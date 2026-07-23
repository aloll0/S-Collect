import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import PortalDropdown from '../../../components/ui/PortalDropdown';
import { VENDOR_CATEGORIES } from '../data/constant';

const DD_ITEM =
  'flex items-center gap-2.5 px-3.5 py-2.5 text-sm cursor-pointer hover:bg-gray-50';

interface VendorCategoryDropdownProps {
  selected: string;
  onChange: (cat: string) => void;
}

export default function VendorCategoryDropdown({
  selected,
  onChange,
}: VendorCategoryDropdownProps) {
  const { t } = useTranslation();
  const label = selected || t('vendors.table.category');

  return (
    <PortalDropdown
      minWidth={180}
      animate={false}
      menuClassName="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
      trigger={({ isOpen, toggle }) => (
        <button
          className="flex items-center gap-1.5 h-9 px-3 border border-gray-200 rounded-lg bg-white text-sm cursor-pointer hover:bg-gray-50 whitespace-nowrap"
          onClick={toggle}
        >
          {label}
          <ChevronDown
            color="black"
            size={15}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
      )}
    >
      {({ close }) => (
        <>
          <div
            className={DD_ITEM}
            onClick={() => {
              onChange('');
              close();
            }}
          >
            <input
              type="radio"
              readOnly
              checked={selected === ''}
              className="accent-black w-3.5 h-3.5 cursor-pointer"
            />
            <span>{t('vendors.table.allCategories')}</span>
          </div>
          <div className="h-px bg-gray-100 my-1" />
          {VENDOR_CATEGORIES.map((cat) => (
            <div
              key={cat}
              className={DD_ITEM}
              onClick={() => {
                onChange(cat);
                close();
              }}
            >
              <input
                type="radio"
                readOnly
                checked={selected === cat}
                className="accent-black w-3.5 h-3.5 cursor-pointer"
              />
              <span>{cat}</span>
            </div>
          ))}
        </>
      )}
    </PortalDropdown>
  );
}
