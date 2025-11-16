import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/services/audio_service.dart';

class RecordingButton extends ConsumerWidget {
  const RecordingButton({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final recordingState = ref.watch(recordingStateProvider);
    final isRecording = recordingState.isRecording;
    final hasRecording = recordingState.filePath != null;

    return GestureDetector(
      onTap: () {
        if (hasRecording && !isRecording) {
          // Already have a recording, don't start new one
          return;
        }
        if (isRecording) {
          ref.read(recordingStateProvider.notifier).stopRecording();
        } else {
          ref.read(recordingStateProvider.notifier).startRecording();
        }
      },
      child: Container(
        width: 120,
        height: 120,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isRecording
                ? [
                    theme.colorScheme.error,
                    theme.colorScheme.error.withOpacity(0.7),
                  ]
                : hasRecording
                    ? [
                        Colors.green,
                        Colors.green.withOpacity(0.7),
                      ]
                    : [
                        theme.colorScheme.primary,
                        theme.colorScheme.secondary,
                      ],
          ),
          boxShadow: [
            BoxShadow(
              color: (isRecording
                      ? theme.colorScheme.error
                      : theme.colorScheme.primary)
                  .withOpacity(0.3),
              blurRadius: 20,
              spreadRadius: 5,
            ),
          ],
        ),
        child: Icon(
          isRecording
              ? Icons.mic
              : hasRecording
                  ? Icons.check
                  : Icons.mic_none,
          size: 48,
          color: Colors.white,
        ),
      )
          .animate(
            onPlay: (controller) => isRecording ? controller.repeat() : null,
          )
          .scale(
            duration: 1000.ms,
            begin: const Offset(1, 1),
            end: const Offset(1.1, 1.1),
          ),
    );
  }
}
