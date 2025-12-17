import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe,NgClass } from '@angular/common';
import { OrdenService } from '../../../core/services/orden.service';

@Component({
  selector: 'app-ordenes',
  standalone: true, 
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CurrencyPipe,
    DatePipe,
    NgClass
  ],
  template: `
    <div class="ordenes-container">
      <div class="header">
        <h1 class="page-title">Órdenes de Compra</h1>
        <button mat-flat-button color="primary">
          <mat-icon>add</mat-icon>
          Nueva Orden
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="ordenes$()" class="ordenes-table">
              
              <ng-container matColumnDef="orderNumber">
                <th mat-header-cell *matHeaderCellDef>Número</th>
                <td mat-cell *matCellDef="let orden">{{ orden.orderNumber }}</td>
              </ng-container>

              <ng-container matColumnDef="orderDate">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let orden">{{ orden.orderDate | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <ng-container matColumnDef="supplierName">
                <th mat-header-cell *matHeaderCellDef>Proveedor</th>
                <td mat-cell *matCellDef="let orden">{{ orden.supplierName || 'N/A' }}</td>
              </ng-container>

              <ng-container matColumnDef="itemsCount">
                <th mat-header-cell *matHeaderCellDef>Productos</th>
                <td mat-cell *matCellDef="let orden">
                  {{ orden.orderItemList?.length || 0 }}
                </td>
              </ng-container>

              <ng-container matColumnDef="totalAmount">
                <th mat-header-cell *matHeaderCellDef>Total</th>
                <td mat-cell *matCellDef="let orden">{{ orden.totalAmount | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let orden">
                  <span class="estado-badge" [ngClass]="orden.status?.toLowerCase()">
                    {{ orden.status }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let orden">
                  <button mat-icon-button color="accent" (click)="verDetalle(orden)">
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .ordenes-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 32px;
      font-weight: 500;
      margin: 0;
      color: #333;
    }

    .table-container {
      overflow-x: auto;
    }

    .ordenes-table {
      width: 100%;
    }

    .estado-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .estado-badge.pending {
      background-color: #fff9c4;
      color: #f57f17; /* Amarillo/Ámbar */
    }

    .estado-badge.received {
      background-color: #c8e6c9;
      color: #388e3c; /* Verde */
    }

    .estado-badge.cancelled {
      background-color: #ffcdd2;
      color: #d32f2f; /* Rojo */
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #999;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }

    .estado-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .estado-badge.pending { background-color: #fff9c4; color: #f57f17; }
    .estado-badge.received { background-color: #c8e6c9; color: #388e3c; }
    .estado-badge.cancelled { background-color: #ffcdd2; color: #d32f2f; }
  `]
})
export class OrdenesComponent {
  private ordenService = inject(OrdenService);
  
  displayedColumns: string[] = ['orderNumber', 'orderDate', 'supplierName', 'itemsCount', 'totalAmount', 'status', 'actions'];
  
  readonly ordenes$ = this.ordenService.ordenes$;

  verDetalle(orden: any) {
    console.log('Detalle de la orden:', orden);
  }
  
  receiveOrder(id: number): void {
    this.ordenService.receiveOrder(id);
  }
  
  cancelOrder(id: number): void {
    this.ordenService.cancelOrder(id);
  }
}