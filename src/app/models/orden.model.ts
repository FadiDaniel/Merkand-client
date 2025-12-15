export interface Orden {
  id: number;
  numeroOrden: string;
  tipo: 'entrada' | 'salida';
  fecha: Date;
  proveedor?: string;
  cliente?: string;
  productos: OrdenProducto[];
  total: number;
  estado: 'pendiente' | 'procesada' | 'cancelada';
  observaciones?: string;
  creadoPor: string;
  fechaCreacion: Date;
}

export interface OrdenProducto {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CreateOrdenDto {
  tipo: 'entrada' | 'salida';
  proveedor?: string;
  cliente?: string;
  productos: OrdenProducto[];
  observaciones?: string;
}
