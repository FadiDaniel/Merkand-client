import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/components/login.component';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { DashboardComponent } from './features/dashboard/components/dashboard.component';
import { ProductosComponent } from './features/productos/components/productos.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'productos',
        component: ProductosComponent
      },
      {
        path: 'ordenes',
        loadComponent: () => import('./features/ordenes/components/ordenes.component').then(m => m.OrdenesComponent)
      },
      {
        path: 'nueva-orden',
        loadComponent: () => import('./features/ordenes/components/nueva-orden.component').then(m => m.NuevaOrdenComponent)
      },
      {
        path: 'movimientos',
        loadComponent: () => import('./features/movimientos/components/movimientos.component').then(m => m.MovimientosComponent)
      },
      {
        path: 'proveedores',
        loadComponent: () => import('./features/proveedores/components/proveedores.component').then(m => m.ProveedoresComponent),
        canActivate: [adminGuard]
      },
      {
        path: 'reportes',
        loadComponent: () => import('./features/reportes/components/reportes.component').then(m => m.ReportesComponent)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/perfil/components/perfil.component').then(m => m.PerfilComponent)
      },
      {
        path: 'registro',
        loadComponent: () => import('./features/auth/components/registro.component').then(m => m.RegistroComponent),
        canActivate: [adminGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
