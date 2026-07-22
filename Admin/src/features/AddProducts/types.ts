export interface ProductFormData {
  nameAr: string;
  nameEn: string;
  description: string;
  basePrice: string;
  comparePrice: string;
  sku: string;
  images: File[];
  categoryId: string;
  enabled?: boolean;
  quantity?: number;
  categories?: string[];
  sizes?: string[];
  colors?: string[];
}

