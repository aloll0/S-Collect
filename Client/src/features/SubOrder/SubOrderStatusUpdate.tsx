import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import type { SubOrderStatus } from '../Orders/types/subOrder';

interface Props {
  currentStatus: SubOrderStatus;
  isPending: boolean;
  isSuccess: boolean;
  onUpdateStatus: (status: SubOrderStatus | null, tracking: string) => void;
}

const STATUS_LABEL: Record<SubOrderStatus, string> = {
  PENDING:    'Pending',
  PROCESSING: 'Processing',
  SHIPPED:    'Shipped',
  DELIVERED:  'Delivered',
  CANCELLED:  'Cancelled',
};

const STATUS_PILL: Record<SubOrderStatus, string> = {
  PENDING:    'border-gray-200 text-gray-600',
  PROCESSING: 'border-gray-200 text-gray-600',
  SHIPPED:    'border-gray-200 text-gray-600',
  DELIVERED:  'border-gray-200 text-gray-600',
  CANCELLED:  'border-gray-200 text-gray-600',
};

export const SubOrderStatusUpdate = ({
  currentStatus,
  isPending,
  isSuccess,
  onUpdateStatus,
}: Props) => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<SubOrderStatus | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  const activeSelectedStatus = selectedStatus ?? currentStatus;

  const handleUpdate = () => {
    onUpdateStatus(selectedStatus, trackingInput);
    setTrackingInput('');
    setSelectedStatus(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 text-sm">
      <h6 className="font-semibold text-gray-900 mb-0.5">{t('ordersPage.updateOrderStatus')}</h6>
      <p className="text-xs text-gray-400 mb-4">{t('ordersPage.updateOrderStatusDesc', 'Status changes are irreversible and cannot be undone.')}</p>

      {/* Status pill buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as SubOrderStatus[]).map((s) => {
          const isActive = activeSelectedStatus === s;
          return (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isActive
                  ? 'bg-gray-900 text-white border-gray-900'
                  : `${STATUS_PILL[s]} hover:bg-gray-50`
              }`}
            >
              {STATUS_LABEL[s]}
            </button>
          );
        })}
      </div>

      {/* Tracking */}
      <label className="block text-xs text-gray-500 mb-1.5">
        {t('ordersPage.trackingOptional', 'Tracking Number (Optional)')}
      </label>
      <input
        type="text"
        value={trackingInput}
        onChange={(e) => setTrackingInput(e.target.value)}
        placeholder="e.g. SPL123456789SA"
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-4 focus:outline-none focus:border-gray-400 transition-colors"
      />

      {/* Update button */}
      <button
        onClick={handleUpdate}
        disabled={isPending || (activeSelectedStatus === currentStatus && !trackingInput.trim())}
        className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={15} className="animate-spin" /> Updating…
          </span>
        ) : (
          t('ordersPage.updateButton', 'Update Order Status')
        )}
      </button>

      {/* Success feedback */}
      {isSuccess && (
        <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          {t('ordersPage.updatedSuccessfully', 'Order updated successfully.')}
        </div>
      )}
    </div>
  );
};
