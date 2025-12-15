import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginCredentials, AuthState } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // State usando Signals
  private authState = signal<AuthState>({
    user: null,
    isAuthenticated: false
  });

  // Computed signals para acceso público
  readonly user = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly isAdmin = computed(() => this.authState().user?.isAdmin ?? false);

  constructor(private router: Router) {
    this.loadAuthState();
  }

  /**
   * Intenta autenticar al usuario con las credenciales proporcionadas
   */
  login(credentials: LoginCredentials): boolean {
    // Simulación de autenticación (en producción, esto sería una llamada HTTP)
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

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): void {
    this.authState.set({
      user: null,
      isAuthenticated: false
    });

    this.clearAuthState();
    this.router.navigate(['/login']);
  }

  /**
   * Guarda el estado de autenticación en localStorage
   */
  private saveAuthState(): void {
    localStorage.setItem('authState', JSON.stringify(this.authState()));
  }

  /**
   * Carga el estado de autenticación desde localStorage
   */
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

  /**
   * Limpia el estado de autenticación de localStorage
   */
  private clearAuthState(): void {
    localStorage.removeItem('authState');
  }
}
