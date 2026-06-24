import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ArrowLeft, ChevronRight } from "lucide-react";

// ============================================================
// FAKE DATA — استبدلها بـ API call لما تستلم الباك إند
// ============================================================
const FAKE_ORDERS: Order[] = [
  {
    id: "ORD-8821", date: "Oct 24, 2024", customer: { name: "Amirah Al-Fahad", email: "amirah@gmail.com", phone: "+966 5XX XXX 111" },
    status: "Shipped", amount: 280, trackingNumber: "SA123456001",
    shippingAddress: "12 Prince Sultan Rd, Al Olaya, Riyadh 12211, Saudi Arabia",
    items: [{ name: "Cotton Summer Dress", variant: "Blue / M", sku: "DRS-001", qty: 2, unitPrice: 140, total: 280 }],
    subtotal: 280, shippingFee: 35, discount: 0, tax: 47.25, grandTotal: 362.25, paymentStatus: "Paid",
    timeline: [
      { step: "Order Placed",  desc: "Order received and confirmed",          date: "Oct 24, 2024 09:15 AM", done: true  },
      { step: "Processing",    desc: "Payment verified, order being prepared", date: "Oct 24, 2024 10:30 AM", done: true  },
      { step: "Shipped",       desc: "Handed to Aramex for delivery",          date: "Oct 25, 2024 02:00 PM", done: true  },
      { step: "Delivered",     desc: "Awaiting delivery confirmation",          date: "",                      done: false },
    ],
  },
  {
    id: "ORD-8820", date: "Oct 24, 2024", customer: { name: "Khalid Mansour", email: "khalid@gmail.com", phone: "+966 5XX XXX 222" },
    status: "Delivered", amount: 1450, trackingNumber: "SA123456002",
    shippingAddress: "55 King Abdullah Rd, Jeddah 21577, Saudi Arabia",
    items: [{ name: "Leather Tote Bag", variant: "Brown", sku: "ACC-442", qty: 1, unitPrice: 1450, total: 1450 }],
    subtotal: 1450, shippingFee: 0, discount: 100, tax: 202.5, grandTotal: 1552.5, paymentStatus: "Paid",
    timeline: [
      { step: "Order Placed",  desc: "Order received and confirmed",          date: "Oct 24, 2024 08:00 AM", done: true },
      { step: "Processing",    desc: "Payment verified, order being prepared", date: "Oct 24, 2024 09:00 AM", done: true },
      { step: "Shipped",       desc: "Handed to SMSA for delivery",            date: "Oct 25, 2024 11:00 AM", done: true },
      { step: "Delivered",     desc: "Package delivered successfully",          date: "Oct 26, 2024 03:00 PM", done: true },
    ],
  },
  {
    id: "ORD-8819", date: "Oct 23, 2024", customer: { name: "Sarah Johnson", email: "sarah@gmail.com", phone: "+966 5XX XXX 333" },
    status: "Pending", amount: 189, trackingNumber: "",
    shippingAddress: "7 Tahlia St, Al Rawdah, Jeddah 23431, Saudi Arabia",
    items: [{ name: "Graphic Cotton Tee", variant: "White / L", sku: "TSH-881", qty: 3, unitPrice: 63, total: 189 }],
    subtotal: 189, shippingFee: 35, discount: 0, tax: 33.6, grandTotal: 257.6, paymentStatus: "Paid",
    timeline: [
      { step: "Order Placed",  desc: "Order received and confirmed", date: "Oct 23, 2024 05:00 PM", done: true  },
      { step: "Processing",    desc: "Awaiting preparation",          date: "",                      done: false },
      { step: "Shipped",       desc: "",                               date: "",                      done: false },
      { step: "Delivered",     desc: "",                               date: "",                      done: false },
    ],
  },
  {
    id: "ORD-8818", date: "Oct 23, 2024", customer: { name: "Ahmed Qabbani", email: "ahmed@gmail.com", phone: "+966 5XX XXX 444" },
    status: "Shipped", amount: 245, trackingNumber: "SA123456004",
    shippingAddress: "3 Madinah Rd, Al Zahra, Jeddah 21462, Saudi Arabia",
    items: [{ name: "Wool Blend Sweater", variant: "Grey / S", sku: "SWT-112", qty: 1, unitPrice: 245, total: 245 }],
    subtotal: 245, shippingFee: 35, discount: 0, tax: 42, grandTotal: 322, paymentStatus: "Paid",
    timeline: [
      { step: "Order Placed",  desc: "Order received and confirmed",          date: "Oct 23, 2024 11:00 AM", done: true  },
      { step: "Processing",    desc: "Payment verified, order being prepared", date: "Oct 23, 2024 12:30 PM", done: true  },
      { step: "Shipped",       desc: "Handed to DHL for delivery",             date: "Oct 24, 2024 09:00 AM", done: true  },
      { step: "Delivered",     desc: "Awaiting delivery confirmation",          date: "",                      done: false },
    ],
  },
  {
    id: "ORD-8817", date: "Oct 22, 2024", customer: { name: "Laila Ibrahim", email: "laila@gmail.com", phone: "+966 5XX XXX 555" },
    status: "Delivered", amount: 520, trackingNumber: "SA123456005",
    shippingAddress: "90 Olaya St, Al Olaya, Riyadh 12211, Saudi Arabia",
    items: [{ name: "Formal Silk Shirt", variant: "White / XL", sku: "SHR-772", qty: 2, unitPrice: 260, total: 520 }],
    subtotal: 520, shippingFee: 35, discount: 50, tax: 75.75, grandTotal: 580.75, paymentStatus: "Paid",
    timeline: [
      { step: "Order Placed",  desc: "Order received and confirmed",          date: "Oct 22, 2024 01:00 PM", done: true },
      { step: "Processing",    desc: "Payment verified, order being prepared", date: "Oct 22, 2024 02:00 PM", done: true },
      { step: "Shipped",       desc: "Handed to Aramex for delivery",          date: "Oct 23, 2024 10:00 AM", done: true },
      { step: "Delivered",     desc: "Package delivered successfully",          date: "Oct 24, 2024 04:30 PM", done: true },
    ],
  },
  {
    id: "ORD-8816", date: "Oct 21, 2024", customer: { name: "Omar Saeed", email: "omar@gmail.com", phone: "+966 5XX XXX 666" },
    status: "Processing", amount: 380, trackingNumber: "",
    shippingAddress: "21 King Fahd Rd, Al Hamra, Riyadh 12271, Saudi Arabia",
    items: [{ name: "Classic Slim Jeans", variant: "Black / 32", sku: "JNS-205", qty: 2, unitPrice: 190, total: 380 }],
    subtotal: 380, shippingFee: 35, discount: 0, tax: 62.25, grandTotal: 477.25, paymentStatus: "Paid",
    timeline: [
      { step: "Order Placed",  desc: "Order received and confirmed",          date: "Oct 21, 2024 08:45 AM", done: true  },
      { step: "Processing",    desc: "Payment verified, order being prepared", date: "Oct 21, 2024 09:30 AM", done: true  },
      { step: "Shipped",       desc: "",                                        date: "",                      done: false },
      { step: "Delivered",     desc: "",                                        date: "",                      done: false },
    ],
  },
  {
    id: "ORD-8815", date: "Oct 21, 2024", customer: { name: "Noura Al-Zahrani", email: "noura@gmail.com", phone: "+966 5XX XXX 777" },
    status: "Shipped", amount: 95, trackingNumber: "SA123456007",
    shippingAddress: "14 Andalus St, Makkah 24231, Saudi Arabia",
    items: [{ name: "Denim Jacket", variant: "Light Blue / M", sku: "JKT-339", qty: 1, unitPrice: 95, total: 95 }],
    subtotal: 95, shippingFee: 35, discount: 0, tax: 19.5, grandTotal: 149.5, paymentStatus: "Paid",
    timeline: [
      { step: "Order Placed",  desc: "Order received and confirmed",          date: "Oct 21, 2024 06:00 PM", done: true  },
      { step: "Processing",    desc: "Payment verified, order being prepared", date: "Oct 21, 2024 07:00 PM", done: true  },
      { step: "Shipped",       desc: "Handed to SMSA for delivery",            date: "Oct 22, 2024 11:00 AM", done: true  },
      { step: "Delivered",     desc: "Awaiting delivery confirmation",          date: "",                      done: false },
    ],
  },
  {
    id: "ORD-8814", date: "Oct 20, 2024", customer: { name: "Zainab Ali", email: "zainab@gmail.com", phone: "+966 5XX XXX 888" },
    status: "Processing", amount: 1120, trackingNumber: "",
    shippingAddress: "5 Corniche Rd, Al Shati, Jeddah 21511, Saudi Arabia",
    items: [
      { name: "Leather Tote Bag",  variant: "Brown",      sku: "ACC-442", qty: 1, unitPrice: 620, total: 620 },
      { name: "Formal Silk Shirt", variant: "White / XL", sku: "SHR-772", qty: 2, unitPrice: 250, total: 500 },
    ],
    subtotal: 1120, shippingFee: 35, discount: 0, tax: 173.25, grandTotal: 1328.25, paymentStatus: "Paid",
    timeline: [
      { step: "Order Placed",  desc: "Order received and confirmed",          date: "Oct 20, 2024 03:00 PM", done: true  },
      { step: "Processing",    desc: "Payment verified, order being prepared", date: "Oct 20, 2024 04:00 PM", done: true  },
      { step: "Shipped",       desc: "",                                        date: "",                      done: false },
      { step: "Delivered",     desc: "",                                        date: "",                      done: false },
    ],
  },
  // Additional orders for testing pagination
  {
    id: "ORD-8813", date: "Oct 19, 2024", customer: { name: "Fatima Hassan", email: "fatima@gmail.com", phone: "+966 5XX XXX 999" },
    status: "Delivered", amount: 650, trackingNumber: "SA123456009",
    shippingAddress: "77 King Saud Rd, Riyadh 12345, Saudi Arabia",
    items: [{ name: "Running Sneakers", variant: "White / 42", sku: "SHOE-99", qty: 1, unitPrice: 650, total: 650 }],
    subtotal: 650, shippingFee: 0, discount: 0, tax: 97.5, grandTotal: 747.5, paymentStatus: "Paid",
    timeline: [
      { step: "Order Placed",  desc: "Order received and confirmed",          date: "Oct 19, 2024 10:00 AM", done: true },
      { step: "Processing",    desc: "Payment verified, order being prepared", date: "Oct 19, 2024 11:00 AM", done: true },
      { step: "Shipped",       desc: "Handed to Aramex for delivery",          date: "Oct 20, 2024 09:00 AM", done: true },
      { step: "Delivered",     desc: "Package delivered successfully",          date: "Oct 21, 2024 02:00 PM", done: true },
    ],
  },
  {
    id: "ORD-8812", date: "Oct 18, 2024", customer: { name: "Mohammed Al-Rashid", email: "mohammed@gmail.com", phone: "+966 5XX XXX 101" },
    status: "Pending", amount: 420, trackingNumber: "",
    shippingAddress: "88 Dammam Rd, Khobar 31952, Saudi Arabia",
    items: [{ name: "Classic Slim Jeans", variant: "Black / 32", sku: "JNS-205", qty: 2, unitPrice: 210, total: 420 }],
    subtotal: 420, shippingFee: 35, discount: 0, tax: 68.25, grandTotal: 523.25, paymentStatus: "Paid",
    timeline: [
      { step: "Order Placed",  desc: "Order received and confirmed", date: "Oct 18, 2024 02:00 PM", done: true  },
      { step: "Processing",    desc: "Awaiting preparation",          date: "",                      done: false },
      { step: "Shipped",       desc: "",                               date: "",                      done: false },
      { step: "Delivered",     desc: "",                               date: "",                      done: false },
    ],
  },
];
// ============================================================

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

interface OrderItem {
  name: string; variant: string; sku: string;
  qty: number; unitPrice: number; total: number;
}
interface TimelineStep {
  step: string; desc: string; date: string; done: boolean;
}
interface Order {
  id: string; date: string;
  customer: { name: string; email: string; phone: string };
  status: OrderStatus; amount: number; trackingNumber: string;
  shippingAddress: string; items: OrderItem[];
  subtotal: number; shippingFee: number; discount: number; tax: number; grandTotal: number;
  paymentStatus: string;
  timeline: TimelineStep[];
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending:    "bg-gray-100 text-gray-600",
  Processing: "bg-blue-100 text-blue-700",
  Shipped:    "bg-orange-100 text-orange-700",
  Delivered:  "bg-green-100 text-green-700",
};

const ALL_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered"];
const ITEMS_PER_PAGE = 8;

// ── Tracking Number Modal ─────────────────────────────────────
const TrackingModal = ({
  onSave,
  onCancel,
}: {
  onSave: (num: string) => void;
  onCancel: () => void;
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-[420px] shadow-xl text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <svg width="28" height="28" fill="none" stroke="#555" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {t("ordersPage.addTrackingNumber")}
        </h2>
        <p className="text-sm text-gray-400 mb-5">
          {t("ordersPage.trackingDescription")}
        </p>

        <input
          type="text"
          placeholder={t("ordersPage.trackingPlaceholder")}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:border-gray-400"
        />

        <div className="flex gap-3">
          <button
            onClick={() => onSave(value)}
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            {t("ordersPage.save")}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {t("ordersPage.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Empty State ───────────────────────────────────────────────
const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg width="64" height="64" fill="none" stroke="#ccc" strokeWidth="1.2" viewBox="0 0 24 24" className="mb-4">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        {t("ordersPage.noOrders")}
      </h2>
      <p className="text-sm text-gray-400">
        {t("ordersPage.noOrdersDesc")}
      </p>
    </div>
  );
};

// ── Order Details Page ────────────────────────────────────────
const OrderDetails = ({
  order,
  onBack,
  onUpdateStatus,
}: {
  order: Order;
  onBack: () => void;
  onUpdateStatus: (id: string, status: OrderStatus, tracking: string) => void;
}) => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [tracking, setTracking] = useState(order.trackingNumber);
  const [saved, setSaved] = useState(false);

  const handleUpdate = () => {
    onUpdateStatus(order.id, selectedStatus, tracking);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#f5f7fb]">
      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("ordersPage.orderDetails")}{" "}
            <span className="text-gray-500">#{order.id}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            {t("ordersPage.title")}
            <ChevronRight size={12} />
            {t("ordersPage.orderDetails")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-5 mt-5">
        {/* Left column */}
        <div className="flex flex-col gap-5">

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h5 className="font-semibold text-gray-900 mb-4">
              {t("ordersPage.orderItems")}
            </h5>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    t("addProduct.nameEn"),
                    t("addProduct.sizes"),
                    t("addProduct.sku"),
                    "Qty",
                    t("ordersPage.subtotal"),
                    t("ordersPage.grandTotal"),
                  ].map((h) => (
                    <th key={h} className="text-left rtl:text-right pb-2 text-xs text-gray-950 font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-none">
                    <td className="py-3 font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 text-gray-500">{item.variant}</td>
                    <td className="py-3 text-gray-400">{item.sku}</td>
                    <td className="py-3">{item.qty}</td>
                    <td className="py-3">SAR {item.unitPrice.toLocaleString()}</td>
                    <td className="py-3 font-medium">SAR {item.total.toLocaleString()}.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h5 className="font-semibold text-gray-900 mb-4">
              {t("ordersPage.orderTimeline")}
            </h5>
            <div className="flex flex-col gap-0">
              {order.timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        item.done
                          ? "bg-green-500 text-white"
                          : "border-2 border-gray-200 bg-white text-gray-300"
                      }`}
                    >
                      {item.done ? "✓" : ""}
                    </div>
                    {i < order.timeline.length - 1 && (
                      <div
                        className={`w-px flex-1 my-1 ${item.done ? "bg-green-300" : "bg-gray-200"}`}
                        style={{ minHeight: 24 }}
                      />
                    )}
                  </div>
                  <div className="pb-5 flex-1 flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-medium ${item.done ? "text-gray-900" : "text-gray-400"}`}>
                        {item.step}
                      </p>
                      {item.desc && (
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      )}
                    </div>
                    {item.date ? (
                      <p className="text-xs text-gray-400 ml-4 whitespace-nowrap">{item.date}</p>
                    ) : (
                      <p className="text-xs text-gray-300 ml-4">{t("ordersPage.pendingLabel")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">

          {/* Order Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-sm">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-semibold text-gray-900">
                {t("ordersPage.orderInformation")}
              </h5>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                {order.status}
              </span>
            </div>
            {[
              [t("ordersPage.orderId"),        `#${order.id}`],
              [t("ordersPage.orderDate"),       order.date],
              [t("ordersPage.paymentStatus"),   order.paymentStatus],
              [t("ordersPage.trackingNumber"),  order.trackingNumber || "—"],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-none">
                <span className="text-gray-400">{label}</span>
                <span
                  className={`font-medium ${
                    label === t("ordersPage.paymentStatus") ? "text-green-600" : "text-gray-700"
                  }`}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-sm">
            <h5 className="font-semibold text-gray-900 mb-3">
              {t("ordersPage.customerInformation")}
            </h5>
            {[
              [t("ordersPage.name"),  order.customer.name],
              [t("ordersPage.email"), order.customer.email],
              [t("ordersPage.phone"), order.customer.phone],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-none">
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-700 font-medium">{val}</span>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-sm">
            <h5 className="font-semibold text-gray-900 mb-2">
              {t("ordersPage.shippingAddress")}
            </h5>
            <p className="text-gray-500 leading-relaxed">{order.shippingAddress}</p>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-sm">
            <h5 className="font-semibold text-gray-900 mb-3">
              {t("ordersPage.orderSummary")}
            </h5>
            {[
              [t("ordersPage.subtotal"),    `SAR ${order.subtotal.toLocaleString()}.00`],
              [t("ordersPage.shippingFee"), `SAR ${order.shippingFee}.00`],
              [t("ordersPage.discount"),    `-SAR ${order.discount}.00`],
              [t("ordersPage.tax"),         `SAR ${order.tax.toFixed(2)}`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between py-1.5 text-gray-500">
                <span>{label}</span>
                <span>{val}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-1 border-t border-gray-100 font-semibold text-gray-900">
              <span>{t("ordersPage.grandTotal")}</span>
              <span>SAR {order.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Update Order Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-sm">
            <h5 className="font-semibold text-gray-900 mb-1">
              {t("ordersPage.updateOrderStatus")}
            </h5>
            <p className="text-xs text-gray-400 mb-3">
              {t("ordersPage.updateOrderStatusDesc")}
            </p>

            <div className="flex flex-wrap gap-2 mb-4 ">
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    selectedStatus === s
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {t(`ordersPage.${s.toLowerCase()}`)}
                </button>
              ))}
            </div>

            <label className="block text-xs text-gray-500 mb-1.5">
              {t("ordersPage.trackingOptional")}
            </label>
            <input
              type="text"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. SA123456789AE"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-gray-400"
            />

            <button
              onClick={handleUpdate}
              className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {t("ordersPage.updateButton")}
            </button>

            {saved && (
              <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-sm">
                <span className="text-green-500">✓</span>
                {t("ordersPage.updatedSuccessfully")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Orders Page ──────────────────────────────────────────
const IncomingOrders = () => {
  const { t } = useTranslation();

  const [orders, setOrders]             = useState<Order[]>(FAKE_ORDERS);
  const [activeTab, setActiveTab]       = useState<string>("allOrders");
  const [sortNewest, setSortNewest]     = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingModal, setTrackingModal] = useState<string | null>(null);
  const [currentPage, setCurrentPage]   = useState(1);

  const FILTER_TABS = [
    { key: "allOrders",  label: t("ordersPage.allOrders")  },
    { key: "Pending",    label: t("ordersPage.pending")    },
    { key: "Processing", label: t("ordersPage.processing") },
    { key: "Shipped",    label: t("ordersPage.shipped")    },
    { key: "Delivered",  label: t("ordersPage.delivered")  },
  ];

  const filtered = useMemo(() => {
    const list = orders.filter(
      (o) => activeTab === "allOrders" || o.status === activeTab
    );
    return sortNewest ? [...list] : [...list].reverse();
  }, [orders, activeTab, sortNewest]);

  // ── Pagination Logic ────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const totalItems = filtered.length;

  // Reset to page 1 when filter changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Get paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  // Generate page numbers
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === "Shipped") {
      setTrackingModal(orderId);
    } else {
      applyStatusChange(orderId, newStatus, "");
    }
  };

  const applyStatusChange = (orderId: string, newStatus: OrderStatus, tracking: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, trackingNumber: tracking || o.trackingNumber }
          : o
      )
    );
    setTrackingModal(null);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? { ...prev, status: newStatus, trackingNumber: tracking || prev.trackingNumber }
          : null
      );
    }
  };

  if (selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        onUpdateStatus={(id, status, tracking) => applyStatusChange(id, status, tracking)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#f5f7fb]">
      {trackingModal && (
        <TrackingModal
          onSave={(num) => applyStatusChange(trackingModal, "Shipped", num)}
          onCancel={() => setTrackingModal(null)}
        />
      )}

      <div className="mb-8">
        <h1 className="text-h5 font-bold">{t("ordersPage.title")}</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSortNewest((p) => !p)}
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-400 text-xs">{t("ordersPage.sortBy")}:</span>
            {sortNewest ? t("ordersPage.newestFirst") : t("ordersPage.oldestFirst")}
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Table / Empty */}
        {paginatedData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    t("ordersPage.orderId"),
                    t("ordersPage.orderDate"),
                    t("ordersPage.customerName"),
                    t("ordersPage.totalAmount"),
                    t("ordersPage.orderStatus"),
                    t("ordersPage.actions"),
                  ].map((h) => (
                    <th key={h} className="text-left rtl:text-right py-3 px-2 text-xs text-gray-950 font-bold">
                      {h}
                    </th> 
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-2 font-semibold text-gray-800">#{order.id}</td>
                    <td className="py-4 px-2 text-gray-500">{order.date}</td>
                    <td className="py-4 px-2 text-gray-700">{order.customer.name}</td>
                    <td className="py-4 px-2 font-medium text-gray-900">
                      {order.amount.toLocaleString()} SAR
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                          {t(`ordersPage.${order.status.toLowerCase()}`)}
                        </span>
                        <div className="relative">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
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
                        onClick={() => setSelectedOrder(order)}
                        className="text-sm font-medium text-gray-900 underline underline-offset-2 hover:text-gray-500 cursor-pointer  transition-colors"
                      >
                        {t("ordersPage.viewDetails")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {t("ordersPage.showing")} {(currentPage - 1) * ITEMS_PER_PAGE + 1} – {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} {t("ordersPage.of")} {totalItems} {t("ordersPage.results")}
                </span>
                <div className="flex gap-1">
                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      onClick={() => setCurrentPage(n)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium border transition-colors ${
                        n === currentPage
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* If only 1 page, show info bar */}
            {totalPages <= 1 && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  {t("ordersPage.showing")} 1 – {totalItems} {t("ordersPage.of")} {totalItems} {t("ordersPage.results")}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IncomingOrders;