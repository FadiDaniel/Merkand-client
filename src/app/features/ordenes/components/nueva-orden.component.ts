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
import { OrdenProducto } from '../../../models/orden.model';

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
    CurrencyPipe
  ],
  template: `
    <div class="nueva-orden-container">
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
                      <mat-option [value]="prov.id">{{ prov.nombre }}</mat-option>
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
                      {{ producto.nombre }} 
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
  proveedorId = signal('');
  clienteRef = signal('');
  
  productoSeleccionado = signal('');
  cantidad = signal(1);
  productosOrden = signal<OrdenProducto[]>([]);

  proveedores = this.proveedorService.proveedores$;
  productos = this.productoService.productos$;

  productosFiltrados = computed(() => {
    let prods = this.productos().filter(p => p.activo);
    
    // Si es entrada y hay proveedor seleccionado, filtrar por ese proveedor
    if (this.tipoOrden() === 'entrada' && this.proveedorId()) {
      // Asumimos que producto.proveedor guarda el nombre o ID. 
      // Para hacerlo flexible, intentaremos coincidir ID o Nombre, o si está vacío mostrar todos.
      // Ajuste: si el campo 'proveedor' en Producto es libre, no será exacto. 
      // Pero idealmente debería coincidir con el ID del proveedor seleccionado.
      // Ojo: en la data mock actual de ProductoService, proveedor es un string 'Nombre'.
      // En ProveedorService los IDs son 'PROV-001'.
      // Esto es un mismatch de datos mock.
      // Para efectos prácticos de este demo, filtraremos si producto.proveedor coincide con el NOMBRE del proveedor seleccionado.
      const prov = this.proveedores().find(p => p.id === this.proveedorId());
      if (prov) {
        return prods.filter(p => p.proveedor === prov.nombre || p.proveedor === prov.id);
      }
    }
    
    return prods;
  });

  total = computed(() => {
    return this.productosOrden().reduce((sum, p) => sum + p.subtotal, 0);
  });

  bloquearSeleccionProductos = computed(() => {
    if (this.tipoOrden() === 'entrada' && !this.proveedorId()) return true;
    if (this.tipoOrden() === 'salida' && !this.clienteRef()) return false; // Cliente es opcional o requerido? Requerido en form
    return false;
  });

  constructor() {
    // Reset cuando cambia el tipo
  }

  onTipoChange() {
    this.productosOrden.set([]);
    this.productoSeleccionado.set('');
    this.proveedorId.set('');
    this.clienteRef.set('');
  }

  onProveedorChange() {
    this.productosOrden.set([]); // Limpiar productos si cambia proveedor
    this.productoSeleccionado.set('');
  }

  getEmptyMessage(): string {
    if (this.tipoOrden() === 'entrada' && !this.proveedorId()) {
      return 'Seleccione un proveedor primero';
    }
    return 'No hay productos disponibles para este proveedor';
  }

  agregarProducto(): void {
    const prodId = this.productoSeleccionado();
    const cant = this.cantidad();

    if (!prodId || cant <= 0) {
      this.snackBar.open('Seleccione un producto y cantidad válida', 'Cerrar', { duration: 3000 });
      return;
    }

    const producto = this.productoService.getById(prodId);
    if (!producto) return;

    if (this.tipoOrden() === 'salida' && producto.stock < cant) {
      this.snackBar.open(`Stock insuficiente. Disponible: ${producto.stock}`, 'Cerrar', { duration: 3000 });
      return;
    }

    const item: OrdenProducto = {
      productoId: producto.id,
      nombreProducto: producto.nombre,
      cantidad: cant,
      precioUnitario: producto.precio,
      subtotal: producto.precio * cant
    };

    this.productosOrden.update(prev => [...prev, item]);
    this.productoSeleccionado.set('');
    this.cantidad.set(1);
  }

  eliminarProducto(index: number): void {
    this.productosOrden.update(prev => prev.filter((_, i) => i !== index));
  }

  onSubmit(): void {
    const orden = this.ordenService.create(
      {
        tipo: this.tipoOrden(),
        proveedor: this.tipoOrden() === 'entrada' ? this.getProveedorNombre() : undefined,
        cliente: this.tipoOrden() === 'salida' ? this.clienteRef() : undefined,
        productos: this.productosOrden()
      },
      this.authService.user()?.username || 'Sistema'
    );

    if (orden) {
      this.snackBar.open('Orden creada exitosamente', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/ordenes']);
    } else {
      this.snackBar.open('Error al crear la orden', 'Cerrar', { duration: 3000 });
    }
  }

  private getProveedorNombre(): string {
    const prov = this.proveedores().find(p => p.id === this.proveedorId());
    return prov ? prov.nombre : '';
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
