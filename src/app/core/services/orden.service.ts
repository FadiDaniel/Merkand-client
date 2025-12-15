import { Injectable, signal, inject } from '@angular/core';
import { Orden, CreateOrdenDto } from '../../models/orden.model';
import { ProductoService } from './producto.service';
import { MovimientoService } from './movimiento.service';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private productoService = inject(ProductoService);
  private movimientoService = inject(MovimientoService);

  private ordenes = signal<Orden[]>(this.loadOrdenes());
  readonly ordenes$ = this.ordenes.asReadonly();

  getAll(): Orden[] {
    return this.ordenes();
  }

  getById(id: string): Orden | undefined {
    return this.ordenes().find(o => o.id === id);
  }

  create(dto: CreateOrdenDto, creadoPor: string): Orden | null {
    // Validar stock para órdenes de salida
    if (dto.tipo === 'salida') {
      for (const item of dto.productos) {
        const producto = this.productoService.getById(item.productoId);
        if (!producto || producto.stock < item.cantidad) {
          return null;
        }
      }
    }

    const total = dto.productos.reduce((sum, p) => sum + p.subtotal, 0);

    const newOrden: Orden = {
      id: this.generateId(),
      numeroOrden: this.generateNumeroOrden(),
      ...dto,
      total,
      estado: 'procesada', // Auto-procesar para simplificar demo y generar movs inmediatamente
      creadoPor,
      fecha: new Date(),
      fechaCreacion: new Date()
    };

    this.ordenes.update(ordenes => [...ordenes, newOrden]);
    this.saveOrdenes();

    // Actualizar stock y registrar movimientos
    this.updateStockAndRegisterMovements(newOrden, creadoPor);

    return newOrden;
  }

  // Ya no usamos updateEstado manual si procesamos directo, o podríamos dejarlo para cancelar
  // Por ahora lo simplifico a CREAR -> PROCESADA instantáneamente para demo

  private updateStockAndRegisterMovements(orden: Orden, usuario: string): void {
    const isEntrada = orden.tipo === 'entrada';
    const multiplier = isEntrada ? 1 : -1;
    
    for (const item of orden.productos) {
      // 1. Actualizar Stock
      this.productoService.updateStock(item.productoId, item.cantidad * multiplier);

      // 2. Registrar Movimiento
      this.movimientoService.registrarMovimiento({
        productoId: item.productoId,
        cantidad: item.cantidad,
        tipo: isEntrada ? 'entrada' : 'salida',
        referencia: orden.numeroOrden,
        motivo: isEntrada ? `Orden de Compra ${orden.numeroOrden}` : `Venta / Salida ${orden.numeroOrden}`
      }, usuario);
    }
  }

  private generateId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateNumeroOrden(): string {
    const count = this.ordenes().length + 1;
    return `ORD-${new Date().getFullYear()}-${String(count).padStart(5, '0')}`;
  }

  private saveOrdenes(): void {
    localStorage.setItem('ordenes', JSON.stringify(this.ordenes()));
  }

  private loadOrdenes(): Orden[] {
    const saved = localStorage.getItem('ordenes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading ordenes:', error);
      }
    }
    return [];
  }
}
