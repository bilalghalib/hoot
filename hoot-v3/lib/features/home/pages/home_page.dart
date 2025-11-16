import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/services/audio_service.dart';
import '../../../core/services/supabase_service.dart';
import '../../feed/pages/feed_page.dart';
import '../widgets/recording_button.dart';
import '../widgets/waveform_widget.dart';

class HomePage extends ConsumerStatefulWidget {
  const HomePage({super.key});

  @override
  ConsumerState<HomePage> createState() => _HomePageState();
}

class _HomePageState extends ConsumerState<HomePage> {
  bool _isUploading = false;
  String? _errorMessage;
  bool _uploadSuccess = false;

  Future<void> _handleUpload() async {
    final recordingState = ref.read(recordingStateProvider);

    if (recordingState.filePath == null) return;

    setState(() {
      _isUploading = true;
      _errorMessage = null;
    });

    try {
      final supabase = ref.read(supabaseServiceProvider);

      // Upload audio file
      final fileName =
          'hoot_${DateTime.now().millisecondsSinceEpoch}.m4a';
      final audioUrl = await supabase.uploadAudio(
        recordingState.filePath!,
        fileName,
      );

      // Create hoot entry
      await supabase.createHoot(audioUrl, recordingState.duration);

      setState(() {
        _uploadSuccess = true;
      });

      // Reset after 2 seconds
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          setState(() {
            _uploadSuccess = false;
          });
          ref.read(recordingStateProvider.notifier).cancelRecording();
        }
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to upload: ${e.toString()}';
      });
    } finally {
      setState(() {
        _isUploading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final recordingState = ref.watch(recordingStateProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('🦉 Hoot'),
        actions: [
          IconButton(
            icon: const Icon(Icons.feed),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const FeedPage()),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await ref.read(supabaseServiceProvider).signOut();
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Title
              Text(
                'Give a Hoot',
                textAlign: TextAlign.center,
                style: theme.textTheme.displayMedium,
              ).animate().fadeIn(duration: 600.ms).slideY(
                    begin: -0.3,
                    end: 0,
                  ),
              const SizedBox(height: 8),

              Text(
                'Tap the microphone to record your voice',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodyMedium,
              ).animate(delay: 200.ms).fadeIn(duration: 600.ms),
              const SizedBox(height: 48),

              // Recording Area
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Waveform or Status
                      if (recordingState.isRecording)
                        const WaveformWidget()
                            .animate(onPlay: (controller) => controller.repeat())
                            .shimmer(duration: 1500.ms),

                      const SizedBox(height: 24),

                      // Recording Button
                      const RecordingButton(),

                      const SizedBox(height: 24),

                      // Duration
                      if (recordingState.duration > 0)
                        Text(
                          _formatDuration(recordingState.duration),
                          style: theme.textTheme.displaySmall?.copyWith(
                            fontFeatures: [const FontFeature.tabularFigures()],
                          ),
                        ).animate().fadeIn(),

                      const SizedBox(height: 16),

                      // Status Text
                      Text(
                        recordingState.isRecording
                            ? 'Recording...'
                            : recordingState.filePath != null
                                ? 'Ready to upload!'
                                : 'Tap to start',
                        style: theme.textTheme.titleLarge,
                      ),
                    ],
                  ),
                ),
              ),

              // Error Message
              if (_errorMessage != null)
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    _errorMessage!,
                    textAlign: TextAlign.center,
                    style: TextStyle(color: theme.colorScheme.error),
                  ),
                ).animate().shake(),

              // Success Message
              if (_uploadSuccess)
                Container(
                  padding: const EdgeInsets.all(12),
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: Colors.green.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.check_circle, color: Colors.green),
                      SizedBox(width: 8),
                      Text(
                        'Hoot uploaded successfully!',
                        style: TextStyle(color: Colors.green),
                      ),
                    ],
                  ),
                ).animate().scale(duration: 400.ms),

              // Action Buttons
              if (!recordingState.isRecording && recordingState.filePath != null)
                Column(
                  children: [
                    ElevatedButton.icon(
                      onPressed: _isUploading ? null : _handleUpload,
                      icon: _isUploading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                valueColor:
                                    AlwaysStoppedAnimation<Color>(Colors.white),
                              ),
                            )
                          : const Icon(Icons.cloud_upload),
                      label: const Text('Upload Hoot'),
                    ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.2, end: 0),
                    const SizedBox(height: 12),
                    OutlinedButton.icon(
                      onPressed: _isUploading
                          ? null
                          : () {
                              ref
                                  .read(recordingStateProvider.notifier)
                                  .cancelRecording();
                            },
                      icon: const Icon(Icons.refresh),
                      label: const Text('Re-record'),
                    ).animate(delay: 100.ms).fadeIn(duration: 400.ms).slideY(
                          begin: 0.2,
                          end: 0,
                        ),
                  ],
                ),

              if (recordingState.isRecording)
                OutlinedButton.icon(
                  onPressed: () {
                    ref.read(recordingStateProvider.notifier).stopRecording();
                  },
                  icon: const Icon(Icons.stop),
                  label: const Text('Stop Recording'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: theme.colorScheme.error,
                    side: BorderSide(color: theme.colorScheme.error),
                  ),
                ).animate().fadeIn(duration: 400.ms),
            ],
          ),
        ),
      ),
    );
  }

  String _formatDuration(int seconds) {
    final mins = seconds ~/ 60;
    final secs = seconds % 60;
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }
}
