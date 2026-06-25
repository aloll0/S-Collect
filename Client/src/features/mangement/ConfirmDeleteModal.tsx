import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type ConfirmDeleteModalProps = {
  messageKey: string;
  messageValues?: Record<string, string | number>;
  onConfirm: () => void;
};

export function ConfirmDeleteModal({
  messageKey,
  messageValues,
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
          {t("managementTable.deleteConfirmTitle")}
        </h3>

        {/* Description */}
        <p className="mt-3 text-center text-sm text-gray-500">
          {t(messageKey, messageValues)}
        </p>

        <p className="mt-1 text-center text-sm text-gray-400">
          {t("managementTable.cannotUndo")}
        </p>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={() => {
              onConfirm();
              toast.dismiss();
            }}
            className="flex-1 cursor-pointer rounded-lg bg-red-600 py-3 text-sm font-medium text-white transition hover:bg-red-700"
          >
            {t("managementTable.delete")}
          </button>

          <button
            type="button"
            onClick={() => toast.dismiss()}
            className="flex-1 cursor-pointer rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {t("managementTable.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}
