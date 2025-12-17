import { Injectable, signal } from '@angular/core';
import { Proveedor, CreateProveedorDto, UpdateProveedorDto } from '../../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private proveedores = signal<Proveedor[]>([]);  
  readonly proveedores$ = this.proveedores.asReadonly();

  constructor() {}

}
