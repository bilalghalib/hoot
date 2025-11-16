import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user_model.dart';
import '../models/hoot_model.dart';

// Supabase client provider
final supabaseProvider = Provider<SupabaseClient>((ref) {
  return Supabase.instance.client;
});

// Auth state provider
final authStateProvider = StreamProvider<Session?>((ref) {
  final supabase = ref.watch(supabaseProvider);
  return supabase.auth.onAuthStateChange.map((data) => data.session);
});

// Current user provider
final currentUserProvider = FutureProvider<UserModel?>((ref) async {
  final supabase = ref.watch(supabaseProvider);
  final session = await ref.watch(authStateProvider.future);

  if (session == null) return null;

  final response = await supabase
      .from('users')
      .select()
      .eq('id', session.user.id)
      .single();

  return UserModel.fromJson(response);
});

// Supabase Service Class
class SupabaseService {
  final SupabaseClient _client;

  SupabaseService(this._client);

  // Auth
  Future<AuthResponse> signIn(String email, String password) async {
    return await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  Future<AuthResponse> signUp(String email, String password,
      {String? username}) async {
    final response = await _client.auth.signUp(
      email: email,
      password: password,
      data: {'username': username},
    );

    // Create user profile
    if (response.user != null) {
      await _client.from('users').insert({
        'id': response.user!.id,
        'email': email,
        'username': username,
        'created_at': DateTime.now().toIso8601String(),
      });
    }

    return response;
  }

  Future<void> signOut() async {
    await _client.auth.signOut();
  }

  // Hoots
  Future<List<HootModel>> getHoots({int limit = 20, int offset = 0}) async {
    final response = await _client
        .from('hoots')
        .select()
        .order('created_at', ascending: false)
        .range(offset, offset + limit - 1);

    return (response as List).map((json) => HootModel.fromJson(json)).toList();
  }

  Future<HootModel> createHoot(String audioUrl, int duration) async {
    final user = _client.auth.currentUser;
    if (user == null) throw Exception('Not authenticated');

    final response = await _client.from('hoots').insert({
      'user_id': user.id,
      'audio_url': audioUrl,
      'duration': duration,
      'created_at': DateTime.now().toIso8601String(),
    }).select().single();

    return HootModel.fromJson(response);
  }

  Future<String> uploadAudio(String path, String fileName) async {
    final file = await _client.storage.from('hoots').upload(
          fileName,
          await _readFileAsBytes(path),
          fileOptions: const FileOptions(
            contentType: 'audio/m4a',
          ),
        );

    return _client.storage.from('hoots').getPublicUrl(fileName);
  }

  // Messages
  Future<void> sendMessage(
      String roomId, String audioUrl, int duration) async {
    final user = _client.auth.currentUser;
    if (user == null) throw Exception('Not authenticated');

    await _client.from('messages').insert({
      'room_id': roomId,
      'sender_id': user.id,
      'audio_url': audioUrl,
      'duration': duration,
      'created_at': DateTime.now().toIso8601String(),
    });
  }

  Stream<List<Map<String, dynamic>>> subscribeToMessages(String roomId) {
    return _client
        .from('messages')
        .stream(primaryKey: ['id'])
        .eq('room_id', roomId)
        .order('created_at');
  }

  // Helper to read file as bytes (implement based on platform)
  Future<List<int>> _readFileAsBytes(String path) async {
    // TODO: Implement file reading
    throw UnimplementedError();
  }
}

// Supabase service provider
final supabaseServiceProvider = Provider<SupabaseService>((ref) {
  return SupabaseService(ref.watch(supabaseProvider));
});
