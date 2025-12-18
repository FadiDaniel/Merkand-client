import { Injectable, inject, computed } from '@angular/core';
import { ProductoService } from './producto.service';
import { MovimientoService } from './movimiento.service';
import { OrdenService } from './orden.service';
import { ProveedorService } from './proveedor.service';
import { ChartData } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private productoService = inject(ProductoService);
  private movimientoService = inject(MovimientoService);
  private ordenService = inject(OrdenService);
  private proveedorService = inject(ProveedorService);

  // Computados
  // 1. Distribución por Categoría
  readonly distribucionCategoriasData = computed<ChartData<'doughnut'>>(() => {
    const productos = this.productoService.productos$();
    const categorias = new Map<string, number>();

    productos.forEach(p => {
      const cat = p.category || 'Sin Categoría';
      categorias.set(cat, (categorias.get(cat) || 0) + 1);
    });

    return {
      labels: Array.from(categorias.keys()),
      datasets: [{
        data: Array.from(categorias.values()),
        backgroundColor: [
          '#fe0000', '#343a40', '#adb5bd', '#6c757d', '#fe4444', '#e9ecef'
        ]
      }]
    };
  });

  // 2. Movimientos Mensuales (Últimos 6 meses)
  readonly movimientosMensualesData = computed<ChartData<'bar'>>(() => {
    const movimientos = this.movimientoService.movimientos$();
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const hoy = new Date();
    
    const dataEntradas = new Array(6).fill(0);
    const dataSalidas = new Array(6).fill(0);
    const labels = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      labels.push(meses[d.getMonth()]);
    }

    movimientos.forEach(m => {
      const fecha = new Date(m.date);
      const diffMonths = (hoy.getFullYear() - fecha.getFullYear()) * 12 + (hoy.getMonth() - fecha.getMonth());
      
      if (diffMonths >= 0 && diffMonths < 6) {
        const index = 5 - diffMonths;
        
        if (m.movementType === 'IN') {
          dataEntradas[index] += m.quantity;
        } else if (m.movementType === 'OUT') {
          dataSalidas[index] += Math.abs(m.quantity); 
        }
      }
    });

    return {
      labels,
      datasets: [
        { label: 'Entradas', data: dataEntradas, backgroundColor: '#28a745' },
        { label: 'Salidas', data: dataSalidas, backgroundColor: '#fe0000' }
      ]
    };
  });

  // 3. Proveedores más utilizados (Top 5)
  readonly topProveedoresData = computed<ChartData<'bar'>>(() => {
    const ordenes = this.ordenService.ordenes$();
    const conteo = new Map<string, number>();

    ordenes.filter(o => o.status === 'RECEIVED' && o.supplierName).forEach(o => {
      const prov = o.supplierName!;
      conteo.set(prov, (conteo.get(prov) || 0) + 1);
    });

    // Ordenar y top 5
    const sorted = Array.from(conteo.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      labels: sorted.map(e => e[0]),
      datasets: [{
        label: 'Órdenes de Compra',
        data: sorted.map(e => e[1]),
        backgroundColor: '#343a40'
      }]
    };
  });

  // 4. Productos sin movimientos (en los últimos 30 días, por ejemplo)
  readonly productosSinMovimiento = computed(() => {
    const productos = this.productoService.productos$();
    const movimientos = this.movimientoService.movimientos$();
    const treintaDiasAtras = new Date();
    treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);

    // Ids de productos con movimiento reciente
    const productosConMov = new Set(
      movimientos
        .filter(m => new Date(m.date) >= treintaDiasAtras)
        .map(m => m.productId)
    );

    return productos.filter(p => !productosConMov.has(p.id) && p.active);
  });
}
