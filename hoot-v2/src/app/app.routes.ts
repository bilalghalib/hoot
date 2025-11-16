import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'feed',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/feed/pages/feed/feed.page').then((m) => m.FeedPage),
  },
  {
    path: 'chat/:roomId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/chat/pages/chat/chat.page').then((m) => m.ChatPage),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/pages/profile/profile.page').then(
        (m) => m.ProfilePage
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
