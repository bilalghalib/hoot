import 'dart:async';
import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:record/record.dart';
import 'package:just_audio/just_audio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:uuid/uuid.dart';

class AudioService {
  final AudioRecorder _recorder = AudioRecorder();
  final AudioPlayer _player = AudioPlayer();

  bool _isRecording = false;
  bool _isPlaying = false;
  String? _currentRecordingPath;
  DateTime? _recordingStartTime;

  bool get isRecording => _isRecording;
  bool get isPlaying => _isPlaying;
  String? get currentRecordingPath => _currentRecordingPath;

  // Recording
  Future<bool> startRecording() async {
    try {
      if (await _recorder.hasPermission()) {
        final directory = await getApplicationDocumentsDirectory();
        final fileName = '${const Uuid().v4()}.m4a';
        final path = '${directory.path}/$fileName';

        await _recorder.start(
          const RecordConfig(
            encoder: AudioEncoder.aacLc,
            bitRate: 128000,
            sampleRate: 44100,
          ),
          path: path,
        );

        _isRecording = true;
        _currentRecordingPath = path;
        _recordingStartTime = DateTime.now();
        return true;
      }
      return false;
    } catch (e) {
      print('Error starting recording: $e');
      return false;
    }
  }

  Future<RecordingResult?> stopRecording() async {
    try {
      final path = await _recorder.stop();
      _isRecording = false;

      if (path != null && _recordingStartTime != null) {
        final duration = DateTime.now().difference(_recordingStartTime!);
        return RecordingResult(
          path: path,
          duration: duration.inSeconds,
        );
      }
      return null;
    } catch (e) {
      print('Error stopping recording: $e');
      return null;
    }
  }

  Future<void> cancelRecording() async {
    await _recorder.stop();
    _isRecording = false;

    if (_currentRecordingPath != null) {
      try {
        final file = File(_currentRecordingPath!);
        if (await file.exists()) {
          await file.delete();
        }
      } catch (e) {
        print('Error deleting recording: $e');
      }
    }

    _currentRecordingPath = null;
    _recordingStartTime = null;
  }

  // Playback
  Future<void> play(String url) async {
    try {
      if (_isPlaying) {
        await _player.stop();
      }

      await _player.setUrl(url);
      await _player.play();
      _isPlaying = true;
    } catch (e) {
      print('Error playing audio: $e');
    }
  }

  Future<void> pause() async {
    await _player.pause();
    _isPlaying = false;
  }

  Future<void> resume() async {
    await _player.play();
    _isPlaying = true;
  }

  Future<void> stop() async {
    await _player.stop();
    _isPlaying = false;
  }

  Future<void> seek(Duration position) async {
    await _player.seek(position);
  }

  Stream<Duration> get positionStream => _player.positionStream;
  Stream<Duration?> get durationStream => _player.durationStream;
  Stream<PlayerState> get playerStateStream => _player.playerStateStream;

  // Cleanup
  void dispose() {
    _recorder.dispose();
    _player.dispose();
  }
}

class RecordingResult {
  final String path;
  final int duration;

  RecordingResult({
    required this.path,
    required this.duration,
  });
}

// Audio service provider
final audioServiceProvider = Provider<AudioService>((ref) {
  final service = AudioService();
  ref.onDispose(() => service.dispose());
  return service;
});

// Recording state provider
final recordingStateProvider = StateNotifierProvider<RecordingStateNotifier, RecordingState>((ref) {
  return RecordingStateNotifier(ref.watch(audioServiceProvider));
});

class RecordingState {
  final bool isRecording;
  final int duration;
  final String? filePath;

  RecordingState({
    this.isRecording = false,
    this.duration = 0,
    this.filePath,
  });

  RecordingState copyWith({
    bool? isRecording,
    int? duration,
    String? filePath,
  }) {
    return RecordingState(
      isRecording: isRecording ?? this.isRecording,
      duration: duration ?? this.duration,
      filePath: filePath ?? this.filePath,
    );
  }
}

class RecordingStateNotifier extends StateNotifier<RecordingState> {
  final AudioService _audioService;
  Timer? _timer;

  RecordingStateNotifier(this._audioService) : super(RecordingState());

  Future<void> startRecording() async {
    final started = await _audioService.startRecording();
    if (started) {
      state = state.copyWith(isRecording: true, duration: 0);
      _startTimer();
    }
  }

  Future<void> stopRecording() async {
    _timer?.cancel();
    final result = await _audioService.stopRecording();
    if (result != null) {
      state = state.copyWith(
        isRecording: false,
        filePath: result.path,
        duration: result.duration,
      );
    }
  }

  Future<void> cancelRecording() async {
    _timer?.cancel();
    await _audioService.cancelRecording();
    state = RecordingState();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      state = state.copyWith(duration: state.duration + 1);
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
