import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../../core/services/producto.service';
import { Producto } from '../../../models/producto.model';
import { ProductoFormDialogComponent } from './producto-form-dialog.component';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-productos',
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatChipsModule,
    MatSnackBarModule,
    CurrencyPipe
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  router = inject(Router);
  displayedColumns: string[] = [
    'nombre', 
    'categoria', 
    'proveedor', 
    'precio', 
    'stock', 
    'estado_stock', 
    'estado',       
    'acciones'
  ];
  searchTerm = signal('');

  productos = computed(() => {
    const productos = this.productoService.productos$();
    const term = this.searchTerm().toLowerCase();

    if (!term) {
      return productos;
    }

    return productos.filter(p =>
      (p.name.toLowerCase().includes(term) ||
       p.category.toLowerCase().includes(term) ||
       p.supplierName.toLowerCase().includes(term))
    );
  });

  constructor(
    private productoService: ProductoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProductoFormDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productoService.create(result);
        this.snackBar.open('Producto creado exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openEditDialog(producto: Producto): void {
    const dialogRef = this.dialog.open(ProductoFormDialogComponent, {
      width: '600px',
      data: { mode: 'edit', producto }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productoService.update({ id: producto.id, ...result });
        this.snackBar.open('Producto actualizado exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteProducto(producto: Producto): void {
    if (confirm(`¿Está seguro de eliminar el producto "${producto.name}"?`)) {
      this.productoService.delete(producto.id);
      this.snackBar.open('Producto eliminado exitosamente', 'Cerrar', { duration: 3000 });
    }
  }

  getStockStatus(producto: Producto): 'normal' | 'bajo' | 'critico' {
    if (producto.stock === 0) return 'critico';
    if (producto.stock <= producto.minimumStock) return 'bajo';
    return 'normal';
  }

    goToHome(): void {
    this.router.navigate(['Dashboard']); 
  }
}
