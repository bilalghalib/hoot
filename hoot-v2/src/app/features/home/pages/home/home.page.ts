import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonText,
  IonSpinner,
  IonButtons,
  IonMenuButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mic,
  stop,
  play,
  pause,
  send,
  arrowForward,
  menu,
} from 'ionicons/icons';
import { AudioService, RecordingState } from '../../../../core/services/audio.service';
import { ApiService } from '../../../../core/services/api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonText,
    IonSpinner,
    IonButtons,
    IonMenuButton,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  recordingState: RecordingState = {
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioUrl: null,
  };
  uploading = false;
  uploadSuccess = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();
  private recordedBlob: Blob | null = null;

  constructor(
    private audioService: AudioService,
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ mic, stop, play, pause, send, arrowForward, menu });
  }

  ngOnInit() {
    this.audioService.recordingState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.recordingState = state;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async startRecording() {
    try {
      this.errorMessage = '';
      await this.audioService.startRecording();
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to start recording';
      console.error('Recording error:', error);
    }
  }

  async stopRecording() {
    try {
      this.recordedBlob = await this.audioService.stopRecording();
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to stop recording';
      console.error('Stop recording error:', error);
    }
  }

  async uploadHoot() {
    if (!this.recordedBlob) {
      this.errorMessage = 'No recording to upload';
      return;
    }

    this.uploading = true;
    this.errorMessage = '';

    try {
      await this.api.createHoot(this.recordedBlob).toPromise();
      this.uploadSuccess = true;
      this.recordedBlob = null;

      // Show success for 2 seconds then reset
      setTimeout(() => {
        this.uploadSuccess = false;
      }, 2000);
    } catch (error: any) {
      this.errorMessage = error?.error?.message || 'Failed to upload Hoot';
      console.error('Upload error:', error);
    } finally {
      this.uploading = false;
    }
  }

  cancelRecording() {
    this.audioService.cancelRecording();
    this.recordedBlob = null;
    this.errorMessage = '';
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goToFeed() {
    this.router.navigate(['/feed']);
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
