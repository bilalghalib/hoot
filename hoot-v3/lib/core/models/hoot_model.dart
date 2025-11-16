import 'package:equatable/equatable.dart';

class HootModel extends Equatable {
  final String id;
  final String userId;
  final String audioUrl;
  final int duration; // in seconds
  final DateTime createdAt;
  final int likes;
  final int replies;
  final bool isLiked;

  const HootModel({
    required this.id,
    required this.userId,
    required this.audioUrl,
    required this.duration,
    required this.createdAt,
    this.likes = 0,
    this.replies = 0,
    this.isLiked = false,
  });

  factory HootModel.fromJson(Map<String, dynamic> json) {
    return HootModel(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      audioUrl: json['audio_url'] as String,
      duration: json['duration'] as int? ?? 0,
      createdAt: DateTime.parse(json['created_at'] as String),
      likes: json['likes'] as int? ?? 0,
      replies: json['replies'] as int? ?? 0,
      isLiked: json['is_liked'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'audio_url': audioUrl,
      'duration': duration,
      'created_at': createdAt.toIso8601String(),
      'likes': likes,
      'replies': replies,
      'is_liked': isLiked,
    };
  }

  HootModel copyWith({
    String? id,
    String? userId,
    String? audioUrl,
    int? duration,
    DateTime? createdAt,
    int? likes,
    int? replies,
    bool? isLiked,
  }) {
    return HootModel(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      audioUrl: audioUrl ?? this.audioUrl,
      duration: duration ?? this.duration,
      createdAt: createdAt ?? this.createdAt,
      likes: likes ?? this.likes,
      replies: replies ?? this.replies,
      isLiked: isLiked ?? this.isLiked,
    );
  }

  @override
  List<Object?> get props =>
      [id, userId, audioUrl, duration, createdAt, likes, replies, isLiked];
}
