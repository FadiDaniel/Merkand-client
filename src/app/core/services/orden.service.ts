import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Orden, CreateOrdenDto } from '../../models/orden.model';
import { ProductoService } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private http = inject(HttpClient);
  private productoService = inject(ProductoService);
  private apiUrl = 'http://localhost:8080/api/orders'; 

  private ordenes = signal<Orden[]>([]);
  readonly ordenes$ = this.ordenes.asReadonly();

  constructor() {
    this.fetchAll();
  }

  fetchAll(): void {
    this.http.get<Orden[]>(this.apiUrl).subscribe({
      next: (data) => {
        console.log("Órdenes recibidas del backend:", data);
        this.ordenes.set(data);
      },
      error: (err) => console.error('Error al obtener órdenes', err)
    });
  }

  getById(id: number): Orden | undefined {
    return this.ordenes().find(o => o.id === id);
  }

  create(dto: CreateOrdenDto): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, dto).pipe(
      tap({
        next: (newOrden) => {
          this.ordenes.update(current => [...current, newOrden]);
        },
        error: (err) => console.error('Error al crear la orden', err)
      })
    );
  }

  receiveOrder(ordenId: number): void {
    const orden = this.getById(ordenId);
    
    if (!orden || orden.status !== 'PENDING') {
      console.warn('No se puede recibir: Orden no encontrada o no está PENDIENTE.');
      return;
    }

    this.http.put<Orden>(`${this.apiUrl}/${ordenId}/receive`, {}).subscribe({
      next: (updatedOrden) => {
        this.ordenes.update(list => 
          list.map(o => o.id === ordenId ? updatedOrden : o)
        );

        updatedOrden.orderItemList?.forEach(item => {
          this.productoService.updateStock(item.productId, item.quantity);
        });

        console.log(`Orden ${ordenId} recibida correctamente.`);
      },
      error: (err) => console.error('Error al recibir la orden', err)
    });
  }

  cancelOrder(ordenId: number): void {
    const orden = this.getById(ordenId);
    if (!orden || orden.status !== 'PENDING') {
      console.warn('No se puede cancelar: Orden no encontrada o no está PENDIENTE.');
      return;
    }
    
    this.http.put<Orden>(`${this.apiUrl}/${ordenId}/cancel`, {}).subscribe({
      next: (updatedOrden) => {
        this.ordenes.update(list => 
          list.map(o => o.id === ordenId ? updatedOrden : o)
        );
        console.log(`Orden ${ordenId} cancelada.`);
      },
      error: (err) => console.error('Error al cancelar la orden', err)
    });
  }
}