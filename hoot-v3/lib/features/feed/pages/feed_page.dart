import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/services/supabase_service.dart';
import '../../../core/models/hoot_model.dart';
import '../widgets/hoot_card.dart';

// Hoots provider
final hootsProvider = FutureProvider<List<HootModel>>((ref) async {
  final supabase = ref.watch(supabaseServiceProvider);
  return await supabase.getHoots();
});

class FeedPage extends ConsumerWidget {
  const FeedPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final hootsAsync = ref.watch(hootsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Feed'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.invalidate(hootsProvider);
            },
          ),
        ],
      ),
      body: hootsAsync.when(
        data: (hoots) {
          if (hoots.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    Icons.mic_off,
                    size: 80,
                    color: Colors.grey,
                  ).animate().scale(duration: 600.ms),
                  const SizedBox(height: 16),
                  Text(
                    'No Hoots yet',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ).animate(delay: 200.ms).fadeIn(),
                  const SizedBox(height: 8),
                  Text(
                    'Be the first to share a Hoot!',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ).animate(delay: 400.ms).fadeIn(),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(hootsProvider);
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: hoots.length,
              itemBuilder: (context, index) {
                return HootCard(hoot: hoots[index])
                    .animate(delay: (index * 100).ms)
                    .fadeIn(duration: 400.ms)
                    .slideY(begin: 0.2, end: 0);
              },
            ),
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(),
        ),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                size: 64,
                color: Colors.red,
              ),
              const SizedBox(height: 16),
              Text('Error loading Hoots'),
              const SizedBox(height: 8),
              Text(
                error.toString(),
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodySmall,
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () {
                  ref.invalidate(hootsProvider);
                },
                icon: const Icon(Icons.refresh),
                label: const Text('Try Again'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
