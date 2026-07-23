const MONTH_NAMES: Record<string, string> = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

export function getDateKey(date: string): string {
  const match = date.match(/(\w{3})\s+\d{1,2},\s+(\d{4})/);
  if (!match) return '';
  const [, month, year] = match;
  return `${year}-${MONTH_NAMES[month] ?? '00'}`;
}

export function formatAmount(amount: number): string {
  const abs = Math.abs(amount);
  return abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
