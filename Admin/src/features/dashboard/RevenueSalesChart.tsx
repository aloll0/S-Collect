import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import PortalDropdown from '../../components/ui/PortalDropdown';

export default function RevenueSalesChart() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'Monthly' | 'Weekly' | 'Yearly'>('Monthly');

  const periods: ('Monthly' | 'Weekly' | 'Yearly')[] = ['Monthly', 'Weekly', 'Yearly'];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-gray-400 mb-0.5">
            {t('dashboardOverview.salesOverview', 'Sales Overview')}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-gray-900">459,134.00</span>
            <span className="text-xs font-medium text-gray-400">SAR</span>
          </div>
        </div>

        {/* Dropdown */}
        <PortalDropdown
          minWidth={110}
          animate={false}
          menuClassName="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden"
          trigger={({ isOpen, toggle }) => (
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span>{period}</span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        >
          {({ close }) => (
            <div className="py-1">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    close();
                  }}
                  className={`w-full text-start px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                    period === p
                      ? 'bg-green-50 text-green-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </PortalDropdown>
      </div>

      {/* Wave Area Chart (SVG) */}
      <div className="relative w-full pt-2">
        <svg
          viewBox="0 0 500 150"
          className="w-full h-44 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="greenWaveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#22c55e" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="75" x2="500" y2="75" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />

          {/* Area Fill */}
          <path
            d="M 0,110 C 40,115 60,75 100,65 C 140,55 160,110 200,105 C 240,100 260,20 300,30 C 340,40 360,95 400,85 C 440,75 460,50 500,70 L 500,150 L 0,150 Z"
            fill="url(#greenWaveGradient)"
          />

          {/* Smooth Wave Line */}
          <path
            d="M 0,110 C 40,115 60,75 100,65 C 140,55 160,110 200,105 C 240,100 260,20 300,30 C 340,40 360,95 400,85 C 440,75 460,50 500,70"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>

        {/* X-Axis Labels */}
        <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 pt-2 px-1">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
        </div>
      </div>
    </div>
  );
}
