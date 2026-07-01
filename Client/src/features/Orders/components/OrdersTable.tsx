import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import {
  type Order,
  type OrderStatus,
  STATUS_STYLES,
  ALL_STATUSES,
} from '../types/order';

interface OrdersTableProps {
  orders: Order[];
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  onViewDetails: (order: Order) => void;
}

// دروب داون مخصص لكل صف
const StatusDropdown = ({
  orderId,
  currentStatus,
  onStatusChange,
  t,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusChange: (orderId: string, newStatus: OrderStatus) => void;
  t: (key: string) => string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // قفل الدروب داون لما تضغط براه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* الزر الرئيسي */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5 hover:border-gray-300 transition-colors"
      >
        <span
          className={`rounded-md px-3 py-1 text-xs font-medium ${
            STATUS_STYLES[currentStatus]
          }`}
        >
          {t(`ordersPage.${currentStatus.toLowerCase()}`)}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-gray-400" />
        </motion.span>
      </button>

      {/* القايمة المنسدلة */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-1 z-50 min-w-[160px] bg-white rounded-lg border border-gray-200 shadow-lg py-1"
          >
            {ALL_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => {
                  onStatusChange(orderId, status);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                  status === currentStatus
                    ? 'bg-gray-50 font-medium text-gray-900'
                    : 'text-gray-600'
                }`}
              >
                {/* دوايرة صغيرة للدلالة على الستاتس */}
                <span
                  className={`w-2 h-2 rounded-full ${
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
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    STATUS_STYLES[status]
                  }`}
                >
                  {t(`ordersPage.${status.toLowerCase()}`)}
                </span>
                {status === currentStatus && (
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const OrdersTable = ({
  orders,
  onStatusChange,
  onViewDetails,
}: OrdersTableProps) => {
  const { t } = useTranslation();

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 text-gray-400"
      >
        {t('ordersPage.noOrders', 'No orders found.')}
      </motion.div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-190 text-sm bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-100">
            {[
              t('ordersPage.orderId'),
              t('ordersPage.orderDate'),
              t('ordersPage.customerName'),
              t('ordersPage.totalAmount'),
              t('ordersPage.orderStatus'),
              t('ordersPage.actions'),
            ].map((h) => (
              <th
                key={h}
                className="text-left rtl:text-right py-3 px-2 text-xs text-gray-950 font-bold"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.04,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4 px-2 font-semibold text-gray-800">
                #{order.id}
              </td>
              <td className="py-4 px-2 text-gray-500">{order.date}</td>
              <td className="py-4 px-2 text-gray-700">{order.customer.name}</td>
              <td className="py-4 px-2 font-medium text-gray-900">
                {order.amount.toLocaleString()} SAR
              </td>
              <td className="py-4 px-2">
                <StatusDropdown
                  orderId={order.id}
                  currentStatus={order.status}
                  onStatusChange={onStatusChange}
                  t={t}
                />
              </td>
              <td className="py-4 px-2">
                <button
                  onClick={() => onViewDetails(order)}
                  className="text-sm font-medium text-gray-900 underline underline-offset-2 hover:text-gray-500 cursor-pointer transition-colors"
                >
                  {t('ordersPage.viewDetails')}
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};