import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronsRight } from 'lucide-react';
import {
  type Order,
  type OrderStatus,
  STATUS_STYLES,
  ALL_STATUSES,
} from './Orders/types/order';

interface OrderDetailsProps {
  order: Order;
  onBack: () => void;
  onUpdateStatus: (id: string, status: OrderStatus, tracking: string) => void;
}

export const OrderDetails = ({
  order,
  onBack,
  onUpdateStatus,
}: OrderDetailsProps) => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(
    order.status
  );
  const [tracking, setTracking] = useState(order.trackingNumber);
  const [saved, setSaved] = useState(false);

  const handleUpdate = () => {
    onUpdateStatus(order.id, selectedStatus, tracking);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f5f7fb]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 mb-2">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
            {t('ordersPage.orderDetails')}{' '}
            <span className="text-gray-500">#{order.id}</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 flex-wrap">
            <span>{t('ordersPage.title')}</span>
            <ChevronsRight size={12} />
            <span>{t('ordersPage.orderDetails')}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 mt-5">
        {/* Left column */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <h5 className="font-semibold text-gray-900 mb-4">
              {t('ordersPage.orderItems')}
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      t('addProduct.nameEn'),
                      t('addProduct.sizes'),
                      t('addProduct.sku'),
                      'Qty',
                      t('ordersPage.subtotal'),
                      t('ordersPage.grandTotal'),
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left rtl:text-right pb-2 text-xs text-gray-950 font-bold"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 last:border-none"
                    >
                      <td className="py-3 font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="py-3 text-gray-500">{item.variant}</td>
                      <td className="py-3 text-gray-400">{item.sku}</td>
                      <td className="py-3">{item.qty}</td>
                      <td className="py-3">
                        SAR {item.unitPrice.toLocaleString()}
                      </td>
                      <td className="py-3 font-medium">
                        SAR {item.total.toLocaleString()}.00
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <h5 className="font-semibold text-gray-900 mb-4">
              {t('ordersPage.orderTimeline')}
            </h5>
            <div className="flex flex-col gap-0">
              {order.timeline.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        item.done
                          ? 'bg-green-500 text-white'
                          : 'border-2 border-gray-200 bg-white text-gray-300'
                      }`}
                    >
                      {item.done ? '✓' : ''}
                    </div>
                    {i < order.timeline.length - 1 && (
                      <div
                        className={`w-px flex-1 my-1 ${item.done ? 'bg-green-300' : 'bg-gray-200'}`}
                        style={{ minHeight: 24 }}
                      />
                    )}
                  </div>
                  <div className="pb-5 flex-1 flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-start">
                    <div>
                      <p
                        className={`text-sm font-medium ${item.done ? 'text-gray-900' : 'text-gray-400'}`}
                      >
                        {item.step}
                      </p>
                      {item.desc && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.desc}
                        </p>
                      )}
                    </div>
                    {item.date ? (
                      <p className="text-xs text-gray-400 sm:ml-4 sm:whitespace-nowrap">
                        {item.date}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-300 sm:ml-4">
                        {t('ordersPage.pendingLabel')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* Order Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 text-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-3">
              <h5 className="font-semibold text-gray-900">
                {t('ordersPage.orderInformation')}
              </h5>
              <span
                className={`w-fit px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[order.status]}`}
              >
                {order.status}
              </span>
            </div>
            {[
              [t('ordersPage.orderId'), `#${order.id}`],
              [t('ordersPage.orderDate'), order.date],
              [t('ordersPage.paymentStatus'), order.paymentStatus],
              [t('ordersPage.trackingNumber'), order.trackingNumber || '—'],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex justify-between gap-4 py-1.5 border-b border-gray-50 last:border-none"
              >
                <span className="text-gray-400">{label}</span>
                <span
                  className={`font-medium text-right ${
                    label === t('ordersPage.paymentStatus')
                      ? 'text-green-600'
                      : 'text-gray-700'
                  }`}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 text-sm">
            <h5 className="font-semibold text-gray-900 mb-3">
              {t('ordersPage.customerInformation')}
            </h5>
            {[
              [t('ordersPage.name'), order.customer.name],
              [t('ordersPage.email'), order.customer.email],
              [t('ordersPage.phone'), order.customer.phone],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex justify-between gap-4 py-1.5 border-b border-gray-50 last:border-none"
              >
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-700 font-medium text-right break-all">
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 text-sm">
            <h5 className="font-semibold text-gray-900 mb-2">
              {t('ordersPage.shippingAddress')}
            </h5>
            <p className="text-gray-500 leading-relaxed break-words">
              {order.shippingAddress}
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 text-sm">
            <h5 className="font-semibold text-gray-900 mb-3">
              {t('ordersPage.orderSummary')}
            </h5>
            {[
              [
                t('ordersPage.subtotal'),
                `SAR ${order.subtotal.toLocaleString()}.00`,
              ],
              [t('ordersPage.shippingFee'), `SAR ${order.shippingFee}.00`],
              [t('ordersPage.discount'), `-SAR ${order.discount}.00`],
              [t('ordersPage.tax'), `SAR ${order.tax.toFixed(2)}`],
            ].map(([label, val]) => (
              <div
                key={label}
                className="flex justify-between gap-4 py-1.5 text-gray-500"
              >
                <span>{label}</span>
                <span className="text-right">{val}</span>
              </div>
            ))}
            <div className="flex justify-between gap-4 pt-3 mt-1 border-t border-gray-100 font-semibold text-gray-900">
              <span>{t('ordersPage.grandTotal')}</span>
              <span className="text-right">
                SAR{' '}
                {order.grandTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Update Order Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 text-sm">
            <h5 className="font-semibold text-gray-900 mb-1">
              {t('ordersPage.updateOrderStatus')}
            </h5>
            <p className="text-xs text-gray-400 mb-3">
              {t('ordersPage.updateOrderStatusDesc')}
            </p>

            <div className="flex flex-wrap gap-2 mb-4 ">
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    selectedStatus === s
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {t(`ordersPage.${s.toLowerCase()}`)}
                </button>
              ))}
            </div>

            <label className="block text-xs text-gray-500 mb-1.5">
              {t('ordersPage.trackingOptional')}
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
              {t('ordersPage.updateButton')}
            </button>

            {saved && (
              <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-sm">
                <span className="text-green-500">✓</span>
                {t('ordersPage.updatedSuccessfully')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
