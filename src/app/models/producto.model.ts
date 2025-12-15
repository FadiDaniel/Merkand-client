export interface Producto {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  minimumStock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  supplierId: number;
  supplierName: string;
}

export interface CreateProductoDto {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  minimumStock: number;
  active: boolean;
  supplierId: number;
  supplierName: string;
}

export interface UpdateProductoDto extends Partial<CreateProductoDto> {
  id: number;
}
