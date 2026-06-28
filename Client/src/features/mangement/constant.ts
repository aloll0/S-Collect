import type { Product, ProductStatus, StatusFilter } from './mangement';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Summer cotton dress',
    category: "Women's clothing",
    price: 189,
    status: 'In Stock',
    enabled: true,
    icon: 'ti-dress',
  },
  {
    id: 2,
    name: 'Classic jeans',
    category: "Men's clothing",
    price: 245,
    status: 'Low Stock',
    enabled: false,
    icon: 'ti-shirt',
  },
  {
    id: 3,
    name: 'Nike sneakers',
    category: 'Shoes',
    price: 380,
    status: 'Out Of Stock',
    enabled: true,
    icon: 'ti-shoe',
  },
  {
    id: 4,
    name: 'White formal shirt',
    category: "Men's clothing",
    price: 150,
    status: 'In Stock',
    enabled: true,
    icon: 'ti-shirt',
  },
  {
    id: 5,
    name: 'Leather handbag',
    category: 'Accessories',
    price: 450,
    status: 'In Stock',
    enabled: true,
    icon: 'ti-briefcase',
  },
  {
    id: 6,
    name: 'Sunglasses',
    category: 'Accessories',
    price: 290,
    status: 'Low Stock',
    enabled: true,
    icon: 'ti-eyeglass',
  },
  {
    id: 7,
    name: 'Printed T-shirt',
    category: 'Youth clothes',
    price: 95,
    status: 'In Stock',
    enabled: true,
    icon: 'ti-shirt',
  },
];

export const CATEGORIES = [
  "Women's clothing",
  "Men's clothing",
  'Shoes',
  'Accessories',
  'Youth clothes',
];

export const STATUS_FILTERS: StatusFilter[] = [
  'All',
  'In Stock',
  'Low Stock',
  'Out Of Stock',
];

export const TOTAL_PRODUCTS = 48;
export const TOTAL_PAGES = 3;

export const STATUS_BADGE: Record<ProductStatus, string> = {
  'In Stock': 'bg-green-100 text-green-800',
  'Low Stock': 'bg-amber-100 text-amber-800',
  'Out Of Stock': 'bg-red-100 text-red-800',
};

export const THUMB_STYLES: Record<string, { bg: string; icon: string }> = {
  "Women's clothing": {
    bg: 'bg-pink-50',
    icon: 'text-pink-600',
  },
  "Men's clothing": {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
  },
  Shoes: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
  },
  Accessories: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
  },
  'Youth clothes': {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
  },
};
