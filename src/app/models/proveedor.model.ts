export interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  pais: string;
  activo: boolean;
  fechaCreacion: Date;
}

export interface CreateProveedorDto {
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad: string;
  pais: string;
}

export interface UpdateProveedorDto extends Partial<CreateProveedorDto> {
  id: number;
}
