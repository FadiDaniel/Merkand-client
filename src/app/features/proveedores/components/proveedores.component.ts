import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProveedorService } from '../../../core/services/proveedor.service';
import { ProveedorFormDialogComponent } from './proveedor-form-dialog.component';
import { Proveedor, CreateProveedorDto } from '../../../models/proveedor.model';

@Component({
  selector: 'app-proveedores',
  imports: [
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="proveedores-container">
      <div class="header">
        <h1 class="page-title">Gestión de Proveedores</h1>
        <button mat-raised-button color="primary" (click)="crearProveedor()">
          <mat-icon>add</mat-icon>
          Nuevo Proveedor
        </button>
      </div>

      <mat-card>
        <mat-card-content>
          @if (proveedores().length > 0) {
            <table mat-table [dataSource]="proveedores()" class="proveedores-table">
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Empresa</th>
                <td mat-cell *matCellDef="let prov">{{ prov.nombre }}</td>
              </ng-container>

              <ng-container matColumnDef="contacto">
                <th mat-header-cell *matHeaderCellDef>Contacto</th>
                <td mat-cell *matCellDef="let prov">
                  {{ prov.contacto }}
                  <div class="sub-text">{{ prov.email }}</div>
                </td>
              </ng-container>

              <ng-container matColumnDef="ubicacion">
                <th mat-header-cell *matHeaderCellDef>Ubicación</th>
                <td mat-cell *matCellDef="let prov">{{ prov.ciudad }}, {{ prov.pais }}</td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let prov">
                  <button mat-icon-button color="primary" (click)="editarProveedor(prov)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="eliminarProveedor(prov)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          } @else {
            <div class="no-data">
              <mat-icon>local_shipping</mat-icon>
              <p>No hay proveedores registrados</p>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .proveedores-container {
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

    .proveedores-table {
      width: 100%;
    }

    .sub-text {
      font-size: 12px;
      color: #666;
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
export class ProveedoresComponent {
  private proveedorService = inject(ProveedorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  proveedores = this.proveedorService.proveedores$;
  displayedColumns = ['nombre', 'contacto', 'ubicacion', 'acciones'];

  crearProveedor() {

  }

  editarProveedor(proveedor: Proveedor) {
    const dialogRef = this.dialog.open(ProveedorFormDialogComponent, {
      width: '600px',
      data: { proveedor }
    });

    dialogRef.afterClosed().subscribe((result: CreateProveedorDto) => {

    });
  }

  eliminarProveedor(proveedor: Proveedor) {

  }
}
