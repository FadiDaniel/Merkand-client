import { Injectable, signal, inject } from '@angular/core';
import { Movimiento, CreateMovimientoDto } from '../../models/movimiento.model';
import { ProductoService } from './producto.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

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
  forkJoin({
    movs: this.http.get<Movimiento[]>(this.apiUrl),
    prods: this.productoService.getProductosAsObservable() 
  }).subscribe({
    next: ({ movs, prods }) => {
      const procesados = movs.map(m => {
        const producto = prods.find(p => p.id === m.productId);
        return {
          ...m,
          productName: producto ? producto.name : 'Producto no encontrado'
        };
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      this.movimientos.set(procesados);
      console.log("Movimientos procesados con éxito");
    },
    error: (err) => console.error('Error en la carga combinada', err)
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