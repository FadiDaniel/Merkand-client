import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService } from '../../../core/services/producto.service';
import { MovimientoService } from '../../../core/services/movimiento.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateMovimientoDto } from '../../../models/movimiento.model';

@Component({
  selector: 'app-movimiento-ajuste-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Registrar Ajuste de Inventario</h2>
    <mat-dialog-content>
      <form #ajusteForm="ngForm">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Movimiento</mat-label>
          <mat-select [(ngModel)]="formData.tipo" name="tipo" required>
            <mat-option value="ajuste">Ajuste Manual</mat-option>
            <mat-option value="inventario-inicial">Inventario Inicial</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Producto</mat-label>
          <mat-select [(ngModel)]="formData.productoId" name="producto" required>
            @for (prod of productos(); track prod.id) {
              <mat-option [value]="prod.id">{{ prod.name }} (Stock: {{ prod.stock }})</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Cantidad (Positivo para agregar, Negativo para restar)</mat-label>
          <input matInput type="number" [(ngModel)]="formData.cantidad" name="cantidad" required>
          <mat-hint>Ej: -5 para reducir stock, 10 para aumentar</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Motivo</mat-label>
          <input matInput [(ngModel)]="formData.motivo" name="motivo" required placeholder="Ej: Merma, Conteo físico">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="!ajusteForm.valid" (click)="guardar()">
        Registrar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class MovimientoAjusteDialogComponent {
  private productoService = inject(ProductoService);
  private movimientoService = inject(MovimientoService);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<MovimientoAjusteDialogComponent>);
  private snackBar = inject(MatSnackBar);

  productos = this.productoService.productos$;

  formData = {
    tipo: 'ADJUST' as const,
    productoId: 5,
    cantidad: 0,
    motivo: ''
  };

  guardar() {
    if (this.formData.cantidad === 0) {
      this.snackBar.open('La cantidad no puede ser 0', 'Cerrar', { duration: 3000 });
      return;
    }

    const dto: CreateMovimientoDto = {
      movementType: this.formData.tipo,
      productId: this.formData.productoId,
      quantity: this.formData.cantidad,
      reason: this.formData.motivo
    };

    this.movimientoService.registrarAjuste(dto);
    
    this.snackBar.open('Movimiento registrado exitosamente', 'Cerrar', { duration: 3000 });
    this.dialogRef.close(true);
  }
}
