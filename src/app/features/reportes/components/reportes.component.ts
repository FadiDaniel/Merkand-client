import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ReporteService } from '../../../core/services/reporte.service';

@Component({
  selector: 'app-reportes',
  imports: [
    MatCardModule,
    MatIconModule,
    MatTableModule,
    BaseChartDirective
  ],
  template: `
    <div class="reportes-container">
      <h1 class="page-title">Reportes y Estadísticas</h1>

      <div class="charts-grid">
        <!-- Distribución por Categoría -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Distribución por Categoría</mat-card-title>
          </mat-card-header>
          <mat-card-content class="chart-container">
            <canvas baseChart
              [data]="reporteService.distribucionCategoriasData()"
              [type]="'doughnut'"
              [options]="doughnutOptions">
            </canvas>
          </mat-card-content>
        </mat-card>

        <!-- Top Proveedores -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Top Proveedores</mat-card-title>
          </mat-card-header>
          <mat-card-content class="chart-container">
            <canvas baseChart
              [data]="reporteService.topProveedoresData()"
              [type]="'bar'"
              [options]="horizontalBarOptions">
            </canvas>
          </mat-card-content>
        </mat-card>

        <!-- Movimientos Mensuales -->
        <mat-card class="full-width-card">
          <mat-card-header>
            <mat-card-title>Entradas vs Salidas (Últimos 6 meses)</mat-card-title>
          </mat-card-header>
          <mat-card-content class="chart-container big-chart">
            <canvas baseChart
              [data]="reporteService.movimientosMensualesData()"
              [type]="'bar'"
              [options]="barOptions">
            </canvas>
          </mat-card-content>
        </mat-card>

        <!-- Productos Sin Movimiento -->
        <mat-card class="full-width-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon color="warn">warning</mat-icon>
              Productos sin movimiento (30 días)
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (reporteService.productosSinMovimiento().length > 0) {
              <table mat-table [dataSource]="reporteService.productosSinMovimiento()" class="stagnant-table">
                <ng-container matColumnDef="nombre">
                  <th mat-header-cell *matHeaderCellDef>Producto</th>
                  <td mat-cell *matCellDef="let p">{{ p.nombre }}</td>
                </ng-container>
                <ng-container matColumnDef="stock">
                  <th mat-header-cell *matHeaderCellDef>Stock Actual</th>
                  <td mat-cell *matCellDef="let p">{{ p.stock }}</td>
                </ng-container>
                <ng-container matColumnDef="categoria">
                  <th mat-header-cell *matHeaderCellDef>Categoría</th>
                  <td mat-cell *matCellDef="let p">{{ p.categoria }}</td>
                </ng-container>
                
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            } @else {
              <p class="ok-message">Todos los productos han tenido movimiento recientemente.</p>
            }
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .reportes-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 24px;
      color: #333;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .full-width-card {
      grid-column: 1 / -1;
    }

    .chart-container {
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .big-chart {
      height: 400px;
    }

    .stagnant-table {
      width: 100%;
    }
    
    .ok-message {
      color: #2e7d32;
      padding: 20px;
      text-align: center;
    }
    
    mat-card-header {
      margin-bottom: 16px;
    }
    
    mat-card-title mat-icon {
      vertical-align: middle;
      margin-right: 8px;
    }
  `]
})
export class ReportesComponent {
  reporteService = inject(ReporteService);

  displayedColumns = ['nombre', 'stock', 'categoria'];

  // Opciones de Gráficos
  doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' }
    }
  };

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    }
  };

  horizontalBarOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false }
    }
  };
}
