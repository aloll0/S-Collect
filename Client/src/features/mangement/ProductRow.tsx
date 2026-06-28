import { useTranslation } from 'react-i18next';
import { SquarePen, Trash } from 'lucide-react';
import Toggle from './Toggle';
import StatusBadge from './StatusBadge';
import { showDeleteConfirmation } from './deleteConfirmation';
import { THUMB_STYLES } from './constant';
import type { Product } from './mangement';

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
  // Removed isArabic detection - no longer needed at row level
  const thumb = THUMB_STYLES[product.category] ?? {
    bg: 'bg-gray-100',
    icon: 'text-gray-500',
  };

  const handleDelete = () => {
    showDeleteConfirmation(
      'managementTable.deleteConfirmMessage',
      { name: product.name },
      onDelete
    );
  };

  return (
    /* Removed individual dir attribute - inherited from parent container */
    <tr
      className={`transition-colors ${selected ? 'bg-indigo-50 hover:bg-indigo-50' : 'hover:bg-gray-50'
        }`}
    >
      <td className="px-3 py-3 border-b border-gray-100 text-start">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="accent-black w-4 h-4 cursor-pointer"
        />
      </td>

      <td className="px-3 py-3 border-b border-gray-100">
        {/* Flex container maintains visual order; direction is inherited */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-11 h-11 rounded-lg border border-gray-100 flex items-center justify-center flex-shrink-0 ${thumb.bg}`}
          >
            <i
              className={`ti ${product.icon} text-xl ${thumb.icon}`}
              aria-hidden="true"
            />
          </div>
          <span className="font-medium">{product.name}</span>
        </div>
      </td>

      <td className="px-3 py-3 border-b border-gray-100 text-gray-500">
        {t(`managementTable.categories.${product.category}`)}
      </td>

      <td className="px-3 py-3 border-b border-gray-100 font-medium">
        {product.price} {t('dashboardMetrics.unit.sar')}
      </td>

      <td className="px-3 py-3 border-b border-gray-100">
        <StatusBadge status={product.status} />
      </td>

      <td className="px-3 py-3 border-b border-gray-100">
        <Toggle checked={product.enabled} onChange={onToggle} />
      </td>

      <td className="px-3 py-3 border-b border-gray-100">
        {/* Action buttons maintain correct alignment through natural flow */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleDelete}
            aria-label={t('managementTable.deleteProduct', {
              name: product.name,
            })}
            className="w-[30px] h-[30px] flex items-center justify-center border border-gray-200  hover:bg-red-50 hover:border-red-200 transition-colors rounded-full"
          >
            <Trash className="text-red-500" size={16} />
          </button>
          <button
            aria-label={t('managementTable.editProduct', {
              name: product.name,
            })}
            className="w-[30px] h-[30px] flex items-center justify-center border border-gray-200  hover:bg-gray-100 transition-colors rounded-full"
          >
            <SquarePen size={16}  />
          </button>
        </div>
      </td>
    </tr>
  );
}