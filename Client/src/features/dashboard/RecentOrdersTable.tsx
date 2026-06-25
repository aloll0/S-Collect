import { useTranslation } from "react-i18next";

type OrderStatus =
  | "Delivered"
  | "Shipped"
  | "Processing"
  | "Pending";

interface Order {
  id: string;
  date: string;
  customer: string;
  amount: number;
  status: OrderStatus;
}

const orders: Order[] = [
  {
    id: "#ORD-0012",
    date: "Jun 15, 2025",
    customer: "Sara Al-Ghamdi",
    amount: 540,
    status: "Delivered",
  },
  {
    id: "#ORD-0011",
    date: "Jun 14, 2025",
    customer: "Khalid Mansour",
    amount: 1200,
    status: "Shipped",
  },
  {
    id: "#ORD-0010",
    date: "Jun 14, 2025",
    customer: "Layla Ibrahim",
    amount: 320,
    status: "Processing",
  },
  {
    id: "#ORD-0009",
    date: "Jun 13, 2025",
    customer: "Fahad Al-Harbi",
    amount: 890,
    status: "Pending",
  },
  {
    id: "#ORD-0009",
    date: "Jun 13, 2025",
    customer: "Fahad Al-Harbi",
    amount: 890,
    status: "Pending",
  },
];

const statusStyles: Record<OrderStatus, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-amber-100 text-amber-700",
  Pending: "bg-gray-100 text-gray-600",
};

const RecentOrdersTable = () => {
  const { t } = useTranslation();

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "Delivered":
        return t("ordersPage.delivered");
      case "Shipped":
        return t("ordersPage.shipped");
      case "Processing":
        return t("ordersPage.processing");
      case "Pending":
        return t("ordersPage.pending");
      default:
        return status;
    }
  };

  return (
    <>
      {/* Scoped animation styles matching your existing design system */}
      <style>{`
        @keyframes tableFadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tbl-animate-in {
          opacity: 0;
          animation: tableFadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white h-[550px]">
        {/* Header fades in first */}
        <div className="flex items-center justify-between px-8 py-6 tbl-animate-in">
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("recentOrders.title")}
          </h2>

          <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors">
            {t("recentOrders.viewAll")}
            <span className="inline-block rtl:rotate-180">→</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-t border-gray-200 bg-gray-50 tbl-animate-in" style={{ animationDelay: '100ms' }}>
                <th className="px-8 py-4 text-left rtl:text-right text-sm font-medium text-gray-500">
                  {t("recentOrders.table.id")}
                </th>
                <th className="px-8 py-4 text-left rtl:text-right text-sm font-medium text-gray-500">
                  {t("recentOrders.table.date")}
                </th>
                <th className="px-8 py-4 text-left rtl:text-right text-sm font-medium text-gray-500">
                  {t("recentOrders.table.customer")}
                </th>
                <th className="px-8 py-4 text-left rtl:text-right text-sm font-medium text-gray-500">
                  {t("recentOrders.table.amount")}
                </th>
                <th className="px-8 py-4 text-left rtl:text-right text-sm font-medium text-gray-500">
                  {t("recentOrders.table.status")}
                </th>
                <th className="px-8 py-4 text-left rtl:text-right text-sm font-medium text-gray-500">
                  {t("recentOrders.table.action")}
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => {
                const orderKey = order.id.replace("#", "").toLowerCase();
                return (
                  <tr
                    key={`${order.id}-${index}`}
                    className="border-t border-gray-200 transition-colors hover:bg-gray-50 tbl-animate-in"
                    // Stagger rows: header finishes at ~100ms, rows start at 200ms + 60ms each
                    style={{ animationDelay: `${200 + index * 60}ms` }}
                  >
                    <td className="px-8 py-6 font-medium text-amber-700">
                      {order.id}
                    </td>

                    <td className="px-8 py-6 text-gray-500">
                      {t(`recentOrders.orders.${orderKey}.date`, { defaultValue: order.date })}
                    </td>

                    <td className="px-8 py-6 font-medium text-gray-900">
                      {t(`recentOrders.orders.${orderKey}.customer`, { defaultValue: order.customer })}
                    </td>

                    <td className="px-8 py-6 text-gray-900">
                      {order.amount.toLocaleString()} {t("dashboardMetrics.unit.sar")}
                    </td>

                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${
                          statusStyles[order.status]
                        }`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>

                    <td className="px-8 py-6">
                      <button className="font-medium text-gray-900 underline hover:text-amber-700 transition-colors">
                        {t("recentOrders.table.view")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RecentOrdersTable;