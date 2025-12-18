import { Injectable, inject, computed } from '@angular/core';
import { ProductoService } from './producto.service';
import { MovimientoService } from './movimiento.service';
import { OrdenService } from './orden.service';
import { ChartData } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private productoService = inject(ProductoService);
  private movimientoService = inject(MovimientoService);
  private ordenService = inject(OrdenService);

  // --- KPIs ---
  readonly totalStockValue = computed(() => {
    return this.productoService.productos$().reduce((acc, p) => acc + (p.price * p.stock), 0);
  });

  readonly criticalProductsCount = computed(() => {
    return this.productoService.productos$().filter(p => p.active && p.stock <= p.minimumStock).length;
  });

  // --- Gráficos ---

  // Distribución por Categoría (Doughnut)
  readonly distribucionCategoriasData = computed<ChartData<'doughnut'>>(() => {
    const productos = this.productoService.productos$();
    const categorias = new Map<string, number>();

    productos.forEach(p => {
      const cat = p.category || 'Otros';
      categorias.set(cat, (categorias.get(cat) || 0) + 1);
    });

    return {
      labels: Array.from(categorias.keys()),
      datasets: [{
        data: Array.from(categorias.values()),
        backgroundColor: ['#3f51b5', '#ff4081', '#4caf50', '#ff9800', '#9c27b0', '#f44336']
      }]
    };
  });

  // Movimientos de Stock (Barras: Entradas vs Salidas)
  readonly movimientosData = computed<ChartData<'bar'>>(() => {
    const movimientos = this.movimientoService.movimientos$();
    
    const entradas = movimientos.filter(m => m.movementType === 'IN').reduce((acc, m) => acc + m.quantity, 0);
    const salidas = movimientos.filter(m => m.movementType === 'OUT').reduce((acc, m) => acc + Math.abs(m.quantity), 0);
    const ajustes = movimientos.filter(m => m.movementType === 'ADJUST').reduce((acc, m) => acc + m.quantity, 0);

    return {
      labels: ['Entradas', 'Salidas', 'Ajustes'],
      datasets: [{
        label: 'Volumen de Unidades',
        data: [entradas, salidas, ajustes],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3']
      }]
    };
  });

  // Productos sin movimientos (Stagnant Inventory)
  readonly productosSinMovimiento = computed(() => {
    const productos = this.productoService.productos$();
    const movimientos = this.movimientoService.movimientos$();
    const idsConMovimiento = new Set(movimientos.map(m => m.productId));

    return productos
      .filter(p => !idsConMovimiento.has(p.id) && p.active)
      .slice(0, 5); //  top 5
  });
}