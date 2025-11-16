# Hoot v3 - Flutter + Supabase

🦉 Voice-based social media platform built with Flutter and Supabase

## Tech Stack

- **Flutter 3.x** - Beautiful, natively compiled applications
- **Dart 3.x** - Modern, type-safe language
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Storage (Audio files)
  - Realtime (Chat)
- **Riverpod** - State management
- **Just Audio** - Audio playback
- **Record** - Audio recording

## Features

- 🎤 **Voice Recording** - Record and share audio messages (Hoots)
- 🎧 **Audio Feed** - Listen to Hoots from the community
- 💬 **Voice Chat** - Reply to Hoots with voice messages
- 🔐 **Authentication** - Secure auth with Supabase
- ⚡ **Realtime** - Live updates for chat
- 📱 **Beautiful UI** - Material Design 3
- 🎨 **Animations** - Smooth, delightful animations

## Project Structure

```
lib/
├── main/
│   └── main.dart              # App entry point
├── core/
│   ├── services/              # Supabase, Audio services
│   ├── models/                # Data models
│   └── widgets/               # Shared widgets
├── features/
│   ├── auth/                  # Login & Registration
│   ├── home/                  # Record Hoots
│   ├── feed/                  # Listen to Hoots
│   └── chat/                  # Voice chat
└── utils/                     # Utilities & constants
```

## Setup

### Prerequisites

- Flutter 3.x ([Install Flutter](https://docs.flutter.dev/get-started/install))
- Dart 3.x (comes with Flutter)
- Supabase account ([Create account](https://supabase.com))

### 1. Install Flutter Dependencies

```bash
cd hoot-v3
flutter pub get
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env` file:

```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
```

4. Run the database setup:

```sql
-- See supabase_setup.sql for complete schema
```

### 3. Run the App

```bash
# Run on iOS simulator
flutter run -d ios

# Run on Android emulator
flutter run -d android

# Run on web
flutter run -d chrome
```

### 4. Build for Production

```bash
# iOS
flutter build ios

# Android
flutter build apk --release

# Web
flutter build web
```

## Supabase Schema

### Tables

**users** - Extended user profiles
```sql
- id (uuid, primary key)
- email (text)
- username (text)
- avatar_url (text)
- bio (text)
- created_at (timestamp)
```

**hoots** - Voice posts
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key)
- audio_url (text)
- duration (integer)
- created_at (timestamp)
```

**rooms** - Chat rooms
```sql
- id (uuid, primary key)
- participants (uuid[])
- created_at (timestamp)
```

**messages** - Chat messages
```sql
- id (uuid, primary key)
- room_id (uuid, foreign key)
- sender_id (uuid, foreign key)
- audio_url (text)
- created_at (timestamp)
```

### Storage Buckets

- **hoots** - Audio files for Hoots
- **messages** - Audio files for chat messages
- **avatars** - User profile pictures

### Realtime

- Subscribe to `messages` table for live chat
- Subscribe to `hoots` table for live feed updates

## Development

### State Management

Using **Riverpod** for reactive state management:

```dart
// Providers in lib/core/services/providers.dart
final authProvider = StateNotifierProvider...
final hootProvider = StateNotifierProvider...
```

### Audio Recording

```dart
// Record audio
final recorder = Record();
await recorder.start();
final path = await recorder.stop();

// Upload to Supabase
await supabase.storage.from('hoots').upload(path, file);
```

### Audio Playback

```dart
// Play audio
final player = AudioPlayer();
await player.setUrl(audioUrl);
await player.play();
```

## Deployment

### Web (Vercel)

```bash
flutter build web
# Deploy dist/ folder to Vercel
```

### iOS App Store

1. Open `ios/Runner.xcworkspace` in Xcode
2. Configure signing
3. Archive and upload

### Google Play Store

1. Configure signing in `android/app/build.gradle`
2. Build release APK/Bundle
3. Upload to Play Console

## Environment Variables

Create `lib/core/config/env.dart`:

```dart
class Env {
  static const supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'your_url_here',
  );
  static const supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'your_key_here',
  );
}
```

Run with:
```bash
flutter run --dart-define=SUPABASE_URL=xxx --dart-define=SUPABASE_ANON_KEY=yyy
```

## Testing

```bash
# Run unit tests
flutter test

# Run integration tests
flutter test integration_test/

# Run with coverage
flutter test --coverage
```

## Performance

- ✅ 60 FPS animations
- ✅ Lazy loading for feed
- ✅ Cached audio files
- ✅ Optimized images
- ✅ Code splitting

## Security

- ✅ Row Level Security (RLS) enabled
- ✅ Secure storage for tokens
- ✅ Audio file access control
- ✅ Input validation

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Write tests
5. Submit pull request

## License

Copyright © 2025 Bilal Ghalib

## Resources

- [Flutter Documentation](https://docs.flutter.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Riverpod Documentation](https://riverpod.dev)
- [Material Design 3](https://m3.material.io)

---

Built with ❤️ and Flutter
