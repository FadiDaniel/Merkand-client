export interface Orden {
  id: number;
  orderNumber: string;
  orderDate: string;
  orderItemList: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'RECEIVED' | 'CANCELLED';
  observations?: string;
  supplierId: number;
  supplierName: string;
  userId: number;
  userName: string;
}

export interface OrderItem {
  itemId: number;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  productName: string;
  productId: number;
  orderId: number;
  orderNumber: string;
}

export interface CreateOrdenDto {    
  orderNumber: string;
  orderDate: string;
  supplierId: number;
  orderItemList: OrderItem[];
  observations?: string;
}
