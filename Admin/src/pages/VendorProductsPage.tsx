import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useVendorStore } from '../features/vendors/vendorStore';
import { useVendorProductsStore } from '../store/vendorProductsStore';
import SuspendVendorModal from '../features/vendors/SuspendVendorModal';
import ActivateVendorModal from '../features/vendors/ActivateVendorModal';

const ITEMS_PER_PAGE = 5;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 16 } },
};

export interface VendorProductItem {
  name: string;
  category: string;
  price: number;
  status: 'active' | 'inactive';
  date: string;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function VendorProductsPage() {
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

  const allProducts: VendorProductItem[] = useMemo(
    () => [
      { name: 'Premium Cotton T-Shirt', category: 'Apparel', price: 120, status: 'active', date: 'Oct 24, 2026' },
      { name: 'Minimalist Sneakers', category: 'Footwear', price: 450, status: 'active', date: 'Oct 22, 2026' },
      { name: 'Denim Jacket', category: 'Apparel', price: 380, status: 'inactive', date: 'Oct 20, 2026' },
      { name: 'Casual Hoodie', category: 'Apparel', price: 210, status: 'active', date: 'Oct 18, 2026' },
      { name: 'Leather Wallet', category: 'Accessories', price: 150, status: 'active', date: 'Oct 15, 2026' },
      { name: 'Classic Sunglasses', category: 'Accessories', price: 290, status: 'active', date: 'Oct 12, 2026' },
      { name: 'Running Shoes', category: 'Footwear', price: 520, status: 'inactive', date: 'Oct 10, 2026' },
    ],
    []
  );

  // ── Zustand: filter / pagination state ───────────────────────────────────
  const appliedFrom  = useVendorProductsStore((s) => s.appliedFrom);
  const appliedTo    = useVendorProductsStore((s) => s.appliedTo);
  const statusFilter = useVendorProductsStore((s) => s.statusFilter);
  const search       = useVendorProductsStore((s) => s.search);
  const page         = useVendorProductsStore((s) => s.page);

  const setStatusFilter = useVendorProductsStore((s) => s.setStatusFilter);
  const setSearch       = useVendorProductsStore((s) => s.setSearch);
  const setPage         = useVendorProductsStore((s) => s.setPage);
  const applyFilter     = useVendorProductsStore((s) => s.applyFilter);
  const resetStore      = useVendorProductsStore((s) => s.reset);

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
    return allProducts.filter((p) => {
      const pDate = new Date(p.date);

      if (appliedFrom) {
        const from = new Date(appliedFrom);
        from.setHours(0, 0, 0, 0);
        if (!isNaN(pDate.getTime()) && pDate < from) return false;
      }

      if (appliedTo) {
        const to = new Date(appliedTo);
        to.setHours(23, 59, 59, 999);
        if (!isNaN(pDate.getTime()) && pDate > to) return false;
      }

      if (statusFilter !== 'all' && p.status !== statusFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const match = p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [allProducts, appliedFrom, appliedTo, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const activeProductsCount = filtered.filter((p) => p.status === 'active').length;
  const inactiveProductsCount = filtered.filter((p) => p.status === 'inactive').length;

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
            <span className="text-gray-500 font-medium">{t('vendors.productsLog.breadcrumb', 'Products Log')}</span>
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
            <p className="text-xs text-gray-400 font-medium mb-3">{t('vendors.productsLog.totalProducts', 'Total Products')}</p>
            <p className="text-2xl font-bold text-gray-900">
              {filtered.length.toLocaleString('en-US')}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium mb-3">{t('vendors.productsLog.activeProducts', 'Active Products')}</p>
            <p className="text-2xl font-bold text-green-600">
              {activeProductsCount}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium mb-3">{t('vendors.productsLog.inactiveProducts', 'Inactive / Out of Stock')}</p>
            <p className="text-2xl font-bold text-amber-500">
              {inactiveProductsCount}
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
              placeholder={t('vendors.productsLog.searchPlaceholder', 'Product Name or Category...')}
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
              <option value="active">{t('vendors.productsLog.statusActive', 'Active')}</option>
              <option value="inactive">{t('vendors.productsLog.statusInactive', 'Inactive')}</option>
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

        {/* Products Log Table */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
        >
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100/70 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-700">
                    {t('vendors.productsLog.colProductName', 'Product Name')}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-700">
                    {t('vendors.productsLog.colCategory', 'Category')}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-700">
                    {t('vendors.productsLog.colPrice', 'Price')}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-700">
                    {t('vendors.productsLog.colDate', 'Date')}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-700">
                    {t('vendors.productsLog.colStatus', 'Status')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="px-5 py-4"><div className="w-32 h-4 rounded bg-gray-200 animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="w-24 h-3.5 rounded bg-gray-100 animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="w-20 h-4 rounded bg-gray-200 animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="w-24 h-3.5 rounded bg-gray-100 animate-pulse" /></td>
                      <td className="px-5 py-4"><div className="w-16 h-5 rounded-full bg-gray-200 animate-pulse" /></td>
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-xs text-gray-400">
                      {t('vendors.productsLog.noProductsFound', 'No products found for the applied filter.')}
                    </td>
                  </tr>
                ) : (
                  paginated.map((product, idx) => (
                    <tr key={`${product.name}-${idx}`} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 font-bold text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-5 py-4 text-gray-500 font-medium">
                        {product.category}
                      </td>
                      <td className="px-5 py-4 text-gray-900 font-bold">
                        SAR{' '}
                        {product.price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-5 py-4 text-gray-500 font-medium">
                        {product.date}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-[11px] font-medium ${
                            product.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {product.status === 'active' ? t('vendors.productsLog.statusActive', 'Active') : t('vendors.productsLog.statusInactive', 'Inactive')}
                        </span>
                      </td>
                    </tr>
                  ))
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
                    <div className="w-32 h-4 rounded bg-gray-200 animate-pulse" />
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
                {t('vendors.productsLog.noProductsFound', 'No products found for the applied filter.')}
              </p>
            ) : (
              paginated.map((product, idx) => (
                <div
                  key={`${product.name}-${idx}`}
                  className="p-4 space-y-2.5 hover:bg-gray-50/40 transition-colors"
                >
                  {/* Top row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-gray-900 truncate">{product.name}</span>
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0 ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {product.status === 'active' ? t('vendors.productsLog.statusActive', 'Active') : t('vendors.productsLog.statusInactive', 'Inactive')}
                    </span>
                  </div>
                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-500">
                    <p>
                      {t('vendors.productsLog.categoryLabel', 'Category')}:{' '}
                      <span className="font-semibold text-gray-800">{product.category}</span>
                    </p>
                    <p>
                      {t('vendors.details.dateLabel', 'Date')}:{' '}
                      <span className="font-semibold text-gray-800">{product.date}</span>
                    </p>
                    <p className="col-span-2">
                      {t('vendors.productsLog.priceLabel', 'Price')}:{' '}
                      <span className="font-bold text-gray-900">
                        SAR{' '}
                        {product.price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              {t('vendors.productsLog.showingProducts', {
                start: filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1,
                end: Math.min(safePage * ITEMS_PER_PAGE, filtered.length),
                total: filtered.length,
              })}
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
