import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TrackingModalProps {
  onSave: (num: string) => void;
  onCancel: () => void;
}

export const TrackingModal = ({ onSave, onCancel }: TrackingModalProps) => {
  const { t } = useTranslation();
  const [value, setValue] = useState('');

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-5 sm:p-8 w-full max-w-[420px] shadow-xl text-center">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="#555"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          {t('ordersPage.addTrackingNumber')}
        </h2>
        <p className="text-sm text-gray-400 mb-5">
          {t('ordersPage.trackingDescription')}
        </p>

        <input
          type="text"
          placeholder={t('ordersPage.trackingPlaceholder')}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-4 focus:outline-none focus:border-gray-400"
        />

        <div className="flex gap-3">
          <button
            onClick={() => onSave(value)}
            className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            {t('ordersPage.save')}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            {t('ordersPage.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};