export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  proveedor: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  activo: boolean;
}

export interface CreateProductoDto {
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  proveedor: string;
}

export interface UpdateProductoDto extends Partial<CreateProductoDto> {
  id: string;
}
