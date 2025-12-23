import { Component, Inject } from '@angular/core';
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
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
  <div class="container">
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo Producto' : 'Editar Producto' }}</h2>
    
    <mat-dialog-content>
      <form #productoForm="ngForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="formData.name" name="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción</mat-label>
          <textarea matInput [(ngModel)]="formData.description" name="description" rows="3" required></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Categoría</mat-label>
          <mat-select class="select" [(ngModel)]="formData.category" name="category" required>
            <mat-option value="Lácteos">Lácteos</mat-option>
            <mat-option value="Frutas">Frutas</mat-option>
            <mat-option value="Verduras">Verduras</mat-option>
            <mat-option value="Carnes">Carnes</mat-option>
            <mat-option value="Bebidas">Bebidas</mat-option>
            <mat-option value="Otros">Otros</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Precio</mat-label>
            <input matInput type="number" [(ngModel)]="formData.price" name="price" required min="0" step="0.01">
            <span matSuffix>€ &nbsp; &nbsp; &nbsp; </span>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Stock</mat-label>
            <input matInput type="number" [(ngModel)]="formData.stock" name="stock" required min="0">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Stock Mínimo</mat-label>
            <input matInput type="number" [(ngModel)]="formData.minimumStock" name="minimumStock" required min="0">
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Categoría</mat-label>
          <mat-select class="select" [(ngModel)]="formData.category" name="category" required>
            <mat-option value="Carnicerias el campo">Carnicerias el campo</mat-option>
            <mat-option value="Coca-Cola">Coca-Cola</mat-option>
            <mat-option value="Polleria la campana">Polleria la campana</mat-option>
            <mat-option value="Mi campiña">Mi campiña</mat-option>
            <mat-option value="Juicis">Juicis</mat-option>
            <mat-option value="Otros">Otros</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button class="btn" mat-button (click)="onCancel()">Cancelar</button>
      <button class="btn" mat-button (click)="onSave()" [disabled]="!productoForm.valid">
        {{ data.mode === 'create' ? 'Crear' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .btn {
      background-color: white;
      color: #000;
      border: 1px solid #ccc;
    }

    .btn:hover {
      background-color: #eaeaea73;
      color: #000;
      border: 1px solid #ccc;
    }

    .container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      background-color: #fff;
    }

    ::ng-deep .mat-mdc-select-panel {
      background: white !important;
    }

    mat-dialog-content {
      min-width: 500px;
      padding: 20px 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
      padding: 9px;
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
      name: this.data.producto?.name || '',
      description: this.data.producto?.description || '',
      category: this.data.producto?.category || '',
      price: this.data.producto?.price || 0,
      stock: this.data.producto?.stock || 0,
      minimumStock: this.data.producto?.minimumStock || 0,
      active: this.data.producto?.active ?? true,
      supplierId: this.data.producto?.supplierId || 0,
      supplierName: this.data.producto?.supplierName || ''
    };
  }

  onSave(): void {
    this.dialogRef.close(this.formData);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}