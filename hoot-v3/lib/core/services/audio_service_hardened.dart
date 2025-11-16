import 'dart:async';
import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:record/record.dart';
import 'package:just_audio/just_audio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:uuid/uuid.dart';
import 'package:permission_handler/permission_handler.dart';
import '../constants/app_constants.dart';
import '../utils/error_handler.dart';
import '../utils/validators.dart';

/// Hardened Audio Service with proper error handling, validation, and cleanup
class AudioServiceHardened {
  final AudioRecorder _recorder = AudioRecorder();
  final AudioPlayer _player = AudioPlayer();

  bool _isRecording = false;
  bool _isPlaying = false;
  String? _currentRecordingPath;
  DateTime? _recordingStartTime;
  Timer? _durationTimer;
  Timer? _maxDurationTimer;

  bool get isRecording => _isRecording;
  bool get isPlaying => _isPlaying;
  String? get currentRecordingPath => _currentRecordingPath;

  // Recording

  /// Check and request microphone permission
  Future<bool> checkAndRequestPermission() async {
    try {
      final status = await Permission.microphone.status;

      if (status.isGranted) {
        return true;
      }

      if (status.isDenied) {
        final result = await Permission.microphone.request();
        return result.isGranted;
      }

      if (status.isPermanentlyDenied) {
        throw PermissionException(
          'Microphone permission permanently denied. Please enable it in settings.',
        );
      }

      return false;
    } catch (e) {
      if (e is PermissionException) rethrow;
      throw PermissionException('Failed to check microphone permission');
    }
  }

  /// Start recording with validation and error handling
  Future<bool> startRecording() async {
    try {
      // Prevent multiple recordings
      if (_isRecording) {
        throw HootException('Recording already in progress');
      }

      // Check permission
      final hasPermission = await checkAndRequestPermission();
      if (!hasPermission) {
        throw PermissionException(AppConstants.permissionDenied);
      }

      // Generate unique filename
      final directory = await getApplicationDocumentsDirectory();
      final fileName = '${const Uuid().v4()}.m4a';
      final path = '${directory.path}/$fileName';

      // Start recording
      await _recorder.start(
        const RecordConfig(
          encoder: AudioEncoder.aacLc,
          bitRate: AppConstants.audioBitRate,
          sampleRate: AppConstants.audioSampleRate,
        ),
        path: path,
      );

      _isRecording = true;
      _currentRecordingPath = path;
      _recordingStartTime = DateTime.now();

      // Auto-stop at max duration
      _maxDurationTimer = Timer(
        Duration(seconds: AppConstants.maxRecordingDurationSeconds),
        () async {
          if (_isRecording) {
            await stopRecording();
          }
        },
      );

      return true;
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace);
      _cleanup();
      rethrow;
    }
  }

  /// Stop recording with validation
  Future<RecordingResult?> stopRecording() async {
    try {
      if (!_isRecording) {
        throw HootException('No recording in progress');
      }

      final path = await _recorder.stop();
      _maxDurationTimer?.cancel();

      if (path == null || _recordingStartTime == null) {
        throw HootException('Failed to stop recording');
      }

      final duration = DateTime.now().difference(_recordingStartTime!);
      final durationSeconds = duration.inSeconds;

      // Validate duration
      final durationError =
          Validators.validateRecordingDuration(durationSeconds);
      if (durationError != null) {
        // Delete invalid recording
        await _deleteFile(path);
        throw ValidationException(durationError);
      }

      // Validate file
      final file = File(path);
      final fileError = Validators.validateAudioFile(file);
      if (fileError != null) {
        await _deleteFile(path);
        throw ValidationException(fileError);
      }

      _isRecording = false;

      return RecordingResult(
        path: path,
        duration: durationSeconds,
        fileSize: file.lengthSync(),
      );
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace);
      await _cleanup();
      rethrow;
    }
  }

  /// Cancel recording with cleanup
  Future<void> cancelRecording() async {
    try {
      if (_isRecording) {
        await _recorder.stop();
      }

      _maxDurationTimer?.cancel();

      if (_currentRecordingPath != null) {
        await _deleteFile(_currentRecordingPath!);
      }
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace);
    } finally {
      await _cleanup();
    }
  }

  // Playback

  /// Play audio with error handling
  Future<void> play(String url) async {
    try {
      if (_isPlaying) {
        await stop();
      }

      await _player.setUrl(url);
      await _player.play();
      _isPlaying = true;
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace, extra: {'url': url});
      throw HootException('Failed to play audio');
    }
  }

  /// Pause playback
  Future<void> pause() async {
    try {
      if (_player.playing) {
        await _player.pause();
        _isPlaying = false;
      }
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace);
    }
  }

  /// Resume playback
  Future<void> resume() async {
    try {
      if (_player.processingState != ProcessingState.idle) {
        await _player.play();
        _isPlaying = true;
      }
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace);
    }
  }

  /// Stop playback
  Future<void> stop() async {
    try {
      await _player.stop();
      _isPlaying = false;
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace);
    }
  }

  /// Seek to position
  Future<void> seek(Duration position) async {
    try {
      await _player.seek(position);
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace);
    }
  }

  /// Set playback speed
  Future<void> setPlaybackRate(double rate) async {
    try {
      if (rate < 0.5 || rate > 2.0) {
        throw ValidationException('Playback rate must be between 0.5 and 2.0');
      }
      await _player.setSpeed(rate);
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace);
    }
  }

  // Streams
  Stream<Duration> get positionStream => _player.positionStream;
  Stream<Duration?> get durationStream => _player.durationStream;
  Stream<PlayerState> get playerStateStream => _player.playerStateStream;

  // Helper Methods

  Future<void> _deleteFile(String path) async {
    try {
      final file = File(path);
      if (await file.exists()) {
        await file.delete();
      }
    } catch (e, stackTrace) {
      ErrorHandler.logError(e, stackTrace, extra: {'path': path});
    }
  }

  Future<void> _cleanup() async {
    _isRecording = false;
    _currentRecordingPath = null;
    _recordingStartTime = null;
    _maxDurationTimer?.cancel();
    _durationTimer?.cancel();
  }

  /// Dispose all resources
  Future<void> dispose() async {
    await cancelRecording();
    await stop();
    await _recorder.dispose();
    await _player.dispose();
    _maxDurationTimer?.cancel();
    _durationTimer?.cancel();
  }
}

/// Recording result with validation
class RecordingResult {
  final String path;
  final int duration;
  final int fileSize;

  RecordingResult({
    required this.path,
    required this.duration,
    required this.fileSize,
  });

  bool get isValid {
    return duration >= AppConstants.minRecordingDurationSeconds &&
        duration <= AppConstants.maxRecordingDurationSeconds &&
        fileSize >= AppConstants.minAudioFileSizeBytes &&
        fileSize <= AppConstants.maxAudioFileSizeBytes;
  }
}

// Provider
final audioServiceProvider = Provider<AudioServiceHardened>((ref) {
  final service = AudioServiceHardened();
  ref.onDispose(() => service.dispose());
  return service;
});

// State Notifier with proper error handling
final recordingStateProvider =
    StateNotifierProvider<RecordingStateNotifier, RecordingState>((ref) {
  return RecordingStateNotifier(ref.watch(audioServiceProvider));
});

class RecordingState {
  final bool isRecording;
  final int duration;
  final String? filePath;
  final int? fileSize;
  final String? error;
  final bool isLoading;

  RecordingState({
    this.isRecording = false,
    this.duration = 0,
    this.filePath,
    this.fileSize,
    this.error,
    this.isLoading = false,
  });

  RecordingState copyWith({
    bool? isRecording,
    int? duration,
    String? filePath,
    int? fileSize,
    String? error,
    bool? isLoading,
  }) {
    return RecordingState(
      isRecording: isRecording ?? this.isRecording,
      duration: duration ?? this.duration,
      filePath: filePath ?? this.filePath,
      fileSize: fileSize ?? this.fileSize,
      error: error,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  bool get hasRecording => filePath != null && fileSize != null;
}

class RecordingStateNotifier extends StateNotifier<RecordingState> {
  final AudioServiceHardened _audioService;
  Timer? _timer;

  RecordingStateNotifier(this._audioService) : super(RecordingState());

  Future<void> startRecording() async {
    if (state.isRecording || state.isLoading) return;

    state = state.copyWith(isLoading: true, error: null);

    try {
      final started = await _audioService.startRecording();
      if (started) {
        state = state.copyWith(
          isRecording: true,
          isLoading: false,
          duration: 0,
          filePath: null,
          fileSize: null,
        );
        _startTimer();
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: ErrorHandler.getUserMessage(e),
      );
      ErrorHandler.logError(e, StackTrace.current);
    }
  }

  Future<void> stopRecording() async {
    if (!state.isRecording || state.isLoading) return;

    _timer?.cancel();
    state = state.copyWith(isLoading: true);

    try {
      final result = await _audioService.stopRecording();
      if (result != null && result.isValid) {
        state = state.copyWith(
          isRecording: false,
          isLoading: false,
          filePath: result.path,
          fileSize: result.fileSize,
          duration: result.duration,
        );
      }
    } catch (e) {
      state = state.copyWith(
        isRecording: false,
        isLoading: false,
        error: ErrorHandler.getUserMessage(e),
      );
      ErrorHandler.logError(e, StackTrace.current);
    }
  }

  Future<void> cancelRecording() async {
    _timer?.cancel();
    await _audioService.cancelRecording();
    state = RecordingState();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (state.duration < AppConstants.maxRecordingDurationSeconds) {
        state = state.copyWith(duration: state.duration + 1);
      } else {
        stopRecording();
      }
    });
  }

  void clearError() {
    state = state.copyWith(error: null);
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
