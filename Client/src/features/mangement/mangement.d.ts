export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out Of Stock';
export type StatusFilter = 'All' | ProductStatus;

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  status: ProductStatus;
  enabled: boolean;
  icon: string;
}
