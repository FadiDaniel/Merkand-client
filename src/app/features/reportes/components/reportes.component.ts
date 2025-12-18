import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { ReporteService } from '../../../core/services/reporte.service';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatTableModule, BaseChartDirective, CurrencyPipe, DecimalPipe],
  template: `
    <div class="reportes-container">
      <h1 class="page-title">Panel de Control y Estadísticas</h1>

      <div class="kpi-grid">
        <mat-card class="kpi-card blue">
          <mat-icon>payments</mat-icon>
          <div class="kpi-value">{{ reporteService.totalStockValue() | currency:'EUR' }}</div>
          <div class="kpi-label">Valor Total Inventario</div>
        </mat-card>

        <mat-card class="kpi-card red">
          <mat-icon>warning</mat-icon>
          <div class="kpi-value">{{ reporteService.criticalProductsCount() }}</div>
          <div class="kpi-label">Productos con Stock Crítico</div>
        </mat-card>

        <mat-card class="kpi-card green">
          <mat-icon>trending_up</mat-icon>
          <div class="kpi-value">{{ reporteService.movimientosData().datasets[0].data[0] }}</div>
          <div class="kpi-label">Unidades Recibidas (Total)</div>
        </mat-card>
      </div>

      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header><mat-card-title>Distribución de Stock</mat-card-title></mat-card-header>
          <mat-card-content>
            <canvas baseChart [data]="reporteService.distribucionCategoriasData()" [type]="'doughnut'" [options]="chartOptions"></canvas>
          </mat-card-content>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header><mat-card-title>Flujo de Movimientos</mat-card-title></mat-card-header>
          <mat-card-content>
            <canvas baseChart [data]="reporteService.movimientosData()" [type]="'bar'" [options]="chartOptions"></canvas>
          </mat-card-content>
        </mat-card>

        <mat-card class="full-width-card">
          <mat-card-header>
            <mat-card-title><mat-icon>inventory</mat-icon> Inventario Sin Movimiento (Top 5)</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (reporteService.productosSinMovimiento().length > 0) {
              <table mat-table [dataSource]="reporteService.productosSinMovimiento()" class="stagnant-table">
                <ng-container matColumnDef="nombre">
                  <th mat-header-cell *matHeaderCellDef>Producto</th>
                  <td mat-cell *matCellDef="let p">{{p.name}}</td>
                </ng-container>
                <ng-container matColumnDef="categoria">
                  <th mat-header-cell *matHeaderCellDef>Categoría</th>
                  <td mat-cell *matCellDef="let p">{{p.category}}</td>
                </ng-container>
                <ng-container matColumnDef="stock">
                  <th mat-header-cell *matHeaderCellDef>Stock Actual</th>
                  <td mat-cell *matCellDef="let p">{{p.stock}} uds.</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['nombre', 'categoria', 'stock']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['nombre', 'categoria', 'stock']"></tr>
              </table>
            } @else {
              <p class="ok-message">¡Excelente! Todo tu inventario tiene rotación reciente.</p>
            }
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .reportes-container { padding: 24px; max-width: 1400px; margin: 0 auto; }
    .page-title { font-size: 28px; margin-bottom: 24px; font-weight: 500; }
    
    /* Grid de KPIs */
    .kpi-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 20px; 
      margin-bottom: 30px; 
    }
    .kpi-card { 
      padding: 20px; 
      text-align: center; 
      border-radius: 12px;
      color: white;
    }
    .kpi-card mat-icon { font-size: 32px; width: 32px; height: 32px; margin-bottom: 8px; }
    .kpi-value { font-size: 24px; font-weight: bold; }
    .kpi-label { font-size: 14px; opacity: 0.9; }
    
    .blue { background: linear-gradient(135deg, #3f51b5, #5c6bc0); }
    .red { background: linear-gradient(135deg, #f44336, #ef5350); }
    .green { background: linear-gradient(135deg, #4caf50, #66bb6a); }

    /* Gráficos */
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .chart-card { min-height: 350px; padding: 16px; border-radius: 12px; }
    .full-width-card { grid-column: 1 / -1; border-radius: 12px; }
    .stagnant-table { width: 100%; margin-top: 10px; }
    .ok-message { text-align: center; padding: 20px; color: #4caf50; font-weight: 500; }
  `]
})
export class ReportesComponent {
  reporteService = inject(ReporteService);

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };
}