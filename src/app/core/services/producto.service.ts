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

  private productos = signal<Producto[]>([]);
  readonly productos$ = this.productos.asReadonly();

  constructor() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => this.productos.set(data),
      error: (err) => console.error('Error fetching products', err)
    });
  }

  getById(id: number): Producto | undefined {
    return this.productos().find(p => p.id == id);
  }


  create(dto: CreateProductoDto): void {
    this.http.post<Producto>(this.apiUrl, dto).subscribe({
      next: (newProducto) => {
        this.productos.update(productos => [...productos, newProducto]);
      },
      error: (err) => console.error('Error creating product', err)
    });
  }


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


  delete(id: number): void {
     this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.productos.update(productos => productos.filter(p => p.id !== id));
      },
      error: (err) => console.error('Error deleting product', err)
    });
  }


  updateStock(id: number, cantidad: number): void {
     const current = this.getById(id);
     if (!current) return;
     
     const updatedProducto = {
       ...current,
       stock: current.stock + cantidad
     };
     
     this.update(updatedProducto);
  }

  getProductosStockBajo(): Producto[] {
    return this.productos().filter(p => p.active && p.stock <= p.minimumStock);
  }
}
