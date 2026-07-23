import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Tag, TrendingUp, Gift } from 'lucide-react';

interface VoucherItem {
  code: string;
  type: string;
  discount: string;
  usage: string;
  expiry: string;
  status: 'active' | 'expired';
}

const VOUCHER_DATA: VoucherItem[] = [
  { code: 'WELCOME20', type: 'Percentage', discount: '20%', usage: '145/500', expiry: '2025-03-01', status: 'active' },
  { code: 'FREESHIP', type: 'Free Shipping', discount: 'Free', usage: '88/200', expiry: '2025-02-15', status: 'active' },
  { code: 'SAVE50', type: 'Amount', discount: 'SAR 50', usage: '200/200', expiry: '2025-01-30', status: 'expired' },
  { code: 'VIP10', type: 'Percentage', discount: '10%', usage: '58/100', expiry: '2025-04-01', status: 'active' },
];

export default function VoucherOverviewSection() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">
          {t('dashboardOverview.voucherOverview', 'Voucher Overview')}
        </h2>
        <Link
          to="/vouchers"
          className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
        >
          {t('dashboardOverview.viewAll', 'View All')} →
        </Link>
      </div>

      {/* 3 Stat Cards Row */}
      {/* Mobile: 2 top cards + 1 full card below / Desktop: 3 cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        {/* Active Vouchers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 mb-2">
              <Tag size={14} />
              <span>{t('dashboardOverview.activeVouchers', 'Active Vouchers')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
            ✓ 12
          </span>
        </div>

        {/* Total Voucher Costs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 mb-2">
            <TrendingUp size={14} />
            <span>{t('dashboardOverview.totalVoucherCosts', 'Total Voucher Costs')}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-gray-700">SAR</span>
            <span className="text-2xl font-bold text-gray-900">24,580</span>
            <span className="text-xs font-normal text-gray-400 ms-1">SAR</span>
          </div>
          <p className="text-[10px] text-gray-400 font-medium mt-1">
            Platform Marketing Expense
          </p>
        </div>

        {/* Redemptions This Month */}
        <div className="col-span-2 lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 mb-2">
              <Gift size={14} />
              <span>{t('dashboardOverview.redemptionsThisMonth', 'Redemptions This Month')}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">347</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
            ⇱ +18%
          </span>
        </div>
      </div>

      {/* Voucher Table / Mobile Cards Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-400">
                <th className="px-5 py-3.5 text-start font-semibold">Code</th>
                <th className="px-5 py-3.5 text-start font-semibold">Type</th>
                <th className="px-5 py-3.5 text-start font-semibold">Discount</th>
                <th className="px-5 py-3.5 text-start font-semibold">Usage</th>
                <th className="px-5 py-3.5 text-start font-semibold">Expiry</th>
                <th className="px-5 py-3.5 text-start font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {VOUCHER_DATA.map((v) => (
                <tr key={v.code} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-gray-900 font-mono">
                    {v.code}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 font-medium">{v.type}</td>
                  <td className="px-5 py-3.5 font-bold text-gray-900">{v.discount}</td>
                  <td className="px-5 py-3.5 text-gray-400 font-medium">{v.usage}</td>
                  <td className="px-5 py-3.5 text-gray-400 font-medium">{v.expiry}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        v.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {v.status === 'active' ? 'Active' : 'Expired'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="md:hidden divide-y divide-gray-100">
          {VOUCHER_DATA.map((v) => (
            <div key={v.code} className="p-4 space-y-2 hover:bg-gray-50/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 font-mono">{v.code}</span>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    v.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {v.status === 'active' ? 'Active' : 'Expired'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[11px] text-gray-500 pt-1">
                <div>
                  <p className="text-[10px] text-gray-400">Discount Type</p>
                  <p className="font-semibold text-gray-800">{v.type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Discount</p>
                  <p className="font-bold text-gray-900">{v.discount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Usage / Expiry</p>
                  <p className="font-medium text-gray-800">
                    {v.usage} • {v.expiry}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
