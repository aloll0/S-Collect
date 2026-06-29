export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered';

export interface OrderItem {
  name: string;
  variant: string;
  sku: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface TimelineStep {
  step: string;
  desc: string;
  date: string;
  done: boolean;
}

export interface Order {
  id: string;
  date: string;
  customer: { name: string; email: string; phone: string };
  status: OrderStatus;
  amount: number;
  trackingNumber: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentStatus: string;
  timeline: TimelineStep[];
}

export const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: 'bg-gray-100 text-gray-500',
  Processing: 'bg-blue-100 text-blue-600',
  Shipped: 'bg-orange-50 text-orange-500',
  Delivered: 'bg-green-50 text-green-600',
};

export const ALL_STATUSES: OrderStatus[] = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
];
