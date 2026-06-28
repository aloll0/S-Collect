import { Switch } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

interface ProductStatusProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

const ProductStatus = ({ enabled, setEnabled }: ProductStatusProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h6 className="font-semibold">
          {t("addProduct.productStatus")}
        </h6>

        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? "bg-green" : "bg-gray-300"
          } relative  inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              enabled
                ? 'translate-x-6 rtl:-translate-x-6'
                : 'translate-x-1 rtl:-translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
          />
        </Switch>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm text-gray-500">Visibility</h3>
        <label className="flex gap-2">
          <input type="checkbox" className="w-4 h-4 accent-black" defaultChecked />
          {t("addProduct.homepage")}
        </label>

        <label className="flex gap-2"> 
          <input type="checkbox" className="w-4 h-4 accent-black" defaultChecked />
          {t("addProduct.promotions")}
        </label>

        <label className="flex gap-2">
          <input type="checkbox" className="w-4 h-4 accent-black" defaultChecked />
          {t("addProduct.searchResults")}
        </label>
      </div>
    </div>
  );
};

export default ProductStatus;
