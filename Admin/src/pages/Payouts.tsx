import { useTranslation } from 'react-i18next';

const Payouts = () => {
  const { t } = useTranslation();

  return (
    <div className="sidebar-page-container flex items-center justify-between mb-10 bg-gray-50">
      <div>
        <h1 className="text-h4 py-2">{t('payouts.title')}</h1>
        <p className="text-gray-500 pb-2">{t('payouts.description')}</p>
      </div>
    </div>
  );
};

export default Payouts;
