import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { MovimientoService } from '../../../core/services/movimiento.service';
import { MovimientoAjusteDialogComponent } from './movimiento-ajuste-dialog.component';
import { AuthService } from '../../../core/services/auth.service';
import { Movimiento } from '../../../models/movimiento.model';
import { BackButtonComponent } from '../../../shared/components/back-button.component';

@Component({
  selector: 'app-movimientos',
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    DatePipe,
    UpperCasePipe,
    BackButtonComponent
  ],
  template: ` 
    <div class="movimientos-container">
      <app-back-button route="/dashboard" label="Volver"></app-back-button>
      <div class="header">
        <h1 class="page-title">Movimientos</h1>
         <button mat-flat-button color="primary" (click)="nuevoAjuste()">
          <mat-icon>add</mat-icon>
          Nuevo Ajuste
        </button>
      </div>
      <mat-card>
        <mat-card-content>
          @if (movimientos().length > 0) {
            <table mat-table [dataSource]="movimientos()" class="movimientos-table">
              <ng-container matColumnDef="fecha">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let mov">{{ mov.date | date:'dd/MM/yyyy HH:mm' }}</td>
              </ng-container>

              <ng-container matColumnDef="producto">
                <th mat-header-cell *matHeaderCellDef>Producto</th>
                <td mat-cell *matCellDef="let mov">{{ mov.productName }}</td>
              </ng-container>

              <ng-container matColumnDef="tipo">
                <th mat-header-cell *matHeaderCellDef>Tipo</th>
                <td mat-cell *matCellDef="let mov">
                  <span [class]="'tipo-badge ' + mov.movementType.toLowerCase()">
                    {{ mov.movementType | uppercase }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="cantidad">
                <th mat-header-cell *matHeaderCellDef>Cantidad</th>
                <td mat-cell *matCellDef="let mov" [class.negativo]="esSalida(mov)" [class.positivo]="!esSalida(mov)">
                  {{ esSalida(mov) ? '-' : '+' }}{{ mov.quantity }}
                </td>
              </ng-container>

              <ng-container matColumnDef="referencia">
                <th mat-header-cell *matHeaderCellDef>Motivo / Referencia</th>
                <td mat-cell *matCellDef="let mov">{{ mov.reference }}</td>
              </ng-container>

              <ng-container matColumnDef="usuario">
                <th mat-header-cell *matHeaderCellDef>Usuario</th>
                <td mat-cell *matCellDef="let mov">{{ mov.userName }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          } @else {
            <div class="no-data">
              <mat-icon>swap_horiz</mat-icon>
              <p>No hay movimientos registrados</p>
            </div>
          }
          </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .movimientos-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
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

    .movimientos-table {
      width: 100%;
    }

    .tipo-badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .tipo-badge.in { background-color: #e8f5e9; color: #2e7d32; }      /* Verde para Entradas */
    .tipo-badge.out { background-color: #ffebee; color: #c62828; }     /* Rojo para Salidas */
    .tipo-badge.adjust { background-color: #f3e5f5; color: #7b1fa2; }  /* Morado para Ajustes */
    
    .negativo { color: #d32f2f; font-weight: 500; }
    .positivo { color: #388e3c; font-weight: 500; }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #999;
    }
    
    .no-data mat-icon { margin-bottom: 16px; font-size: 48px; height: 48px; width: 48px;}
  `]
})
export class MovimientosComponent {
  private movimientoService = inject(MovimientoService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  movimientos = this.movimientoService.movimientos$;
  isAdmin = this.authService.isAdmin;
  
  displayedColumns = ['fecha', 'producto', 'tipo', 'cantidad', 'referencia', 'usuario'];

  esSalida(mov: Movimiento): boolean {
    return mov.movementType === 'OUT' || (mov.movementType === 'ADJUST' && mov.quantity < 0); 
  }

  nuevoAjuste() {
    this.dialog.open(MovimientoAjusteDialogComponent, {
      width: '500px'
    });
  }
}
