export interface Movimiento {
  id: number;
  movementType: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  date: Date;
  reference?: string; 
  productId: number;
  productName?: string; 
  userId?: string; 
  userName?: string;
}

export interface CreateMovimientoDto {
  movementType: 'IN' | 'OUT' | 'ADJUST';
  productId: number;
  quantity: number;
  reference?: string;
  reason: string;
}
