<div align="center">
  
  # Merkand Client - Web app 🛒
  
  **[English](README.md) | [Español](README.es.md)**
  
  [![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=flat&logo=angular)](https://angular.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
  [![Material](https://img.shields.io/badge/Material-21-757575?style=flat&logo=material-design)](https://material.angular.io/)
</div>

A modern inventory management system built with **Angular 21**, featuring cutting-edge reactive patterns, standalone components, and a clean architecture designed for scalability and maintainability.

> [!IMPORTANT]
> This project requires the [Merkand-API](https://github.com/FadiDaniel/Merkand-API) backend for full functionality.

---

## ✨ Key Features

### Core Functionality
- 🔐 **Authentication & Authorization** with role-based access (Admin/Operator)
- 📊 **Real-time Dashboard** with dynamic statistics and KPIs
- 📦 **Product Management** - Complete CRUD operations
- 🔄 **Order Management** - Handle IN/OUT transactions
- 📈 **Movement Tracking** - Complete inventory movement history
- 👥 **Supplier Management** - Admin-only supplier control
- 📋 **Reports & Analytics** - Inventory and sales insights
- 👤 **User Profile** - Personal account management
- ➕ **User Registration** - Admin-controlled user creation

---

## 🏗️ Architecture & Modern Patterns

This project showcases **modern Angular best practices** and serves as a reference implementation for enterprise-level applications.

### Technical Stack
- **Angular 21** - Latest framework version with modern APIs
- **Angular Material 21** - Comprehensive UI component library
- **TypeScript 5.9** - Type-safe development
- **RxJS 7.8** - Reactive programming patterns
- **Signals** - Built-in reactive state management
- **PNPM** - Fast, disk space efficient package manager

### Modern Angular Patterns

#### 🎯 Standalone Components
Fully modular architecture without NgModules:

```typescript
@Component({
  selector: 'app-productos',
  imports: [MatCardModule, MatTableModule, CommonModule],
  templateUrl: './productos.component.html'
})
export class ProductosComponent { }
```

#### 🔔 Signals for Reactive State
Efficient state management without Zone.js overhead:

```typescript
private productos = signal<Producto[]>([]);
readonly productos$ = this.productos.asReadonly();

// Computed signals for derived state
readonly productosStockBajo = computed(() =>
  this.productos().filter(p => p.stock <= p.stockMinimo)
);
```

#### 🎨 New Control Flow Syntax
Cleaner, more performant templates using `@if` and `@for`:

```html
@if (productos().length > 0) {
  <table mat-table [dataSource]="productos()">
    @for (producto of productos(); track producto.id) {
      <tr>{{ producto.nombre }}</tr>
    }
  </table>
} @else {
  <p>No products available</p>
}
```

#### 💉 Functional Dependency Injection
Modern `inject()` pattern for cleaner code:

```typescript
export class ProductosComponent {
  private productoService = inject(ProductoService);
  private router = inject(Router);
}
```

#### 🛡️ Functional Guards
Type-safe route guards as pure functions:

```typescript
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

<details>
<summary><b>📁 View Project Structure</b></summary>

```
src/app/
├── core/                    # Singleton services & guards
│   ├── guards/             # Authentication & authorization guards
│   ├── services/           # Core services (Auth, Product, Order)
│   └── interceptors/       # HTTP interceptors (future)
├── shared/                  # Reusable components & utilities
│   ├── components/         # Shared UI components
│   └── pipes/              # Custom pipes
├── features/                # Feature modules
│   ├── auth/               # Login & registration
│   ├── dashboard/          # Main dashboard
│   ├── productos/          # Product management
│   ├── ordenes/            # Order management
│   ├── movimientos/        # Movement history
│   ├── proveedores/        # Supplier management
│   ├── reportes/           # Reports & analytics
│   └── perfil/             # User profile
├── models/                  # TypeScript interfaces & types
└── layouts/                 # Application layouts
```

</details>

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 24.x or higher
- **PNPM** 10.x
- **Angular CLI** 21.x

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FadiDaniel/Merkand-client.git
   cd Merkand-client
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm start
   # or
   ng serve
   ```

4. **Open in browser**
   ```
   http://localhost:4200
   ```

---

## 🔐 Test Credentials

| Role | Username | Password | Permissions |
|------|----------|----------|-------------|
| **Admin** | `admin1` | `admin1` | Full access to all features |
| **User** | `user1` | `user1` | Limited access (no suppliers/user registration) |

---

## 📊 Core Services

### AuthService
- User authentication and session management
- localStorage-based persistence
- Computed signals for auth state
- Role-based access control

### ProductoService

- Complete product CRUD operations
- Stock validation and alerts
- Low stock monitoring
- Server-side persistence

### OrdenService

- IN/OUT order creation
- Stock validation for outbound orders
- Automatic inventory updates
- Order generation


---

## 🎨 UI & Design

### Custom Material Theme
Rose/red color palette with Roboto typography:

```scss
@include mat.theme((
  color: (
    primary: mat.$rose-palette,
    tertiary: mat.$red-palette,
  ),
  typography: Roboto,
  density: 0,
));
```

### Material Components Used
- **Layout**: Cards, Tables, Sidenav, Toolbars
- **Forms**: Input fields, Select, Datepicker
- **Navigation**: Menus, Tabs
- **Feedback**: Dialogs, Snackbars
- **Display**: Icons, Chips, Badges

### Performance Optimization
- **Lazy Loading** for secondary routes
- **OnPush Change Detection** strategy
- **TrackBy** functions in lists
- **Computed Signals** for derived state

```typescript
{
  path: 'reportes',
  loadComponent: () => import('./features/reportes/reportes.component')
}
```

---

## 🛠️ Available Commands

```bash
# Development
pnpm start          # Start development server
pnpm build          # Production build
pnpm watch          # Build in watch mode

# Testing
pnpm test           # Run unit tests

# Code Quality
ng lint             # Run linter
```

---

## 🔗 Related Projects

- **[Merkand-API](https://github.com/FadiDaniel/Merkand-API)** - Spring Boot backend REST API

---

## 👨‍💻 Author

**Fadi Daniel**
- GitHub: [@FadiDaniel](https://github.com/FadiDaniel)

---

<div align="center">
  <p>Built with ❤️ using Angular 21</p>
</div>
