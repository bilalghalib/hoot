import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user_model.dart';
import '../models/hoot_model.dart';
import '../constants/app_constants.dart';
import '../utils/error_handler.dart';
import '../utils/validators.dart';

/// Hardened Supabase Service with security, validation, retry logic, and caching
class SupabaseServiceHardened {
  final SupabaseClient _client;

  // Simple in-memory cache
  final Map<String, CacheEntry> _cache = {};

  // Rate limiting (client-side)
  final Map<String, List<DateTime>> _rateLimitTracker = {};

  SupabaseServiceHardened(this._client);

  // Auth

  /// Sign in with retry logic and proper error handling
  Future<AuthResponse> signIn(String email, String password) async {
    try {
      // Validate inputs
      final emailError = Validators.validateEmail(email);
      if (emailError != null) {
        throw ValidationException(emailError);
      }

      final passwordError = Validators.validatePassword(password);
      if (passwordError != null) {
        throw ValidationException(passwordError);
      }

      return await RetryHelper.retry(
        () => _client.auth.signInWithPassword(
          email: email.trim().toLowerCase(),
          password: password,
        ),
        maxAttempts: 2, // Don't retry too much for auth
      );
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace, extra: {'email': email});

      if (e is AuthException) {
        throw AuthenticationException(ErrorHandler.getUserMessage(e));
      }
      if (e is ValidationException) rethrow;

      throw AuthenticationException();
    }
  }

  /// Sign up with validation
  Future<AuthResponse> signUp(
    String email,
    String password, {
    String? username,
  }) async {
    try {
      // Validate inputs
      final emailError = Validators.validateEmail(email);
      if (emailError != null) {
        throw ValidationException(emailError);
      }

      final passwordError = Validators.validatePassword(password);
      if (passwordError != null) {
        throw ValidationException(passwordError);
      }

      if (username != null) {
        final usernameError = Validators.validateUsername(username);
        if (usernameError != null) {
          throw ValidationException(usernameError);
        }
      }

      final response = await RetryHelper.retry(
        () => _client.auth.signUp(
          email: email.trim().toLowerCase(),
          password: password,
          data: username != null ? {'username': username.trim()} : null,
        ),
        maxAttempts: 2,
      );

      // Create user profile
      if (response.user != null) {
        await _createUserProfile(
          response.user!.id,
          email.trim().toLowerCase(),
          username?.trim(),
        );
      }

      return response;
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace, extra: {
        'email': email,
        'username': username,
      });

      if (e is AuthException) {
        throw AuthenticationException(ErrorHandler.getUserMessage(e));
      }
      if (e is ValidationException) rethrow;

      throw AuthenticationException();
    }
  }

  Future<void> _createUserProfile(
    String userId,
    String email,
    String? username,
  ) async {
    try {
      await _client.from('users').insert({
        'id': userId,
        'email': email,
        'username': username,
        'created_at': DateTime.now().toUtc().toIso8601String(),
        'updated_at': DateTime.now().toUtc().toIso8601String(),
      });
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace, extra: {'userId': userId});
      // Don't throw - profile creation failure shouldn't prevent signup
    }
  }

  /// Sign out with cleanup
  Future<void> signOut() async {
    try {
      await _client.auth.signOut();
      _cache.clear();
      _rateLimitTracker.clear();
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace);
      throw AuthenticationException('Failed to sign out');
    }
  }

  // Hoots

  /// Get hoots with caching and pagination
  Future<List<HootModel>> getHoots({
    int limit = AppConstants.hootsPerPage,
    int offset = 0,
    bool useCache = true,
  }) async {
    try {
      // Validate pagination
      if (limit < 1 || limit > AppConstants.maxHootsToLoad) {
        throw ValidationException('Invalid limit: $limit');
      }

      if (offset < 0) {
        throw ValidationException('Invalid offset: $offset');
      }

      // Check cache
      final cacheKey = 'hoots_$limit\_$offset';
      if (useCache && _cache.containsKey(cacheKey)) {
        final entry = _cache[cacheKey]!;
        if (!entry.isExpired) {
          return entry.data as List<HootModel>;
        }
      }

      final response = await RetryHelper.retry(
        () => _client
            .from('hoots')
            .select()
            .order('created_at', ascending: false)
            .range(offset, offset + limit - 1),
        maxAttempts: AppConstants.maxRetryAttempts,
      );

      final hoots = (response as List)
          .map((json) => HootModel.fromJson(json as Map<String, dynamic>))
          .toList();

      // Cache the result
      _cache[cacheKey] = CacheEntry(
        data: hoots,
        timestamp: DateTime.now(),
        duration: AppConstants.cacheDuration,
      );

      return hoots;
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace, extra: {
        'limit': limit,
        'offset': offset,
      });

      if (e is ValidationException) rethrow;
      throw HootException('Failed to load Hoots');
    }
  }

  /// Create hoot with validation and rate limiting
  Future<HootModel> createHoot(String audioUrl, int duration) async {
    try {
      final user = _client.auth.currentUser;
      if (user == null) {
        throw AuthenticationException('Not authenticated');
      }

      // Rate limiting check
      if (!_checkRateLimit('create_hoot', AppConstants.maxUploadsPerMinute)) {
        throw HootException(
          'Too many uploads. Please wait a minute and try again.',
        );
      }

      // Validate duration
      final durationError = Validators.validateRecordingDuration(duration);
      if (durationError != null) {
        throw ValidationException(durationError);
      }

      // Validate URL format
      if (!audioUrl.startsWith('http')) {
        throw ValidationException('Invalid audio URL');
      }

      final response = await RetryHelper.retry(
        () => _client.from('hoots').insert({
          'user_id': user.id,
          'audio_url': audioUrl,
          'duration': duration,
          'created_at': DateTime.now().toUtc().toIso8601String(),
        }).select().single(),
      );

      // Invalidate cache
      _invalidateCache('hoots_');

      return HootModel.fromJson(response as Map<String, dynamic>);
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace, extra: {
        'audioUrl': audioUrl,
        'duration': duration,
      });

      if (e is ValidationException || e is AuthenticationException) rethrow;
      throw HootException('Failed to create Hoot');
    }
  }

  /// Upload audio file with validation and progress tracking
  Future<String> uploadAudio(
    String filePath, {
    void Function(double progress)? onProgress,
  }) async {
    try {
      final user = _client.auth.currentUser;
      if (user == null) {
        throw AuthenticationException('Not authenticated');
      }

      final file = File(filePath);

      // Validate file exists
      if (!await file.exists()) {
        throw ValidationException('File does not exist');
      }

      // Validate file
      final validationError = Validators.validateAudioFile(file);
      if (validationError != null) {
        throw ValidationException(validationError);
      }

      // Generate unique filename
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      final extension = filePath.split('.').last;
      final fileName = '${user.id}_$timestamp.$extension';
      final sanitizedFileName = Validators.sanitizeFileName(fileName);

      // Read file
      final bytes = await file.readAsBytes();

      // Determine MIME type
      String mimeType = 'audio/m4a';
      if (extension == 'mp3') {
        mimeType = 'audio/mpeg';
      } else if (extension == 'wav') {
        mimeType = 'audio/wav';
      }

      // Upload with retry
      await RetryHelper.retry(
        () => _client.storage.from(AppConstants.hootsBucket).uploadBinary(
              sanitizedFileName,
              bytes,
              fileOptions: FileOptions(
                contentType: mimeType,
                upsert: false,
              ),
            ),
        maxAttempts: 3,
      );

      // Get public URL
      final publicUrl = _client.storage
          .from(AppConstants.hootsBucket)
          .getPublicUrl(sanitizedFileName);

      return publicUrl;
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace, extra: {'filePath': filePath});

      if (e is ValidationException || e is AuthenticationException) rethrow;
      if (e is StorageException) {
        throw StorageException(ErrorHandler.getUserMessage(e));
      }
      throw StorageException();
    }
  }

  /// Delete audio file
  Future<void> deleteAudio(String fileName) async {
    try {
      await _client.storage.from(AppConstants.hootsBucket).remove([fileName]);
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace, extra: {'fileName': fileName});
      // Don't throw - file deletion failure is not critical
    }
  }

  // Messages

  /// Send message with validation
  Future<void> sendMessage(
    String roomId,
    String audioUrl,
    int duration,
  ) async {
    try {
      final user = _client.auth.currentUser;
      if (user == null) {
        throw AuthenticationException('Not authenticated');
      }

      await RetryHelper.retry(
        () => _client.from('messages').insert({
          'room_id': roomId,
          'sender_id': user.id,
          'audio_url': audioUrl,
          'duration': duration,
          'created_at': DateTime.now().toUtc().toIso8601String(),
        }),
      );
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace, extra: {'roomId': roomId});

      if (e is AuthenticationException) rethrow;
      throw HootException('Failed to send message');
    }
  }

  /// Subscribe to messages with error handling
  Stream<List<Map<String, dynamic>>> subscribeToMessages(String roomId) {
    try {
      return _client
          .from('messages')
          .stream(primaryKey: ['id'])
          .eq('room_id', roomId)
          .order('created_at')
          .handleError((error, stackTrace) {
            ErrorHandler.logError(error, stackTrace, extra: {'roomId': roomId});
          });
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace);
      throw HootException('Failed to subscribe to messages');
    }
  }

  // Helper Methods

  /// Simple rate limiting (client-side)
  bool _checkRateLimit(String action, int maxPerMinute) {
    final now = DateTime.now();
    final key = action;

    if (!_rateLimitTracker.containsKey(key)) {
      _rateLimitTracker[key] = [];
    }

    // Remove entries older than 1 minute
    _rateLimitTracker[key]!
        .removeWhere((time) => now.difference(time).inMinutes >= 1);

    // Check limit
    if (_rateLimitTracker[key]!.length >= maxPerMinute) {
      return false;
    }

    // Add current action
    _rateLimitTracker[key]!.add(now);
    return true;
  }

  /// Invalidate cache entries matching pattern
  void _invalidateCache(String pattern) {
    _cache.removeWhere((key, value) => key.startsWith(pattern));
  }

  /// Clear all cache
  void clearCache() {
    _cache.clear();
  }
}

/// Cache entry
class CacheEntry {
  final dynamic data;
  final DateTime timestamp;
  final Duration duration;

  CacheEntry({
    required this.data,
    required this.timestamp,
    required this.duration,
  });

  bool get isExpired => DateTime.now().difference(timestamp) > duration;
}

// Providers
final supabaseProvider = Provider<SupabaseClient>((ref) {
  return Supabase.instance.client;
});

final supabaseServiceProvider = Provider<SupabaseServiceHardened>((ref) {
  return SupabaseServiceHardened(ref.watch(supabaseProvider));
});

final authStateProvider = StreamProvider<Session?>((ref) {
  final supabase = ref.watch(supabaseProvider);
  return supabase.auth.onAuthStateChange.map((data) => data.session);
});

final currentUserProvider = FutureProvider<UserModel?>((ref) async {
  final supabase = ref.watch(supabaseProvider);
  final session = await ref.watch(authStateProvider.future);

  if (session == null) return null;

  try {
    final response = await supabase
        .from('users')
        .select()
        .eq('id', session.user.id)
        .single();

    return UserModel.fromJson(response as Map<String, dynamic>);
  } catch (e, stackTrace) {
    ErrorHandler.logError(e, stackTrace);
    return null;
  }
});
