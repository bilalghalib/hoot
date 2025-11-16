/// Application-wide constants
class AppConstants {
  // Prevent instantiation
  AppConstants._();

  // App Info
  static const String appName = 'Hoot';
  static const String appVersion = '3.0.0';
  static const String appTagline = 'Give a Hoot, Take a Hoot';

  // Audio Recording
  static const int maxRecordingDurationSeconds = 300; // 5 minutes
  static const int minRecordingDurationSeconds = 1;
  static const int audioSampleRate = 44100;
  static const int audioBitRate = 128000;

  // Audio File Validation
  static const int maxAudioFileSizeBytes = 50 * 1024 * 1024; // 50MB
  static const int minAudioFileSizeBytes = 1024; // 1KB
  static const List<String> allowedAudioExtensions = [
    '.m4a',
    '.mp3',
    '.wav',
    '.aac',
  ];
  static const List<String> allowedAudioMimeTypes = [
    'audio/mp4',
    'audio/mpeg',
    'audio/wav',
    'audio/aac',
    'audio/x-m4a',
  ];

  // Pagination
  static const int hootsPerPage = 20;
  static const int maxHootsToLoad = 100;

  // UI Dimensions
  static const double recordingButtonSize = 120.0;
  static const double defaultPadding = 24.0;
  static const double cardBorderRadius = 16.0;
  static const double inputBorderRadius = 12.0;

  // Animation Durations
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 400);
  static const Duration longAnimationDuration = Duration(milliseconds: 600);

  // Timeouts
  static const Duration networkTimeout = Duration(seconds: 30);
  static const Duration uploadTimeout = Duration(minutes: 5);

  // Retry Configuration
  static const int maxRetryAttempts = 3;
  static const Duration retryDelay = Duration(seconds: 2);

  // Cache
  static const Duration cacheDuration = Duration(minutes: 5);
  static const int maxCachedItems = 100;

  // Storage Buckets
  static const String hootsBucket = 'hoots';
  static const String messagesBucket = 'messages';
  static const String avatarsBucket = 'avatars';

  // Error Messages
  static const String genericError = 'Something went wrong. Please try again.';
  static const String networkError = 'Network error. Please check your connection.';
  static const String authError = 'Authentication failed. Please login again.';
  static const String uploadError = 'Upload failed. Please try again.';
  static const String recordingError = 'Recording failed. Please check microphone permissions.';
  static const String permissionDenied = 'Permission denied. Please grant access in settings.';

  // Validation
  static const int minPasswordLength = 8;
  static const int maxPasswordLength = 128;
  static const int minUsernameLength = 3;
  static const int maxUsernameLength = 30;
  static const int maxBioLength = 500;

  // Rate Limiting (client-side hints)
  static const int maxUploadsPerMinute = 5;
  static const int maxHootsPerDay = 100;

  // Audio Player
  static const Duration seekStepDuration = Duration(seconds: 5);
  static const double defaultVolume = 1.0;

  // Regex Patterns
  static final RegExp emailRegex = RegExp(
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
  );
  static final RegExp usernameRegex = RegExp(
    r'^[a-zA-Z0-9_]{3,30}$',
  );
  // Password must contain: uppercase, lowercase, number, special char
  static final RegExp passwordRegex = RegExp(
    r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$',
  );
}
