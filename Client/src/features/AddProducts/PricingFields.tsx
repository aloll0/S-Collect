// pages/AddProduct/PricingFields.tsx
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProductFormData } from './types';

interface PricingFieldsProps {
  formData: Pick<ProductFormData, 'basePrice' | 'comparePrice' | 'sku'>;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PricingFields = ({ formData, onChange }: PricingFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <h6 className="pt-6 font-semibold">{t('addProduct.pricingRules')}</h6>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            {t('addProduct.basePrice')} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={onChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-950 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            {t('addProduct.comparePrice')}{' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="comparePrice"
            value={formData.comparePrice}
            onChange={onChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-950 focus:outline-none"
          />
        </div>
      </div>

      <div className="max-w-md">
        <label className="mb-2 block font-medium">
          {t('addProduct.sku')} <span className="text-red-500">*</span>
        </label>
        <input
          name="sku"
          value={formData.sku}
          onChange={onChange}
          placeholder="SKU-001"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-950 focus:outline-none"
        />
      </div>
    </>
  );
};

export default PricingFields;
