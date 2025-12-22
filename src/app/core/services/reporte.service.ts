import { Injectable, inject, computed, signal } from '@angular/core';
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

  // Signals para filtros
  readonly selectedSalesMonth = signal(0);
  readonly comprasMesesAtras = signal(5);
  readonly movimientosMesesAtras = signal(5); // Nuevo filtro para balance

  // --- KPIs ---
  readonly totalStockValue = computed(() => 
    this.productoService.productos$().reduce((acc, p) => acc + (p.price * p.stock), 0)
  );

  readonly criticalProductsCount = computed(() => 
    this.productoService.productos$().filter(p => p.active && p.stock <= p.minimumStock).length
  );

  // Card: Ventas en EUROS del mes seleccionado (solo OUT, excluyendo ADJUST)
  readonly salesByMonth = computed(() => {
    const monthsAgo = this.selectedSalesMonth();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsAgo);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999);
    
    const productos = this.productoService.productos$();
    
    const totalEuros = this.movimientoService.movimientos$()
      .filter(m => {
        const mDate = new Date(m.date);
        return m.movementType === 'OUT' && mDate >= startDate && mDate <= endDate;
      })
      .reduce((acc, m) => {
        const producto = productos.find(p => p.id === m.productId);
        const precio = producto?.price || 0;
        return acc + (Math.abs(m.quantity) * precio);
      }, 0);

    return {
      amount: totalEuros,
      monthName: startDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
    };
  });

  // --- Gráficos ---

  readonly distribucionCategoriasData = computed<ChartData<'doughnut'>>(() => {
    const categorias = new Map<string, number>();
    this.productoService.productos$().forEach(p => {
      const cat = p.category || 'Otros';
      categorias.set(cat, (categorias.get(cat) || 0) + 1);
    });
    return {
      labels: Array.from(categorias.keys()),
      datasets: [{ 
        data: Array.from(categorias.values()), 
        backgroundColor: ['#3f51b5', '#ff4081', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4']
      }]
    };
  });

  // Balance Entradas/Salidas con filtro de período
  readonly movimientosData = computed<ChartData<'bar'>>(() => {
    const mesesAtras = this.movimientosMesesAtras();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - mesesAtras);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const movs = this.movimientoService.movimientos$()
      .filter(m => new Date(m.date) >= startDate);
    
    const entradas = movs.filter(m => m.movementType === 'IN').reduce((acc, m) => acc + m.quantity, 0);
    const salidas = movs.filter(m => m.movementType === 'OUT').reduce((acc, m) => acc + Math.abs(m.quantity), 0);
    
    return {
      labels: ['Entradas', 'Salidas'],
      datasets: [{ label: 'Unidades', data: [entradas, salidas], backgroundColor: ['#3f51b5', '#f44336'] }]
    };
  });

  // Gráfico: Gasto en Compras con filtro
  readonly comprasMensualesData = computed<ChartData<'bar'>>(() => {
    const ordenes = this.ordenService.ordenes$();
    const mesesAtras = this.comprasMesesAtras();
    const mesesLabels: string[] = [];
    const montos: number[] = [];

    for (let i = mesesAtras; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mesNombre = d.toLocaleString('es-ES', { month: 'short', year: '2-digit' });
      mesesLabels.push(mesNombre);

      const totalMes = ordenes
        .filter(o => {
          const oDate = new Date(o.orderDate);
          return oDate.getMonth() === d.getMonth() && oDate.getFullYear() === d.getFullYear();
        })
        .reduce((acc, o) => acc + (o.totalAmount || 0), 0);
      montos.push(totalMes);
    }

    return {
      labels: mesesLabels,
      datasets: [{ label: 'Inversión (€)', data: montos, backgroundColor: '#4caf50' }]
    };
  });

  // --- Tablas de Datos ---

  // Tabla 1: Inventario sin movimientos
  readonly productosStagnant = computed(() => {
    const hoy = new Date();
    const productos = this.productoService.productos$();
    const movimientos = this.movimientoService.movimientos$();
    
    const productosConInfo = productos
      .filter(p => p.active)
      .map(p => {
        // Buscar TODOS los movimientos OUT de este producto
        const movsOut = movimientos.filter(m => m.productId === p.id && m.movementType === 'OUT');
        
        let ultimoMov: Date | null = null;
        let dias = 999;

        if (movsOut.length > 0) {
          // Encontrar la fecha más reciente
          const fechaMasReciente = Math.max(...movsOut.map(m => new Date(m.date).getTime()));
          ultimoMov = new Date(fechaMasReciente);
          
          // Calcular días transcurridos desde el último movimiento
          dias = Math.floor((hoy.getTime() - ultimoMov.getTime()) / (1000 * 3600 * 24));
        }

        return { 
          ...p, 
          lastMove: ultimoMov, 
          daysInactive: dias 
        };
      })
      .filter(p => p.daysInactive > 30) // Solo los que llevan más de 30 días sin movimiento
      .sort((a, b) => b.daysInactive - a.daysInactive);

    return productosConInfo.slice(0, 10);
  });

  // Tabla 2: Productos con Stock Crítico
  readonly productosCriticos = computed(() => {
    return this.productoService.productos$()
      .filter(p => p.active && p.stock <= p.minimumStock)
      .map(p => ({
        ...p,
        deficit: p.minimumStock - p.stock
      }))
      .sort((a, b) => b.deficit - a.deficit);
  });

  // Tabla 3: Top Proveedores
  readonly topProveedores = computed(() => {
    const stats = new Map<string, { count: number, total: number }>();
    
    this.ordenService.ordenes$().forEach(o => {
      if (!o.supplierName) return;
      const current = stats.get(o.supplierName) || { count: 0, total: 0 };
      stats.set(o.supplierName, { 
        count: current.count + 1, 
        total: current.total + (o.totalAmount || 0) 
      });
    });

    return Array.from(stats.entries())
      .map(([name, data]) => ({
        name,
        orderCount: data.count,
        totalSpend: data.total,
        avgSpend: data.total / data.count
      }))
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 5);
  });

  // Métodos para cambiar filtros
  setSalesMonth(monthsAgo: number) {
    this.selectedSalesMonth.set(monthsAgo);
  }

  setComprasPeriod(monthsAgo: number) {
    this.comprasMesesAtras.set(monthsAgo);
  }

  setMovimientosPeriod(monthsAgo: number) {
    this.movimientosMesesAtras.set(monthsAgo);
  }
}