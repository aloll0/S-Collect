import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';

import type { ProductFormData } from '../types';
import MobileStepIndicator from './MobileStepIndicator';
import MobileBasicInfoStep from './MobileBasicInfoStep';
import MobilePricingStep from './MobilePricingStep';
import MobileInventoryStep from './MobileInventoryStep';
import MobileReviewStep from './MobileReviewStep';
import { MobileLoadingPopup, MobileSuccessPopup } from './MobilePublishPopups';
import { useMobileAddProductStore } from './mobileAddProductStore';

const MobileAddProduct = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';

  const { step, isLoading, isSuccess, createdThumbnailUrl, previousStep, reset } =
    useMobileAddProductStore();

  const methods = useForm<ProductFormData>({
    defaultValues: {
      nameAr: '',
      nameEn: '',
      description: '',
      basePrice: '',
      comparePrice: '',
      sku: '',
      images: [],
      categoryId: '',
    },
  });

  const handleBack = () => (step > 1 ? previousStep() : navigate(-1));

  const handleDone = () => {
    reset();
    methods.reset();
    navigate('/management');
  };

  const stepTitles: Record<number, string> = {
    1: t('addProduct.mobile.basicInfo'),
    2: t('addProduct.mobile.pricing'),
    3: t('addProduct.mobile.inventory'),
    4: t('addProduct.mobile.reviewPublish'),
  };

  return (
    <FormProvider {...methods}>
      <div
        className="flex h-full flex-col bg-white font-sans"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5 bg-white">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-base font-bold text-gray-900">
            {t('addProduct.mobile.addProduct')}
          </h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {/* Step indicator */}
          <MobileStepIndicator />

          {/* Step title */}
          {step < 4 && (
            <h2 className="mb-5 text-lg font-bold text-gray-900">
              {stepTitles[step]}
            </h2>
          )}

          {/* Step content */}
          {step === 1 && <MobileBasicInfoStep />}

          {step === 2 && <MobilePricingStep />}

          {step === 3 && <MobileInventoryStep />}

          {step === 4 && <MobileReviewStep />}
        </div>

        {/* Popups */}
        {isLoading && <MobileLoadingPopup />}
        {isSuccess && <MobileSuccessPopup onClose={handleDone} thumbnailUrl={createdThumbnailUrl} />}
      </div>
    </FormProvider>
  );
};

export default MobileAddProduct;
