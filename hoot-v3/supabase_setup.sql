-- Hoot v3 Supabase Database Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users Table (extends auth.users)
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  username text unique,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Hoots Table
create table if not exists public.hoots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  audio_url text not null,
  duration integer not null, -- in seconds
  likes integer default 0,
  replies integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Rooms Table (for chat)
create table if not exists public.rooms (
  id uuid default uuid_generate_v4() primary key,
  participants uuid[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages Table
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  room_id uuid references public.rooms on delete cascade not null,
  sender_id uuid references public.users on delete cascade not null,
  audio_url text not null,
  duration integer not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Likes Table
create table if not exists public.likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  hoot_id uuid references public.hoots on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, hoot_id)
);

-- Indexes for performance
create index if not exists hoots_user_id_idx on public.hoots(user_id);
create index if not exists hoots_created_at_idx on public.hoots(created_at desc);
create index if not exists messages_room_id_idx on public.messages(room_id);
create index if not exists messages_created_at_idx on public.messages(created_at);
create index if not exists likes_user_id_idx on public.likes(user_id);
create index if not exists likes_hoot_id_idx on public.likes(hoot_id);

-- Row Level Security (RLS)

-- Enable RLS
alter table public.users enable row level security;
alter table public.hoots enable row level security;
alter table public.rooms enable row level security;
alter table public.messages enable row level security;
alter table public.likes enable row level security;

-- Users Policies
create policy "Users can view all profiles"
  on public.users for select
  using (true);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Hoots Policies
create policy "Anyone can view hoots"
  on public.hoots for select
  using (true);

create policy "Users can create own hoots"
  on public.hoots for insert
  with check (auth.uid() = user_id);

create policy "Users can update own hoots"
  on public.hoots for update
  using (auth.uid() = user_id);

create policy "Users can delete own hoots"
  on public.hoots for delete
  using (auth.uid() = user_id);

-- Rooms Policies
create policy "Users can view rooms they're in"
  on public.rooms for select
  using (auth.uid() = any(participants));

create policy "Users can create rooms"
  on public.rooms for insert
  with check (auth.uid() = any(participants));

-- Messages Policies
create policy "Users can view messages in their rooms"
  on public.messages for select
  using (
    exists (
      select 1 from public.rooms
      where id = room_id
      and auth.uid() = any(participants)
    )
  );

create policy "Users can create messages in their rooms"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.rooms
      where id = room_id
      and auth.uid() = any(participants)
    )
  );

-- Likes Policies
create policy "Anyone can view likes"
  on public.likes for select
  using (true);

create policy "Users can like hoots"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike hoots"
  on public.likes for delete
  using (auth.uid() = user_id);

-- Functions

-- Function to update likes count
create or replace function update_hoot_likes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.hoots
    set likes = likes + 1
    where id = NEW.hoot_id;
  elsif TG_OP = 'DELETE' then
    update public.hoots
    set likes = likes - 1
    where id = OLD.hoot_id;
  end if;
  return null;
end;
$$ language plpgsql;

-- Trigger for likes count
drop trigger if exists on_like_change on public.likes;
create trigger on_like_change
  after insert or delete on public.likes
  for each row execute function update_hoot_likes_count();

-- Function to update room timestamp
create or replace function update_room_updated_at()
returns trigger as $$
begin
  update public.rooms
  set updated_at = now()
  where id = NEW.room_id;
  return NEW;
end;
$$ language plpgsql;

-- Trigger for room updates
drop trigger if exists on_message_insert on public.messages;
create trigger on_message_insert
  after insert on public.messages
  for each row execute function update_room_updated_at();

-- Storage Buckets Setup
-- Run these in Supabase Storage UI or via SQL:

-- Create storage buckets
insert into storage.buckets (id, name, public)
values
  ('hoots', 'hoots', true),
  ('messages', 'messages', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage Policies

-- Hoots bucket policies
create policy "Anyone can view hoots audio"
  on storage.objects for select
  using (bucket_id = 'hoots');

create policy "Authenticated users can upload hoots"
  on storage.objects for insert
  with check (bucket_id = 'hoots' and auth.role() = 'authenticated');

-- Messages bucket policies
create policy "Users can view messages audio in their rooms"
  on storage.objects for select
  using (bucket_id = 'messages');

create policy "Authenticated users can upload messages"
  on storage.objects for insert
  with check (bucket_id = 'messages' and auth.role() = 'authenticated');

-- Avatars bucket policies
create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

-- Realtime Setup
-- Enable realtime for messages table
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.hoots;

-- Create a view for hoots with user info (optional)
create or replace view hoots_with_users as
select
  h.*,
  u.username,
  u.avatar_url,
  exists(
    select 1 from public.likes l
    where l.hoot_id = h.id
    and l.user_id = auth.uid()
  ) as is_liked
from public.hoots h
join public.users u on h.user_id = u.id
order by h.created_at desc;

-- Grant access to the view
grant select on hoots_with_users to authenticated;

-- Done!
-- Now you can use Hoot with Supabase!
