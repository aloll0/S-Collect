import { useTranslation } from 'react-i18next';

interface InventoryFooterProps {
  onSave: () => void;
}

export const InventoryFooter = ({ onSave }: InventoryFooterProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end mt-5">
      <button
        onClick={onSave}
        className="bg-gray-900 text-gray-50 px-6 py-2.5 rounded-lg text-label-md font-semibold hover:bg-gray-800 transition-colors"
      >
        {t('inventoryPage.saveChanges')}
      </button>
    </div>
  );
};
