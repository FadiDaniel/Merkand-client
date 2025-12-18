import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Proveedor, CreateProveedorDto } from '../../../models/proveedor.model';

export interface ProveedorDialogData {
  proveedor?: Proveedor;
}

@Component({
  selector: 'app-proveedor-form-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.proveedor ? 'Editar' : 'Nuevo' }} Proveedor</h2>
    <mat-dialog-content>
      <form #form="ngForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre Empresa</mat-label>
          <input matInput [(ngModel)]="formData.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contacto Principal</mat-label>
          <input matInput [(ngModel)]="formData.contactName" name="contactName" required>
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline">
            <mat-label>Teléfono</mat-label>
            <input matInput [(ngModel)]="formData.phone" name="phone" required>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" [(ngModel)]="formData.email" name="email" required>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Dirección</mat-label>
          <input matInput [(ngModel)]="formData.address" name="address" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="!form.valid" (click)="guardar()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 8px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 8px; }
  `]
})
export class ProveedorFormDialogComponent {
  private dialogRef = inject(MatDialogRef<ProveedorFormDialogComponent>);
  public data = inject<ProveedorDialogData>(MAT_DIALOG_DATA);

  formData: CreateProveedorDto = {
    name: this.data.proveedor?.name || '',
    contactName: this.data.proveedor?.contactName || '',
    phone: this.data.proveedor?.phone || '',
    email: this.data.proveedor?.email || '',
    address: this.data.proveedor?.address || '',
    nif: this.data.proveedor?.nif || '',
  };

  guardar() {
    this.dialogRef.close(this.formData);
  }
}
