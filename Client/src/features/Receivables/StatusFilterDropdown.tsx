import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import PortalDropdown from '../../components/ui/PortalDropdown';
import { STATUS_FILTERS, type TransactionStatus } from './constants';

type StatusFilter = TransactionStatus | 'all';

export default function StatusFilterDropdown({
  selected,
  onChange,
}: {
  selected: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
  const { t } = useTranslation();

  const options: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: t('receivables.all') },
    ...STATUS_FILTERS.map((s) => ({
      value: s as StatusFilter,
      label: t(`receivables.statuses.${s}`),
    })),
  ];

  const current = options.find((o) => o.value === selected);

  return (
    <PortalDropdown
      align="right"
      minWidth={160}
      animate
      menuClassName="bg-white rounded-lg border border-gray-200 shadow-lg py-1 overflow-hidden"
      trigger={({ isOpen, toggle }) => (
        <button
          onClick={toggle}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 h-9 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {current?.label}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} className="text-gray-400" />
          </motion.span>
        </button>
      )}
    >
      {({ close }) => (
        <>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                close();
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                option.value === selected
                  ? 'bg-gray-50 font-semibold text-gray-900'
                  : 'text-gray-600'
              }`}
            >
              {option.label}
              {option.value === selected && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-auto text-gray-900"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </>
      )}
    </PortalDropdown>
  );
}
