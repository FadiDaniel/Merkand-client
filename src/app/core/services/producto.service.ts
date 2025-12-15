import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto, CreateProductoDto, UpdateProductoDto } from '../../models/producto.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/products';

  // State using Signals
  private productos = signal<Producto[]>([]);

  // Expose products as readonly
  readonly productos$ = this.productos.asReadonly();

  constructor() {
    this.fetchAll();
  }

  /**
   * Fetches all products from backend
   */
  fetchAll(): void {
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => this.productos.set(data),
      error: (err) => console.error('Error fetching products', err)
    });
  }

  /**
   * Get product by ID from state
   */
  getById(id: number): Producto | undefined {
    return this.productos().find(p => p.id == id);
  }

  /**
   * Create a new product
   */
  create(dto: CreateProductoDto): void {
    this.http.post<Producto>(this.apiUrl, dto).subscribe({
      next: (newProducto) => {
        this.productos.update(productos => [...productos, newProducto]);
      },
      error: (err) => console.error('Error creating product', err)
    });
  }

  /**
   * Update an existing product
   */
  update(dto: UpdateProductoDto): void {
    this.http.put<Producto>(`${this.apiUrl}/${dto.id}`, dto).subscribe({
      next: (updatedProducto) => {
        this.productos.update(productos => 
          productos.map(p => p.id === dto.id ? updatedProducto : p)
        );
      },
      error: (err) => console.error('Error updating product', err)
    });
  }

  /**
   * Delete a product
   */
  delete(id: number): void {
     this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.productos.update(productos => productos.filter(p => p.id !== id));
      },
      error: (err) => console.error('Error deleting product', err)
    });
  }

  /**
   * Update stock using the update method (full update to ensure PUT safety)
   */
  updateStock(id: number, cantidad: number): void {
     const current = this.getById(id);
     if (!current) return;
     
     // We cast to UpdateProductoDto to satisfy strict typing if necessary, 
     // but we send the full object to ensure we don't wipe data on PUT.
     // We update the local stock logic here to create the object.
     const updatedProducto = {
       ...current,
       stock: current.stock + cantidad
     };
     
     this.update(updatedProducto);
  }

  /**
   * Get products with low stock
   */
  getProductosStockBajo(): Producto[] {
    return this.productos().filter(p => p.active && p.stock <= p.minimumStock);
  }
}
