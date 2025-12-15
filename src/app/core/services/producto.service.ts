import { Injectable, signal } from '@angular/core';
import { Producto, CreateProductoDto, UpdateProductoDto } from '../../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // State usando Signals
  private productos = signal<Producto[]>(this.loadProductos());

  // Exponer productos como readonly
  readonly productos$ = this.productos.asReadonly();

  constructor() {}

  /**
   * Obtiene todos los productos
   */
  getAll(): Producto[] {
    return this.productos();
  }

  /**
   * Obtiene un producto por ID
   */
  getById(id: string): Producto | undefined {
    return this.productos().find(p => p.id === id);
  }

  /**
   * Crea un nuevo producto
   */
  create(dto: CreateProductoDto): Producto {
    const newProducto: Producto = {
      id: this.generateId(),
      ...dto,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      activo: true
    };

    this.productos.update(productos => [...productos, newProducto]);
    this.saveProductos();
    return newProducto;
  }

  /**
   * Actualiza un producto existente
   */
  update(dto: UpdateProductoDto): Producto | null {
    const index = this.productos().findIndex(p => p.id === dto.id);
    
    if (index === -1) {
      return null;
    }

    const updatedProducto: Producto = {
      ...this.productos()[index],
      ...dto,
      fechaActualizacion: new Date()
    };

    this.productos.update(productos => {
      const newProductos = [...productos];
      newProductos[index] = updatedProducto;
      return newProductos;
    });

    this.saveProductos();
    return updatedProducto;
  }

  /**
   * Elimina un producto (soft delete)
   */
  delete(id: string): boolean {
    const index = this.productos().findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }

    this.productos.update(productos => {
      const newProductos = [...productos];
      newProductos[index] = { ...newProductos[index], activo: false };
      return newProductos;
    });

    this.saveProductos();
    return true;
  }

  /**
   * Actualiza el stock de un producto
   */
  updateStock(id: string, cantidad: number): boolean {
    const index = this.productos().findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }

    this.productos.update(productos => {
      const newProductos = [...productos];
      newProductos[index] = {
        ...newProductos[index],
        stock: newProductos[index].stock + cantidad,
        fechaActualizacion: new Date()
      };
      return newProductos;
    });

    this.saveProductos();
    return true;
  }

  /**
   * Obtiene productos con stock bajo
   */
  getProductosStockBajo(): Producto[] {
    return this.productos().filter(p => p.activo && p.stock <= p.stockMinimo);
  }

  /**
   * Genera un ID único
   */
  private generateId(): string {
    return `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Guarda productos en localStorage
   */
  private saveProductos(): void {
    localStorage.setItem('productos', JSON.stringify(this.productos()));
  }

  /**
   * Carga productos desde localStorage
   */
  private loadProductos(): Producto[] {
    const saved = localStorage.getItem('productos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading productos:', error);
      }
    }
    return this.getInitialProductos();
  }

  /**
   * Datos iniciales de ejemplo
   */
  private getInitialProductos(): Producto[] {
    return [
      {
        id: 'PROD-001',
        nombre: 'Laptop Dell XPS 15',
        descripcion: 'Laptop de alto rendimiento',
        categoria: 'Electrónica',
        precio: 1500,
        stock: 10,
        stockMinimo: 5,
        proveedor: 'Dell Inc.',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        activo: true
      },
      {
        id: 'PROD-002',
        nombre: 'Mouse Logitech MX Master 3',
        descripcion: 'Mouse ergonómico inalámbrico',
        categoria: 'Accesorios',
        precio: 99,
        stock: 25,
        stockMinimo: 10,
        proveedor: 'Logitech',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        activo: true
      },
      {
        id: 'PROD-003',
        nombre: 'Teclado Mecánico Keychron K2',
        descripcion: 'Teclado mecánico compacto',
        categoria: 'Accesorios',
        precio: 89,
        stock: 3,
        stockMinimo: 8,
        proveedor: 'Keychron',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        activo: true
      }
    ];
  }
}
