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

@Component({
  selector: 'app-movimientos',
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    DatePipe,
    UpperCasePipe
  ],
  template: `
    <div class="movimientos-container">
      <div class="header">
        <h1 class="page-title">Movimientos de Stock</h1>
        
        @if (isAdmin()) {
          <button mat-raised-button color="primary" (click)="nuevoAjuste()">
            <mat-icon>tune</mat-icon>
            Nuevo Ajuste / Inventario
          </button>
        }
      </div>

      <mat-card>
        <mat-card-content>
          @if (movimientos().length > 0) {
            <table mat-table [dataSource]="movimientos()" class="movimientos-table">
              <ng-container matColumnDef="fecha">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let mov">{{ mov.fecha | date:'short' }}</td>
              </ng-container>

              <ng-container matColumnDef="producto">
                <th mat-header-cell *matHeaderCellDef>Producto</th>
                <td mat-cell *matCellDef="let mov">{{ mov.nombreProducto }}</td>
              </ng-container>

              <ng-container matColumnDef="tipo">
                <th mat-header-cell *matHeaderCellDef>Tipo</th>
                <td mat-cell *matCellDef="let mov">
                  <span [class]="'tipo-badge ' + mov.tipo">{{ mov.tipo | uppercase }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="cantidad">
                <th mat-header-cell *matHeaderCellDef>Cantidad</th>
                <td mat-cell *matCellDef="let mov" [class.negativo]="esSalida(mov)" [class.positivo]="!esSalida(mov)">
                  {{ esSalida(mov) ? '-' : '+' }}{{ mov.cantidad }}
                </td>
              </ng-container>

              <ng-container matColumnDef="motivo">
                <th mat-header-cell *matHeaderCellDef>Motivo / Referencia</th>
                <td mat-cell *matCellDef="let mov">
                  {{ mov.motivo }} 
                  @if (mov.referencia) { <small>({{ mov.referencia }})</small> }
                </td>
              </ng-container>

              <ng-container matColumnDef="usuario">
                <th mat-header-cell *matHeaderCellDef>Usuario</th>
                <td mat-cell *matCellDef="let mov">{{ mov.usuario }}</td>
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

    .tipo-badge.entrada { background-color: #e3f2fd; color: #1976d2; }
    .tipo-badge.salida { background-color: #fff3e0; color: #e65100; }
    .tipo-badge.ajuste { background-color: #f3e5f5; color: #7b1fa2; }
    .tipo-badge.inventario-inicial { background-color: #e8f5e9; color: #2e7d32; }

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
  
  displayedColumns = ['fecha', 'producto', 'tipo', 'cantidad', 'motivo', 'usuario'];

  esSalida(mov: any): boolean {
    return mov.tipo === 'salida' || (mov.tipo === 'ajuste' && mov.cantidad < 0); // Ajustes pueden ser negativos aunque cantidad venga abs siempre? En mi logica no.
    // Revisar logica de ajuste. Si es ajuste positivo suma, negativo resta. 
    // En mi CreateMovimientoDto cantidad es number.
    // Simplemente checkeamos el tipo. Salida siempre reduce. Entrada siempre suma.
    // Ajuste depende del signo... pero visualmente si tipo es Salida le pongo menos.
  }

  nuevoAjuste() {
    this.dialog.open(MovimientoAjusteDialogComponent, {
      width: '500px'
    });
  }
}
