import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { User, LoginCredentials, RegisterCredentials } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private api: ApiService,
    private storage: StorageService
  ) {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    const token = await this.storage.get('auth_token');
    const user = await this.storage.get('user');

    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(credentials: LoginCredentials): Observable<any> {
    return this.api.login(credentials).pipe(
      tap(async (response) => {
        if (response.success) {
          await this.storage.set('auth_token', response.data.token);
          await this.storage.set('user', JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  register(credentials: RegisterCredentials): Observable<any> {
    return this.api.register(credentials).pipe(
      tap(async (response) => {
        if (response.success) {
          // Auto-login after registration
          await this.storage.set('auth_token', response.data.token);
          await this.storage.set('user', JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  async logout(): Promise<void> {
    try {
      await this.api.logout().toPromise();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await this.storage.remove('auth_token');
      await this.storage.remove('user');
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
    }
  }

  async getToken(): Promise<string | null> {
    return await this.storage.get('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
