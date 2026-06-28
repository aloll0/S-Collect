// pages/AddProduct/BasicInfoFields.tsx
import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProductFormData } from './types';

interface BasicInfoFieldsProps {
  formData: Pick<ProductFormData, 'nameAr' | 'nameEn' | 'description'>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoFields = ({ formData, onChange }: BasicInfoFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <label className="mb-2 block font-medium">
          {t('addProduct.nameAr')} <span className="text-red-500">*</span>
        </label>
        <input
          name="nameAr"
          required
          value={formData.nameAr}
          onChange={onChange}
          placeholder={t('addProduct.nameArPlaceholder')}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-gray-950 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          {t('addProduct.nameEn')} <span className="text-red-500">*</span>
        </label>
        <input
          name="nameEn"
          required
          value={formData.nameEn}
          onChange={onChange}
          placeholder={t('addProduct.nameEnPlaceholder')}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-gray-950 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium">
          {t('addProduct.description')} <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder={t('addProduct.descriptionPlaceholder')}
          className="w-full rounded-xl border border-gray-300 p-4 focus:border-gray-950 focus:outline-none"
        />
      </div>
    </>
  );
};

export default BasicInfoFields;
