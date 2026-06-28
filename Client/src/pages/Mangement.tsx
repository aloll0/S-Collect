import { useTranslation } from 'react-i18next';
import ManagementTable from '../features/mangement/ManagementTable';
import { Link } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';

const Management = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center justify-between mb-10 bg-gray-50 px-4 lg:px-14 ">
        <h1 className="text-h4 py-5">{t('managementTable.title')}</h1>
        <Link
          to={'/add-product'}
          className="flex items-center gap-2 text-lg font-medium bg-black text-white hover:bg-gray-800 transition-colors rounded-lg px-6 py-2"
        >
          <PlusIcon size={22} />

          {t('Add Product')}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-4 lg:px-14 pt-0 bg-[#f5f7fb]">
        <ManagementTable />
      </div>
    </>
  );
};

export default Management;
