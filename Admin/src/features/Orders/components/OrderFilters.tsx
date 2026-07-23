import { Search, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PortalDropdown from '../../../components/ui/PortalDropdown';

export interface OrderFiltersProps {
  activeMainTab: 'allOrders' | 'refunds';
  onMainTabChange: (tab: 'allOrders' | 'refunds') => void;
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  dateFilter: string;
  onDateFilterChange: (val: string) => void;
  vendorFilter: string;
  onVendorFilterChange: (val: string) => void;
}

export const OrderFilters = ({
  activeMainTab,
  onMainTabChange,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  vendorFilter,
  onVendorFilterChange,
}: OrderFiltersProps) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const vendorOptions = [
    'All',
    'Al-Falah Crafts',
    'Desert Bloom',
    'Oasis Tech',
    'Red Sea Styles',
    'Dates & Co',
    'Urban Elegance',
    'Beauty Lab',
  ];

  const dateOptions = [
    { key: 'last7Days', label: 'Last 7 Days' },
    { key: 'last30Days', label: 'Last 30 Days' },
    { key: 'thisMonth', label: 'This Month' },
    { key: 'thisYear', label: 'This Year' },
  ];

  return (
    <div>
      {/* Main Tab Toggle Buttons */}
      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => onMainTabChange('allOrders')}
          className={`px-4 py-2 rounded-xl text-body-sm font-bold transition-all cursor-pointer ${
            activeMainTab === 'allOrders'
              ? 'bg-gray-950 text-white shadow-sm'
              : 'bg-gray-200/60 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('ordersPage.allOrders', 'All Orders')}
        </button>
        <button
          type="button"
          onClick={() => onMainTabChange('refunds')}
          className={`px-4 py-2 rounded-xl text-body-sm font-bold transition-all cursor-pointer ${
            activeMainTab === 'refunds'
              ? 'bg-gray-950 text-white shadow-sm'
              : 'bg-gray-200/60 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t('ordersPage.refunds', 'Refunds')}
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${
              isRtl ? 'right-3.5' : 'left-3.5'
            }`}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              activeMainTab === 'allOrders'
                ? t('ordersPage.searchOrders', 'Search orders...')
                : t('ordersPage.searchRefunds', 'Search refunds...')
            }
            className={`w-full py-2 rounded-xl border border-gray-200 text-body-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-white ${
              isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
            }`}
          />
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:gap-3 shrink-0">
          {/* Status Dropdown */}
          <PortalDropdown
            minWidth={150}
            animate={false}
            menuClassName="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-50 py-1"
            trigger={({ isOpen, toggle }) => (
              <button
                type="button"
                onClick={toggle}
                className="flex items-center justify-between md:justify-start gap-2 py-2 px-3 rounded-xl border border-gray-200 text-body-sm text-gray-700 focus:outline-none hover:border-gray-300 transition-all bg-white cursor-pointer whitespace-nowrap w-full md:w-auto"
              >
                <span className="truncate">Status: {statusFilter}</span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          >
            {({ close }) => (
              <div>
                {(activeMainTab === 'allOrders'
                  ? ['All', 'Delivered', 'Canceled', 'Shipped', 'Pending', 'Processing']
                  : ['All', 'Pending', 'Approved', 'Rejected']
                ).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      onStatusFilterChange(st);
                      close();
                    }}
                    className={`w-full text-start px-3.5 py-2 text-xs font-medium transition-colors hover:bg-gray-50 cursor-pointer ${
                      statusFilter === st
                        ? 'bg-gray-100 text-gray-900 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {st === 'All' ? 'All' : st}
                  </button>
                ))}
              </div>
            )}
          </PortalDropdown>

          {/* Date Dropdown */}
          <PortalDropdown
            minWidth={165}
            animate={false}
            menuClassName="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-50 py-1"
            trigger={({ isOpen, toggle }) => {
              const currentLabel =
                dateOptions.find((d) => d.key === dateFilter)?.label || 'Last 30 Days';
              return (
                <button
                  type="button"
                  onClick={toggle}
                  className="flex items-center justify-between md:justify-start gap-2 py-2 px-3 rounded-xl border border-gray-200 text-body-sm text-gray-700 focus:outline-none hover:border-gray-300 transition-all bg-white cursor-pointer whitespace-nowrap w-full md:w-auto"
                >
                  <span className="truncate">Date: {currentLabel}</span>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              );
            }}
          >
            {({ close }) => (
              <div>
                {dateOptions.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => {
                      onDateFilterChange(d.key);
                      close();
                    }}
                    className={`w-full text-start px-3.5 py-2 text-xs font-medium transition-colors hover:bg-gray-50 cursor-pointer ${
                      dateFilter === d.key
                        ? 'bg-gray-100 text-gray-900 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            )}
          </PortalDropdown>

          {/* Vendor Dropdown */}
          <PortalDropdown
            minWidth={160}
            animate={false}
            menuClassName="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-50 py-1"
            trigger={({ isOpen, toggle }) => (
              <button
                type="button"
                onClick={toggle}
                className="flex items-center justify-between md:justify-start gap-2 py-2 px-3 rounded-xl border border-gray-200 text-body-sm text-gray-700 focus:outline-none hover:border-gray-300 transition-all bg-white cursor-pointer whitespace-nowrap w-full md:w-auto"
              >
                <span className="truncate">Vendor: {vendorFilter}</span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          >
            {({ close }) => (
              <div>
                {vendorOptions.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      onVendorFilterChange(v);
                      close();
                    }}
                    className={`w-full text-start px-3.5 py-2 text-xs font-medium transition-colors hover:bg-gray-50 cursor-pointer ${
                      vendorFilter === v
                        ? 'bg-gray-100 text-gray-900 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {v === 'All' ? 'All' : v}
                  </button>
                ))}
              </div>
            )}
          </PortalDropdown>
        </div>
      </div>
    </div>
  );
};
