import { useRef, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useTranslation } from 'react-i18next';
import { CATEGORIES } from './constant';
import { ChevronUp } from 'lucide-react';
const DD_MENU =
  'absolute top-[calc(100%+6px)] left-0 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden';

const DD_ITEM =
  'flex items-center gap-2.5 px-3.5 py-2.5 text-sm cursor-pointer hover:bg-gray-50';

interface CategoryDropdownProps {
  selected: string[];
  onChange: (cats: string[]) => void;
}

function CategoryDropdown({ selected, onChange }: CategoryDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  const allSelected = selected.length === 0;
  const label = allSelected
    ? t('managementTable.category')
    : selected.length === 1
      ? t(`managementTable.categories.${selected[0]}`)
      : t('managementTable.categoriesCount', { count: selected.length });

  const toggle = (cat: string) =>
    onChange(
      selected.includes(cat)
        ? selected.filter((c) => c !== cat)
        : [...selected, cat]
    );

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1.5 h-9 px-3 border border-gray-200 rounded-lg bg-white text-sm cursor-pointer hover:bg-gray-50 whitespace-nowrap"
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronUp color="black" size={15} />
      </button>

      {open && (
        <div className={`${DD_MENU} min-w-[200px]`}>
          <div className={DD_ITEM} onClick={() => onChange([])}>
            <input
              type="checkbox"
              readOnly
              checked={allSelected}
              className="accent-black w-3.5 h-3.5 cursor-pointer"
            />
            <span>{t('managementTable.allCategories')}</span>
          </div>
          <div className="h-px bg-gray-100 my-1" />
          {CATEGORIES.map((cat) => (
            <div key={cat} className={DD_ITEM} onClick={() => toggle(cat)}>
              <input
                type="checkbox"
                readOnly
                checked={selected.includes(cat)}
                className="accent-black w-3.5 h-3.5 cursor-pointer"
              />
              <span>{t(`managementTable.categories.${cat}`)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;
