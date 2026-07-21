import { useTranslation } from 'react-i18next';
import { Ban } from 'lucide-react';
import type { SubOrderStatus } from '../Orders/types/subOrder';

interface Props {
  status: SubOrderStatus;
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  statusOverrideReason: string | null;
}

const TIMELINE_STEPS: { status: SubOrderStatus; label: string; desc: string }[] = [
  { status: 'PENDING',    label: 'Order Placed',  desc: 'Order received and confirmed' },
  { status: 'PROCESSING', label: 'Processing',    desc: 'Payment verified, order being prepared' },
  { status: 'SHIPPED',    label: 'Shipped',        desc: 'Handed to courier for delivery' },
  { status: 'DELIVERED',  label: 'Delivered',      desc: 'Awaiting delivery confirmation' },
];

export const SubOrderTimeline = ({
  status,
  createdAt,
  shippedAt,
  deliveredAt,
  statusOverrideReason,
}: Props) => {
  const { t } = useTranslation();
  const currentStepIdx = TIMELINE_STEPS.findIndex((s) => s.status === status);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h6 className="font-semibold text-gray-900 mb-5">{t('ordersPage.orderTimeline')}</h6>

      {status === 'CANCELLED' ? (
        <div className="flex items-center gap-3 text-red-500 py-2">
          <Ban size={20} />
          <div>
            <p className="font-semibold">Order Cancelled</p>
            {statusOverrideReason && (
              <p className="text-gray-500 text-sm mt-0.5">Reason: {statusOverrideReason}</p>
            )}
          </div>
        </div>
      ) : (
        <div>
          {TIMELINE_STEPS.map((step, i) => {
            const done = i <= currentStepIdx;
            const isCurrent = step.status === status;
            const isLast = i === TIMELINE_STEPS.length - 1;

            // Date label
            let dateLabel = '';
            if (step.status === 'PENDING') dateLabel = new Date(createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            if (step.status === 'SHIPPED' && shippedAt) dateLabel = new Date(shippedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            if (step.status === 'DELIVERED' && deliveredAt) dateLabel = new Date(deliveredAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            if (!done) dateLabel = 'Pending';

            return (
              <div key={step.status} className="flex gap-4">
                {/* Icon + connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full border-2 ${
                      done && !isCurrent
                        ? 'bg-green-500 border-green-500'
                        : isCurrent
                        ? 'bg-amber-400 border-amber-400'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    {done && !isCurrent ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isCurrent ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 mt-0.5 ${done && !isCurrent ? 'bg-green-400' : 'bg-gray-200'}`}
                      style={{ minHeight: 36 }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex justify-between pb-6 gap-4 min-w-0">
                  <div>
                    <p className={`font-semibold text-sm ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${done ? 'text-gray-500' : 'text-gray-300'}`}>
                      {step.desc}
                    </p>
                  </div>
                  <p className={`text-xs whitespace-nowrap ${done ? 'text-gray-400' : 'text-gray-300'}`}>
                    {dateLabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
