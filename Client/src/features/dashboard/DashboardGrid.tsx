import { TrendingUp, Box, PackagePlus, Package } from 'lucide-react';
import type { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';


const DashboardGrid = () => {
const { t } = useTranslation();

interface DashboardMetric {
  title: string;
  value: string;
  unit: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  colorTheme: {
    primary: string;
    light?: string;
  };
  trend?: {
    percentage: string;
    isPositive: boolean;
  };
}

  const dashboardMetrics: DashboardMetric[] = [
    {
      title: t('dashboardMetrics.totalSales'),
      value: '124,392',
      unit: t('dashboardMetrics.unit.sar'),
      icon: TrendingUp,
      colorTheme: {
        primary: 'var(--green)',
        light: 'var(--green-light)',
      },
      trend: {
        percentage: '12.5%',
        isPositive: true,
      },
    },
    {
      title: t('dashboardMetrics.numberOfOrders'),
      value: '1,842',
      unit: t('dashboardMetrics.unit.order'),
      icon: Box,
      colorTheme: {
        primary: 'var(--yellow)',
        light: 'var(--green-light)',
      },
      trend: {
        percentage: '12.5%',
        isPositive: true,
      },
    },
    {
      title: t('dashboardMetrics.newOrders'),
      value: '684',
      unit: t('dashboardMetrics.unit.order'),
      icon: PackagePlus,
      colorTheme: {
        primary: 'var(--yellow)',
        light: 'var(--red-light)',
      },
      trend: {
        percentage: '12.5%',
        isPositive: false,
      },
    },
    {
      title: t('dashboardMetrics.activeProducts'),
      value: '128',
      unit: t('dashboardMetrics.unit.product'),
      icon: Package,
      colorTheme: {
        primary: 'var(--blue, #2563eb)',
      },
    },
  ];

  return (
    <div className="mb-10 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardMetrics.map((metric) => (
          <div
            key={metric.title}
            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm min-h-[130px] flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <metric.icon
                size={20}
                color={metric.colorTheme.primary}
              />
              <span className="text-sm text-gray-500 font-medium">
                {metric.title}
              </span>
            </div>

            {/* Content */}
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {metric.value}
                  </span>

                  <span className="text-sm text-gray-400 mb-1">
                    {metric.unit}
                  </span>
                </div>
              </div>

              {metric.trend && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                    metric.trend.isPositive
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  <span>
                    {metric.trend.isPositive ? '↗' : '↘'}
                  </span>
                  {metric.trend.percentage}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardGrid;