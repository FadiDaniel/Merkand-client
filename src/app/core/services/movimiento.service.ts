import { Injectable, signal, inject } from '@angular/core';
import { Movimiento, CreateMovimientoDto } from '../../models/movimiento.model';
import { ProductoService } from './producto.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private http = inject(HttpClient); 
  private productoService = inject(ProductoService);
  private apiUrl = 'http://localhost:8080/api/movements';
  private movimientos = signal<Movimiento[]>([]);
  readonly movimientos$ = this.movimientos.asReadonly();

constructor() {
    this.fetchAll(); 
  }

fetchAll(): void {
  this.http.get<Movimiento[]>(this.apiUrl).subscribe({
    next: (data) => {
      console.log("Movimientos recibidos del backend:", data);
      const ordenados = data.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      this.movimientos.set(ordenados);
    },
    error: (err) => console.error('Error al obtener movimientos', err)
  });
}

registrarMovimiento(dto: CreateMovimientoDto): void {
    const producto = this.productoService.getById(dto.productId);
    
    const nuevoMovimiento: Movimiento = {
      id: Date.now(), 
      movementType: dto.movementType,
      productId: dto.productId,
      quantity: dto.quantity,
      reference: dto.reference || dto.reason, 
      productName: producto?.name || 'Producto desconocido',
      date: new Date(),
    };

    this.movimientos.update(prev => [nuevoMovimiento, ...prev]);
  }

  registrarAjuste(dto: CreateMovimientoDto): void {
    this.productoService.updateStock(dto.productId, dto.quantity);
    this.registrarMovimiento(dto);
  }

}