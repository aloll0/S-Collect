// features/Orders/mobile/MobileOrderCard.tsx
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import {
  type Order,
  type OrderStatus,
  STATUS_STYLES,
  ALL_STATUSES,
} from '../types/order';

interface MobileOrderCardProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: Order) => void;
}

export const MobileOrderCard = ({
  order,
  onStatusChange,
  onViewDetails,
}: MobileOrderCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      {/* Top row: order ID + date */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-base font-bold text-gray-900">#{order.id}</span>
        <span className="text-xs text-gray-400">{order.date}</span>
      </div>

      {/* Customer name + amount */}
      <p className="text-sm font-medium text-gray-700">{order.customer.name}</p>
      <p className="text-sm font-bold text-gray-900 mt-0.5">
        {order.amount.toLocaleString()} SAR
      </p>

      {/* Bottom row: status dropdown + details link */}
      <div className="flex items-center justify-between mt-3">
        {/* Status selector */}
        <div className="relative inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5">
          <span
            className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
          >
            {t(`ordersPage.${order.status.toLowerCase()}`)}
          </span>
          <select
            value={order.status}
            onChange={(e) =>
              onStatusChange(order.id, e.target.value as OrderStatus)
            }
            className="absolute inset-0 cursor-pointer opacity-0 w-full h-full"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`ordersPage.${s.toLowerCase()}`)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="text-gray-400 pointer-events-none shrink-0"
          />
        </div>

        <button
          onClick={() => onViewDetails(order)}
          className="text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-gray-500 transition-colors cursor-pointer"
        >
          {t('ordersPage.viewDetails')}
        </button>
      </div>
    </div>
  );
};
