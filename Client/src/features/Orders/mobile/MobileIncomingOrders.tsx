// features/Orders/mobile/MobileIncomingOrders.tsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Order, OrderStatus } from '../types/order';
import { FAKE_ORDERS } from '../data/orders/fakeOrders';
import { TrackingModal } from '../components/TrackingModal';
import { MobileOrderCard } from './MobileOrderCard';
import { MobileOrderDetails } from './MobileOrderDetails';
import { MobileToast } from './MobileToast';

const ITEMS_PER_PAGE = 8;

const FILTER_TABS = [
  { key: 'allOrders', label: 'ordersPage.allOrders' },
  { key: 'Pending', label: 'ordersPage.pending' },
  { key: 'Processing', label: 'ordersPage.processing' },
  { key: 'Shipped', label: 'ordersPage.shipped' },
  { key: 'Delivered', label: 'ordersPage.delivered' },
];

type ToastState = {
  type: 'success' | 'warning';
  message: string;
  description?: string;
} | null;

const MobileIncomingOrders = () => {
  const { t } = useTranslation();

  const [orders, setOrders] = useState<Order[]>(FAKE_ORDERS);
  const [activeTab, setActiveTab] = useState('allOrders');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingModal, setTrackingModal] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const filtered = useMemo(() => {
    return orders.filter(
      (o) => activeTab === 'allOrders' || o.status === activeTab
    );
  }, [orders, activeTab]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const totalItems = filtered.length;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const showToast = (t: ToastState) => {
    setToast(t);
    setTimeout(() => setToast(null), 4000);
  };

  const applyStatusChange = (
    orderId: string,
    newStatus: OrderStatus,
    tracking: string
  ) => {
    const isShipped = newStatus === 'Shipped';

    // Warn if shipped without tracking
    if (isShipped && !tracking) {
      showToast({
        type: 'warning',
        message: t('ordersPage.orderStatus', 'Order Status'),
        description: t(
          'ordersPage.trackingWarning',
          "Continuing without a tracking number. It's recommended to add one to improve the buyer's experience and enable shipment tracking."
        ),
      });
    } else {
      showToast({
        type: 'success',
        message: t('ordersPage.orderStatus', 'Order Status'),
        description: t(
          'ordersPage.statusUpdatedSuccessfully',
          'Order status updated successfully'
        ),
      });
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              trackingNumber: tracking || o.trackingNumber,
            }
          : o
      )
    );
    setTrackingModal(null);

    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              trackingNumber: tracking || prev.trackingNumber,
            }
          : null
      );
    }
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === 'Shipped') {
      setTrackingModal(orderId);
    } else {
      applyStatusChange(orderId, newStatus, '');
    }
  };

  // Show order details view
  if (selectedOrder) {
    return (
      <MobileOrderDetails
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        onUpdateStatus={(id, status, tracking) =>
          applyStatusChange(id, status, tracking)
        }
      />
    );
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const start = totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const end = Math.min(currentPage * ITEMS_PER_PAGE, totalItems);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 px-4 pt-5 pb-6">
      {/* Tracking modal */}
      {trackingModal && (
        <TrackingModal
          onSave={(num) => applyStatusChange(trackingModal, 'Shipped', num)}
          onCancel={() => setTrackingModal(null)}
        />
      )}

      {/* Header */}
      <h1 className="text-xl font-bold text-gray-900 mb-4">
        {t('ordersPage.title', 'Incoming Orders')}
      </h1>

      {/* Toast */}
      {toast && (
        <div className="mb-4">
          <MobileToast
            type={toast.type}
            message={toast.message}
            description={toast.description}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Filter tabs — horizontally scrollable */}
      <div
        className="flex gap-2 overflow-x-auto mb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              activeTab === tab.key
                ? 'bg-gray-900 text-white'
                : 'border border-gray-200 text-gray-500 bg-white hover:bg-gray-50'
            }`}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <svg
            width="56"
            height="56"
            fill="none"
            stroke="#ccc"
            strokeWidth="1.2"
            viewBox="0 0 24 24"
            className="mb-4"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <h2 className="text-base font-semibold text-gray-700 mb-1">
            {t('ordersPage.noOrders', 'No orders yet')}
          </h2>
          <p className="text-sm text-gray-400">
            {t(
              'ordersPage.noOrdersDesc',
              'They will appear here once you receive your first order'
            )}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {paginatedData.map((order) => (
            <MobileOrderCard
              key={order.id}
              order={order}
              onStatusChange={handleStatusChange}
              onViewDetails={setSelectedOrder}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-400">
            {t('ordersPage.showing', 'Showing')} {start}–{end}{' '}
            {t('ordersPage.of', 'of')} {totalItems}
          </span>
          {totalPages > 1 && (
            <div className="flex gap-1.5">
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium border transition-colors ${
                    n === currentPage
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileIncomingOrders;
