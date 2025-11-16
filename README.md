# Hoot 🦉

> Voice-based social media platform - Give a Hoot, Take a Hoot!

## Overview

Hoot is a mobile-first voice-based social media application that allows users to share and consume audio messages (called "Hoots") in a visually engaging, gesture-driven interface. Think of it as a voice-first social network where users can record, share, and respond to audio snippets with an immersive, nature-themed user experience.

## What is Hoot?

Hoot revolutionizes social communication by focusing on voice rather than text or images. Users can:

- Record short audio messages (Hoots) with a simple swipe gesture
- Share Hoots with the community
- Swipe through a feed of Hoots from other users
- Reply to Hoots with voice messages
- Engage in audio conversations in chat rooms

The app features a beautifully animated interface with a nature theme including owls, trees, nests, and eggs that respond to user interactions.

## Technology Stack

### Frontend
- **Ionic Framework v1** - Hybrid mobile app framework
- **AngularJS 1.x** - JavaScript framework
- **Cordova** - Native mobile capabilities
- **Bower** - Frontend package management
- **Gulp** - Build automation

### Backend Integration
- **Restangular** - REST API client
- **ngCordova** - AngularJS extensions for Cordova
- **ngStorage** - Local storage for Angular

### Cordova Plugins
- cordova-plugin-media - Audio recording/playback
- cordova-plugin-device - Device information
- ionic-plugin-keyboard - Keyboard management
- com-badrit-macaddress - Device identification

### Platforms
- iOS
- Android

## Project Structure

```
hoot/
├── grunt-app/               # Main application directory
│   ├── app/                 # Application source code
│   │   ├── src/             # JavaScript source files
│   │   │   ├── app.module.js       # Main app module
│   │   │   ├── homepage/           # Homepage (record Hoots)
│   │   │   ├── conversation/       # Listen to Hoots feed
│   │   │   ├── login/              # User authentication
│   │   │   ├── chat/               # Reply/chat functionality
│   │   │   ├── core/               # Core services & config
│   │   │   └── common/             # Shared services
│   │   ├── styles/          # CSS/SCSS files
│   │   ├── images/          # UI assets
│   │   ├── sounds/          # Audio assets
│   │   ├── audioRecorder/   # Audio recording component
│   │   └── index.html       # Main HTML file
│   ├── bower.json           # Frontend dependencies
│   └── gruntfile.js         # Grunt build configuration
├── resources/               # App icons and splash screens
├── config.xml               # Cordova configuration
├── package.json             # Node dependencies
└── gulpfile.js              # Gulp tasks
```

## Key Features

### 1. Voice Recording
- Swipe up to start recording
- Tap to stop recording
- Visual feedback with animated UI elements
- Auto-stop after time limit

### 2. Hoot Feed
- Swipe through Hoots (left/right navigation)
- Auto-play audio when viewing a Hoot
- Previous/Next hoot navigation
- Lazy loading of additional Hoots

### 3. Replies & Chat
- Swipe up on any Hoot to record a reply
- Chat rooms created per user
- Voice-based conversations

### 4. Gesture Navigation
- Swipe up: Start recording
- Swipe down: Go back/stop recording
- Swipe left: Go to Hoot feed
- Swipe right: Go to homepage
- Tap: Upload/stop/interact

### 5. Authentication
- Auto-registration using device MAC address
- Token-based authentication
- Persistent login state

### 6. Animated UI
- Nature-themed graphics (owl, trees, nest, eggs)
- CSS animations using Animate.css
- Smooth transitions between states
- Parallax effects

## Installation

### Prerequisites
- Node.js (v6.x or compatible)
- npm
- Bower
- Gulp CLI
- Ionic CLI v1
- Cordova CLI
- iOS/Android development environment

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd hoot
```

2. Install Node dependencies:
```bash
npm install
```

3. Install Bower dependencies:
```bash
bower install
cd grunt-app
bower install
```

4. Install Cordova platforms:
```bash
cordova platform add ios
cordova platform add android
```

5. Configure API endpoint:
Edit `grunt-app/app/src/core/restangular.config.js` and set your backend URL:
```javascript
RestangularProvider.setBaseUrl('http://your-api-server:3000/api');
```

## Development

### Running in browser
```bash
ionic serve
```

### Running on iOS
```bash
ionic build ios
ionic emulate ios
# or
ionic run ios
```

### Running on Android
```bash
ionic build android
ionic emulate android
# or
ionic run android
```

### Build for production
```bash
ionic build --release ios
ionic build --release android
```

## API Endpoints

The app expects the following REST API endpoints:

### Authentication
- `POST /users/login` - User login
- `POST /users/register` - User registration
- `GET /users/logout` - User logout

### Hoots
- `POST /hoot` - Create a new Hoot
- `GET /hoot/getHoot?offset={offset}&limit={limit}` - Get Hoots feed
- `POST /hoot/hootRead/{hootId}` - Mark Hoot as read

### Chat/Rooms
- `GET /room/{userId}` - Get or create chat room
- `POST /room/{roomId}/message` - Send message to room

## Configuration

### API Base URL
Located in: `grunt-app/app/src/core/restangular.config.js`

### S3 Bucket (if using S3)
Audio files are referenced from S3_BUCKET_ENDPOINT constant

### App Metadata
Edit `config.xml` for app name, version, author, and permissions

## Known Issues & Limitations

### Technical Debt
1. **Outdated Technology Stack**
   - Ionic v1 (released 2014, outdated)
   - AngularJS 1.x (maintenance mode)
   - Bower (deprecated)
   - Gulp v3 (old version)

2. **Security Concerns**
   - Hardcoded test credentials in login controller
   - No environment variable management
   - Hardcoded API endpoint
   - MAC address-based authentication (privacy concern)

3. **Code Quality**
   - jQuery mixed with Angular (anti-pattern)
   - No TypeScript/type safety
   - Limited error handling
   - No automated tests
   - Inconsistent code style

4. **Mobile Compatibility**
   - Outdated Cordova plugins
   - May not work on modern iOS/Android versions
   - Limited accessibility features

### Browser Compatibility
- Requires getUserMedia API for audio recording
- Limited to HTTPS contexts
- Mobile-first design (poor desktop experience)

## Contributing

Before contributing, please review the MODERNIZATION_STRATEGY.md document to understand the planned architectural changes.

## License

Copyright © 2017 Bilal Ghalib

## Contact

Author: Bilal Ghalib
Email: bg@bilalghalib.com
Website: http://bilalghalib.com/

## Version History

- v1.1.1 - Current version
- v1.0.0 - Initial release

---

**Note**: This codebase is in need of modernization. See MODERNIZATION_STRATEGY.md for the roadmap to upgrade to modern technologies and best practices.
