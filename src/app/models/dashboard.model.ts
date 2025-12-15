export interface DashboardStats {
  totalProductos: number;
  productosStockBajo: number;
  ordenesHoy: number;
  valorInventario: number;
}

export interface ReporteVentas {
  periodo: string;
  ventas: number;
  cantidad: number;
}

export interface ReporteInventario {
  productoId: number;
  nombreProducto: string;
  stock: number;
  stockMinimo: number;
  valorStock: number;
  estado: 'normal' | 'bajo' | 'critico';
}
