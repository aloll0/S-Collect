import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Box, CheckCircle2, Clock } from 'lucide-react';

export default function RevenueStatCards() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {/* GMV */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-green-600">
          <TrendingUp size={15} />
          <span>{t('dashboardOverview.gmv', 'GMV')}</span>
        </div>
        <div className="flex items-baseline justify-between gap-1 flex-col md:flex-row">
          <div>
            <span className="text-xl lg:text-2xl font-bold text-gray-900">1,459,134</span>
            <span className="text-xs font-medium text-gray-400 ms-1">SAR</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700 shrink-0">
            <TrendingDown className="w-3 h-3 text-green-700" />
            15.2%
          </span>
        </div>
      </div>

      {/* Net Revenue */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-blue-600">
          <Box size={15} />
          <span>{t('dashboardOverview.netRevenue', 'Net Revenue')}</span>
        </div>
        <div className="flex items-baseline justify-between gap-1 flex-col md:flex-row">
          <div>
            <span className="text-xl lg:text-2xl font-bold text-gray-900">245,780</span>
            <span className="text-xs font-medium text-gray-400 ms-1">SAR</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700 shrink-0">
            <TrendingDown className="w-3 h-3 text-green-700" />
            5.8%
          </span>
        </div>
      </div>

      {/* Total Payouts */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-green-600">
          <CheckCircle2 size={15} />
          <span>{t('dashboardOverview.totalPayouts', 'Total Payouts')}</span>
        </div>
        <div className="flex items-baseline justify-between gap-1 flex-col md:flex-row">
          <div>
            <span className="text-xl lg:text-2xl font-bold text-gray-900">189,450</span>
            <span className="text-xs font-medium text-gray-400 ms-1">SAR</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700 shrink-0">
            <TrendingDown className="w-3 h-3 text-green-700" />
            12.3%
          </span>
        </div>
      </div>

      {/* Pending Payouts */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 lg:p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-amber-600">
          <Clock size={15} />
          <span>{t('dashboardOverview.pendingPayouts', 'Pending Payouts')}</span>
        </div>
        <div className="flex items-baseline justify-between gap-1 flex-col md:flex-row">
          <div>
            <span className="text-xl lg:text-2xl font-bold text-gray-900">56,330</span>
            <span className="text-xs font-medium text-gray-400 ms-1">SAR</span>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-600 shrink-0">
            <TrendingUp className="w-3 h-3 text-rose-600" />
            3.2%
          </span>
        </div>
      </div>
    </div>
  );
}
