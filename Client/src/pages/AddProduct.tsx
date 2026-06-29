import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ProductMedia from '../components/ui/ProductMedia';
import ProductStatus from '../components/ui/ProductStatus';
import ReviewPage from '../features/AddProducts/ReviewPage';
import BasicInfoFields from '../features/AddProducts/BasicInfoFields';
import QuantityInput from '../features/AddProducts/QuantityInput';
import TagInput from '../features/AddProducts/TagInput';
import PricingFields from '../features/AddProducts/PricingFields';
import SuccessPopup from '../features/AddProducts/SuccessPopup';
import MobileAddProduct from '../features/AddProducts/mobile/MobileAddProduct';
import type { ProductFormData } from '../features/AddProducts/types';
import { useBreakpoint } from '../hooks/useBreakpoint';

const AddProduct = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  const [enabled, setEnabled] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const methods = useForm<ProductFormData>({
    defaultValues: {
      nameAr: '',
      nameEn: '',
      description: '',
      basePrice: '',
      comparePrice: '',
      sku: '',
    },
  });

  const makeAdder =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (value: string) =>
      setter((prev) => [...prev, value]);

  const makeRemover =
    (setter: React.Dispatch<React.SetStateAction<string[]>>, list: string[]) =>
    (index: number) =>
      setter(list.filter((_, i) => i !== index));

  const onSubmit = () => {
    setShowReview(true);
  };

  if (isMobile) {
    return <MobileAddProduct />;
  }

  if (showReview) {
    return (
      <ReviewPage
        formData={methods.getValues()}
        categories={categories}
        sizes={sizes}
        colors={colors}
        quantity={quantity}
        onPrevious={() => setShowReview(false)}
        onPublish={() => {
          setShowReview(false);
          setIsSuccess(true);
          navigate('/');
        }}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 px-4 py-6 md:p-8">
      <div className="mb-6 md:mb-8 md:ml-4">
        <h1 className="text-h5 font-bold">{t('addProduct.title')}</h1>
        <p className="mt-2 text-body-sm text-gray-500">
          {t('addProduct.subtitle')}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm md:p-6 md:shadow-none">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_400px] xl:gap-10">
          {/* Left */}
          <div>
            <h5 className="mb-6 font-semibold">
              {t('addProduct.productInformation')}
            </h5>

            <FormProvider {...methods}>
              <form
                id="add-product-form"
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <BasicInfoFields />

                <QuantityInput value={quantity} onChange={setQuantity} />

                <TagInput
                  label={t('addProduct.categories')}
                  required
                  items={categories}
                  onAdd={makeAdder(setCategories)}
                  onRemove={makeRemover(setCategories, categories)}
                  placeholder={t('addProduct.enterCategory')}
                  addLabel={t('addProduct.addCategory')}
                  addBtnLabel={t('addProduct.add')}
                  cancelBtnLabel={t('addProduct.cancel')}
                />

                <TagInput
                  label={t('addProduct.sizes')}
                  required
                  items={sizes}
                  onAdd={makeAdder(setSizes)}
                  onRemove={makeRemover(setSizes, sizes)}
                  placeholder={t('addProduct.enterSize')}
                  addLabel={t('addProduct.addSize')}
                  addBtnLabel={t('addProduct.add')}
                  cancelBtnLabel={t('addProduct.cancel')}
                />

                <TagInput
                  label={t('addProduct.colors')}
                  required
                  items={colors}
                  onAdd={makeAdder(setColors)}
                  onRemove={makeRemover(setColors, colors)}
                  placeholder={t('addProduct.enterColor')}
                  addLabel={t('addProduct.addColor')}
                  addBtnLabel={t('addProduct.add')}
                  cancelBtnLabel={t('addProduct.cancel')}
                />

                <PricingFields />
              </form>
            </FormProvider>
          </div>

          {/* Right */}
          <div>
            <ProductMedia />
            <div className="mt-8">
              <ProductStatus enabled={enabled} setEnabled={setEnabled} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4">
          <button className="rounded-xl border border-red-500 px-6 py-3 text-red-500 transition hover:bg-red-50 cursor-pointer">
            {t('addProduct.cancel')}
          </button>
          <button
            type="submit"
            form="add-product-form"
            className="rounded-xl bg-gray-950 px-6 py-3 text-white transition hover:bg-gray-800 cursor-pointer"
          >
            {t('addProduct.continue')}
          </button>
        </div>
      </div>

      {isSuccess && <SuccessPopup onClose={() => setIsSuccess(false)} />}
    </div>
  );
};

export default AddProduct;
