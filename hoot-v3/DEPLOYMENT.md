# Hoot v3 Deployment Guide

## Prerequisites

- Flutter SDK 3.x installed
- Supabase account
- Vercel account (for web deployment)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and name: "Hoot"
4. Generate a strong database password
5. Select region closest to your users
6. Click "Create Project"

### 1.2 Run Database Setup

1. Go to SQL Editor in Supabase Dashboard
2. Create new query
3. Copy contents of `supabase_setup.sql`
4. Run the query
5. Verify tables are created under "Database" → "Tables"

### 1.3 Get API Credentials

1. Go to Project Settings → API
2. Copy:
   - Project URL (`SUPABASE_URL`)
   - `anon/public` key (`SUPABASE_ANON_KEY`)

### 1.4 Configure Storage

1. Go to Storage
2. Verify buckets exist: `hoots`, `messages`, `avatars`
3. Policies should be auto-created by SQL script

## Step 2: Flutter App Configuration

### 2.1 Install Dependencies

```bash
cd hoot-v3
flutter pub get
```

### 2.2 Configure Environment

Create `.env` file in root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

Or use dart-defines (recommended for production):

```bash
flutter run \
  --dart-define=SUPABASE_URL=https://your-project.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=your-anon-key
```

### 2.3 Test Local Development

```bash
# iOS Simulator
flutter run -d ios

# Android Emulator
flutter run -d android

# Chrome (Web)
flutter run -d chrome
```

## Step 3: Mobile App Deployment

### iOS Deployment

#### 3.1 Prerequisites
- macOS with Xcode installed
- Apple Developer Account ($99/year)
- iOS device for testing

#### 3.2 Setup

```bash
# Open Xcode
open ios/Runner.xcworkspace

# In Xcode:
# 1. Select Runner in project navigator
# 2. Go to "Signing & Capabilities"
# 3. Select your team
# 4. Change bundle identifier: com.yourdomain.hoot
# 5. Update version and build number
```

#### 3.3 Build Release

```bash
flutter build ios --release \
  --dart-define=SUPABASE_URL=https://your-project.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=your-anon-key
```

#### 3.4 App Store Submission

1. Open Xcode
2. Product → Archive
3. Distribute App → App Store Connect
4. Follow Apple's submission process

### Android Deployment

#### 3.1 Setup Signing

Create `android/key.properties`:

```properties
storePassword=your-store-password
keyPassword=your-key-password
keyAlias=hoot
storeFile=../hoot-key.jks
```

Generate keystore:

```bash
keytool -genkey -v -keystore hoot-key.jks -keyalg RSA \
  -keysize 2048 -validity 10000 -alias hoot
```

#### 3.2 Build Release

```bash
# AAB (for Play Store)
flutter build appbundle --release \
  --dart-define=SUPABASE_URL=https://your-project.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=your-anon-key

# APK (for direct distribution)
flutter build apk --release \
  --dart-define=SUPABASE_URL=https://your-project.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=your-anon-key
```

#### 3.3 Google Play Submission

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new application
3. Fill in store listing details
4. Upload AAB from `build/app/outputs/bundle/release/`
5. Submit for review

## Step 4: Web Deployment (Vercel)

### 4.1 Build Web App

```bash
flutter build web --release \
  --dart-define=SUPABASE_URL=https://your-project.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=your-anon-key
```

### 4.2 Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd build/web
vercel --prod
```

#### Option B: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Build Command: `flutter build web --release --dart-define=SUPABASE_URL=$SUPABASE_URL --dart-define=SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY`
   - Output Directory: `build/web`
6. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
7. Deploy

### 4.3 Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your domain
4. Update DNS records as instructed

## Step 5: CI/CD (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.x'

      - name: Install dependencies
        run: flutter pub get

      - name: Run tests
        run: flutter test

      - name: Build web
        run: |
          flutter build web --release \
            --dart-define=SUPABASE_URL=${{ secrets.SUPABASE_URL }} \
            --dart-define=SUPABASE_ANON_KEY=${{ secrets.SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./build/web
```

## Step 6: Monitoring & Analytics

### Supabase Analytics

1. Go to Supabase Dashboard
2. Analytics tab shows:
   - API requests
   - Database performance
   - Storage usage

### Sentry (Error Tracking)

```yaml
# pubspec.yaml
dependencies:
  sentry_flutter: ^7.0.0
```

```dart
// lib/main/main.dart
import 'package:sentry_flutter/sentry_flutter.dart';

Future<void> main() async {
  await SentryFlutter.init(
    (options) {
      options.dsn = 'YOUR_SENTRY_DSN';
    },
    appRunner: () => runApp(const HootApp()),
  );
}
```

## Step 7: Post-Deployment

### 7.1 Test Everything

- [ ] User registration
- [ ] User login
- [ ] Record Hoot
- [ ] Upload Hoot
- [ ] View feed
- [ ] Play audio
- [ ] Realtime features (if implemented)

### 7.2 Monitor

- Check Supabase logs for errors
- Monitor Vercel deployment logs
- Check app store reviews

### 7.3 Update

When making updates:

```bash
# Increment version in pubspec.yaml
version: 3.0.1+2  # version+build_number

# Rebuild and redeploy
flutter build [ios|android|web] --release
```

## Troubleshooting

### Audio Not Recording

- Check microphone permissions
- iOS: Update Info.plist with microphone usage description
- Android: Update AndroidManifest.xml with RECORD_AUDIO permission

### Supabase Connection Issues

- Verify API URL and key are correct
- Check if IP is allowed (Supabase → Project Settings → API)
- Ensure RLS policies are correct

### Build Failures

```bash
# Clean build
flutter clean
flutter pub get
flutter build [platform]
```

## Security Checklist

- [ ] Row Level Security (RLS) enabled on all tables
- [ ] API keys stored as environment variables (never committed)
- [ ] Storage policies restrict access appropriately
- [ ] HTTPS enforced for all connections
- [ ] Auth tokens properly validated

## Performance Optimization

- Enable audio file compression
- Implement image caching
- Use Supabase Edge Functions for heavy processing
- Set up CDN for static assets

## Cost Estimation

### Supabase (Free Tier)
- 500MB database
- 1GB storage
- 2GB bandwidth
- Upgrade: $25/month for Pro

### Vercel (Hobby)
- Free for personal projects
- 100GB bandwidth
- Upgrade: $20/month for Pro

### App Store
- Apple: $99/year
- Google: $25 one-time

---

Need help? Check:
- [Flutter Docs](https://docs.flutter.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
