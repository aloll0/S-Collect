import { SquarePen, Trash } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import type { Category } from '../types';
import Toggle from './Toggle';

// ─── Mobile Card ───────────────────────────────────────────────────────────────
export interface MobileCardProps {
  category: Category;
  selected: boolean;
  onSelect: () => void;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
  onToggleActive: (c: Category) => void;
}

const MobileCard = ({
  category,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onToggleActive,
}: MobileCardProps) => {
  const { i18n } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className={`border-b border-gray-100 px-4 py-4 transition-colors ${selected ? 'bg-gray-50' : 'bg-white'}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="h-4 w-4 rounded border-gray-300 accent-gray-900 cursor-pointer mt-1"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">
            {i18n.language === 'ar' ? category.nameAr : category.nameEn}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">slug: {category.slug}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-blue-50 transition-all cursor-pointer"
          >
            <SquarePen size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-red hover:bg-red-light transition-all cursor-pointer"
          >
            <Trash size={15} />
          </button>
        </div>
      </div>

      {/* Footer row */}
      <div className="mt-3 flex items-center justify-between pl-7">
        <div>
          <p className="text-xs text-gray-400">Products Count</p>
          <p className="text-sm font-semibold text-gray-900">{category.productsCount}</p>
        </div>
        <Toggle
          checked={category.isActive}
          onChange={() => onToggleActive(category)}
        />
      </div>
    </motion.div>
  );
};

export default MobileCard;
