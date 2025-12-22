import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { ReporteService } from '../../../core/services/reporte.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BackButtonComponent } from '../../../shared/components/back-button.component';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    MatCardModule, 
    MatIconModule, 
    MatTableModule, 
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    BaseChartDirective, 
    CurrencyPipe, 
    DatePipe,
    BackButtonComponent
  ],
  template: `
    <app-back-button route="/dashboard" label="Volver"></app-back-button>
    <div class="reportes-container">
      <h1 class="page-title">Dashboard Analítico de Inventario</h1>

      <!-- KPIs -->
      <div class="kpi-grid">
        <mat-card class="kpi-card blue">
          <mat-icon>inventory_2</mat-icon>
          <div class="kpi-value">{{ reporteService.totalStockValue() | currency:'EUR' }}</div>
          <div class="kpi-label">Valor del Almacén</div>
        </mat-card>

        <mat-card class="kpi-card red">
          <mat-icon>report_problem</mat-icon>
          <div class="kpi-value">{{ reporteService.criticalProductsCount() }}</div>
          <div class="kpi-label">Alertas de Stock</div>
        </mat-card>

        <mat-card class="kpi-card green">
          <div class="kpi-header">
            <mat-icon>euro</mat-icon>
            <select class="month-selector" (change)="onMonthChange($event)" [value]="reporteService.selectedSalesMonth()">
              <option value="0">Mes Actual</option>
              <option value="1">Mes Anterior</option>
              <option value="2">Hace 2 meses</option>
              <option value="3">Hace 3 meses</option>
              <option value="4">Hace 4 meses</option>
              <option value="5">Hace 5 meses</option>
            </select>
          </div>
          <div class="kpi-value">{{ reporteService.salesByMonth().amount | currency:'EUR' }}</div>
          <div class="kpi-label">Ventas en € - {{ reporteService.salesByMonth().monthName }}</div>
        </mat-card>

        <mat-card class="kpi-card purple">
          <mat-icon>summarize</mat-icon>
          <div class="kpi-value">{{ reporteService.productosCriticos().length }}</div>
          <div class="kpi-label">Productos Críticos</div>
        </mat-card>
      </div>

      <!-- Gráficos -->
      <div class="charts-grid">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Distribución por Categorías</mat-card-title>
          </mat-card-header>
          <div class="chart-wrapper">
            <canvas baseChart 
              [data]="reporteService.distribucionCategoriasData()" 
              [type]="'doughnut'" 
              [options]="doughnutOptions">
            </canvas>
          </div>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>
              Gasto en Compras
              <select class="period-selector" (change)="onComprasPeriodChange($event)" [value]="reporteService.comprasMesesAtras()">
                <option value="2">Últimos 3 meses</option>
                <option value="5">Últimos 6 meses</option>
                <option value="11">Último año</option>
              </select>
            </mat-card-title>
          </mat-card-header>
          <div class="chart-wrapper">
            <canvas baseChart 
              [data]="reporteService.comprasMensualesData()" 
              [type]="'bar'" 
              [options]="barOptions">
            </canvas>
          </div>
        </mat-card>

        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>
              Balance Entradas/Salidas
              <select class="period-selector" (change)="onMovimientosPeriodChange($event)" [value]="reporteService.movimientosMesesAtras()">
                <option value="2">Últimos 3 meses</option>
                <option value="5">Últimos 6 meses</option>
                <option value="11">Último año</option>
              </select>
            </mat-card-title>
          </mat-card-header>
          <div class="chart-wrapper">
            <canvas baseChart 
              [data]="reporteService.movimientosData()" 
              [type]="'bar'" 
              [options]="barOptions">
            </canvas>
          </div>
        </mat-card>
      </div>

      <!-- Tablas -->
      <div class="tables-grid">
        
        <!-- Tabla: Stock Crítico -->
        <mat-card class="data-table-card">
          <mat-card-header>
            <mat-card-title class="critico">
              <mat-icon>warning</mat-icon> Stock Crítico y Déficit
            </mat-card-title>
          </mat-card-header>
          <div class="table-container">
            @if (reporteService.productosCriticos().length > 0) {
              <table mat-table [dataSource]="reporteService.productosCriticos()">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Producto</th>
                  <td mat-cell *matCellDef="let p">{{p.name}}</td>
                </ng-container>
                <ng-container matColumnDef="stock">
                  <th mat-header-cell *matHeaderCellDef>Stock Actual</th>
                  <td mat-cell *matCellDef="let p" class="text-center">{{p.stock}}</td>
                </ng-container>
                <ng-container matColumnDef="min">
                  <th mat-header-cell *matHeaderCellDef>Stock Mínimo</th>
                  <td mat-cell *matCellDef="let p" class="text-center">{{p.minimumStock}}</td>
                </ng-container>
                <ng-container matColumnDef="deficit">
                  <th mat-header-cell *matHeaderCellDef>Déficit</th>
                  <td mat-cell *matCellDef="let p" class="text-red text-center">
                    <strong>-{{p.deficit}}</strong>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['name', 'stock', 'min', 'deficit']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'stock', 'min', 'deficit'];"></tr>
              </table>
            } @else {
              <div class="empty-state">
                <mat-icon>check_circle</mat-icon>
                <p>No hay productos con stock crítico</p>
              </div>
            }
          </div>
        </mat-card>

        <!-- Tabla: Top Proveedores -->
        <mat-card class="data-table-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>local_shipping</mat-icon> Top Proveedores
            </mat-card-title>
          </mat-card-header>
          <div class="table-container">
            @if (reporteService.topProveedores().length > 0) {
              <table mat-table [dataSource]="reporteService.topProveedores()">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Proveedor</th>
                  <td mat-cell *matCellDef="let prov">{{prov.name}}</td>
                </ng-container>
                <ng-container matColumnDef="orders">
                  <th mat-header-cell *matHeaderCellDef>Órdenes</th>
                  <td mat-cell *matCellDef="let prov" class="text-center">
                    <span class="badge blue-badge">{{prov.orderCount}}</span>
                  </td>
                </ng-container>
                <ng-container matColumnDef="avg">
                  <th mat-header-cell *matHeaderCellDef>Promedio/Orden</th>
                  <td mat-cell *matCellDef="let prov" class="text-right">
                    {{prov.avgSpend | currency:'EUR'}}
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['name', 'orders', 'avg']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'orders', 'avg'];"></tr>
              </table>
            } @else {
              <div class="empty-state">
                <mat-icon>info</mat-icon>
                <p>No hay proveedores registrados</p>
              </div>
            }
          </div>
        </mat-card>

        <!-- Tabla: Inventario Sin Salida -->
        <mat-card class="data-table-card full-width">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>history_toggle_off</mat-icon> Inventario Sin Salida (>30 días)
            </mat-card-title>
          </mat-card-header>
          <div class="table-container">
            @if (reporteService.productosStagnant().length > 0) {
              <table mat-table [dataSource]="reporteService.productosStagnant()">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Producto</th>
                  <td mat-cell *matCellDef="let p">{{p.name}}</td>
                </ng-container>
                <ng-container matColumnDef="category">
                  <th mat-header-cell *matHeaderCellDef>Categoría</th>
                  <td mat-cell *matCellDef="let p">{{p.category || 'Sin categoría'}}</td>
                </ng-container>
                <ng-container matColumnDef="stock">
                  <th mat-header-cell *matHeaderCellDef>Stock</th>
                  <td mat-cell *matCellDef="let p" class="text-center">{{p.stock}}</td>
                </ng-container>
                <ng-container matColumnDef="lastDate">
                  <th mat-header-cell *matHeaderCellDef>Última Salida</th>
                  <td mat-cell *matCellDef="let p" class="text-center">
                    @if (p.lastMove) {
                      {{p.lastMove | date:'dd/MM/yyyy'}}
                    } @else {
                      <span class="text-muted">Sin registros</span>
                    }
                  </td>
                </ng-container>
                <ng-container matColumnDef="days">
                  <th mat-header-cell *matHeaderCellDef>Días Inactivo</th>
                  <td mat-cell *matCellDef="let p" class="text-center">
                    @if (p.daysInactive === 999) {
                      <span class="days-badge severe">Nunca</span>
                    } @else {
                      <span class="days-badge" [class.severe]="p.daysInactive > 90">
                        {{p.daysInactive}} días
                      </span>
                    }
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['name', 'category', 'stock', 'lastDate', 'days']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['name', 'category', 'stock', 'lastDate', 'days'];"></tr>
              </table>
            } @else {
              <div class="empty-state">
                <mat-icon>check_circle</mat-icon>
                <p>Todos los productos han tenido movimientos recientes</p>
              </div>
            }
          </div>
        </mat-card>

      </div>
    </div>
  `,
  styles: [`
    .reportes-container { 
      padding: 0 20px 80px 20px; 
      background-color: #f5f7fa; 
      min-height: 100vh;
    }
    
    .page-title { 
      margin-bottom: 24px; 
      font-weight: 400; 
      color: #2c3e50;
      font-size: 28px;
    }

    /* KPIs */
    .kpi-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
      gap: 16px; 
      margin-bottom: 24px; 
    }
    
    .kpi-card { 
      padding: 20px; 
      border-radius: 12px; 
      color: white; 
      display: flex; 
      flex-direction: column; 
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    
    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    }
    
    .kpi-card mat-icon { 
      font-size: 36px; 
      width: 36px; 
      height: 36px; 
      margin-bottom: 8px;
      opacity: 0.9;
    }
    
    .kpi-value { 
      font-size: 28px; 
      font-weight: 700; 
      margin: 8px 0; 
    }
    
    .kpi-label { 
      font-size: 13px; 
      text-transform: uppercase; 
      opacity: 0.85;
      text-align: center;
      letter-spacing: 0.5px;
    }

    .kpi-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .month-selector {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      cursor: pointer;
      text-align: center;
    }

    .month-selector:focus {
      outline: none;
      background: rgba(255,255,255,0.3);
    }

    .blue { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .red { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    .green { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
    .purple { background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); }

    /* Gráficos */
    .charts-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); 
      gap: 20px; 
      margin-bottom: 24px; 
    }
    
    .chart-card { 
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      background: white;
    }

    .chart-card mat-card-header {
      margin-bottom: 16px;
    }

    .chart-card mat-card-title {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .period-selector {
      background: #f0f0f0;
      border: 1px solid #ddd;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      color: #555;
    }

    .period-selector:focus {
      outline: none;
      border-color: #667eea;
    }

    .chart-wrapper {
      height: 280px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Tablas */
    .tables-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
      gap: 20px; 
    }
    
    .data-table-card { 
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      background: white;
    }
    
    .full-width { 
      grid-column: 1 / -1; 
    }

    .data-table-card mat-card-header {
      margin-bottom: 16px;
    }

    .data-table-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
    }

    .data-table-card mat-card-title mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .critico { 
      color: #f44336; 
    }

    .table-container {
      overflow-x: auto;
      max-height: 400px;
      overflow-y: auto;
    }
    
    table { 
      width: 100%;
      font-size: 14px;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #2c3e50;
      padding: 12px 8px !important;
    }

    td {
      padding: 10px 8px !important;
    }

    .text-red { 
      color: #f44336; 
      font-weight: 600; 
    }
    
    .text-center { 
      text-align: center; 
    }

    .text-right {
      text-align: right;
    }

    .text-muted {
      color: #999;
      font-style: italic;
    }
    
    .days-badge { 
      background: #fff3e0; 
      color: #ef6c00; 
      padding: 4px 12px; 
      border-radius: 12px; 
      font-weight: 600;
      font-size: 12px;
      display: inline-block;
    }

    .days-badge.severe {
      background: #ffebee;
      color: #c62828;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 12px;
      display: inline-block;
    }

    .blue-badge {
      background: #e3f2fd;
      color: #1976d2;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #999;
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
      opacity: 0.5;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .kpi-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .charts-grid {
        grid-template-columns: 1fr;
      }

      .tables-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportesComponent {
  reporteService = inject(ReporteService);
  
  barOptions: ChartOptions = { 
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: true,
        position: 'top'
      } 
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  doughnutOptions: ChartOptions = { 
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11
          }
        }
      } 
    }
  };

  onMonthChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.reporteService.setSalesMonth(Number(value));
  }

  onComprasPeriodChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.reporteService.setComprasPeriod(Number(value));
  }

  onMovimientosPeriodChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.reporteService.setMovimientosPeriod(Number(value));
  }
}