import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Order, OrderStatus } from '../../src/pages/Orders/types/order';
import { FAKE_ORDERS } from '../../src/pages/Orders/data/orders/fakeOrders';
import { OrderFilters } from '../../src/pages/Orders/components/OrderFilters';
import { OrdersTable } from '../../src/pages/Orders/components/OrdersTable';
import { Pagination } from '../../src/pages/Orders/components/Pagination';
import { EmptyState } from '../../src/pages/Orders/components/ EmptyState';
import { TrackingModal } from '../../src/pages/Orders/components/TrackingModal';
import { OrderDetails } from './OrderDetails';

const ITEMS_PER_PAGE = 8;

const IncomingOrders = () => {
  const { t } = useTranslation();

  const [orders, setOrders] = useState<Order[]>(FAKE_ORDERS);
  const [activeTab, setActiveTab] = useState<string>('allOrders');
  const [sortNewest, setSortNewest] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingModal, setTrackingModal] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const list = orders.filter(
      (o) => activeTab === 'allOrders' || o.status === activeTab
    );
    return sortNewest ? [...list] : [...list].reverse();
  }, [orders, activeTab, sortNewest]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const totalItems = filtered.length;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === 'Shipped') {
      setTrackingModal(orderId);
    } else {
      applyStatusChange(orderId, newStatus, '');
    }
  };

  const applyStatusChange = (
    orderId: string,
    newStatus: OrderStatus,
    tracking: string
  ) => {
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

  if (selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
        onUpdateStatus={(id, status, tracking) =>
          applyStatusChange(id, status, tracking)
        }
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#f5f7fb]">
      {trackingModal && (
        <TrackingModal
          onSave={(num) => applyStatusChange(trackingModal, 'Shipped', num)}
          onCancel={() => setTrackingModal(null)}
        />
      )}

      <div className="mb-6 sm:mb-8">
        <h1 className="text-h6 sm:text-h5 font-bold">
          {t('ordersPage.title')}
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        <OrderFilters
          activeTab={activeTab}
          onTabChange={handleTabChange}
          sortNewest={sortNewest}
          onSortToggle={() => setSortNewest((p) => !p)}
        />

        {paginatedData.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <OrdersTable
              orders={paginatedData}
              onStatusChange={handleStatusChange}
              onViewDetails={setSelectedOrder}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default IncomingOrders;
