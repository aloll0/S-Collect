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

export const OrdersTable = ({
  orders,
  onStatusChange,
  onViewDetails,
}: OrdersTableProps) => {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-gray-100">
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
          {orders.map((order) => (
            <tr
              key={order.id}
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
                <div className="flex items-center gap-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[order.status]}`}
                  >
                    {t(`ordersPage.${order.status.toLowerCase()}`)}
                  </span>
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        onStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className="appearance-none bg-transparent border-none text-xs text-gray-400 cursor-pointer focus:outline-none pl-0.5 pr-4"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {t(`ordersPage.${s.toLowerCase()}`)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </td>
              <td className="py-4 px-2">
                <button
                  onClick={() => onViewDetails(order)}
                  className="text-sm font-medium text-gray-900 underline underline-offset-2 hover:text-gray-500 cursor-pointer transition-colors"
                >
                  {t('ordersPage.viewDetails')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
