import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

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
    t("salesChart.day1"),
    t("salesChart.day2"),
    t("salesChart.day3"),
    t("salesChart.day4"),
    t("salesChart.day5"),
    t("salesChart.day6"),
  ];

  const data = {
    labels,
    datasets: [
      {
        label: t("salesChart.sales"),
        data: chartValues,
        borderColor: "#218c21",
        backgroundColor: "#218c21",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
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
  };

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow">
      <div className="mb-4 flex items-center gap-3">
        <label className="font-medium">{t("salesChart.pointStyle")}</label>

      
      </div>

      <div className="h-[512px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}