export interface Proveedor {
  id: number;
  nif: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
  active: boolean;
  productList: number[];
}

export interface CreateProveedorDto {
  name: string;
  nif: string;
  contactName: string;
  phone: string;
  email: string;
  address: string;
}

export interface UpdateProveedorDto extends Partial<CreateProveedorDto> {
  id: number;
}
