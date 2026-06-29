import { useTranslation } from 'react-i18next';

export const InventoryHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      <h5 className="font-bold text-gray-900">{t('inventoryPage.title')}</h5>
      <p className="text-gray-500 mt-1">{t('inventoryPage.subtitle')}</p>
    </div>
  );
};

export default InventoryHeader;
