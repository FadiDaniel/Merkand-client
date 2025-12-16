import { Injectable, signal, inject } from '@angular/core';
import { Orden, CreateOrdenDto, OrdenProducto } from '../../models/orden.model';
import { ProductoService } from './producto.service';
import { MovimientoService } from './movimiento.service'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private productoService = inject(ProductoService);
  private movimientoService = inject(MovimientoService);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/orders'; 

  private ordenes = signal<Orden[]>([]);
  readonly ordenes$ = this.ordenes.asReadonly();

  constructor() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.http.get<Orden[]>(this.apiUrl).subscribe({
      next: (data) => this.ordenes.set(data),
      error: (err) => console.error('Error fetching orders', err)
    });
  }

  getById(id: number): Orden | undefined {
    return this.ordenes().find(o => o.id === id);
  }


  create(dto: CreateOrdenDto): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, dto).pipe(
      tap({
        next: (newOrden) => {
          this.ordenes.update(ordenes => [...ordenes, newOrden]);
        },
        error: (err) => console.error('Error creating order', err)
      })
    );
  }

  receiveOrder(ordenId: number): void {
    const orden = this.getById(ordenId);
    if (!orden || orden.estado !== 'PENDING') {
      console.warn('Cannot receive order: Order not found or not in PENDING status.');
      return;
    }

    this.http.put<Orden>(`${this.apiUrl}/${ordenId}/receive`, {}).subscribe({
      next: (updatedOrden) => {
        this.ordenes.update(ordenes => 
          ordenes.map(o => o.id === ordenId ? updatedOrden : o)
        );

        updatedOrden.productos.forEach(item => {
          this.productoService.updateStock(item.productoId, item.cantidad);
        });

        console.log(`Order ${ordenId} received and stock updated.`);
      },
      error: (err) => console.error('Error receiving order', err)
    });
  }
  

  cancelOrder(ordenId: number): void {
    const orden = this.getById(ordenId);
    if (!orden || orden.estado !== 'PENDING') {
      console.warn('Cannot cancel order: Order not found or not in PENDING status.');
      return;
    }
    
    this.http.put<Orden>(`${this.apiUrl}/${ordenId}/cancel`, {}).subscribe({
      next: (updatedOrden) => {
        this.ordenes.update(ordenes => 
          ordenes.map(o => o.id === ordenId ? updatedOrden : o)
        );
        console.log(`Order ${ordenId} cancelled.`);
      },
      error: (err) => console.error('Error cancelling order', err)
    });
  }

  private calculateTotal(productos: OrdenProducto[]): number {
    return productos.reduce((sum, item) => sum + item.subtotal, 0);
  }
}