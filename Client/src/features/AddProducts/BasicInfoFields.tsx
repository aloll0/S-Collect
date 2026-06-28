import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import type { ProductFormData } from './types';

const BasicInfoFields = () => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const inputCls = (hasError?: string) =>
    `w-full rounded-xl border px-4 py-2.5 focus:outline-none ${hasError
      ? 'border-red-500 focus:border-red-500'
      : 'border-gray-300 focus:border-gray-950'
    }`;

  return (
    <>
      <div>
        <label className="mb-2 block font-medium">
          {t('addProduct.nameAr')} <span className="text-red-500">*</span>
        </label>
        <input
          className={inputCls(errors.nameAr?.message)}
          placeholder={t('addProduct.nameArPlaceholder')}
          {...register('nameAr', {
            required: t('addProduct.errors.nameArRequired'),
          })}
        />
        {errors.nameAr && (
          <p className="mt-1 text-sm text-red-500">
            {errors.nameAr.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium">
          {t('addProduct.nameEn')} <span className="text-red-500">*</span>
        </label>
        <input
          className={inputCls(errors.nameEn?.message)}
          placeholder={t('addProduct.nameEnPlaceholder')}
          {...register('nameEn', {
            required: t('addProduct.errors.nameEnRequired'),
          })}
        />
        {errors.nameEn && (
          <p className="mt-1 text-sm text-red-500">
            {errors.nameEn.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium">
          {t('addProduct.description')} <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          className={inputCls(errors.description?.message)}
          placeholder={t('addProduct.descriptionPlaceholder')}
          {...register('description', {
            required: t('addProduct.errors.descriptionRequired'),
          })}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>
    </>
  );
};

export default BasicInfoFields;
