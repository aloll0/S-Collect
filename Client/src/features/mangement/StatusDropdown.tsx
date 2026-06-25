import { useTranslation } from 'react-i18next';
import type { StatusFilter } from './mangement';
import { useRef, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { STATUS_FILTERS } from './constant';
import { ChevronUp } from 'lucide-react';

const DD_BTN =
  'flex items-center gap-1.5 h-9 px-3 border border-gray-200 rounded-lg bg-white text-sm cursor-pointer hover:bg-gray-50 whitespace-nowrap';

const DD_MENU =
  'absolute top-[calc(100%+6px)] left-0 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden';

const DD_ITEM =
  'flex items-center gap-2.5 px-3.5 py-2.5 text-sm cursor-pointer hover:bg-gray-50';

interface StatusDropdownProps {
  selected: StatusFilter;
  onChange: (s: StatusFilter) => void;
}

function StatusDropdown({ selected, onChange }: StatusDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button className={DD_BTN} onClick={() => setOpen(!open)}>
        {selected === 'All'
          ? t('managementTable.status')
          : t(`managementTable.statuses.${selected}`)}
        <ChevronUp color="black" size={15} />
      </button>

      {open && (
        <div className={`${DD_MENU} min-w-[180px]`}>
          {STATUS_FILTERS.map((s) => (
            <div
              key={s}
              className={DD_ITEM}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
            >
              <input
                type="radio"
                readOnly
                checked={selected === s}
                className="accent-black w-3.5 h-3.5 cursor-pointer"
              />
              <span>
                {s === 'All'
                  ? t('managementTable.allStatuses')
                  : t(`managementTable.statuses.${s}`)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusDropdown;
