import { Component, Inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Producto, CreateProductoDto } from '../../../models/producto.model';

interface DialogData {
  mode: 'create' | 'edit';
  producto?: Producto;
}

@Component({
  selector: 'app-producto-form-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo Producto' : 'Editar Producto' }}</h2>
    
    <mat-dialog-content>
      <form #productoForm="ngForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="formData.nombre" name="nombre" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput [(ngModel)]="formData.descripcion" name="descripcion" rows="3" required></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Categoría</mat-label>
          <mat-select [(ngModel)]="formData.categoria" name="categoria" required>
            <mat-option value="Electrónica">Electrónica</mat-option>
            <mat-option value="Accesorios">Accesorios</mat-option>
            <mat-option value="Componentes">Componentes</mat-option>
            <mat-option value="Periféricos">Periféricos</mat-option>
            <mat-option value="Software">Software</mat-option>
            <mat-option value="Otros">Otros</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Precio</mat-label>
            <input matInput type="number" [(ngModel)]="formData.precio" name="precio" required min="0" step="0.01">
            <span matPrefix>$&nbsp;</span>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Stock</mat-label>
            <input matInput type="number" [(ngModel)]="formData.stock" name="stock" required min="0">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Stock Mínimo</mat-label>
            <input matInput type="number" [(ngModel)]="formData.stockMinimo" name="stockMinimo" required min="0">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Proveedor</mat-label>
          <input matInput [(ngModel)]="formData.proveedor" name="proveedor" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!productoForm.valid">
        {{ data.mode === 'create' ? 'Crear' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 500px;
      padding: 20px 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      mat-dialog-content {
        min-width: auto;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductoFormDialogComponent {
  formData: CreateProductoDto;

  constructor(
    public dialogRef: MatDialogRef<ProductoFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.formData = {
      nombre: this.data.producto?.nombre || '',
      descripcion: this.data.producto?.descripcion || '',
      categoria: this.data.producto?.categoria || '',
      precio: this.data.producto?.precio || 0,
      stock: this.data.producto?.stock || 0,
      stockMinimo: this.data.producto?.stockMinimo || 0,
      proveedor: this.data.producto?.proveedor || ''
    };
  }

  onSave(): void {
    this.dialogRef.close(this.formData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
