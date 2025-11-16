import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioUrl: string | null;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  audioUrl: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private recordingStartTime: number = 0;
  private audioElement: HTMLAudioElement | null = null;

  private recordingStateSubject = new BehaviorSubject<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioUrl: null,
  });

  private playbackStateSubject = new BehaviorSubject<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    audioUrl: null,
  });

  public recordingState$ = this.recordingStateSubject.asObservable();
  public playbackState$ = this.playbackStateSubject.asObservable();

  constructor() {}

  // Recording Methods
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      this.audioChunks = [];
      this.recordingStartTime = Date.now();

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const duration = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        this.updateRecordingState({ duration });
      };

      this.mediaRecorder.start(100); // Collect data every 100ms

      this.updateRecordingState({
        isRecording: true,
        isPaused: false,
        duration: 0,
        audioUrl: null,
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to access microphone. Please grant permission.');
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        this.updateRecordingState({
          isRecording: false,
          isPaused: false,
          audioUrl,
        });

        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.updateRecordingState({ isPaused: true });
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      this.updateRecordingState({ isPaused: false });
    }
  }

  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.audioChunks = [];

      this.updateRecordingState({
        isRecording: false,
        isPaused: false,
        duration: 0,
        audioUrl: null,
      });
    }
  }

  // Playback Methods
  play(audioUrl: string): void {
    if (this.audioElement) {
      this.stop();
    }

    this.audioElement = new Audio(audioUrl);

    this.audioElement.addEventListener('loadedmetadata', () => {
      this.updatePlaybackState({
        duration: this.audioElement!.duration,
        audioUrl,
      });
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this.updatePlaybackState({
        currentTime: this.audioElement!.currentTime,
      });
    });

    this.audioElement.addEventListener('ended', () => {
      this.updatePlaybackState({
        isPlaying: false,
        currentTime: 0,
      });
    });

    this.audioElement.addEventListener('error', (error) => {
      console.error('Audio playback error:', error);
      this.updatePlaybackState({
        isPlaying: false,
        currentTime: 0,
      });
    });

    this.audioElement.play();
    this.updatePlaybackState({ isPlaying: true, audioUrl });
  }

  pause(): void {
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
      this.updatePlaybackState({ isPlaying: false });
    }
  }

  resume(): void {
    if (this.audioElement && this.audioElement.paused) {
      this.audioElement.play();
      this.updatePlaybackState({ isPlaying: true });
    }
  }

  stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;

      this.updatePlaybackState({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        audioUrl: null,
      });
    }
  }

  seek(time: number): void {
    if (this.audioElement) {
      this.audioElement.currentTime = time;
      this.updatePlaybackState({ currentTime: time });
    }
  }

  setPlaybackRate(rate: number): void {
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }

  // Helper Methods
  private updateRecordingState(partial: Partial<RecordingState>): void {
    const currentState = this.recordingStateSubject.value;
    this.recordingStateSubject.next({ ...currentState, ...partial });
  }

  private updatePlaybackState(partial: Partial<PlaybackState>): void {
    const currentState = this.playbackStateSubject.value;
    this.playbackStateSubject.next({ ...currentState, ...partial });
  }

  getRecordingState(): RecordingState {
    return this.recordingStateSubject.value;
  }

  getPlaybackState(): PlaybackState {
    return this.playbackStateSubject.value;
  }

  async checkMicrophonePermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return result.state === 'granted';
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return false;
    }
  }
}
