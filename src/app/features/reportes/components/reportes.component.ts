import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-reportes',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  template: `
    <div class="reportes-container">
      <h1 class="page-title">Reportes</h1>

      <mat-card>
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Inventario">
              <div class="tab-content">
                <div class="no-data">
                  <mat-icon>assessment</mat-icon>
                  <p>Reporte de Inventario</p>
                  <button mat-raised-button color="primary">
                    <mat-icon>download</mat-icon>
                    Generar Reporte
                  </button>
                </div>
              </div>
            </mat-tab>

            <mat-tab label="Ventas">
              <div class="tab-content">
                <div class="no-data">
                  <mat-icon>trending_up</mat-icon>
                  <p>Reporte de Ventas</p>
                  <button mat-raised-button color="primary">
                    <mat-icon>download</mat-icon>
                    Generar Reporte
                  </button>
                </div>
              </div>
            </mat-tab>

            <mat-tab label="Movimientos">
              <div class="tab-content">
                <div class="no-data">
                  <mat-icon>swap_horiz</mat-icon>
                  <p>Reporte de Movimientos</p>
                  <button mat-raised-button color="primary">
                    <mat-icon>download</mat-icon>
                    Generar Reporte
                  </button>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .reportes-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 32px;
      font-weight: 500;
      margin-bottom: 24px;
      color: #333;
    }

    .tab-content {
      padding: 24px 0;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #999;
      gap: 16px;
    }

    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }

    .no-data p {
      font-size: 18px;
      margin: 0;
    }
  `]
})
export class ReportesComponent {}
