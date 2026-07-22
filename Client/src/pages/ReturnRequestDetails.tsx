import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Circle, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { MOCK_RETURNS, type ReturnItem } from '../data/mockReturns';
import { StatusBadge } from './ReturnRequests';
import ApproveReturnModal from '../components/returns/ApproveReturnModal';
import RejectReturnModal from '../components/returns/RejectReturnModal';
import { getVendorSubOrderDetails, updateVendorSubOrderStatus } from '../services/returns';
import toast from 'react-hot-toast';

export default function ReturnRequestDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const decodedId = id ? decodeURIComponent(id) : '#RET-20240617-001';
  const foundItem = MOCK_RETURNS.find((r) => r.id === decodedId) || MOCK_RETURNS[0];

  const [item, setItem] = useState<ReturnItem>(foundItem);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [internalNote, setInternalNote] = useState('');

  // Smooth scroll to top & attempt API load when opening details
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let isMounted = true;
    async function loadSubOrder() {
      const rawId = decodedId.replace('#RET-', '');
      if (rawId && rawId.length >= 8) {
        try {
          const sub = await getVendorSubOrderDetails(rawId);
          if (isMounted && sub) {
            const firstProduct = sub.items[0] || {};
            setItem({
              id: `#RET-${sub.id.slice(0, 8).toUpperCase()}`,
              orderId: `#ORD-${sub.orderId.slice(0, 8).toUpperCase()}`,
              customerName: 'Customer',
              productTitle: firstProduct.productName || 'Order Product',
              productSku: firstProduct.productId || 'SKU-001',
              productVariant: firstProduct.variantLabel || 'Default',
              productQty: firstProduct.quantity || 1,
              productPrice: `SAR ${(firstProduct.lineTotal || 0).toFixed(2)}`,
              productImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=150',
              reason: sub.statusOverrideReason || "Item doesn't fit",
              requestedDate: new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: sub.status === 'DELIVERED' ? 'COMPLETED' : sub.status === 'CANCELLED' ? 'REJECTED' : 'PENDING_REVIEW',
            });
          }
        } catch (_err) {
          // Keep mock item on error
        }
      }
    }
    loadSubOrder();
    return () => {
      isMounted = false;
    };
  }, [decodedId, id]);

  const handleApprove = async () => {
    // 1. Optimistic UI update (Instant execution)
    const prevStatus = item.status;
    setItem((prev) => ({ ...prev, status: 'APPROVED' }));
    setShowApproveModal(false);
    toast.success('Return Request Approved successfully');

    // 2. Background Network Sync
    try {
      const rawId = item.id.replace('#RET-', '');
      if (rawId.length >= 8) {
        await updateVendorSubOrderStatus(rawId, { status: 'DELIVERED' });
      }
    } catch (_e) {
      // If network fails, revert state
      setItem((prev) => ({ ...prev, status: prevStatus }));
      toast.error('Failed to sync status with server');
    }
  };

  const handleReject = async (reason: string) => {
    // 1. Optimistic UI update (Instant execution)
    const prevStatus = item.status;
    setItem((prev) => ({ ...prev, status: 'REJECTED' }));
    setShowRejectModal(false);
    toast.success(`Return Request Rejected: ${reason || 'Decision recorded'}`);

    // 2. Background Network Sync
    try {
      const rawId = item.id.replace('#RET-', '');
      if (rawId.length >= 8) {
        await updateVendorSubOrderStatus(rawId, { status: 'CANCELLED' });
      }
    } catch (_e) {
      // If network fails, revert state
      setItem((prev) => ({ ...prev, status: prevStatus }));
      toast.error('Failed to sync status with server');
    }
  };

  return (
    <>
    {/* Title & Breadcrumbs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className='sidebar-page-container-header bg-white'
      >
        <h1 className="heading-page-title font-bold text-gray-900">
          {t('returnsPage.title', { defaultValue: 'Return Requests' })}
        </h1>
        <div className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-gray-500 mt-1.5">
          <Link to="/returns" className="hover:text-gray-900 transition-colors font-medium">
            {t('returnsPage.title', { defaultValue: 'Return Requests' })}
          </Link>
          <ChevronRight size={16} className="text-gray-400 shrink-0" />
          <span className="text-gray-800 font-semibold">
            {t('returnsPage.breadcrumb', { defaultValue: 'Return Request Details' })} {item.id}
          </span>
        </div>
      </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="sidebar-page-container min-h-screen "
    >

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols on Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Card 1: Return Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              {t('returnsPage.returnSummary', { defaultValue: 'Return Summary' })}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-1">{t('returnsPage.returnId', { defaultValue: 'Return ID' })}</p>
                <p className="font-bold text-gray-900 font-mono text-sm sm:text-base">{item.id}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">{t('returnsPage.orderId', { defaultValue: 'Order ID' })}</p>
                <p className="font-semibold text-gray-700 font-mono">{item.orderId}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">{t('returnsPage.status', { defaultValue: 'Status' })}</p>
                <StatusBadge status={item.status} />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">{t('returnsPage.requestedDate', { defaultValue: 'Request Date' })}</p>
                <p className="font-medium text-gray-800">{item.requestedDate}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Product Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              {t('returnsPage.productInformation', { defaultValue: 'Product Information' })}
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={item.productImage}
                alt={item.productTitle}
                className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{item.productTitle}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <span>SKU: <strong className="text-gray-700">{item.productSku}</strong></span>
                  <span>•</span>
                  <span>Variant: <strong className="text-gray-700">{item.productVariant}</strong></span>
                  <span>•</span>
                  <span>Qty: <strong className="text-gray-700">{item.productQty}</strong></span>
                  <span>•</span>
                  <span className="font-bold text-gray-900 text-base">{item.productPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Return Reason */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-3">
              {t('returnsPage.returnReason', { defaultValue: 'Return Reason' })}: <span className="text-amber-600 font-bold">{item.reason}</span>
            </h2>
            {item.customerNote && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                {item.customerNote}
              </div>
            )}
          </div>

          {/* Card 4: Customer Uploaded Images */}
          {item.uploadedImages && item.uploadedImages.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                {t('returnsPage.uploadedImages', { defaultValue: 'Customer Uploaded Images (Product Condition)' })}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {item.uploadedImages.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt={`Condition ${i + 1}`}
                    className="w-full h-28 sm:h-32 rounded-xl object-cover border border-gray-200 shadow-xs hover:scale-[1.02] transition-transform cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Card 5: Internal Notes */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-3">
              {t('returnsPage.internalNotes', { defaultValue: 'Internal Notes (Only visible to you)' })}
            </h2>
            <textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder={t('returnsPage.notesPlaceholder', { defaultValue: 'Add notes about this return request...' })}
              className="w-full h-28 p-3.5 border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-gray-900 transition-colors resize-none bg-gray-50/50"
            />
          </div>
        </motion.div>

        {/* Right Column (1 Col on Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="space-y-6"
        >
          {/* Card 1: Customer Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900">
              {t('returnsPage.customerInformation', { defaultValue: 'Customer Information' })}
            </h2>
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-medium">Name</span>
                <span className="font-bold text-gray-900">{item.customerName}</span>
              </div>
              {item.customerEmail && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">{t('returnsPage.email', { defaultValue: 'Email' })}</span>
                  <span className="font-semibold text-gray-800 font-mono">{item.customerEmail}</span>
                </div>
              )}
              {item.customerPhone && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">{t('returnsPage.phone', { defaultValue: 'Phone' })}</span>
                  <span className="font-semibold text-gray-800 dir-ltr">{item.customerPhone}</span>
                </div>
              )}
              {item.shippingAddress && (
                <div className="pt-3 border-t border-gray-100">
                  <span className="text-gray-400 font-medium block mb-1">{t('returnsPage.shippingAddress', { defaultValue: 'Shipping Address' })}</span>
                  <p className="text-gray-700 whitespace-pre-line text-xs sm:text-sm leading-relaxed">
                    {item.shippingAddress}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Return Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-4">
              {t('returnsPage.returnTimeline', { defaultValue: 'Return Timeline' })}
            </h2>
            <div className="space-y-5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {item.timeline?.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5 relative z-10">
                  <div className="shrink-0 mt-0.5 bg-white rounded-full">
                    {step.completed ? (
                      <CheckCircle2 size={22} className="text-emerald-600 fill-emerald-100" />
                    ) : step.active ? (
                      <Clock size={22} className="text-amber-500 fill-amber-50" />
                    ) : (
                      <Circle size={22} className="text-gray-300 fill-gray-50" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs sm:text-sm font-bold ${step.completed || step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.title}
                      </p>
                      {step.date && <span className="text-xs text-gray-400">{step.date}</span>}
                    </div>
                    {step.subtext && (
                      <p className="text-xs text-gray-500 mt-0.5">{step.subtext}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowRejectModal(true)}
              className="py-3 px-6 rounded-xl border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors cursor-pointer active:scale-95"
            >
              {t('returnsPage.rejectReturn', { defaultValue: 'Reject Return' })}
            </button>
            <button
              type="button"
              onClick={() => setShowApproveModal(true)}
              className="py-3 px-6 rounded-xl bg-gray-950 text-white text-sm font-bold hover:bg-gray-800 transition-colors cursor-pointer shadow-md active:scale-95"
            >
              {t('returnsPage.approveReturn', { defaultValue: 'Approve Return' })}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Fixed Sticky Action Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 flex items-center gap-3 shadow-lg">
        <button
          type="button"
          onClick={() => setShowRejectModal(true)}
          className="flex-1 py-3 px-4 rounded-xl border border-red-200 text-red-600 text-xs sm:text-sm font-bold hover:bg-red-50 transition-colors cursor-pointer active:scale-95"
        >
          {t('returnsPage.rejectReturn', { defaultValue: 'Reject Return' })}
        </button>
        <button
          type="button"
          onClick={() => setShowApproveModal(true)}
          className="flex-1 py-3 px-4 rounded-xl bg-gray-950 text-white text-xs sm:text-sm font-bold hover:bg-gray-800 transition-colors cursor-pointer shadow-md active:scale-95"
        >
          {t('returnsPage.approveReturn', { defaultValue: 'Approve Return' })}
        </button>
      </div>

      {/* Modals */}
      <ApproveReturnModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
        item={item}
      />
      <RejectReturnModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
        item={item}
      />
    </motion.div>
    </>
  );
}
