import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrdenService } from '../../../core/services/orden.service';

@Component({
  selector: 'app-ordenes',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    CurrencyPipe,
    DatePipe
  ],
  template: `
    <div class="ordenes-container">
      <div class="header">
        <h1 class="page-title">Órdenes</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="ordenes()" class="ordenes-table">
              <ng-container matColumnDef="numeroOrden">
                <th mat-header-cell *matHeaderCellDef>Número</th>
                <td mat-cell *matCellDef="let orden">{{ orden.numeroOrden }}</td>
              </ng-container>

              <ng-container matColumnDef="tipo">
                <th mat-header-cell *matHeaderCellDef>Tipo</th>
                <td mat-cell *matCellDef="let orden">
                  <span [class]="'tipo-badge ' + orden.tipo">{{ orden.tipo }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="fecha">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let orden">{{ orden.fecha | date:'short' }}</td>
              </ng-container>

              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef>Total</th>
                <td mat-cell *matCellDef="let orden">{{ orden.total | currency }}</td>
              </ng-container>

              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let orden">
                  <span [class]="'estado-badge ' + orden.estado">{{ orden.estado }}</span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            @if (ordenes().length === 0) {
              <div class="no-data">
                <mat-icon>receipt_long</mat-icon>
                <p>No hay órdenes registradas</p>
              </div>
            }
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

    .tipo-badge, .estado-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;
    }

    .tipo-badge.entrada {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .tipo-badge.salida {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .estado-badge.pendiente {
      background-color: #fff9c4;
      color: #f57f17;
    }

    .estado-badge.procesada {
      background-color: #c8e6c9;
      color: #388e3c;
    }

    .estado-badge.cancelada {
      background-color: #ffcdd2;
      color: #d32f2f;
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
  `]
})
export class OrdenesComponent {
  private ordenService = inject(OrdenService);
  
  displayedColumns: string[] = ['numeroOrden', 'tipo', 'fecha', 'total', 'estado'];
  readonly ordenes = this.ordenService.ordenes$;
}
