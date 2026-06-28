import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

type ConfirmDeleteModalProps = {
  titleKey?: string;
  messageKey: string;
  messageValues?: Record<string, string | number>;
  confirmKey?: string;
  confirmClassName?: string;
  onConfirm: () => void;
};

export function ConfirmDeleteModal({
  titleKey = 'managementTable.deleteConfirmTitle',
  messageKey,
  messageValues,
  confirmKey = 'managementTable.delete',
  confirmClassName = 'bg-red-600 hover:bg-red-700',
  onConfirm,
}: ConfirmDeleteModalProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[9999] h-screen w-screen flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-2xl">
        {/* Warning Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-4xl font-bold leading-none text-red-500">
            !
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-5 text-center text-2xl font-semibold text-gray-900">
          {t(titleKey)}
        </h3>

        {/* Description */}
        <p className="mt-3 text-center text-sm text-gray-500">
          {t(messageKey, messageValues)}
        </p>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => {
              onConfirm();
              toast.dismiss();
            }}
            className={`flex-1 cursor-pointer rounded-lg py-3 text-sm font-medium text-white transition ${confirmClassName}`}
          >
            {t(confirmKey)}
          </button>

          <button
            type="button"
            onClick={() => toast.dismiss()}
            className="flex-1 cursor-pointer rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {t('managementTable.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
