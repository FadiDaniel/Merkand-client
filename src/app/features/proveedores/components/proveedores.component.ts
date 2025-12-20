import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProveedorService } from '../../../core/services/proveedor.service';
import { ProveedorFormDialogComponent } from './proveedor-form-dialog.component';
import { Proveedor, CreateProveedorDto, UpdateProveedorDto } from '../../../models/proveedor.model';
import { BackButtonComponent } from '../../../shared/components/back-button.component';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, BackButtonComponent],
  template: `
    <div class="proveedores-container">
      <app-back-button route="/dashboard" label="Volver"></app-back-button>
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
              
              <ng-container matColumnDef="nif">
                <th mat-header-cell *matHeaderCellDef>NIF</th>
                <td mat-cell *matCellDef="let prov">{{ prov.nif }}</td>
              </ng-container>

              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Empresa</th>
                <td mat-cell *matCellDef="let prov">{{ prov.name }}</td>
              </ng-container>

              <ng-container matColumnDef="contacto">
                <th mat-header-cell *matHeaderCellDef>Contacto</th>
                <td mat-cell *matCellDef="let prov">
                  {{ prov.contactName }}
                  <div class="sub-text">{{ prov.email }} | {{ prov.phone }}</div>
                </td>
              </ng-container>

              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let prov">
                  <span class="status-pill" [class.active]="prov.active" [class.inactive]="!prov.active">
                    {{ prov.active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="productos">
                <th mat-header-cell *matHeaderCellDef>Productos</th>
                <td mat-cell *matCellDef="let prov">{{ prov.productList.length }}</td>
              </ng-container>

              <ng-container matColumnDef="direccion">
                <th mat-header-cell *matHeaderCellDef>Dirección</th>
                <td mat-cell *matCellDef="let prov">{{ prov.address }}</td>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let prov">
                  <button mat-icon-button color="primary" (click)="editarProveedor(prov)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="eliminarProveedor(prov.id)">
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

    .status-pill {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    display: inline-block; 
    text-align: center;
    min-width: 70px;
    }

    .status-pill.active {
      background-color: #d3eed5ff;
      color: #2a702dff;
    }

    .status-pill.inactive {
      background-color: #f0d9d8ff;
      color: #7a5754ff;
      border: 1px solid #cfd8dc;
    }
  `]
})
export class ProveedoresComponent {
  private proveedorService = inject(ProveedorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  proveedores = this.proveedorService.proveedores$;
  displayedColumns = ['nif', 'nombre', 'contacto', 'direccion', 'productos', 'estado', 'acciones'];

  crearProveedor() {
    const dialogRef = this.dialog.open(ProveedorFormDialogComponent, { width: '600px' });
    dialogRef.afterClosed().subscribe((result: CreateProveedorDto) => {
      if (result) {
        this.proveedorService.create(result).subscribe({
          next: () => this.snackBar.open('Proveedor creado', 'Cerrar', { duration: 3000 }),
          error: () => this.snackBar.open('Error al crear proveedor', 'Cerrar')
        });
      }
    });
  }

  editarProveedor(proveedor: Proveedor) {
    const dialogRef = this.dialog.open(ProveedorFormDialogComponent, {
      width: '600px',
      data: { proveedor }
    });

    dialogRef.afterClosed().subscribe((result: UpdateProveedorDto) => {
      if (result) {
        this.proveedorService.update(proveedor.id, result).subscribe({
          next: () => this.snackBar.open('Proveedor actualizado', 'Cerrar', { duration: 3000 })
        });
      }
    });
  }

  eliminarProveedor(id: number) {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.proveedorService.delete(id).subscribe({
        next: () => this.snackBar.open('Proveedor eliminado', 'Cerrar', { duration: 3000 })
      });
    }
  }
}