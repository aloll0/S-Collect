// features/Orders/mobile/MobileOrderDetails.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, CircleCheckBig } from 'lucide-react';
import { type Order, type OrderStatus, STATUS_STYLES, ALL_STATUSES } from '../types/order';

interface MobileOrderDetailsProps {
  order: Order;
  onBack: () => void;
  onUpdateStatus: (id: string, status: OrderStatus, tracking: string) => void;
}

export const MobileOrderDetails = ({
  order,
  onBack,
  onUpdateStatus,
}: MobileOrderDetailsProps) => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [tracking, setTracking] = useState(order.trackingNumber ?? '');
  const [saved, setSaved] = useState(false);

  const handleUpdate = () => {
    onUpdateStatus(order.id, selectedStatus, tracking);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-3 bg-white border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>{t('ordersPage.title', 'Incoming Orders')}</span>
        </button>
        <span className="text-gray-300 text-sm">/</span>
        <span className="text-sm text-gray-400">{t('ordersPage.orderDetails', 'Details')}</span>
      </div>

      <div className="px-4 pt-4 pb-6 flex flex-col gap-4">
        {/* Order ID + status */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">#{order.id}</h1>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
            {order.status}
          </span>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">
            {t('ordersPage.orderInformation', 'Order Info')}
          </h2>
          {[
            [t('ordersPage.orderDate', 'Date'), order.date],
            [t('ordersPage.paymentStatus', 'Payment'), order.paymentStatus],
            [t('ordersPage.trackingNumber', 'Tracking'), order.trackingNumber || '—'],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 last:border-none text-sm">
              <span className="text-gray-400">{label}</span>
              <span className="font-medium text-gray-800 text-right">{val}</span>
            </div>
          ))}
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">
            {t('ordersPage.orderItems', 'Items')}
          </h2>
          <div className="flex flex-col gap-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-start text-sm">
                <div className="min-w-0 pr-3">
                  <p className="font-medium text-gray-900 leading-tight">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Qty: {item.qty}</p>
                </div>
                <p className="font-semibold text-gray-800 shrink-0">
                  SAR {item.total.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">
            {t('ordersPage.customerInformation', 'Customer')}
          </h2>
          <p className="text-sm font-semibold text-gray-800">{order.customer.name}</p>
          <p className="text-sm text-gray-400 mt-0.5">{order.customer.email}</p>
          {order.customer.phone && (
            <p className="text-sm text-gray-400 mt-0.5">{order.customer.phone}</p>
          )}
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-gray-900 mb-2">
            {t('ordersPage.shippingAddress', 'Shipping Address')}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">{order.shippingAddress}</p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-gray-900 mb-3">
            {t('ordersPage.orderSummary', 'Summary')}
          </h2>
          {[
            [t('ordersPage.subtotal', 'Subtotal'), `SAR ${order.subtotal.toLocaleString()}.00`],
            [t('ordersPage.shippingFee', 'Shipping'), `SAR ${order.shippingFee}.00`],
            [t('ordersPage.discount', 'Discount'), `-SAR ${order.discount}.00`],
            [t('ordersPage.tax', 'Tax (15% VAT)'), `SAR ${order.tax.toFixed(2)}`],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between py-1.5 text-sm text-gray-500">
              <span>{label}</span>
              <span>{val}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 mt-1 border-t border-gray-100 text-sm font-bold text-gray-900">
            <span>{t('ordersPage.grandTotal', 'Grand Total')}</span>
            <span>
              {order.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} SAR
            </span>
          </div>
        </div>

        {/* Update Status */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="text-sm font-bold text-gray-900 mb-1">
            {t('ordersPage.updateOrderStatus', 'Update Order Status')}
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            {t('ordersPage.updateOrderStatusDesc', 'Status changes are irreversible and cannot be undone.')}
          </p>

          {/* Status pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {ALL_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  selectedStatus === s
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {t(`ordersPage.${s.toLowerCase()}`)}
              </button>
            ))}
          </div>

          {/* Tracking input */}
          <label className="block text-xs text-gray-500 mb-1.5">
            {t('ordersPage.trackingOptional', 'Tracking Number (Optional)')}
          </label>
          <input
            type="text"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            placeholder="SA123456789AE"
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm mb-4 focus:outline-none focus:border-gray-500"
          />

          <button
            onClick={handleUpdate}
            className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors active:scale-[0.98]"
          >
            {t('ordersPage.updateButton', 'Update Order Status')}
          </button>

          {saved && (
            <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-sm">
              <CircleCheckBig size={16} className="shrink-0" />
              {t('ordersPage.updatedSuccessfully', 'Order updated successfully.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};