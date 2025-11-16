import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  Hoot,
  HootResponse,
  HootsResponse,
  Room,
  RoomResponse,
  Message,
  MessagesResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Authentication
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/users/login`, credentials);
  }

  register(credentials: RegisterCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/users/register`, credentials);
  }

  logout(): Observable<{ success: boolean }> {
    return this.http.get<{ success: boolean }>(`${this.baseUrl}/users/logout`);
  }

  // Hoots
  getHoots(offset = 0, limit = 10): Observable<HootsResponse> {
    const params = new HttpParams().set('offset', offset.toString()).set('limit', limit.toString());
    return this.http.get<HootsResponse>(`${this.baseUrl}/hoot/getHoot`, { params });
  }

  createHoot(audioBlob: Blob, metadata?: any): Observable<HootResponse> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'hoot.webm');
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }
    return this.http.post<HootResponse>(`${this.baseUrl}/hoot`, formData);
  }

  markHootAsRead(hootId: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.baseUrl}/hoot/hootRead/${hootId}`, {});
  }

  // Chat/Rooms
  getRoom(userId: string): Observable<RoomResponse> {
    return this.http.get<RoomResponse>(`${this.baseUrl}/room/${userId}`);
  }

  sendMessage(roomId: string, audioBlob: Blob, data?: any): Observable<Message> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'message.webm');
    if (data) {
      formData.append('data', JSON.stringify(data));
    }
    return this.http.post<Message>(`${this.baseUrl}/room/${roomId}/message`, formData);
  }

  getMessages(roomId: string): Observable<MessagesResponse> {
    return this.http.get<MessagesResponse>(`${this.baseUrl}/room/${roomId}/messages`);
  }

  // Helper method to construct audio URL
  getAudioUrl(hootId: string): string {
    return `${environment.s3BucketUrl || this.baseUrl}/audio/${hootId}`;
  }
}
