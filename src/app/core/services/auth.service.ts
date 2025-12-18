import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, AuthState, AuthResponse, UserRole } from '../../models/user.model'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = signal<AuthState>({
    user: null,
    isAuthenticated: false
  });

  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/auth';

  readonly user = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly isAdmin = computed(() => this.authState().user?.role === UserRole.ADMIN);

  constructor() {
    this.loadAuthState();
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          
          const authenticatedUser: User = {
            username: response.userName,
            role: response.role as UserRole,
            fullName: response.userName
          };

          this.authState.set({
            user: authenticatedUser,
            isAuthenticated: true
          });

          this.saveAuthState();
        }
      }),
      map(response => !!(response && response.token))
    );
  }

  logout(): void {
    this.authState.set({
      user: null,
      isAuthenticated: false
    });

    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  private saveAuthState(): void {
    localStorage.setItem('authState', JSON.stringify(this.authState()));
  }

  private loadAuthState(): void {
    const savedState = localStorage.getItem('authState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        this.authState.set(state);
      } catch (error) {
        console.error('Error loading auth state:', error);
        this.clearAuthState();
      }
    }
  }


  private clearAuthState(): void {
    localStorage.removeItem('authState');
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
