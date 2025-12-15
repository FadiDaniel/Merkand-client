import { Injectable, signal, inject } from '@angular/core';
import { Movimiento, CreateMovimientoDto } from '../../models/movimiento.model';
import { ProductoService } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private productoService = inject(ProductoService);
  private movimientos = signal<Movimiento[]>(this.loadMovimientos());
  readonly movimientos$ = this.movimientos.asReadonly();

  getAll(): Movimiento[] {
    return this.movimientos();
  }

  registrarMovimiento(dto: CreateMovimientoDto, usuario: string): Movimiento {
    // Buscar nombre del producto
    const producto = this.productoService.getById(dto.productoId);
    
    const nuevoMovimiento: Movimiento = {
      id: Date.now(),
      ...dto,
      nombreProducto: producto?.name || 'Producto desconocido',
      fecha: new Date(),
      usuario
    };

    this.movimientos.update(prev => [nuevoMovimiento, ...prev]);
    this.saveMovimientos();
    return nuevoMovimiento;
  }

  registrarAjuste(dto: CreateMovimientoDto, usuario: string): Movimiento {
    // Si es ajuste, también debemos actualizar el stock en ProductoService
    // Si la cantidad es positiva suma, negativa resta.
    // Asumiremos que el DTO trae la cantidad a ajustar (ej: +5 o -2)
    
    // Primero actualizamos stock
    this.productoService.updateStock(dto.productoId, dto.cantidad);

    // Luego registramos el movimiento
    return this.registrarMovimiento(dto, usuario);
  }

  private saveMovimientos(): void {
    localStorage.setItem('movimientos', JSON.stringify(this.movimientos()));
  }

  private loadMovimientos(): Movimiento[] {
    const saved = localStorage.getItem('movimientos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  }
}
