import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Download, Calendar, DollarSign, ChevronDown, FileSpreadsheet, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import PortalDropdown from '../components/ui/PortalDropdown';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

interface TransactionItem {
  id: string;
  orderNo: string;
  date: string;
  buyerName: string;
  amount: number;
  paymentMethod: string;
  status: 'Captured' | 'Pending' | 'Failed' | 'Refunded';
  fatoorahRef: string;
}

const MOCK_TRANSACTIONS: TransactionItem[] = [
  { id: '1', orderNo: '#ORD-2024-089', date: '2024-10-24', buyerName: 'Mohammed Al-Rashid', amount: 12450, paymentMethod: 'Mada', status: 'Captured', fatoorahRef: 'MF-78432901' },
  { id: '2', orderNo: '#ORD-2024-088', date: '2024-10-24', buyerName: 'Sarah Al-Otaibi', amount: 8900, paymentMethod: 'Visa', status: 'Captured', fatoorahRef: 'MF-78432902' },
  { id: '3', orderNo: '#ORD-2024-087', date: '2024-10-23', buyerName: 'Abdulrahman Al-Saeed', amount: 15200, paymentMethod: 'Apple Pay', status: 'Captured', fatoorahRef: 'MF-78432903' },
  { id: '4', orderNo: '#ORD-2024-086', date: '2024-10-23', buyerName: 'Fatimah Al-Ghamdi', amount: 5640, paymentMethod: 'Mada', status: 'Captured', fatoorahRef: 'MF-78432904' },
  { id: '5', orderNo: '#ORD-2024-085', date: '2024-10-22', buyerName: 'Khaled Al-Harbi', amount: 22100, paymentMethod: 'Apple Pay', status: 'Captured', fatoorahRef: 'MF-78432905' },
  { id: '6', orderNo: '#ORD-2024-084', date: '2024-10-22', buyerName: 'Noura Al-Qahtani', amount: 3400, paymentMethod: 'Visa', status: 'Captured', fatoorahRef: 'MF-78432906' },
  { id: '7', orderNo: '#ORD-2024-083', date: '2024-10-21', buyerName: 'Faisal Al-Shammari', amount: 11200, paymentMethod: 'Mada', status: 'Captured', fatoorahRef: 'MF-78432907' },
  { id: '8', orderNo: '#ORD-2024-082', date: '2024-10-21', buyerName: 'Tariq Al-Zahrani', amount: 7600, paymentMethod: 'Visa', status: 'Captured', fatoorahRef: 'MF-78432908' },
  { id: '9', orderNo: '#ORD-2024-081', date: '2024-10-20', buyerName: 'Reem Al-Dossary', amount: 14800, paymentMethod: 'Apple Pay', status: 'Captured', fatoorahRef: 'MF-78432909' },
  { id: '10', orderNo: '#ORD-2024-080', date: '2024-10-20', buyerName: 'Youssef Al-Malki', amount: 9300, paymentMethod: 'Mada', status: 'Captured', fatoorahRef: 'MF-78432910' },
  { id: '11', orderNo: '#ORD-2024-079', date: '2024-10-19', buyerName: 'Hoda Al-Subaie', amount: 18400, paymentMethod: 'Visa', status: 'Captured', fatoorahRef: 'MF-78432911' },
  { id: '12', orderNo: '#ORD-2024-078', date: '2024-10-19', buyerName: 'Bandar Al-Mutairi', amount: 6200, paymentMethod: 'Mada', status: 'Captured', fatoorahRef: 'MF-78432912' },
  { id: '13', orderNo: '#ORD-2024-077', date: '2024-10-18', buyerName: 'Mona Al-Shehri', amount: 25100, paymentMethod: 'Apple Pay', status: 'Captured', fatoorahRef: 'MF-78432913' },
  { id: '14', orderNo: '#ORD-2024-076', date: '2024-10-18', buyerName: 'Sultan Al-Nasser', amount: 4900, paymentMethod: 'Visa', status: 'Captured', fatoorahRef: 'MF-78432914' },
  { id: '15', orderNo: '#ORD-2024-075', date: '2024-10-17', buyerName: 'Amal Al-Harthi', amount: 13700, paymentMethod: 'Mada', status: 'Captured', fatoorahRef: 'MF-78432915' },
  { id: '16', orderNo: '#ORD-2024-074', date: '2024-10-17', buyerName: 'Omar Al-Ghamdi', amount: 8400, paymentMethod: 'Apple Pay', status: 'Captured', fatoorahRef: 'MF-78432916' },
  { id: '17', orderNo: '#ORD-2024-073', date: '2024-10-16', buyerName: 'Laila Al-Rashid', amount: 16900, paymentMethod: 'Visa', status: 'Captured', fatoorahRef: 'MF-78432917' },
  { id: '18', orderNo: '#ORD-2024-072', date: '2024-10-16', buyerName: 'Ziad Al-Otaibi', amount: 5100, paymentMethod: 'Mada', status: 'Captured', fatoorahRef: 'MF-78432918' },
  { id: '19', orderNo: '#ORD-2024-071', date: '2024-10-15', buyerName: 'Asma Al-Saeed', amount: 19800, paymentMethod: 'Apple Pay', status: 'Captured', fatoorahRef: 'MF-78432919' },
  { id: '20', orderNo: '#ORD-2024-070', date: '2024-10-15', buyerName: 'Hamad Al-Harbi', amount: 7200, paymentMethod: 'Mada', status: 'Captured', fatoorahRef: 'MF-78432920' },
];

const ITEMS_PER_PAGE = 20;

export default function Transactions() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Captured' | 'Pending' | 'Failed' | 'Refunded'>('Captured');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [tempMin, setTempMin] = useState('');
  const [tempMax, setTempMax] = useState('');
  const [dateRangeKey, setDateRangeKey] = useState('last30Days');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Trigger skeleton loading on filter changes
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 350);
    return () => clearTimeout(timer);
  }, [search, statusFilter, minAmount, maxAmount, dateRangeKey, page]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return MOCK_TRANSACTIONS.filter((item) => {
      const matchesSearch =
        item.orderNo.toLowerCase().includes(search.toLowerCase()) ||
        item.buyerName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter;

      let matchesAmount = true;
      const min = minAmount !== '' ? parseFloat(minAmount) : null;
      const max = maxAmount !== '' ? parseFloat(maxAmount) : null;

      if (min !== null && !isNaN(min)) {
        matchesAmount = matchesAmount && item.amount >= min;
      }
      if (max !== null && !isNaN(max)) {
        matchesAmount = matchesAmount && item.amount <= max;
      }

      return matchesSearch && matchesStatus && matchesAmount;
    });
  }, [search, statusFilter, minAmount, maxAmount]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedData = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const exportHeaders = [
    { key: 'orderNo' as const, label: t('dashboardOverview.transactionsLog.orderNo', 'Order #') },
    { key: 'date' as const, label: t('dashboardOverview.transactionsLog.date', 'Date') },
    { key: 'buyerName' as const, label: t('dashboardOverview.transactionsLog.buyerName', 'Buyer Name') },
    { key: 'amount' as const, label: t('dashboardOverview.transactionsLog.totalAmount', 'Total Amount') },
    { key: 'paymentMethod' as const, label: t('dashboardOverview.transactionsLog.paymentMethod', 'Payment Method') },
    { key: 'status' as const, label: t('dashboardOverview.transactionsLog.paymentStatus', 'Payment Status') },
    { key: 'fatoorahRef' as const, label: t('dashboardOverview.transactionsLog.myFatoorahRef', 'MyFatoorah Ref #') },
  ];

  const handleExportExcel = () => {
    exportToCSV('Transactions_Log', exportHeaders, filtered);
    toast.success(t('dashboardOverview.transactionsLog.exportSuccess', 'File exported successfully!'));
  };

  const handleExportPDF = () => {
    exportToPDF(
      t('dashboardOverview.transactionsLog.title', 'Transactions Log'),
      exportHeaders,
      filtered
    );
  };

  const statusOptions = [
    { key: 'All', labelKey: 'statusAll', defaultLabel: 'Status: All' },
    { key: 'Captured', labelKey: 'statusCaptured', defaultLabel: 'Status: Captured' },
    { key: 'Pending', labelKey: 'statusPending', defaultLabel: 'Status: Pending' },
    { key: 'Failed', labelKey: 'statusFailed', defaultLabel: 'Status: Failed' },
    { key: 'Refunded', labelKey: 'statusRefunded', defaultLabel: 'Status: Refunded' },
  ];

  const dateRanges = [
    { key: 'last7Days', defaultLabel: 'Last 7 Days' },
    { key: 'last30Days', defaultLabel: 'Last 30 Days' },
    { key: 'thisMonth', defaultLabel: 'This Month' },
    { key: 'thisYear', defaultLabel: 'This Year' },
  ];

  return (
    <>
      {/* Header Container (Matching Categories) */}
      <div className="sidebar-page-container-header">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-bold text-gray-900 heading-page-title">
              {t('dashboardOverview.transactionsLog.title', 'Transactions Log')}
            </h1>
          </div>

          {/* Export Dropdown */}
          <PortalDropdown
            minWidth={185}
            animate={false}
            menuClassName="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
            trigger={({ toggle }) => (
              <button
                type="button"
                onClick={toggle}
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-gray-950 text-white text-xs sm:text-label-md font-semibold rounded-xl hover:bg-gray-800 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <Download size={16} />
                <span>{t('dashboardOverview.transactionsLog.export', 'Export')}</span>
              </button>
            )}
          >
            {({ close }) => (
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    handleExportExcel();
                    close();
                  }}
                  className="w-full flex items-center gap-2.5 text-start px-3.5 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet size={15} className="text-green-600" />
                  <span>
                    {t(
                      'dashboardOverview.transactionsLog.exportExcel',
                      'Export as Excel (.csv)'
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleExportPDF();
                    close();
                  }}
                  className="w-full flex items-center gap-2.5 text-start px-3.5 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <FileText size={15} className="text-red-500" />
                  <span>
                    {t(
                      'dashboardOverview.transactionsLog.exportPdf',
                      'Export as PDF (.pdf)'
                    )}
                  </span>
                </button>
              </div>
            )}
          </PortalDropdown>
        </div>
      </div>

      {/* Main Body Container (Matching Categories) */}
      <div className="flex-1 overflow-y-auto py-6 sidebar-page-container">
        {/* Search & Filter Controls Bar (Matching CategoryFilterBar) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none ${
                isRtl ? 'right-3.5' : 'left-3.5'
              }`}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={t(
                'dashboardOverview.transactionsLog.searchPlaceholder',
                'Search order or buyer...'
              )}
              className={`w-full py-2.5 rounded-xl border border-gray-200 text-body-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-white ${
                isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:gap-3 shrink-0">
            {/* Status Dropdown */}
            <PortalDropdown
              minWidth={140}
              animate={false}
              menuClassName="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-50"
              trigger={({ isOpen, toggle }) => {
                const statusText =
                  statusFilter === 'All'
                    ? t('dashboardOverview.transactionsLog.statusAll', 'Status: All')
                    : t(`dashboardOverview.transactionsLog.${statusFilter.toLowerCase()}`, statusFilter);

                return (
                  <button
                    type="button"
                    onClick={toggle}
                    className="flex items-center justify-between md:justify-start gap-2 py-2.5 px-3 rounded-xl border border-gray-200 text-body-sm text-gray-700 focus:outline-none focus:border-gray-900 transition-all bg-white cursor-pointer whitespace-nowrap w-full md:w-auto"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      <span className="truncate whitespace-nowrap leading-snug">{statusText}</span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                );
              }}
            >
              {({ close }) => (
                <div className="py-1">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        setStatusFilter(opt.key as any);
                        setPage(1);
                        close();
                      }}
                      className="w-full text-start px-3.5 py-2 text-xs transition-colors cursor-pointer whitespace-nowrap text-gray-700 hover:bg-gray-50"
                    >
                      {t(`dashboardOverview.transactionsLog.${opt.labelKey}`, opt.defaultLabel)}
                    </button>
                  ))}
                </div>
              )}
            </PortalDropdown>

            {/* Amount Min/Max Dropdown Centered */}
            <PortalDropdown
              align="center"
              minWidth={240}
              animate={false}
              menuClassName="bg-white border border-gray-200 rounded-2xl shadow-xl p-3.5 z-50"
              trigger={({ isOpen, toggle }) => {
                let label = t('dashboardOverview.transactionsLog.amountLabel', 'Amount');
                if (minAmount && maxAmount) {
                  label = `${minAmount}-${maxAmount}`;
                } else if (minAmount) {
                  label = `>=${minAmount}`;
                } else if (maxAmount) {
                  label = `<=${maxAmount}`;
                }

                return (
                  <button
                    type="button"
                    onClick={() => {
                      setTempMin(minAmount);
                      setTempMax(maxAmount);
                      toggle();
                    }}
                    className="flex items-center justify-between md:justify-start gap-2 py-2.5 px-3 rounded-xl border border-gray-200 text-body-sm text-gray-700 focus:outline-none focus:border-gray-900 transition-all bg-white cursor-pointer whitespace-nowrap w-full md:w-auto"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <DollarSign size={14} className="text-blue-500 shrink-0" />
                      <span className="truncate whitespace-nowrap leading-snug">{label}</span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                );
              }}
            >
              {({ close }) => (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2">
                    {t(
                      'dashboardOverview.transactionsLog.filterByAmount',
                      'Filter by Amount'
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                        {t('dashboardOverview.transactionsLog.minAmount', 'Min Amount')}
                      </label>
                      <input
                        type="number"
                        value={tempMin}
                        onChange={(e) => setTempMin(e.target.value)}
                        placeholder="0"
                        className="w-full h-8 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                        {t('dashboardOverview.transactionsLog.maxAmount', 'Max Amount')}
                      </label>
                      <input
                        type="number"
                        value={tempMax}
                        onChange={(e) => setTempMax(e.target.value)}
                        placeholder="100000"
                        className="w-full h-8 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTempMin('');
                        setTempMax('');
                        setMinAmount('');
                        setMaxAmount('');
                        setPage(1);
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      {t('dashboardOverview.transactionsLog.clear', 'Clear')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMinAmount(tempMin);
                        setMaxAmount(tempMax);
                        setPage(1);
                        close();
                      }}
                      className="px-3 py-1 bg-gray-950 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      {t('dashboardOverview.transactionsLog.apply', 'Apply')}
                    </button>
                  </div>
                </div>
              )}
            </PortalDropdown>

            {/* Date Range Dropdown */}
            <PortalDropdown
              minWidth={140}
              animate={false}
              menuClassName="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-50"
              trigger={({ isOpen, toggle }) => (
                <button
                  type="button"
                  onClick={toggle}
                  className="flex items-center justify-between md:justify-start gap-2 py-2.5 px-3 rounded-xl border border-gray-200 text-body-sm text-gray-700 focus:outline-none focus:border-gray-900 transition-all bg-white cursor-pointer whitespace-nowrap w-full md:w-auto"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Calendar size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate whitespace-nowrap leading-snug">
                      {t(
                        `dashboardOverview.${dateRangeKey}`,
                        dateRanges.find((r) => r.key === dateRangeKey)?.defaultLabel ?? ''
                      )}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              )}
            >
              {({ close }) => (
                <div className="py-1">
                  {dateRanges.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        setDateRangeKey(opt.key);
                        close();
                      }}
                      className="w-full text-start px-3.5 py-2 text-xs transition-colors cursor-pointer whitespace-nowrap text-gray-700 hover:bg-gray-50"
                    >
                      {t(`dashboardOverview.${opt.key}`, opt.defaultLabel)}
                    </button>
                  ))}
                </div>
              )}
            </PortalDropdown>
          </div>
        </div>

        {/* Card Container (Matching Categories) */}
        <div className=" overflow-hidden">
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="p-5 space-y-4 animate-pulse">
              <div className="h-4 w-48 bg-gray-200 rounded-md" />
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="h-12 w-full bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="text-left rtl:text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {t('dashboardOverview.transactionsLog.orderNo', 'Order #')}
                      </th>
                      <th className="text-left rtl:text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {t('dashboardOverview.transactionsLog.date', 'Date')}
                      </th>
                      <th className="text-left rtl:text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {t('dashboardOverview.transactionsLog.buyerName', 'Buyer Name')}
                      </th>
                      <th className="text-left rtl:text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {t(
                          'dashboardOverview.transactionsLog.totalAmount',
                          'Total Amount (SAR)'
                        )}
                      </th>
                      <th className="text-left rtl:text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {t(
                          'dashboardOverview.transactionsLog.paymentMethod',
                          'Payment Method'
                        )}
                      </th>
                      <th className="text-left rtl:text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {t(
                          'dashboardOverview.transactionsLog.paymentStatus',
                          'Payment Status'
                        )}
                      </th>
                      <th className="text-left rtl:text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {t(
                          'dashboardOverview.transactionsLog.myFatoorahRef',
                          'MyFatoorah Ref #'
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors group"
                        >
                          <td className="py-3.5 px-4 font-bold text-gray-900 font-mono">
                            {item.orderNo}
                          </td>
                          <td className="py-3.5 px-4 text-gray-500 font-medium">
                            {item.date}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-900">
                            {item.buyerName}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-900">
                            {item.amount.toLocaleString()} SAR
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 font-medium">
                            {item.paymentMethod}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                item.status === 'Captured'
                                  ? 'bg-green-100 text-green-700'
                                  : item.status === 'Pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-red-100 text-red-600'
                              }`}
                            >
                              {t(
                                `dashboardOverview.transactionsLog.${item.status.toLowerCase()}`,
                                item.status
                              )}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-500 font-mono text-[11px]">
                            {item.fatoorahRef}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="md:hidden space-y-3 p-3 bg-gray-50/50">
                {paginatedData.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-xs bg-white rounded-2xl border border-gray-100">
                    No transactions found.
                  </div>
                ) : (
                  paginatedData.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2.5 shadow-2xs hover:border-gray-200 transition-colors"
                    >
                      {/* Top Row: Order # & Badge */}
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-xs font-bold text-gray-900 font-mono">
                          {item.orderNo}
                        </span>
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            item.status === 'Captured'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {t(
                            `dashboardOverview.transactionsLog.${item.status.toLowerCase()}`,
                            item.status
                          )}
                        </span>
                      </div>

                      {/* Detail Rows */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">
                            {t('dashboardOverview.transactionsLog.buyerName', 'Buyer Name')}
                          </span>
                          <span className="font-bold text-gray-900">{item.buyerName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">
                            {t('dashboardOverview.transactionsLog.totalAmount', 'Total Amount')}
                          </span>
                          <span className="font-bold text-gray-900">
                            {item.amount.toLocaleString()} SAR
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">
                            {t('dashboardOverview.transactionsLog.methodAndDate', 'Method & Date')}
                          </span>
                          <span className="font-medium text-gray-800">
                            {item.paymentMethod} • {item.date}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">
                            {t('dashboardOverview.transactionsLog.myFatoorahRef', 'MyFatoorah Ref')}
                          </span>
                          <span className="font-mono text-gray-500">{item.fatoorahRef}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination Component (Matching CategoryControls Pagination) */}
              {filtered.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-xs text-gray-400">
                    {t('dashboardOverview.transactionsLog.showingCount', {
                      start: (safePage - 1) * ITEMS_PER_PAGE + 1,
                      end: Math.min(safePage * ITEMS_PER_PAGE, filtered.length),
                      total: filtered.length,
                      defaultValue: `Showing ${
                        (safePage - 1) * ITEMS_PER_PAGE + 1
                      } - ${Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of ${
                        filtered.length
                      } transactions`,
                    })}
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={safePage === 1}
                      onClick={() => setPage(safePage - 1)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {isRtl ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        className={`inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                          n === safePage
                            ? 'bg-gray-950 text-white shadow-sm'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={safePage === totalPages}
                      onClick={() => setPage(safePage + 1)}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      {isRtl ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
