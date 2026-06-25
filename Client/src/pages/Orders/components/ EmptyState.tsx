import { useTranslation } from 'react-i18next';

export const EmptyState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg
        width="64"
        height="64"
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
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        {t('ordersPage.noOrders')}
      </h2>
      <p className="text-sm text-gray-400">{t('ordersPage.noOrdersDesc')}</p>
    </div>
  );
};