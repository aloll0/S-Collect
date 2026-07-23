import { useTranslation } from 'react-i18next';
import { type ReturnItem } from '../types';

export function StatusBadge({ status }: { status: ReturnItem['status'] }) {
  const { t } = useTranslation();

  const config = {
    PENDING_REVIEW: {
      labelKey: 'returnsPage.statuses.pendingReview',
      defaultLabel: 'Pending Review',
      cls: 'bg-amber-100/90 text-amber-900 border-amber-300/70',
    },
    APPROVED: {
      labelKey: 'returnsPage.statuses.approved',
      defaultLabel: 'Approved',
      cls: 'bg-emerald-100/90 text-emerald-900 border-emerald-300/70',
    },
    REJECTED: {
      labelKey: 'returnsPage.statuses.rejected',
      defaultLabel: 'Rejected',
      cls: 'bg-rose-100/90 text-rose-900 border-rose-300/70',
    },
    AWAITING_ITEM: {
      labelKey: 'returnsPage.statuses.awaitingItem',
      defaultLabel: 'Awaiting Item',
      cls: 'bg-sky-100/90 text-sky-900 border-sky-300/70',
    },
    COMPLETED: {
      labelKey: 'returnsPage.statuses.completed',
      defaultLabel: 'Completed',
      cls: 'bg-emerald-100/90 text-emerald-900 border-emerald-300/70',
    },
  };

  const current = config[status] || config.PENDING_REVIEW;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${current.cls}`}
    >
      {t(current.labelKey, { defaultValue: current.defaultLabel })}
    </span>
  );
}
