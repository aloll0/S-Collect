import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useVendorStore } from '../features/vendors/vendorStore';
import { VENDOR_MOCK_PAYOUTS, type MockPayout } from '../features/vendors/constant';
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

const PAYOUT_STATUS_STYLES: Record<
  MockPayout['status'],
  { label: string; className: string }
> = {
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
  accepted: { label: 'Completed', className: 'bg-green-100 text-green-700' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
  rejected: { label: 'Rejected', className: 'bg-red-100 text-red-700' },
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function VendorPayoutsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const vendors = useVendorStore((s) => s.vendors);
  const suspendVendor = useVendorStore((s) => s.suspendVendor);
  const activateVendor = useVendorStore((s) => s.activateVendor);

  const vendorId = id ? parseInt(id, 10) : NaN;
  const vendor = vendors.find((v) => v.id === vendorId);

  const [showSuspend, setShowSuspend] = useState(false);
  const [showActivate, setShowActivate] = useState(false);

  const allPayouts: MockPayout[] = VENDOR_MOCK_PAYOUTS[vendorId] ?? [];

  const [fromDate, setFromDate] = useState('2024-01-01');
  const [toDate, setToDate] = useState('2026-12-31');
  const [appliedFrom, setAppliedFrom] = useState(fromDate);
  const [appliedTo, setAppliedTo] = useState(toDate);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return allPayouts.filter((p) => {
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
        const match =
          p.id.toLowerCase().includes(q) ||
          p.referenceNumber.toLowerCase().includes(q) ||
          p.adminName.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [allPayouts, appliedFrom, appliedTo, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const totalAmount = filtered.reduce((s, p) => s + p.amount, 0);
  const pendingAmount = filtered
    .filter((p) => p.status === 'pending')
    .reduce((s, p) => s + p.amount, 0);
  const lastPayout = filtered.find((p) => p.status === 'completed' || p.status === 'accepted');

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
            <span className="text-gray-500 font-medium">Payouts Log</span>
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
            <p className="text-xs text-gray-400 font-medium mb-3">Total Payouts</p>
            <p className="text-2xl font-bold text-green-600">
              {totalAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              <span className="text-xs font-normal text-green-600">SAR</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium mb-3">Pending Amount</p>
            <p className="text-2xl font-bold text-amber-500">
              {pendingAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              <span className="text-xs font-normal text-amber-500">SAR</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium mb-3">Last Payout Date</p>
            <p className="text-2xl font-bold text-gray-900">
              {lastPayout?.date ?? 'Oct 15, 2024'}
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
              placeholder="Payout ID, Reference, Admin..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
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

        {/* Payouts Log Table */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100/70 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-700">
                    Payout ID
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-700">
                    Reference Number
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-700">
                    Admin Name
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-xs text-gray-400">
                      No payouts found for the applied filter.
                    </td>
                  </tr>
                ) : (
                  paginated.map((payout) => {
                    const style = PAYOUT_STATUS_STYLES[payout.status];
                    return (
                      <tr key={payout.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-4 font-bold text-amber-500">
                          {payout.id}
                        </td>
                        <td className="px-5 py-4 text-gray-500 font-medium">
                          {payout.date}
                        </td>
                        <td className="px-5 py-4 text-gray-900 font-bold">
                          SAR{' '}
                          {payout.amount.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-5 py-4 text-gray-400 font-medium">
                          {payout.referenceNumber}
                        </td>
                        <td className="px-5 py-4 text-gray-600 font-medium">
                          {payout.adminName}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-[11px] font-medium ${style.className}`}
                          >
                            {style.label}
                          </span>
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
              {Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} payouts
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
