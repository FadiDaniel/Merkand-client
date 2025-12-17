export interface Movimiento {
  id: number;
  tipo: 'entrada' | 'salida' | 'ajuste' | 'inventario-inicial';
  productoId: number;
  nombreProducto?: string; 
  cantidad: number;
  fecha: Date;
  usuario: string; 
  referencia?: string; 
  motivo: string;
}

export interface CreateMovimientoDto {
  tipo: 'entrada' | 'salida' | 'ajuste' | 'inventario-inicial';
  productoId: number;
  cantidad: number;
  referencia?: string;
  motivo: string;
}
