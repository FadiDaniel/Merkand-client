import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="perfil-container">
      <h1 class="page-title">Mi Perfil</h1>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Información del Usuario</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="profile-info">
            <div class="avatar">
              <mat-icon>account_circle</mat-icon>
            </div>

            <div class="info-grid">
              <mat-form-field appearance="outline">
                <mat-label>Nombre de Usuario</mat-label>
                <input matInput [value]="user()?.username || ''" readonly>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nombre Completo</mat-label>
                <input matInput [value]="user()?.fullName || ''" readonly>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Rol</mat-label>
                <input matInput [value]="isAdmin() ? 'Administrador' : 'Usuario'" readonly>
              </mat-form-field>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .perfil-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 24px;
      color: #333;
    }

    .profile-info {
      padding: 20px;
    }

    .avatar {
      text-align: center;
      margin-bottom: 32px;
    }

    .avatar mat-icon {
      font-size: 120px;
      width: 120px;
      height: 120px;
      color: var(--mat-sys-primary);
    }

    .info-grid {
      display: grid;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class PerfilComponent {
  private authService = inject(AuthService);
  
  readonly user = this.authService.user;
  readonly isAdmin = this.authService.isAdmin;
}
