import React from 'react';

export interface TableItem {
  id: string;
  code: string;
  customer: string;
  vendor?: string;
  orderId?: string;
  total: number;
  totalFormatted: string;
  status: string;
  subOrdersCount?: number;
  reason?: string;
  date: string;
}

interface OrdersTableProps {
  items: TableItem[];
  activeMainTab: 'allOrders' | 'refunds';
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onSelectOne: (id: string) => void;
  selectedAll: boolean;
  onViewDetails: (item: TableItem) => void;
}

export const StatusBadge = ({ status }: { status: string }) => {
  let badgeStyle = 'bg-gray-100 text-gray-700';

  if (status === 'Delivered' || status === 'Approved' || status === 'Paid') {
    badgeStyle = 'bg-emerald-100/70 text-emerald-700';
  } else if (status === 'Canceled' || status === 'Cancelled' || status === 'Rejected') {
    badgeStyle = 'bg-rose-100/70 text-rose-700';
  } else if (status === 'Shipped' || status === 'Pending') {
    badgeStyle = 'bg-amber-100/70 text-amber-700';
  } else if (status === 'Processing') {
    badgeStyle = 'bg-blue-100/70 text-blue-700';
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeStyle}`}>
      {status}
    </span>
  );
};

export const OrdersTable: React.FC<OrdersTableProps> = ({
  items,
  activeMainTab,
  selectedIds,
  onSelectAll,
  onSelectOne,
  selectedAll,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-white text-xs font-bold text-gray-900">
              <th className="py-4 px-4 text-start w-10">
                <input
                  type="checkbox"
                  checked={selectedAll}
                  onChange={onSelectAll}
                  className="rounded border-gray-300 text-gray-950 focus:ring-gray-950 cursor-pointer"
                />
              </th>
              <th className="py-4 px-4 text-start font-bold">
                {activeMainTab === 'allOrders' ? 'Order ID' : 'Refund ID'}
              </th>
              <th className="py-4 px-4 text-start font-bold">Customer</th>
              <th className="py-4 px-4 text-start font-bold">
                {activeMainTab === 'allOrders' ? 'Vendor' : 'Order ID'}
              </th>
              <th className="py-4 px-4 text-start font-bold">Total (SAR)</th>
              <th className="py-4 px-4 text-start font-bold">Status</th>
              <th className="py-4 px-4 text-start font-bold">
                {activeMainTab === 'allOrders' ? 'Sub-orders' : 'Reason'}
              </th>
              <th className="py-4 px-4 text-start font-bold">Date</th>
              <th className="py-4 px-4 text-start font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-4 px-4 text-start">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(item.id)}
                    onChange={() => onSelectOne(item.id)}
                    className="rounded border-gray-300 text-gray-950 focus:ring-gray-950 cursor-pointer"
                  />
                </td>
                <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">
                  {item.code}
                </td>
                <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                  {item.customer}
                </td>
                <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                  {activeMainTab === 'allOrders' ? item.vendor : item.orderId}
                </td>
                <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">
                  {item.totalFormatted}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge status={item.status} />
                </td>
                <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                  {activeMainTab === 'allOrders' ? item.subOrdersCount : item.reason}
                </td>
                <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                  {item.date}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onViewDetails(item)}
                    className="text-blue-600 font-semibold hover:underline text-sm cursor-pointer"
                  >
                    View details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
