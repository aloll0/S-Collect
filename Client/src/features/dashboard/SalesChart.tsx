'use client';

import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '../../components/ui/chart';

type Period = 'month' | 'week' | 'day';

const monthlyData = [
  { label: 'January', desktop: 186 },
  { label: 'February', desktop: 305 },
  { label: 'March', desktop: 237 },
  { label: 'April', desktop: 73 },
  { label: 'May', desktop: 209 },
  { label: 'June', desktop: 214 },
  { label: 'July', desktop: 168 },
  { label: 'August', desktop: 295 },
  { label: 'September', desktop: 232 },
  { label: 'October', desktop: 182 },
  { label: 'November', desktop: 276 },
  { label: 'December', desktop: 312 },
];

const weeklyData = [
  { label: 'Sat', desktop: 124 },
  { label: 'Sun', desktop: 198 },
  { label: 'Mon', desktop: 156 },
  { label: 'Tue', desktop: 241 },
  { label: 'Wed', desktop: 178 },
  { label: 'Thu', desktop: 263 },
  { label: 'Fri', desktop: 195 },
];

const dailyData = [
  { label: '00:00', desktop: 42 },
  { label: '04:00', desktop: 28 },
  { label: '08:00', desktop: 67 },
  { label: '12:00', desktop: 134 },
  { label: '16:00', desktop: 189 },
  { label: '20:00', desktop: 112 },
  { label: '23:59', desktop: 78 },
];

const dataByPeriod: Record<Period, { label: string; desktop: number }[]> = {
  month: monthlyData,
  week: weeklyData,
  day: dailyData,
};

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export default function SalesChart() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>('month');

  const periodOptions: { value: Period; label: string }[] = [
    { value: 'month', label: t('salesChart.lastMonth') },
    { value: 'week', label: t('salesChart.lastWeek') },
    { value: 'day', label: t('salesChart.lastDay') },
  ];

  const selectedOption = periodOptions.find((o) => o.value === period)!;
  const chartData = dataByPeriod[period];

  return (
    <Card className="lg:h-[512px] lg:flex lg:flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>{t('salesChart.pointStyle')}</CardTitle>
            <CardDescription>{t('salesChart.sales')}</CardDescription>
          </div>
          <Listbox value={period} onChange={setPeriod}>
            <div className="relative">
              <Listbox.Button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 focus:outline-none">
                {selectedOption.label}
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </Listbox.Button>
              <Listbox.Options className="absolute right-0 z-10 mt-1 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-xs shadow-lg focus:outline-none">
                {periodOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className={({ active }) =>
                      `cursor-pointer px-3 py-2 ${
                        active ? 'bg-gray-50 text-gray-900' : 'text-gray-600'
                      }`
                    }
                  >
                    {option.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
      </CardHeader>
      <CardContent className="lg:flex-1 lg:overflow-hidden">
        <ChartContainer
          config={chartConfig}
          className="lg:aspect-auto lg:h-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {selectedOption.label} <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-gray-500">
              {selectedOption.label}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
