import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../../core/services/producto.service';
import { OrdenService } from '../../../core/services/orden.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProveedorService } from '../../../core/services/proveedor.service';
import { OrderItem } from '../../../models/orden.model';
import { BackButtonComponent } from '../../../shared/components/back-button.component';

@Component({
  selector: 'app-nueva-orden',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatSnackBarModule,
    CurrencyPipe,
    BackButtonComponent
  ],
  template: `
    <div class="nueva-orden-container">
      <app-back-button route="/dashboard" label="Volver"></app-back-button>
      <h1 class="page-title">Nueva Orden</h1>

      <mat-card>
        <mat-card-content>
          <form #ordenForm="ngForm">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Tipo de Orden</mat-label>
                <mat-select [(ngModel)]="tipoOrden" name="tipo" (selectionChange)="onTipoChange()" required>
                  <mat-option value="entrada">Entrada (Compra)</mat-option>
                  <mat-option value="salida">Salida (Venta/Ajuste)</mat-option>
                </mat-select>
              </mat-form-field>

              @if (tipoOrden() === 'entrada') {
                <mat-form-field appearance="outline">
                  <mat-label>Seleccionar Proveedor</mat-label>
                  <mat-select [(ngModel)]="proveedorId" name="proveedorId" (selectionChange)="onProveedorChange()" required>
                    @for (prov of proveedores(); track prov.id) {
                      <mat-option [value]="prov.id">{{ prov.name }}</mat-option>
                    }
                  </mat-select>
                </mat-form-field>
              } @else {
                <mat-form-field appearance="outline">
                  <mat-label>Cliente / Referencia</mat-label>
                  <input matInput [(ngModel)]="clienteRef" name="cliente" required>
                </mat-form-field>
              }
            </div>

            <h3>Productos</h3>
            <div class="producto-selector">
              <mat-form-field appearance="outline" class="producto-field">
                <mat-label>Seleccionar Producto</mat-label>
                <mat-select [(ngModel)]="productoSeleccionado" name="producto" [disabled]="bloquearSeleccionProductos()">
                  @for (producto of productosFiltrados(); track producto.id) {
                    <mat-option [value]="producto.id">
                      {{ producto.name }} 
                      @if (tipoOrden() === 'salida') { (Stock: {{ producto.stock }}) }
                    </mat-option>
                  }
                  @if (productosFiltrados().length === 0) {
                    <mat-option disabled>
                      {{ getEmptyMessage() }}
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="cantidad-field">
                <mat-label>Cantidad</mat-label>
                <input matInput type="number" [(ngModel)]="cantidad" name="cantidad" min="1" [disabled]="bloquearSeleccionProductos()">
              </mat-form-field>

              <button mat-raised-button color="accent" type="button" (click)="agregarProducto()" [disabled]="bloquearSeleccionProductos()">
                <mat-icon>add</mat-icon>
                Agregar
              </button>
            </div>

            <table mat-table [dataSource]="productosOrden()" class="productos-table">
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Producto</th>
                <td mat-cell *matCellDef="let item">{{ item.nombreProducto }}</td>
              </ng-container>

              <ng-container matColumnDef="cantidad">
                <th mat-header-cell *matHeaderCellDef>Cantidad</th>
                <td mat-cell *matCellDef="let item">{{ item.cantidad }}</td>
              </ng-container>

              <ng-container matColumnDef="precio">
                <th mat-header-cell *matHeaderCellDef>Precio Unit.</th>
                <td mat-cell *matCellDef="let item">{{ item.precioUnitario | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="subtotal">
                <th mat-header-cell *matHeaderCellDef>Subtotal</th>
                <td mat-cell *matCellDef="let item">{{ item.subtotal | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let item; let i = index">
                  <button mat-icon-button color="warn" (click)="eliminarProducto(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div class="total-section">
              <h2>Total: {{ total() | currency }}</h2>
            </div>

            <div class="actions">
              <button mat-button type="button" (click)="onCancel()">Cancelar</button>
              <button mat-raised-button color="primary" type="button" (click)="onSubmit()" 
                      [disabled]="productosOrden().length === 0 || !ordenForm.valid">
                Crear Orden
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .nueva-orden-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 24px;
      color: #333;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .producto-selector {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      align-items: flex-start;
    }

    .producto-field {
      flex: 2;
    }

    .cantidad-field {
      flex: 1;
    }

    .producto-selector button {
      height: 56px;
      margin-top: 4px;
    }

    .productos-table {
      width: 100%;
      margin-bottom: 24px;
      border: 1px solid #eee;
    }

    .total-section {
      text-align: right;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 24px;
      border-left: 5px solid var(--merkand-primary);
    }

    .total-section h2 {
      margin: 0;
      color: #333;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  `]
})
export class NuevaOrdenComponent {
  private productoService = inject(ProductoService);
  private ordenService = inject(OrdenService);
  private authService = inject(AuthService);
  private proveedorService = inject(ProveedorService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['nombre', 'cantidad', 'precio', 'subtotal', 'acciones'];
  
  tipoOrden = signal<'entrada' | 'salida'>('entrada');
  proveedorId = signal(null);
  clienteRef = signal('');
  
  productoSeleccionado = signal(null);
  cantidad = signal(1);
  productosOrden = signal<OrderItem[]>([]);

  proveedores = this.proveedorService.proveedores$;
  productos = this.productoService.productos$;

  productosFiltrados = computed(() => {
    let prods = this.productos().filter(p => p.active);
    
    if (this.tipoOrden() === 'entrada' && this.proveedorId()) {
      const prov = this.proveedores().find(p => p.id === this.proveedorId());
      if (prov) {
        return prods.filter(p => p.supplierName === prov.name || p.supplierId === prov.id);
      }
    }
    
    return prods;
  });

  total = computed(() => {
    return this.productosOrden().reduce((sum, p) => sum + p.subTotal, 0);
  });

  bloquearSeleccionProductos = computed(() => {
    if (this.tipoOrden() === 'entrada' && !this.proveedorId()) return true;
    if (this.tipoOrden() === 'salida' && !this.clienteRef()) return false; 
    return false;
  });

  constructor() {
  }

  onTipoChange() {

  }

  onProveedorChange() {
    this.productosOrden.set([]); 
    this.productoSeleccionado.set(null);
  }

  getEmptyMessage(): string {
    if (this.tipoOrden() === 'entrada' && !this.proveedorId()) {
      return 'Seleccione un proveedor primero';
    }
    return 'No hay productos disponibles para este proveedor';
  }

  agregarProducto(): void {

  }

  eliminarProducto(index: number): void {
    this.productosOrden.update(prev => prev.filter((_, i) => i !== index));
  }

  onSubmit(): void {
    console.log(this.productosOrden());
  }

  private getProveedorNombre(): string {
    const prov = this.proveedores().find(p => p.id == this.proveedorId());
    return prov ? prov.name : '';
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
