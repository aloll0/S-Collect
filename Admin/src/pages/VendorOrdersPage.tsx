import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useVendorStore } from '../features/vendors/vendorStore';
import SuspendVendorModal from '../features/vendors/SuspendVendorModal';
import ActivateVendorModal from '../features/vendors/ActivateVendorModal';

const ITEMS_PER_PAGE = 7;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 16 } },
};

export interface VendorOrderItem {
  id: string;
  customer: string;
  vendorName: string;
  total: number;
  status: 'delivered' | 'canceled' | 'shipped';
  subOrders: number;
  date: string;
}

const ORDER_STATUS_STYLES: Record<
  VendorOrderItem['status'],
  { label: string; className: string }
> = {
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-700' },
  canceled: { label: 'Canceled', className: 'bg-red-100 text-red-600' },
  shipped: { label: 'Shipped', className: 'bg-amber-100 text-amber-700' },
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function VendorOrdersPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const vendors = useVendorStore((s) => s.vendors);
  const suspendVendor = useVendorStore((s) => s.suspendVendor);
  const activateVendor = useVendorStore((s) => s.activateVendor);

  const vendorId = id ? parseInt(id, 10) : NaN;
  const vendor = vendors.find((v) => v.id === vendorId);

  const [showSuspend, setShowSuspend] = useState(false);
  const [showActivate, setShowActivate] = useState(false);

  const allOrders: VendorOrderItem[] = useMemo(
    () => [
      {
        id: '#ORD-77492-CS',
        customer: 'Yousef Al-Harbi',
        vendorName: vendor?.businessName || 'Al-Falah Crafts',
        total: 450,
        status: 'delivered',
        subOrders: 12,
        date: 'Oct 24, 2026',
      },
      {
        id: '#ORD-77491-CS',
        customer: 'Layan Mansour',
        vendorName: vendor?.businessName || 'Desert Bloom',
        total: 1200,
        status: 'delivered',
        subOrders: 5,
        date: 'Oct 24, 2026',
      },
      {
        id: '#ORD-77490-CS',
        customer: 'Fahad Al-Otaibi',
        vendorName: vendor?.businessName || 'Oasis Tech',
        total: 85,
        status: 'canceled',
        subOrders: 20,
        date: 'Oct 24, 2026',
      },
      {
        id: '#ORD-77489-CS',
        customer: 'Sarah Khalid',
        vendorName: vendor?.businessName || 'Red Sea Styles',
        total: 320,
        status: 'shipped',
        subOrders: 11,
        date: 'Oct 24, 2026',
      },
      {
        id: '#ORD-77488-CS',
        customer: 'Abdulrahman Ali',
        vendorName: vendor?.businessName || 'Dates & Co',
        total: 150,
        status: 'delivered',
        subOrders: 2,
        date: 'Oct 24, 2026',
      },
      {
        id: '#ORD-77487-CS',
        customer: 'Reem Abdullah',
        vendorName: vendor?.businessName || 'Urban Elegance',
        total: 550,
        status: 'shipped',
        subOrders: 4,
        date: 'Oct 24, 2026',
      },
      {
        id: '#ORD-77486-CS',
        customer: 'Khaled Al-Saeed',
        vendorName: vendor?.businessName || 'Beauty Lab',
        total: 240,
        status: 'delivered',
        subOrders: 3,
        date: 'Oct 24, 2026',
      },
      {
        id: '#ORD-77485-CS',
        customer: 'Mona Al-Ghamdi',
        vendorName: vendor?.businessName || 'Urban Elegance',
        total: 890,
        status: 'delivered',
        subOrders: 6,
        date: 'Oct 23, 2026',
      },
      {
        id: '#ORD-77484-CS',
        customer: 'Tariq Al-Zahrani',
        vendorName: vendor?.businessName || 'Urban Elegance',
        total: 340,
        status: 'shipped',
        subOrders: 1,
        date: 'Oct 23, 2026',
      },
      {
        id: '#ORD-77483-CS',
        customer: 'Haya Al-Rashid',
        vendorName: vendor?.businessName || 'Urban Elegance',
        total: 1120,
        status: 'canceled',
        subOrders: 8,
        date: 'Oct 22, 2026',
      },
    ],
    [vendor?.businessName]
  );

  const [fromDate, setFromDate] = useState('2024-01-01');
  const [toDate, setToDate] = useState('2026-12-31');
  const [appliedFrom, setAppliedFrom] = useState(fromDate);
  const [appliedTo, setAppliedTo] = useState(toDate);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return allOrders.filter((o) => {
      const oDate = new Date(o.date);

      if (appliedFrom) {
        const from = new Date(appliedFrom);
        from.setHours(0, 0, 0, 0);
        if (!isNaN(oDate.getTime()) && oDate < from) return false;
      }

      if (appliedTo) {
        const to = new Date(appliedTo);
        to.setHours(23, 59, 59, 999);
        if (!isNaN(oDate.getTime()) && oDate > to) return false;
      }

      if (statusFilter !== 'all' && o.status !== statusFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.vendorName.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [allOrders, appliedFrom, appliedTo, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const totalRevenue = filtered.reduce((s, o) => s + o.total, 0);
  const activeOrdersCount = filtered.filter((o) => o.status === 'shipped').length;

  const allSelected =
    paginated.length > 0 && paginated.every((o) => selectedIds.includes(o.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginated.some((o) => o.id === id)));
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...paginated.map((o) => o.id).filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const toggleSelect = (orderId: string) => {
    setSelectedIds((prev) =>
      prev.includes(orderId) ? prev.filter((i) => i !== orderId) : [...prev, orderId]
    );
  };

  const handleFilter = () => {
    setAppliedFrom(fromDate);
    setAppliedTo(toDate);
    setPage(1);
  };

  const handleReset = () => {
    setFromDate('2024-01-01');
    setToDate('2026-12-31');
    setAppliedFrom('2024-01-01');
    setAppliedTo('2026-12-31');
    setStatusFilter('all');
    setSearch('');
    setPage(1);
  };

  if (!vendor) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-40 text-center">
        <p className="text-gray-500 text-sm">Vendor not found.</p>
        <button
          onClick={() => navigate('/vendors')}
          className="text-sm underline text-gray-600 cursor-pointer"
        >
          Back to Vendors
        </button>
      </div>
    );
  }

  const initials = getInitials(vendor.businessName);
  const isActive = vendor.active !== false;

  return (
    <>
      {/* ── Page Header ── */}
      <div className="sidebar-page-container flex items-center justify-between mb-6 bg-gray-50 pt-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Vendor Management</h1>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Link to="/vendors" className="hover:text-gray-600 transition-colors">
              Vendor Management
            </Link>
            <span className="text-gray-300">››</span>
            <Link to={`/vendors/${vendorId}`} className="hover:text-gray-600 transition-colors">
              Vendor Details
            </Link>
            <span className="text-gray-300">››</span>
            <span className="text-gray-500 font-medium">Orders Log</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {isActive ? (
            <button
              onClick={() => setShowSuspend(true)}
              className="px-4 py-2 rounded-lg border border-red-300 text-red-600 bg-white text-xs font-semibold hover:bg-red-50 transition-colors shadow-sm"
            >
              Suspend Vendor
            </button>
          ) : (
            <button
              onClick={() => setShowActivate(true)}
              className="px-4 py-2 rounded-lg border border-green-300 text-green-700 bg-white text-xs font-semibold hover:bg-green-50 transition-colors shadow-sm"
            >
              Activate Vendor
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <motion.div
        className="sidebar-page-container flex-1 overflow-y-auto pt-0 pb-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Vendor Header Card */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-xl bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold text-center leading-tight flex-shrink-0">
            {initials.length > 1 ? (
              <>
                {vendor.businessName.split(' ')[0]}
                <br />
                {vendor.businessName.split(' ')[1] || ''}
              </>
            ) : (
              vendor.businessName
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-gray-900">
                {vendor.businessName}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {vendor.category} {vendor.joinedDate ? `• Joined ${vendor.joinedDate}` : ''}
            </p>
          </div>
        </motion.div>

        {/* 3 Stat Cards Row */}
        <motion.div
          variants={cardVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5"
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium mb-3">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">
              {(vendor.orders ?? filtered.length).toLocaleString('en-US')}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium mb-3">Total Order Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              {(vendor.revenue ?? totalRevenue).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              <span className="text-xs font-normal text-green-600">SAR</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium mb-3">Shipped Orders</p>
            <p className="text-2xl font-bold text-amber-500">
              {activeOrdersCount}
            </p>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex items-end gap-4 flex-wrap"
        >
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Search</label>
            <input
              type="text"
              placeholder="Order ID, Customer, Vendor..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-xs text-gray-700 outline-none focus:border-gray-400 transition-colors bg-gray-50/50"
            />
          </div>
          <div className="w-[140px]">
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-xs text-gray-700 outline-none focus:border-gray-400 transition-colors bg-gray-50/50"
            >
              <option value="all">All Statuses</option>
              <option value="delivered">Delivered</option>
              <option value="shipped">Shipped</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-xs text-gray-700 outline-none focus:border-gray-400 transition-colors bg-gray-50/50"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-xs text-gray-700 outline-none focus:border-gray-400 transition-colors bg-gray-50/50"
            />
          </div>
          <button
            onClick={handleFilter}
            className="h-10 px-6 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            Filter
          </button>
          <button
            onClick={handleReset}
            className="h-10 px-4 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            Reset
          </button>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100/70 border-b border-gray-100">
                  <th className="w-10 px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="accent-black w-4 h-4 cursor-pointer rounded"
                    />
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    Order ID
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    Customer
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    Vendor
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    Total (SAR)
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    Sub-orders
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-xs text-gray-400">
                      No orders found for the applied filter.
                    </td>
                  </tr>
                ) : (
                  paginated.map((order) => {
                    const style = ORDER_STATUS_STYLES[order.status];
                    const isSelected = selectedIds.includes(order.id);
                    return (
                      <tr
                        key={order.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-indigo-50/40' : 'hover:bg-gray-50/60'
                        }`}
                      >
                        <td className="w-10 px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(order.id)}
                            className="accent-black w-4 h-4 cursor-pointer rounded"
                          />
                        </td>
                        <td className="px-5 py-4 font-bold text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-5 py-4 text-gray-700 font-medium">
                          {order.customer}
                        </td>
                        <td className="px-5 py-4 text-gray-400 font-medium">
                          {order.vendorName}
                        </td>
                        <td className="px-5 py-4 font-bold text-gray-900">
                          {order.total.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{' '}
                          SAR
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-[11px] font-medium ${style.className}`}
                          >
                            {style.label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 font-medium">
                          {order.subOrders}
                        </td>
                        <td className="px-5 py-4 text-gray-500 font-medium">
                          {order.date}
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => navigate(`/incoming-orders/${order.id.replace('#', '')}`)}
                            className="text-blue-600 font-medium hover:underline cursor-pointer text-xs"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} items
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                    n === safePage
                      ? 'bg-black text-white font-bold'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                &gt;
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <SuspendVendorModal
        isOpen={showSuspend}
        vendorName={vendor.businessName}
        onConfirm={(reason) => {
          suspendVendor(vendorId, reason);
          setShowSuspend(false);
        }}
        onCancel={() => setShowSuspend(false)}
      />
      <ActivateVendorModal
        isOpen={showActivate}
        vendorName={vendor.businessName}
        onConfirm={() => {
          activateVendor(vendorId);
          setShowActivate(false);
        }}
        onCancel={() => setShowActivate(false)}
      />
    </>
  );
}
