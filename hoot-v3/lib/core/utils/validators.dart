import '../constants/app_constants.dart';
import 'dart:io';

/// Input validation utilities
class Validators {
  Validators._();

  /// Validate email address
  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }

    if (!AppConstants.emailRegex.hasMatch(value)) {
      return 'Please enter a valid email address';
    }

    if (value.length > 255) {
      return 'Email is too long';
    }

    return null;
  }

  /// Validate password with strength requirements
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }

    if (value.length < AppConstants.minPasswordLength) {
      return 'Password must be at least ${AppConstants.minPasswordLength} characters';
    }

    if (value.length > AppConstants.maxPasswordLength) {
      return 'Password is too long';
    }

    if (!value.contains(RegExp(r'[A-Z]'))) {
      return 'Password must contain at least one uppercase letter';
    }

    if (!value.contains(RegExp(r'[a-z]'))) {
      return 'Password must contain at least one lowercase letter';
    }

    if (!value.contains(RegExp(r'[0-9]'))) {
      return 'Password must contain at least one number';
    }

    if (!value.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'))) {
      return 'Password must contain at least one special character';
    }

    return null;
  }

  /// Validate username
  static String? validateUsername(String? value) {
    if (value == null || value.isEmpty) {
      return 'Username is required';
    }

    if (value.length < AppConstants.minUsernameLength) {
      return 'Username must be at least ${AppConstants.minUsernameLength} characters';
    }

    if (value.length > AppConstants.maxUsernameLength) {
      return 'Username must be less than ${AppConstants.maxUsernameLength} characters';
    }

    if (!AppConstants.usernameRegex.hasMatch(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }

    return null;
  }

  /// Validate audio file
  static String? validateAudioFile(File file) {
    // Check if file exists
    if (!file.existsSync()) {
      return 'File does not exist';
    }

    // Check file size
    final fileSize = file.lengthSync();
    if (fileSize > AppConstants.maxAudioFileSizeBytes) {
      final maxSizeMB = AppConstants.maxAudioFileSizeBytes / (1024 * 1024);
      return 'File is too large. Maximum size is ${maxSizeMB.toStringAsFixed(0)}MB';
    }

    if (fileSize < AppConstants.minAudioFileSizeBytes) {
      return 'File is too small or corrupted';
    }

    // Check file extension
    final extension = file.path.toLowerCase().split('.').last;
    if (!AppConstants.allowedAudioExtensions.contains('.$extension')) {
      return 'Invalid file type. Allowed: ${AppConstants.allowedAudioExtensions.join(", ")}';
    }

    return null;
  }

  /// Sanitize filename for upload
  static String sanitizeFileName(String fileName) {
    // Remove any directory traversal attempts
    String sanitized = fileName.replaceAll(RegExp(r'[./\\]'), '_');

    // Remove special characters
    sanitized = sanitized.replaceAll(RegExp(r'[^a-zA-Z0-9_\-.]'), '_');

    // Limit length
    if (sanitized.length > 255) {
      final extension = sanitized.split('.').last;
      sanitized = '${sanitized.substring(0, 250)}.$extension';
    }

    return sanitized;
  }

  /// Validate bio text
  static String? validateBio(String? value) {
    if (value == null || value.isEmpty) {
      return null; // Bio is optional
    }

    if (value.length > AppConstants.maxBioLength) {
      return 'Bio must be less than ${AppConstants.maxBioLength} characters';
    }

    return null;
  }

  /// Validate recording duration
  static String? validateRecordingDuration(int durationSeconds) {
    if (durationSeconds < AppConstants.minRecordingDurationSeconds) {
      return 'Recording is too short. Minimum ${AppConstants.minRecordingDurationSeconds} second(s)';
    }

    if (durationSeconds > AppConstants.maxRecordingDurationSeconds) {
      final maxMinutes = AppConstants.maxRecordingDurationSeconds ~/ 60;
      return 'Recording is too long. Maximum $maxMinutes minutes';
    }

    return null;
  }
}
