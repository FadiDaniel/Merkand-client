import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = signal('');
  password = signal('');
  hidePassword = signal(true);
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    if (!this.username() || !this.password()) {
      this.snackBar.open('Por favor complete todos los campos', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isLoading.set(true);
    

    this.authService.login({
      username: this.username(),
      password: this.password()
    }).subscribe({
      next: (success) => {
        this.isLoading.set(false);
        if (success) {
          this.snackBar.open('¡Bienvenido!', 'Cerrar', {
            duration: 2000
          });
          this.router.navigate(['/dashboard']);
        } else {
          console.log(success);
          this.snackBar.open('Credenciales inválidas' + success, 'Cerrar', {
            duration: 3000
          });
        }
      },
      error: (err) => {
        console.error('Login error details:', err);
        this.isLoading.set(false);
        const errorMessage = err.error?.message || err.message || 'Error desconocido';
        this.snackBar.open(`Error de conexión: ${errorMessage}`, 'Cerrar', {
          duration: 5000
        });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.snackBar.open('Contacta con el administrador para recuperar tu contraseña', 'Cerrar', {
      duration: 5000
    });
  }
}
