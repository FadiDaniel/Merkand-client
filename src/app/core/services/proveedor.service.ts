import { Injectable, signal } from '@angular/core';
import { Proveedor, CreateProveedorDto, UpdateProveedorDto } from '../../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private proveedores = signal<Proveedor[]>(this.loadProveedores());
  
  // Exponer como readonly
  readonly proveedores$ = this.proveedores.asReadonly();

  constructor() {}

  getAll(): Proveedor[] {
    return this.proveedores();
  }

  getById(id: number): Proveedor | undefined {
    return this.proveedores().find(p => p.id === id);
  }

  create(dto: CreateProveedorDto): Proveedor {
    const newProveedor: Proveedor = {
      id: this.generateId(),
      ...dto,
      fechaCreacion: new Date(),
      activo: true
    };

    this.proveedores.update(prev => [...prev, newProveedor]);
    this.saveProveedores();
    return newProveedor;
  }

  update(dto: UpdateProveedorDto): Proveedor | null {
    const index = this.proveedores().findIndex(p => p.id === dto.id);
    if (index === -1) return null;

    const updated = { ...this.proveedores()[index], ...dto };
    
    this.proveedores.update(prev => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });

    this.saveProveedores();
    return updated;
  }

  delete(id: number): boolean {
    // Soft delete
    const index = this.proveedores().findIndex(p => p.id == id);
    if (index === -1) return false;

    this.proveedores.update(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], activo: false };
      return copy;
    });
    
    this.saveProveedores();
    return true;
  }

  // Helpers
  private generateId(): number {
    return this.proveedores().length + 1;
  }

  private saveProveedores(): void {
    localStorage.setItem('proveedores', JSON.stringify(this.proveedores()));
  }

  private loadProveedores(): Proveedor[] {
    const saved = localStorage.getItem('proveedores');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return this.getInitialData();
  }

  private getInitialData(): Proveedor[] {
    return [
      {
        id: 1,
        nombre: 'Dell Inc.',
        contacto: 'Juan Pérez',
        telefono: '555-0101',
        email: 'contacto@dell.com',
        direccion: 'Calle Tecnológica 123',
        ciudad: 'Ciudad de México',
        pais: 'México',
        activo: true,
        fechaCreacion: new Date()
      },
      {
        id: 2,
        nombre: 'Logitech',
        contacto: 'Maria García',
        telefono: '555-0202',
        email: 'ventas@logitech.com',
        direccion: 'Av. Periféricos 456',
        ciudad: 'Guadalajara',
        pais: 'México',
        activo: true,
        fechaCreacion: new Date()
      },
      {
        id: 3,
        nombre: 'Keychron',
        contacto: 'Soporte Ventas',
        telefono: '555-0303',
        email: 'sales@keychron.com',
        direccion: 'Industrial Park 789',
        ciudad: 'Monterrey',
        pais: 'México',
        activo: true,
        fechaCreacion: new Date()
      }
    ];
  }
}
