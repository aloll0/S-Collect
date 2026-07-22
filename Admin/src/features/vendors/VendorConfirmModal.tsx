import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, PowerOff } from 'lucide-react';

interface VendorConfirmModalProps {
  isOpen: boolean;
  type: 'approve' | 'reject' | 'deactivate';
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function VendorConfirmModal({
  isOpen,
  type,
  count,
  onConfirm,
  onCancel,
}: VendorConfirmModalProps) {
  const { t } = useTranslation();

  const configs = {
    approve: {
      title: t('vendors.table.confirmApproveTitle'),
      message: t('vendors.table.confirmApproveMessage', { count }),
      icon: <CheckCircle size={24} className="text-green-600" strokeWidth={2} />,
      iconBg: 'bg-green-50',
      btnClass: 'bg-green-600 hover:bg-green-700',
    },
    reject: {
      title: t('vendors.table.confirmRejectTitle'),
      message: t('vendors.table.confirmRejectMessage', { count }),
      icon: <AlertTriangle size={24} className="text-red-500" strokeWidth={2} />,
      iconBg: 'bg-red-50',
      btnClass: 'bg-red-500 hover:bg-red-600',
    },
    deactivate: {
      title: t('vendors.table.confirmDeactivateTitle'),
      message: t('vendors.table.confirmDeactivateMessage', { count }),
      icon: <PowerOff size={24} className="text-amber-500" strokeWidth={2} />,
      iconBg: 'bg-amber-50',
      btnClass: 'bg-amber-500 hover:bg-amber-600',
    },
  };

  const cfg = configs[type];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${cfg.iconBg}`}
            >
              {cfg.icon}
            </div>

            <h2 className="text-base font-semibold text-gray-900 mb-1">
              {cfg.title}
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              {cfg.message}
            </p>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('vendors.table.cancel')}
              </button>
              <button
                onClick={onConfirm}
                className={`px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${cfg.btnClass}`}
              >
                {t('vendors.table.confirm')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
