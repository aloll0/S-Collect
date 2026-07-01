import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface OrderFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSortToggle: () => void;
  sortNewest: boolean;
}

export const OrderFilters = ({
  activeTab,
  onTabChange,
  onSortToggle,
  sortNewest,
}: OrderFiltersProps) => {
  const { t } = useTranslation();

  const FILTER_TABS = [
    { key: 'allOrders', label: t('ordersPage.allOrders') },
    { key: 'Pending', label: t('ordersPage.pending') },
    { key: 'Processing', label: t('ordersPage.processing') },
    { key: 'Shipped', label: t('ordersPage.shipped') },
    { key: 'Delivered', label: t('ordersPage.delivered') },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'text-white'
                : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {/* Active tab background with smooth layout animation */}
            {activeTab === tab.key && (
              <motion.div
                layoutId="orders-active-tab"
                className="absolute inset-0 bg-gray-900 rounded-lg"
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 35,
                  mass: 0.8,
                }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-xs">{t('ordersPage.sortBy')}:</span>

        <select
          value={sortNewest ? 'newest' : 'oldest'}
          onChange={onSortToggle}
          className="flex w-full items-center justify-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer sm:w-fit"
        >
          <option value="newest">{t('ordersPage.newestFirst')}</option>
          <option value="oldest">{t('ordersPage.oldestFirst')}</option>
        </select>
      </div>
    </div>
  );
};