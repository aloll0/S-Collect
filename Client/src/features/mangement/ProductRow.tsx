import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { PencilIcon, Trash2 } from "lucide-react";
import Toggle from "./Toggle";
import StatusBadge from "./StatusBadge";
import { THUMB_STYLES } from "./constant";
import type { Product } from "./mangement";

type Props = {
  product: Product;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggle: () => void;
};

export default function ProductRow({
  product,
  selected,
  onSelect,
  onDelete,
  onToggle,
}: Props) {
  const { t } = useTranslation();
  const thumb = THUMB_STYLES[product.category] ?? {
    bg: "bg-gray-100",
    icon: "text-gray-500",
  };

const confirmDelete = () => {
  toast.custom(
    (toastItem) => (
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
            {t("managementTable.deleteConfirmMessage", {
              name: product.name,
            })}
          </p>

          <p className="mt-1 text-center text-sm text-gray-400">
            {t("managementTable.cannotUndo")}
          </p>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => {
                onDelete();
                toast.dismiss(toastItem.id);
              }}
              className="flex-1 cursor-pointer rounded-lg bg-red-600 py-3 text-sm font-medium text-white transition hover:bg-red-700"
            >
              {t("managementTable.delete")}
            </button>

            <button
              type="button"
              onClick={() => toast.dismiss(toastItem.id)}
              className="flex-1 cursor-pointer rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {t("managementTable.cancel")}
            </button>
          </div>
        </div>
      </div>
    ),
    {
      duration: Infinity,
    }
  );
};

  return (
    <tr
      className={`transition-colors ${selected ? "bg-indigo-50 hover:bg-indigo-50" : "hover:bg-gray-50"}`}
    >
      <td className="px-3 py-3 border-b border-gray-100">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="accent-indigo-600 w-4 h-4 cursor-pointer"
        />
      </td>

      <td className="px-3 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-11 h-11 rounded-lg border border-gray-100 flex items-center justify-center flex-shrink-0 ${thumb.bg}`}
          >
            <i className={`ti ${product.icon} text-xl ${thumb.icon}`} aria-hidden="true" />
          </div>
          <span className="font-medium">{product.name}</span>
        </div>
      </td>

      <td className="px-3 py-3 border-b border-gray-100 text-gray-500">
        {t(`managementTable.categories.${product.category}`)}
      </td>

      <td className="px-3 py-3 border-b border-gray-100 font-medium">
        {product.price} {t("dashboardMetrics.unit.sar")}
      </td>

      <td className="px-3 py-3 border-b border-gray-100">
        <StatusBadge status={product.status} />
      </td>

      <td className="px-3 py-3 border-b border-gray-100">
        <Toggle checked={product.enabled} onChange={onToggle} />
      </td>

      <td className="px-3 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <button
            onClick={confirmDelete}
            aria-label={t("managementTable.deleteProduct", { name: product.name })}
            className="w-[30px] h-[30px] flex items-center justify-center border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <Trash2 className="text-red-500" size={16} />
          </button>
          <button
            aria-label={t("managementTable.editProduct", { name: product.name })}
            className="w-[30px] h-[30px] flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <PencilIcon className="text-gray-500" size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
