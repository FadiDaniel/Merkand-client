export interface Movimiento {
  id: string;
  tipo: 'entrada' | 'salida' | 'ajuste' | 'inventario-inicial';
  productoId: number;
  nombreProducto?: string; // Opcional si no lo tenemos a mano siempre, o el servicio lo llena
  cantidad: number;
  fecha: Date;
  usuario: string; // Cambiado de realizadoPor para consistencia con lo que escribí en el servicio, o viceversa. Usaré 'usuario'
  referencia?: string; // Nuevo
  motivo: string;
}

export interface CreateMovimientoDto {
  tipo: 'entrada' | 'salida' | 'ajuste' | 'inventario-inicial';
  productoId: number;
  cantidad: number;
  referencia?: string;
  motivo: string;
}
