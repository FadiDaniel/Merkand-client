import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, AuthState, AuthResponse } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = signal<AuthState>({
    user: null,
    isAuthenticated: false
  });
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  readonly user = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly isAdmin = computed(() => this.authState().user?.isAdmin ?? false);

  constructor(private router: Router) {
    this.loadAuthState();
  }

  login(credentials: LoginCredentials): Observable<boolean> {
    return this.http.post<AuthResponse>(this.apiUrl + '/login', credentials).pipe(
      tap(response => {
        //console.log('Backend response:', response);
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          
          const authenticatedUser: User = response.user || {
            username: credentials.username,
            isAdmin: credentials.username === 'admin', 
            fullName: credentials.username
          };

          this.authState.set({
            user: authenticatedUser,
            isAuthenticated: true
          });

          this.saveAuthState();
        }
      }),
      map(response => {
        // Return true if token exists
        return !!(response && response.token);
      })
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
