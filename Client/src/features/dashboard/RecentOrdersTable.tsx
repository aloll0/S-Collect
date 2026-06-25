type OrderStatus =
  | "Delivered"
  | "Shipped"
  | "Processing"
  | "Pending";

interface Order {
  id: string;
  date: string;
  customer: string;
  amount: string;
  status: OrderStatus;
}

const orders: Order[] = [
  {
    id: "#ORD-0012",
    date: "Jun 15, 2025",
    customer: "Sara Al-Ghamdi",
    amount: "SAR 540",
    status: "Delivered",
  },
  {
    id: "#ORD-0011",
    date: "Jun 14, 2025",
    customer: "Khalid Mansour",
    amount: "SAR 1,200",
    status: "Shipped",
  },
  {
    id: "#ORD-0010",
    date: "Jun 14, 2025",
    customer: "Layla Ibrahim",
    amount: "SAR 320",
    status: "Processing",
  },
  {
    id: "#ORD-0009",
    date: "Jun 13, 2025",
    customer: "Fahad Al-Harbi",
    amount: "SAR 890",
    status: "Pending",
  },
  {
    id: "#ORD-0009",
    date: "Jun 13, 2025",
    customer: "Fahad Al-Harbi",
    amount: "SAR 890",
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
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white h-[550px] ">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Recent Orders
        </h2>

        <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black">
          View All
          <span>→</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-t border-gray-200 bg-gray-50">
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500">
                ID
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500">
                Customer
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500">
                Amount
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-gray-200 transition-colors hover:bg-gray-50"
              >
                <td className="px-8 py-6 font-medium text-amber-700">
                  {order.id}
                </td>

                <td className="px-8 py-6 text-gray-500">
                  {order.date}
                </td>

                <td className="px-8 py-6 font-medium text-gray-900">
                  {order.customer}
                </td>

                <td className="px-8 py-6 text-gray-900">
                  {order.amount}
                </td>

                <td className="px-8 py-6">
                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-medium ${statusStyles[order.status]
                      }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-8 py-6">
                  <button className="font-medium text-gray-900 underline">
                    View
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

export default RecentOrdersTable;