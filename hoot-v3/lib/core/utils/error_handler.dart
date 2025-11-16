import 'package:supabase_flutter/supabase_flutter.dart';
import '../constants/app_constants.dart';
import 'dart:io';

/// Custom exception types
class HootException implements Exception {
  final String message;
  final String? code;
  final dynamic originalError;

  HootException(this.message, {this.code, this.originalError});

  @override
  String toString() => message;
}

class NetworkException extends HootException {
  NetworkException([String? message])
      : super(message ?? AppConstants.networkError, code: 'NETWORK_ERROR');
}

class AuthenticationException extends HootException {
  AuthenticationException([String? message])
      : super(message ?? AppConstants.authError, code: 'AUTH_ERROR');
}

class ValidationException extends HootException {
  ValidationException(String message)
      : super(message, code: 'VALIDATION_ERROR');
}

class StorageException extends HootException {
  StorageException([String? message])
      : super(message ?? AppConstants.uploadError, code: 'STORAGE_ERROR');
}

class PermissionException extends HootException {
  PermissionException([String? message])
      : super(message ?? AppConstants.permissionDenied,
            code: 'PERMISSION_ERROR');
}

/// Global error handler
class ErrorHandler {
  ErrorHandler._();

  /// Convert exceptions to user-friendly messages
  static String getUserMessage(dynamic error) {
    // Supabase errors
    if (error is AuthException) {
      return _handleAuthException(error);
    }

    if (error is PostgrestException) {
      return _handlePostgrestException(error);
    }

    if (error is StorageException) {
      return error.message;
    }

    // Custom exceptions
    if (error is HootException) {
      return error.message;
    }

    // Network errors
    if (error is SocketException) {
      return AppConstants.networkError;
    }

    if (error is TimeoutException) {
      return 'Request timed out. Please try again.';
    }

    // File errors
    if (error is FileSystemException) {
      return 'File error. Please try again.';
    }

    // Generic error
    return AppConstants.genericError;
  }

  static String _handleAuthException(AuthException error) {
    switch (error.statusCode) {
      case '400':
        return 'Invalid credentials. Please check your email and password.';
      case '422':
        return 'User already exists or invalid data provided.';
      case '500':
        return 'Server error. Please try again later.';
      default:
        return error.message ?? AppConstants.authError;
    }
  }

  static String _handlePostgrestException(PostgrestException error) {
    // Don't expose database errors to users
    if (error.code == 'PGRST116') {
      return 'No data found.';
    }

    if (error.code?.startsWith('23') ?? false) {
      // PostgreSQL constraint violations
      return 'This action is not allowed.';
    }

    return AppConstants.genericError;
  }

  /// Log error (in production, send to monitoring service)
  static void logError(
    dynamic error,
    StackTrace? stackTrace, {
    Map<String, dynamic>? extra,
  }) {
    // In production, send to Sentry, Firebase Crashlytics, etc.
    print('ERROR: $error');
    if (stackTrace != null) {
      print('STACK TRACE: $stackTrace');
    }
    if (extra != null) {
      print('EXTRA: $extra');
    }

    // TODO: Implement actual error logging service
    // Sentry.captureException(error, stackTrace: stackTrace);
  }

  /// Check if error is recoverable
  static bool isRecoverable(dynamic error) {
    if (error is SocketException) return true;
    if (error is TimeoutException) return true;
    if (error is NetworkException) return true;

    // Supabase 5xx errors are recoverable
    if (error is AuthException) {
      final code = error.statusCode;
      return code != null && code.startsWith('5');
    }

    return false;
  }

  /// Should retry operation
  static bool shouldRetry(dynamic error, int attemptNumber) {
    if (attemptNumber >= AppConstants.maxRetryAttempts) {
      return false;
    }

    return isRecoverable(error);
  }
}

/// Retry helper
class RetryHelper {
  static Future<T> retry<T>(
    Future<T> Function() operation, {
    int maxAttempts = AppConstants.maxRetryAttempts,
    Duration delay = AppConstants.retryDelay,
    bool Function(dynamic error)? shouldRetry,
  }) async {
    int attempt = 0;

    while (true) {
      attempt++;

      try {
        return await operation();
      } catch (error, stackTrace) {
        final canRetry = shouldRetry?.call(error) ??
            ErrorHandler.shouldRetry(error, attempt);

        if (!canRetry || attempt >= maxAttempts) {
          ErrorHandler.logError(
            error,
            stackTrace,
            extra: {'attempt': attempt, 'maxAttempts': maxAttempts},
          );
          rethrow;
        }

        // Exponential backoff
        final backoffDelay = delay * attempt;
        await Future.delayed(backoffDelay);
      }
    }
  }
}
