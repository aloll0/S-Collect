import { useTranslation } from 'react-i18next';

const Products = () => {
  const { t } = useTranslation();

  return (
    <div className="sidebar-page-container flex items-center justify-between mb-10 bg-gray-50">
      <div>
        <h1 className="text-h4 py-2">{t('productsListing.title')}</h1>
        <p className="text-gray-500 pb-2">{t('productsListing.description')}</p>
      </div>
    </div>
  );
};

export default Products;
