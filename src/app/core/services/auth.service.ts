import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, AuthState } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';

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

  login(credentials: LoginCredentials): boolean {
    const validUsers = [
      { username: 'admin', password: 'admin123', isAdmin: true, fullName: 'Administrador' },
      { username: 'usuario', password: 'user123', isAdmin: false, fullName: 'Usuario Regular' }
    ];

    const user = validUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      const authenticatedUser: User = {
        username: user.username,
        isAdmin: user.isAdmin,
        fullName: user.fullName
      };

      this.authState.set({
        user: authenticatedUser,
        isAuthenticated: true
      });

      this.saveAuthState();
      return true;
    }

    return false;
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
  }
}
