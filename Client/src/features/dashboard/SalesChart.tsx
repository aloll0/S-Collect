import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartValues = [20, 45, 30, 70, 55, 90];

export default function SalesChart() {
  const { t } = useTranslation();

  const labels = [
    t('salesChart.day1'),
    t('salesChart.day2'),
    t('salesChart.day3'),
    t('salesChart.day4'),
    t('salesChart.day5'),
    t('salesChart.day6'),
  ];

  const data = {
    labels,
    datasets: [
      {
        label: t('salesChart.sales'),
        data: chartValues,
        borderColor: '#218c21',
        backgroundColor: 'rgba(33, 140, 33, 0.1)', // Semi-transparent fill for cleaner look
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    // Smooth chart draw animation synced with container entrance
    animation: {
      duration: 1200,
      easing: 'easeOutQuart' as const,
      delay: (context: { dataIndex?: number; type?: string }) => {
        // Stagger each data point's draw animation
        if (context.type === 'data' && context.dataIndex !== undefined) {
          return context.dataIndex * 150 + 400; // 400ms base delay + stagger
        }
        return 400;
      },
    },
  };

  return (
    <>
      {/* Scoped animation matching dashboard design system */}
      <style>{`
        @keyframes chartFadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .chart-animate-in {
          opacity: 0;
          animation: chartFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="w-full rounded-xl bg-white p-6 shadow h-[512px] chart-animate-in">
        <div className="mb-4 flex items-center gap-3">
          <label className="font-medium">{t('salesChart.pointStyle')}</label>
        </div>

        <div className="h-[450px]">
          <Line data={data} options={options} />
        </div>
      </div>
    </>
  );
}