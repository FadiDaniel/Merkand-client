# Sistema de Control de Inventario - Angular

Sistema completo de gestión de inventario desarrollado con **Angular 21**, **Angular Material** y arquitectura moderna usando **Signals** y **Standalone Components**.

## 🚀 Características

### Funcionalidades Principales

- ✅ **Autenticación y Autorización** con roles (Admin/Usuario)
- ✅ **Dashboard** con estadísticas en tiempo real
- ✅ **Gestión de Productos** (CRUD completo)
- ✅ **Gestión de Órdenes** (Entrada/Salida)
- ✅ **Control de Movimientos** de inventario
- ✅ **Gestión de Proveedores** (solo Admin)
- ✅ **Reportes** de inventario y ventas
- ✅ **Perfil de Usuario**
- ✅ **Registro de Usuarios** (solo Admin)

### Tecnologías y Arquitectura

#### Stack Tecnológico

- **Angular 21** - Framework principal
- **Angular Material** - Componentes UI
- **TypeScript 5.9** - Lenguaje de programación
- **RxJS 7.8** - Programación reactiva
- **Signals** - Manejo de estado reactivo
- **PNPM** - Gestor de paquetes

#### Arquitectura

```
src/app/
├── core/                    # Servicios singleton y guards
│   ├── guards/             # Guards de autenticación
│   ├── services/           # Servicios core (Auth, Producto, Orden)
│   └── interceptors/       # HTTP Interceptors (futuro)
├── shared/                  # Componentes compartidos
│   ├── components/         # Componentes reutilizables
│   └── pipes/              # Pipes personalizados
├── features/                # Módulos de funcionalidades
│   ├── auth/               # Login y registro
│   ├── dashboard/          # Dashboard principal
│   ├── productos/          # Gestión de productos
│   ├── ordenes/            # Gestión de órdenes
│   ├── movimientos/        # Historial de movimientos
│   ├── proveedores/        # Gestión de proveedores
│   ├── reportes/           # Reportes y estadísticas
│   └── perfil/             # Perfil de usuario
├── models/                  # Interfaces y tipos
└── layouts/                 # Layouts principales
```

## 📦 Instalación

### Prerrequisitos

- Node.js 24.x o superior
- PNPM 10.x
- Angular CLI 21.x

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
cd Merkand-client
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Iniciar el servidor de desarrollo**

```bash
pnpm start
# o
ng serve
```

4. **Abrir en el navegador**

```
http://localhost:4200
```

## 🔐 Credenciales de Prueba

### Usuario Administrador

- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Permisos:** Acceso completo a todas las funcionalidades

### Usuario Regular

- **Usuario:** `usuario`
- **Contraseña:** `user123`
- **Permisos:** Acceso limitado (sin gestión de proveedores ni registro de usuarios)

## 🏗️ Arquitectura y Patrones

### Standalone Components

Todos los componentes son standalone, eliminando la necesidad de NgModules:

```typescript
@Component({
  selector: 'app-productos',
  imports: [MatCardModule, MatTableModule, ...],
  templateUrl: './productos.component.html'
})
export class ProductosComponent { }
```

### Signals para Estado Reactivo

Uso de Signals de Angular para manejo de estado:

```typescript
private productos = signal<Producto[]>([]);
readonly productos$ = this.productos.asReadonly();

// Computed signals
readonly productosStockBajo = computed(() =>
  this.productos().filter(p => p.stock <= p.stockMinimo)
);
```

### Control Flow Syntax

Uso de la nueva sintaxis de control de flujo de Angular:

```html
@if (productos().length > 0) {
<table mat-table [dataSource]="productos()">
  @for (producto of productos(); track producto.id) {
  <tr>
    {{ producto.nombre }}
  </tr>
  }
</table>
} @else {
<p>No hay productos</p>
}
```

### Dependency Injection con inject()

Uso de la función `inject()` en lugar de constructor injection:

```typescript
export class ProductosComponent {
  private productoService = inject(ProductoService);
  private router = inject(Router);
}
```

### Guards Funcionales

Guards implementados como funciones en lugar de clases:

```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

## 📊 Servicios Principales

### AuthService

- Autenticación de usuarios
- Manejo de sesión con localStorage
- Computed signals para estado de autenticación

### ProductoService

- CRUD completo de productos
- Validación de stock
- Alertas de stock bajo
- Persistencia en localStorage

### OrdenService

- Creación de órdenes de entrada/salida
- Validación de stock para salidas
- Actualización automática de inventario
- Generación de números de orden

## 🎨 Diseño y UI

### Tema Personalizado

El proyecto usa un tema personalizado de Angular Material con paleta rose/red:

```scss
@include mat.theme(
  (
    color: (
      primary: mat.$rose-palette,
      tertiary: mat.$red-palette,
    ),
    typography: Roboto,
    density: 0,
  )
);
```

### Componentes Material Utilizados

- Cards, Tables, Forms
- Dialogs, Menus, Toolbars
- Buttons, Icons, Chips
- Sidenav, Tabs
- Snackbars para notificaciones


### Lazy Loading

Los componentes secundarios usan lazy loading para optimizar la carga inicial:

```typescript
{
  path: 'reportes',
  loadComponent: () => import('./features/reportes/...')
}
```


## 🚀 Comandos Disponibles

```bash
# Desarrollo
pnpm start          # Inicia servidor de desarrollo
pnpm build          # Build de producción
pnpm watch          # Build en modo watch

# Testing (configurar)
pnpm test           # Ejecuta tests unitarios

# Linting
ng lint             # Ejecuta linter
```

---

**Nota:** Este proyecto usa datos simulados almacenados en localStorage. Para producción, se debe integrar con un backend real.
