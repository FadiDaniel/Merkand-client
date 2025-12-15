import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="registro-container">
      <h1 class="page-title">Registrar Nuevo Usuario</h1>

      <mat-card>
        <mat-card-content>
          <form #registroForm="ngForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre de Usuario</mat-label>
              <input matInput [(ngModel)]="formData.username" name="username" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre Completo</mat-label>
              <input matInput [(ngModel)]="formData.fullName" name="fullName" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="formData.email" name="email" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" [(ngModel)]="formData.password" name="password" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Rol</mat-label>
              <mat-select [(ngModel)]="formData.isAdmin" name="isAdmin" required>
                <mat-option [value]="false">Usuario</mat-option>
                <mat-option [value]="true">Administrador</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="actions">
              <button mat-button type="button" (click)="onCancel()">Cancelar</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!registroForm.valid">
                Registrar Usuario
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .registro-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 24px;
      color: #333;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
    }
  `]
})
export class RegistroComponent {
  formData = {
    username: '',
    fullName: '',
    email: '',
    password: '',
    isAdmin: false
  };

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/dashboard']);
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
