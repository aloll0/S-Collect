// features/Orders/mobile/MobileOrderCard.tsx
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import PortalDropdown from '../../../components/ui/PortalDropdown';
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
        <PortalDropdown
          align="left"
          minWidth={160}
          animate
          menuClassName="bg-white rounded-lg border border-gray-200 shadow-lg py-1 overflow-hidden"
          trigger={({ isOpen, toggle }) => (
            <button
              onClick={toggle}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 hover:border-gray-300 transition-colors"
            >
              <span
                className={`rounded-lg px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
              >
                {t(`ordersPage.${order.status.toLowerCase()}`)}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={13} className="text-gray-400" />
              </motion.span>
            </button>
          )}
        >
          {({ close }) => (
            <>
              {ALL_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(order.id, status);
                    close();
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                    status === order.status
                      ? 'bg-gray-50 font-medium text-gray-900'
                      : 'text-gray-600'
                  }`}
                >
                  {/* دوايرة صغيرة للدلالة على الستاتس */}
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      status === 'Pending'
                        ? 'bg-amber-400'
                        : status === 'Processing'
                          ? 'bg-blue-400'
                          : status === 'Shipped'
                            ? 'bg-purple-400'
                            : status === 'Delivered'
                              ? 'bg-emerald-400'
                              : 'bg-gray-400'
                    }`}
                  />
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                      STATUS_STYLES[status]
                    }`}
                  >
                    {t(`ordersPage.${status.toLowerCase()}`)}
                  </span>
                  {status === order.status && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="ml-auto text-gray-900"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </>
          )}
        </PortalDropdown>

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
