import { useState, useMemo } from 'react';
import { Switch } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  Tag,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  GripVertical,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBreakpoint } from '../hooks/useBreakpoint';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  productsCount: number;
  isActive: boolean;
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const INITIAL_CATEGORIES: Category[] = [
  {
    id: '1',
    nameEn: 'Handicrafts',
    nameAr: 'الحرف اليدوية',
    slug: 'handicrafts',
    productsCount: 245,
    isActive: false,
  },
  {
    id: '2',
    nameEn: 'Electronics',
    nameAr: 'إلكترونيات',
    slug: 'electronics',
    productsCount: 126,
    isActive: true,
  },
  {
    id: '3',
    nameEn: 'Clothing',
    nameAr: 'ملابس',
    slug: 'clothing',
    productsCount: 542,
    isActive: true,
  },
  {
    id: '4',
    nameEn: 'Home Decor',
    nameAr: 'ديكور المنزل',
    slug: 'home-decor',
    productsCount: 312,
    isActive: false,
  },
  {
    id: '5',
    nameEn: 'Books',
    nameAr: 'كتب',
    slug: 'books',
    productsCount: 89,
    isActive: true,
  },
  {
    id: '6',
    nameEn: 'Beauty',
    nameAr: 'تجميل',
    slug: 'beauty',
    productsCount: 156,
    isActive: true,
  },
  {
    id: '7',
    nameEn: 'Jewelry',
    nameAr: 'مجوهرات',
    slug: 'jewelry',
    productsCount: 74,
    isActive: false,
  },
  {
    id: '8',
    nameEn: 'Collectibles',
    nameAr: 'مقتنيات',
    slug: 'collectibles',
    productsCount: 38,
    isActive: true,
  },
  {
    id: '9',
    nameEn: 'Rare Trading Cards',
    nameAr: 'بطاقات تداول نادرة',
    slug: 'rare-trading-cards',
    productsCount: 21,
    isActive: true,
  },
  {
    id: '10',
    nameEn: 'Sports',
    nameAr: 'رياضة',
    slug: 'sports',
    productsCount: 198,
    isActive: true,
  },
];

const ITEMS_PER_PAGE = 8;

// ─── Slug generator ───────────────────────────────────────────────────────────
const toSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <Switch
    checked={checked}
    onChange={onChange}
    className={`${
      checked ? 'bg-green' : 'bg-gray-300'
    } relative inline-flex h-6 w-11 items-center cursor-pointer rounded-full transition-colors`}
  >
    <span
      className={`${
        checked
          ? 'translate-x-6 rtl:-translate-x-6'
          : 'translate-x-1 rtl:-translate-x-1'
      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
    />
  </Switch>
);

// ─── Status Confirmation Modal ─────────────────────────────────────────────────
interface StatusConfirmModalProps {
  isOpen: boolean;
  categoryName: string;
  currentStatus: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const StatusConfirmModal = ({
  isOpen,
  categoryName,
  currentStatus,
  onClose,
  onConfirm,
}: StatusConfirmModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        key="status-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 overflow-hidden"
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 inline-flex items-center justify-center h-7 w-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="px-6 pt-8 pb-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
              <AlertTriangle size={24} className="text-amber-500" />
            </div>

            <h3 className="text-label-lg font-semibold text-gray-900 mb-2">
              Change Status
            </h3>
            <p className="text-body-sm text-gray-500 mb-6 leading-relaxed">
              Are you sure you want to{' '}
              <span className={`font-semibold ${currentStatus ? 'text-red' : 'text-green'}`}>
                {currentStatus ? 'deactivate' : 'activate'}
              </span>{' '}
              &ldquo;{categoryName}&rdquo;?
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-label-md font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-xl text-white text-label-md font-semibold active:scale-[0.98] transition-all cursor-pointer ${
                  currentStatus
                    ? 'bg-red hover:bg-red/90'
                    : 'bg-green hover:bg-green/90'
                }`}
              >
                {currentStatus ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Category Form Modal ───────────────────────────────────────────────────────
interface CategoryFormModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  category?: Category | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: Omit<Category, 'id' | 'productsCount'>) => void;
}

const CategoryFormModal = ({
  isOpen,
  mode,
  category,
  categories,
  onClose,
  onSave,
}: CategoryFormModalProps) => {
  const { t, i18n } = useTranslation();
  const [nameEn, setNameEn] = useState(category?.nameEn ?? '');
  const [nameAr, setNameAr] = useState(category?.nameAr ?? '');
  const [slug, setSlug] = useState(category?.slug ?? '');
  const [isActive, setIsActive] = useState(category?.isActive ?? true);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [touchedEn, setTouchedEn] = useState(false);
  const [touchedAr, setTouchedAr] = useState(false);

  const isNameEnValid = nameEn.trim().length >= 2 && nameEn.trim().length <= 50;
  const isNameArValid = nameAr.trim().length >= 2 && nameAr.trim().length <= 50;

  const isDuplicateEn = categories.some(
    (c) => c.id !== category?.id && c.nameEn.trim().toLowerCase() === nameEn.trim().toLowerCase()
  );
  const isDuplicateAr = categories.some(
    (c) => c.id !== category?.id && c.nameAr.trim().toLowerCase() === nameAr.trim().toLowerCase()
  );
  const isDuplicate = isDuplicateEn || isDuplicateAr;

  const isValid = isNameEnValid && isNameArValid && !isDuplicate;

  const handleNameEnChange = (val: string) => {
    setNameEn(val);
    setTouchedEn(true);
    if (!slugManuallyEdited) {
      setSlug(toSlug(val));
    }
  };

  const handleNameArChange = (val: string) => {
    setNameAr(val);
    setTouchedAr(true);
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setSlugManuallyEdited(true);
  };

  const handleSave = () => {
    if (!isValid) return;
    onSave({ nameEn: nameEn.trim(), nameAr: nameAr.trim(), slug, isActive });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="form-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="text-label-lg font-semibold text-gray-900">
                {mode === 'add' ? t('categories.modal.addCategory') : t('categories.modal.editCategory')}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Category Name EN */}
              <div>
                <label className="block text-body-sm font-medium text-gray-700 mb-1.5">
                  {t('categories.modal.nameEn')} <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => handleNameEnChange(e.target.value)}
                  onBlur={() => setTouchedEn(true)}
                  placeholder={t('categories.modal.nameEnPlaceholder')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-body-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                    touchedEn && !isNameEnValid
                      ? 'border-red focus:border-red focus:ring-red'
                      : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
                  }`}
                />
                {touchedEn && !isNameEnValid && (
                  <p className="text-xs text-red mt-1.5">
                    {i18n.language === 'ar'
                      ? 'يجب أن يكون اسم الفئة بين 2 و 50 حرفاً'
                      : 'Category name must be between 2 and 50 characters.'}
                  </p>
                )}
                {isDuplicateEn && (
                  <p className="text-xs text-red mt-1.5">
                    {i18n.language === 'ar'
                      ? 'اسم الفئة موجود مسبقا يرجى اختيار اسم مختلف'
                      : 'Category name already exists. Please choose a different name.'}
                  </p>
                )}
              </div>

              {/* Category Name AR */}
              <div>
                <label className="block text-body-sm font-medium text-gray-700 mb-1.5">
                  {t('categories.modal.nameAr')} <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => handleNameArChange(e.target.value)}
                  onBlur={() => setTouchedAr(true)}
                  placeholder={t('categories.modal.nameArPlaceholder')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-body-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                    touchedAr && !isNameArValid
                      ? 'border-red focus:border-red focus:ring-red'
                      : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
                  }`}
                />
                {touchedAr && !isNameArValid && (
                  <p className="text-xs text-red mt-1.5">
                    {i18n.language === 'ar'
                      ? 'يجب أن يكون اسم الفئة بين 2 و 50 حرفاً'
                      : 'Category name must be between 2 and 50 characters.'}
                  </p>
                )}
                {isDuplicateAr && (
                  <p className="text-xs text-red mt-1.5">
                    {i18n.language === 'ar'
                      ? 'اسم الفئة موجود مسبقا يرجى اختيار اسم مختلف'
                      : 'Category name already exists. Please choose a different name.'}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-body-sm font-medium text-gray-700 mb-1.5">
                  {t('categories.modal.slug')}
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder={t('categories.modal.slugPlaceholder')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-body-sm text-gray-500 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-gray-50/60"
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <label className="text-body-sm font-medium text-gray-700">{t('categories.modal.status')}</label>
                <Toggle checked={isActive} onChange={setIsActive} />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 space-y-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={!isValid}
                className="w-full py-3 rounded-xl bg-gray-950 text-white text-label-md font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer"
              >
                {t('categories.modal.save')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-label-md font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all cursor-pointer"
              >
                {t('categories.modal.cancel')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Delete Confirmation Modal ─────────────────────────────────────────────────
interface DeleteModalProps {
  isOpen: boolean;
  categoryName: string;
  count?: number;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({ isOpen, categoryName, count, onClose, onConfirm }: DeleteModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        key="delete-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm z-10 overflow-hidden"
          initial={{ scale: 0.92, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Close btn */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 inline-flex items-center justify-center h-7 w-7 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="px-6 pt-8 pb-6 text-center">
            {/* Icon */}
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-light">
              <Trash2 size={24} className="text-red" />
            </div>

            <h3 className="text-label-lg font-semibold text-gray-900 mb-2">
              Delete {count && count > 1 ? `${count} Categories` : 'Category'}
            </h3>
            <p className="text-body-sm text-gray-500 mb-6 leading-relaxed">
              {count && count > 1
                ? `Are you sure you want to delete ${count} selected categories? This action cannot be undone.`
                : <>Are you sure you want to delete &ldquo;{categoryName}&rdquo;? This action cannot be undone.</>
              }
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-label-md font-medium text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red text-white text-label-md font-semibold hover:bg-red/90 active:scale-[0.98] transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

interface SortableRowProps {
  category: Category;
  selectedIds: Set<string>;
  onSelectOne: (id: string) => void;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
  onToggleActive: (c: Category) => void;
}

const SortableRow = ({
  category: cat,
  selectedIds,
  onSelectOne,
  onEdit,
  onDelete,
  onToggleActive,
}: SortableRowProps) => {
  const { i18n } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: cat.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: isDragging ? ('relative' as const) : undefined,
    zIndex: isDragging ? 99 : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-gray-100 transition-colors group ${
        selectedIds.has(cat.id) ? 'bg-gray-50' : 'hover:bg-gray-50/60'
      } ${isDragging ? 'bg-white shadow-xl' : ''}`}
    >
      {/* Drag Handle */}
      <td className="py-3.5 pl-4 pr-1 w-8">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>
      </td>

      {/* Checkbox */}
      <td className="py-3.5 px-4 w-10">
        <input
          type="checkbox"
          checked={selectedIds.has(cat.id)}
          onChange={() => onSelectOne(cat.id)}
          className="h-4 w-4 rounded border-gray-300 accent-gray-900 cursor-pointer"
        />
      </td>

      {/* Category Name */}
      <td className="py-3.5 px-4">
        <p className="font-semibold text-gray-900">
          {i18n.language === 'ar' ? cat.nameAr : cat.nameEn}
        </p>
      </td>

      {/* Slug */}
      <td className="py-3.5 px-4">
        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-lg">
          {cat.slug}
        </span>
      </td>

      {/* Products Count */}
      <td className="py-3.5 px-4">
        <span className="font-medium text-gray-900">{cat.productsCount}</span>
      </td>

      {/* Active Toggle */}
      <td className="py-3.5 px-4">
        <Toggle checked={cat.isActive} onChange={() => onToggleActive(cat)} />
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(cat)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(cat)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-red hover:bg-red-light transition-all cursor-pointer"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── Desktop Table ─────────────────────────────────────────────────────────────
interface DesktopTableProps {
  categories: Category[];
  selectedIds: Set<string>;
  onSelectOne: (id: string) => void;
  onSelectAll: () => void;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
  onToggleActive: (c: Category) => void;
}

const DesktopTable = ({
  categories,
  selectedIds,
  onSelectOne,
  onSelectAll,
  onEdit,
  onDelete,
  onToggleActive,
}: DesktopTableProps) => {
  const { t } = useTranslation();
  const allSelected = categories.length > 0 && categories.every((c) => selectedIds.has(c.id));
  const someSelected = categories.some((c) => selectedIds.has(c.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/70">
            {/* Empty for drag handle */}
            <th className="py-3.5 pl-4 pr-1 w-8"></th>
            {/* Select All checkbox */}
            <th className="py-3.5 px-4 w-10">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected;
                }}
                onChange={onSelectAll}
                className="h-4 w-4 rounded border-gray-300 accent-gray-900 cursor-pointer"
              />
            </th>
            {[
              t('categories.columns.category'),
              t('categories.columns.slug'),
              t('categories.columns.productsCount'),
              t('categories.columns.status'),
              t('categories.columns.actions'),
            ].map((h) => (
              <th
                key={h}
                className="text-left rtl:text-right py-3.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {categories.map((cat) => (
              <SortableRow
                key={cat.id}
                category={cat}
                selectedIds={selectedIds}
                onSelectOne={onSelectOne}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
              />
            ))}
          </SortableContext>
        </tbody>
      </table>

      {categories.length === 0 && (
        <div className="py-16 text-center">
          <Tag size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No categories found</p>
        </div>
      )}
    </div>
  );
};

// ─── Mobile Card ───────────────────────────────────────────────────────────────
interface MobileCardProps {
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
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-red hover:bg-red-light transition-all cursor-pointer"
          >
            <Trash2 size={15} />
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

// ─── Pagination ────────────────────────────────────────────────────────────────
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between gap-4 flex-wrap">
      <p className="text-xs text-gray-400">
        Showing{' '}
        <span className="font-medium text-gray-700">{start}–{end}</span> of{' '}
        <span className="font-medium text-gray-700">{totalItems}</span> categories
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              p === currentPage
                ? 'bg-gray-950 text-white shadow-sm'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ─── Bulk Action Navbar ────────────────────────────────────────────────────────
interface BulkNavbarProps {
  selectedCount: number;
  onDelete: () => void;
  onClearSelection: () => void;
}

const BulkNavbar = ({ selectedCount, onDelete, onClearSelection }: BulkNavbarProps) => (
  <AnimatePresence>
    {selectedCount > 0 && (
      <motion.div
        key="bulk-navbar"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="flex items-center gap-3 bg-gray-950 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-black/30 border border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/15 text-xs font-bold">
              {selectedCount}
            </span>
            <span className="text-sm font-medium text-white/80">
              {selectedCount === 1 ? 'category' : 'categories'} selected
            </span>
          </div>

          <div className="w-px h-5 bg-white/20" />

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red text-white text-sm font-semibold hover:bg-red/90 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            Delete {selectedCount > 1 ? `(${selectedCount})` : ''}
          </button>

          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Clear selection"
          >
            <X size={15} />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Main Categories Page ──────────────────────────────────────────────────────
const Categories = () => {
  const { t, i18n } = useTranslation();
  const { isMobile } = useBreakpoint();

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: 'add' | 'edit';
    category: Category | null;
  }>({ open: false, mode: 'add', category: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    category: Category | null;
    isBulk: boolean;
  }>({ open: false, category: null, isBulk: false });

  const [statusModal, setStatusModal] = useState<{
    open: boolean;
    category: Category | null;
  }>({ open: false, category: null });

  const filtered = useMemo(() => {
    let result = categories;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.nameEn.toLowerCase().includes(q) || c.nameAr.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'all') {
      result = result.filter((c) => c.id === categoryFilter);
    }
    return result;
  }, [categories, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };
  const handleCategoryFilter = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  // ── Selection ──
  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    const pageIds = paginated.map((c) => c.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  // ── Modals ──
  const openAdd = () => setFormModal({ open: true, mode: 'add', category: null });
  const openEdit = (category: Category) =>
    setFormModal({ open: true, mode: 'edit', category });
  const openDelete = (category: Category) =>
    setDeleteModal({ open: true, category, isBulk: false });
  const openBulkDelete = () =>
    setDeleteModal({ open: true, category: null, isBulk: true });
  const closeForm = () => setFormModal((prev) => ({ ...prev, open: false }));
  const closeDelete = () => setDeleteModal({ open: false, category: null, isBulk: false });

  const handleSave = (data: Omit<Category, 'id' | 'productsCount'>) => {
    if (formModal.mode === 'add') {
      const newCat: Category = {
        ...data,
        id: String(Date.now()),
        productsCount: 0,
      };
      setCategories((prev) => [newCat, ...prev]);
    } else if (formModal.category) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === formModal.category!.id ? { ...c, ...data } : c
        )
      );
    }
    closeForm();
  };

  const handleDelete = () => {
    if (deleteModal.isBulk) {
      const selectedCats = categories.filter((c) => selectedIds.has(c.id));
      const hasProducts = selectedCats.some((c) => c.productsCount > 0);
      if (hasProducts) {
        toast.error(
          i18n.language === 'ar'
            ? 'لا يمكن حذف فئة تحتوي منتجات — سواء كانت نشطة أو موقوفة. يجب نقل جميع المنتجات لفئة أخرى أو حذفها أولاً.'
            : 'Cannot delete a category containing products. Move or delete the products first.'
        );
        closeDelete();
        return;
      }
      setCategories((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      clearSelection();
    } else if (deleteModal.category) {
      if (deleteModal.category.productsCount > 0) {
        toast.error(
          i18n.language === 'ar'
            ? `لا يمكن حذف هذه الفئة — تحتوي على ${deleteModal.category.productsCount} منتج. انقل المنتجات أولاً.`
            : `Cannot delete this category — it contains ${deleteModal.category.productsCount} products. Move the products first.`
        );
        closeDelete();
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== deleteModal.category!.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteModal.category!.id);
        return next;
      });
    }
    closeDelete();
  };

  const handleToggleActiveRequest = (cat: Category) => {
    setStatusModal({ open: true, category: cat });
  };

  const handleStatusConfirm = () => {
    if (statusModal.category) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === statusModal.category!.id ? { ...c, isActive: !c.isActive } : c
        )
      );
    }
    setStatusModal({ open: false, category: null });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((c) => c.id === active.id);
        const newIndex = items.findIndex((c) => c.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto py-6 sidebar-page-container">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-h6 sm:text-h5 font-bold text-gray-900">
            {isMobile ? 'Product Management' : 'Category Management'}
          </h1>
          {!isMobile && (
            <p className="text-body-sm text-gray-500 mt-1">
              {t('categories.description')}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={openAdd}
          className={`inline-flex items-center gap-2 rounded-xl font-semibold transition-all active:scale-95 cursor-pointer shadow-sm ${
            isMobile
              ? 'h-10 w-10 justify-center bg-gray-950 text-white'
              : 'px-4 py-2.5 bg-gray-950 text-white text-label-md hover:bg-gray-800'
          }`}
        >
          <Plus size={18} />
          {!isMobile && <span>Add Category</span>}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('categories.filter.search')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-body-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-white"
          />
        </div>

        <div className="relative shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-body-sm text-gray-700 focus:outline-none focus:border-gray-900 transition-all bg-white cursor-pointer"
          >
            <option value="all">{t('categories.filter.all')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {i18n.language === 'ar' ? c.nameAr : c.nameEn}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isMobile ? (
          <div>
            <AnimatePresence>
              {paginated.map((cat) => (
                <MobileCard
                  key={cat.id}
                  category={cat}
                  selected={selectedIds.has(cat.id)}
                  onSelect={() => handleSelectOne(cat.id)}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  onToggleActive={handleToggleActiveRequest}
                />
              ))}
            </AnimatePresence>
            {paginated.length === 0 && (
              <div className="py-16 text-center">
                <Tag size={36} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No categories found</p>
              </div>
            )}
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <DesktopTable
              categories={paginated}
              selectedIds={selectedIds}
              onSelectOne={handleSelectOne}
              onSelectAll={handleSelectAll}
              onEdit={openEdit}
              onDelete={openDelete}
              onToggleActive={handleToggleActiveRequest}
            />
          </DndContext>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Bulk Delete Bottom Navbar */}
      <BulkNavbar
        selectedCount={selectedIds.size}
        onDelete={openBulkDelete}
        onClearSelection={clearSelection}
      />

      {/* Add / Edit Modal */}
      <CategoryFormModal
        key={formModal.open ? (formModal.category?.id ?? 'add-new') : 'closed'}
        isOpen={formModal.open}
        mode={formModal.mode}
        category={formModal.category}
        categories={categories}
        onClose={closeForm}
        onSave={handleSave}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModal.open}
        categoryName={
          i18n.language === 'ar'
            ? deleteModal.category?.nameAr ?? ''
            : deleteModal.category?.nameEn ?? ''
        }
        count={deleteModal.isBulk ? selectedIds.size : undefined}
        onClose={closeDelete}
        onConfirm={handleDelete}
      />

      {/* Status Confirmation Modal */}
      <StatusConfirmModal
        isOpen={statusModal.open}
        categoryName={
          i18n.language === 'ar'
            ? statusModal.category?.nameAr ?? ''
            : statusModal.category?.nameEn ?? ''
        }
        currentStatus={statusModal.category?.isActive ?? false}
        onClose={() => setStatusModal({ open: false, category: null })}
        onConfirm={handleStatusConfirm}
      />
    </div>
  );
};

export default Categories;
