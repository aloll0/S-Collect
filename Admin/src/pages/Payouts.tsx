import { useTranslation } from 'react-i18next';

const Payouts = () => {
  const { t } = useTranslation();

  return (
    <div className="sidebar-page-container-header flex items-center justify-between  bg-gray-50">
      <div>
        <h1 className="heading-page-title">{t('payouts.title')}</h1>
        <p className="text-gray-500">{t('payouts.description')}</p>
      </div>
    </div>
  );
};

export default Payouts;
