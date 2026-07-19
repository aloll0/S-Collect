import { useTranslation } from 'react-i18next';
import { STATUS_BADGE, type TransactionStatus } from './constants';

export default function StatusBadge({ status }: { status: TransactionStatus }) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[status]}`}
    >
      {t(`receivables.statuses.${status}`)}
    </span>
  );
}
