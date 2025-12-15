import { Component, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductoService } from '../../../core/services/producto.service';
import { OrdenService } from '../../../core/services/orden.service';
import { DashboardStats } from '../../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  stats = computed<DashboardStats>(() => {
    const productos = this.productoService.productos$();
    const ordenes = this.ordenService.ordenes$();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordenesHoy = ordenes.filter(o => {
      const ordenDate = new Date(o.fecha);
      ordenDate.setHours(0, 0, 0, 0);
      return ordenDate.getTime() === today.getTime();
    });

    const productosActivos = productos.filter(p => p.activo);
    const productosStockBajo = productosActivos.filter(p => p.stock <= p.stockMinimo);
    const valorInventario = productosActivos.reduce((sum, p) => sum + (p.precio * p.stock), 0);

    return {
      totalProductos: productosActivos.length,
      productosStockBajo: productosStockBajo.length,
      ordenesHoy: ordenesHoy.length,
      valorInventario
    };
  });

  constructor(
    private productoService: ProductoService,
    private ordenService: OrdenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Componente inicializado
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
