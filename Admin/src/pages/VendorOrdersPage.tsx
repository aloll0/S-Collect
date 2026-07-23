import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useVendorStore } from '../features/vendors/vendorStore';
import { useVendorOrdersStore } from '../store/vendorOrdersStore';
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
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const vendors = useVendorStore((s) => s.vendors);
  const suspendVendor = useVendorStore((s) => s.suspendVendor);
  const activateVendor = useVendorStore((s) => s.activateVendor);

  const vendorId = id ? parseInt(id, 10) : NaN;
  const vendor = vendors.find((v) => v.id === vendorId);

  const [showSuspend, setShowSuspend] = useState(false);
  const [showActivate, setShowActivate] = useState(false);

  const ORDER_STATUS_STYLES: Record<
    VendorOrderItem['status'],
    { label: string; className: string }
  > = useMemo(() => ({
    delivered: { label: t('vendors.ordersLog.statusDelivered', 'Delivered'), className: 'bg-green-100 text-green-700' },
    canceled: { label: t('vendors.ordersLog.statusCanceled', 'Canceled'), className: 'bg-red-100 text-red-600' },
    shipped: { label: t('vendors.ordersLog.statusShipped', 'Shipped'), className: 'bg-amber-100 text-amber-700' },
  }), [t]);

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

  // ── Zustand: filter / pagination / selection state ────────────────────────
  const appliedFrom  = useVendorOrdersStore((s) => s.appliedFrom);
  const appliedTo    = useVendorOrdersStore((s) => s.appliedTo);
  const statusFilter = useVendorOrdersStore((s) => s.statusFilter);
  const search       = useVendorOrdersStore((s) => s.search);
  const page         = useVendorOrdersStore((s) => s.page);
  const selectedIds  = useVendorOrdersStore((s) => s.selectedIds);

  const setStatusFilter   = useVendorOrdersStore((s) => s.setStatusFilter);
  const setSearch         = useVendorOrdersStore((s) => s.setSearch);
  const setPage           = useVendorOrdersStore((s) => s.setPage);
  const applyFilter       = useVendorOrdersStore((s) => s.applyFilter);
  const resetStore        = useVendorOrdersStore((s) => s.reset);
  const toggleSelect      = useVendorOrdersStore((s) => s.toggleSelect);
  const toggleSelectAllFn = useVendorOrdersStore((s) => s.toggleSelectAll);

  // ── Local UI state: staging date inputs + modals + skeleton ────────────────
  const [fromDate, setFromDate] = useState(appliedFrom);
  const [toDate,   setToDate]   = useState(appliedTo);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [page, appliedFrom, appliedTo, statusFilter, search]);

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

  const toggleSelectAll = () => toggleSelectAllFn(paginated.map((o) => o.id));

  const handleFilter = () => applyFilter(fromDate, toDate);

  const handleReset = () => {
    const DEFAULT_FROM = '2024-01-01';
    const DEFAULT_TO   = '2026-12-31';
    setFromDate(DEFAULT_FROM);
    setToDate(DEFAULT_TO);
    resetStore();
  };

  if (!vendor) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-40 text-center">
        <p className="text-gray-500 text-sm">{t('vendors.details.vendorNotFound', 'Vendor not found.')}</p>
        <button
          onClick={() => navigate('/vendors')}
          className="text-sm underline text-gray-600 cursor-pointer"
        >
          {t('vendors.details.backToVendors', 'Back to Vendors')}
        </button>
      </div>
    );
  }

  const initials = getInitials(vendor.businessName);
  const isActive = vendor.active !== false;

  return (
    <>
      {/* ── Page Header ── */}
      <div className="sidebar-page-container flex items-center justify-between mb-6 bg-gray-50 pt-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">{t('vendors.ordersLog.pageTitle', 'Vendor Management')}</h1>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Link to="/vendors" className="hover:text-gray-600 transition-colors">
              {t('vendors.details.breadcrumbParent', 'Vendor Management')}
            </Link>
            <span className="text-gray-300">››</span>
            <Link to={`/vendors/${vendorId}`} className="hover:text-gray-600 transition-colors">
              {t('vendors.details.breadcrumbCurrent', 'Vendor Details')}
            </Link>
            <span className="text-gray-300">››</span>
            <span className="text-gray-500 font-medium">{t('vendors.ordersLog.breadcrumb', 'Orders Log')}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {isActive ? (
            <button
              onClick={() => setShowSuspend(true)}
              className="px-4 py-2 rounded-lg border border-red-300 text-red-600 bg-white text-xs font-semibold hover:bg-red-50 transition-colors shadow-sm"
            >
              {t('vendors.details.suspendVendor', 'Suspend Vendor')}
            </button>
          ) : (
            <button
              onClick={() => setShowActivate(true)}
              className="px-4 py-2 rounded-lg border border-green-300 text-green-700 bg-white text-xs font-semibold hover:bg-green-50 transition-colors shadow-sm"
            >
              {t('vendors.details.activateVendor', 'Activate Vendor')}
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
        dir={isRtl ? 'rtl' : 'ltr'}
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
                {isActive ? t('vendors.table.active', 'Active') : t('vendors.table.inactive', 'Inactive')}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              {vendor.category} {vendor.joinedDate ? `• ${t('vendors.details.joined', 'Joined')} ${vendor.joinedDate}` : ''}
            </p>
          </div>
        </motion.div>

        {/* 3 Stat Cards Row */}
        <motion.div
          variants={cardVariants}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5"
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium mb-3">{t('vendors.ordersLog.totalOrders', 'Total Orders')}</p>
            <p className="text-2xl font-bold text-gray-900">
              {(vendor.orders ?? filtered.length).toLocaleString('en-US')}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium mb-3">{t('vendors.ordersLog.totalRevenue', 'Total Order Revenue')}</p>
            <p className="text-2xl font-bold text-green-600">
              {(vendor.revenue ?? totalRevenue).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              <span className="text-xs font-normal text-green-600">SAR</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium mb-3">{t('vendors.ordersLog.shippedOrders', 'Shipped Orders')}</p>
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
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">{t('vendors.table.search', 'Search')}</label>
            <input
              type="text"
              placeholder={t('vendors.ordersLog.searchPlaceholder', 'Order ID, Customer, Vendor...')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-xs text-gray-700 outline-none focus:border-gray-400 transition-colors bg-gray-50/50"
            />
          </div>
          <div className="w-[140px]">
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">{t('vendors.table.statusFilter', 'Status')}</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-xs text-gray-700 outline-none focus:border-gray-400 transition-colors bg-gray-50/50"
            >
              <option value="all">{t('vendors.ordersLog.allStatuses', 'All Statuses')}</option>
              <option value="delivered">{t('vendors.ordersLog.statusDelivered', 'Delivered')}</option>
              <option value="shipped">{t('vendors.ordersLog.statusShipped', 'Shipped')}</option>
              <option value="canceled">{t('vendors.ordersLog.statusCanceled', 'Canceled')}</option>
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">{t('vendors.ordersLog.fromDate', 'From Date')}</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full h-10 border border-gray-200 rounded-xl px-3 text-xs text-gray-700 outline-none focus:border-gray-400 transition-colors bg-gray-50/50"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">{t('vendors.ordersLog.toDate', 'To Date')}</label>
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
            {t('vendors.ordersLog.filter', 'Filter')}
          </button>
          <button
            onClick={handleReset}
            className="h-10 px-4 rounded-xl border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            {t('vendors.ordersLog.reset', 'Reset')}
          </button>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
        >
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
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
                    {t('vendors.ordersLog.colOrderId', 'Order ID')}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    {t('vendors.ordersLog.colCustomer', 'Customer')}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    {t('vendors.ordersLog.colVendor', 'Vendor')}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    {t('vendors.ordersLog.colTotal', 'Total (SAR)')}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    {t('vendors.ordersLog.colStatus', 'Status')}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    {t('vendors.ordersLog.colSubOrders', 'Sub-orders')}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    {t('vendors.ordersLog.colDate', 'Date')}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-800">
                    {t('vendors.ordersLog.colActions', 'Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="w-10 px-4 py-4 text-center">
                        <div className="w-4 h-4 rounded bg-gray-200 animate-pulse mx-auto" />
                      </td>
                      <td className="px-5 py-4"><div className="w-24 h-4 rounded bg-gray-200 animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="w-28 h-3.5 rounded bg-gray-100 animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="w-24 h-3.5 rounded bg-gray-100 animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="w-20 h-4 rounded bg-gray-200 animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="w-16 h-5 rounded-full bg-gray-200 animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="w-8 h-3.5 rounded bg-gray-100 animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="w-20 h-3.5 rounded bg-gray-100 animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="w-16 h-3.5 rounded bg-gray-200 animate-pulse" /></td>
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-xs text-gray-400">
                      {t('vendors.ordersLog.noOrdersFound', 'No orders found for the applied filter.')}
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
                            {t('vendors.ordersLog.viewDetails', 'View details')}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="p-4 space-y-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="w-28 h-4 rounded bg-gray-200 animate-pulse" />
                    <div className="w-14 h-5 rounded-full bg-gray-200 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="w-24 h-3.5 rounded bg-gray-100 animate-pulse" />
                    <div className="w-20 h-3.5 rounded bg-gray-100 animate-pulse" />
                    <div className="w-28 h-3.5 rounded bg-gray-100 animate-pulse" />
                    <div className="w-16 h-3.5 rounded bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ))
            ) : paginated.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-10">
                {t('vendors.ordersLog.noOrdersFound', 'No orders found for the applied filter.')}
              </p>
            ) : (
              paginated.map((order) => {
                const style = ORDER_STATUS_STYLES[order.status];
                const isSelected = selectedIds.includes(order.id);
                return (
                  <div
                    key={order.id}
                    className={`p-4 space-y-2.5 transition-colors ${
                      isSelected ? 'bg-indigo-50/40' : 'bg-white'
                    }`}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(order.id)}
                          className="accent-black w-4 h-4 cursor-pointer rounded flex-shrink-0"
                        />
                        <span className="text-xs font-bold text-gray-900">{order.id}</span>
                      </div>
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${style.className}`}
                      >
                        {style.label}
                      </span>
                    </div>
                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-500 ps-6">
                      <p>
                        {t('vendors.ordersLog.customerLabel', 'Customer')}:{' '}
                        <span className="font-semibold text-gray-800">{order.customer}</span>
                      </p>
                      <p>
                        {t('vendors.ordersLog.dateLabel', 'Date')}:{' '}
                        <span className="font-semibold text-gray-800">{order.date}</span>
                      </p>
                      <p>
                        {t('vendors.ordersLog.vendorLabel', 'Vendor')}:{' '}
                        <span className="font-semibold text-gray-800">{order.vendorName}</span>
                      </p>
                      <p>
                        {t('vendors.ordersLog.subOrdersLabel', 'Sub-orders')}:{' '}
                        <span className="font-semibold text-gray-800">{order.subOrders}</span>
                      </p>
                      <p className="col-span-2">
                        {t('vendors.ordersLog.totalLabel', 'Total')}:{' '}
                        <span className="font-bold text-gray-900">
                          SAR{' '}
                          {order.total.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </p>
                    </div>
                    {/* View details */}
                    <div className="ps-6">
                      <button
                        onClick={() => navigate(`/incoming-orders/${order.id.replace('#', '')}`)}
                        className="text-blue-600 text-xs font-medium hover:underline"
                      >
                        {t('vendors.ordersLog.viewDetails', 'View details')} →
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {t('vendors.ordersLog.showingItems', {
                start: filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1,
                end: Math.min(safePage * ITEMS_PER_PAGE, filtered.length),
                total: filtered.length,
              })}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(Math.max(1, safePage - 1))}
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
                onClick={() => setPage(Math.min(totalPages, safePage + 1))}
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
