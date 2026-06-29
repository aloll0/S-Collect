import { useTranslation } from 'react-i18next';
import type { FilterKey } from './constants';
import { FILTER_TABS } from './constants';

interface InventoryToolbarProps {
  search: string;
  activeTab: FilterKey;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: FilterKey) => void;
}

export const InventoryToolbar = ({
  search,
  activeTab,
  onSearchChange,
  onFilterChange,
}: InventoryToolbarProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="icon-stroke"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </span>
        <input
          type="text"
          placeholder={t('inventoryPage.search')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-3 py-2 text-body-md border border-gray-300 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:border-gray-600 w-48 placeholder:text-gray-400 transition-colors"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onFilterChange(tab.key)}
            className={`px-4 py-2 rounded-lg text-label-md transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'bg-gray-900 text-gray-50'
                : 'border border-gray-300 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>
    </div>
  );
};
