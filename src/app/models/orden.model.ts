export interface Orden {
  id: number;
  numeroOrden: string;
  fecha: Date;
  proveedor?: string;
  productos: OrdenProducto[];
  total: number;
  estado: 'PENDING' | 'RECEIVED' | 'CANCELLED';
  observaciones?: string;
  creadoPor: string;
  fechaCreacion: Date;
  supplierId: number;
  supplierName: string;
}

export interface OrdenProducto {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CreateOrdenDto {
  proveedor?: string;
  productos: OrdenProducto[];
  observaciones?: string;
}
