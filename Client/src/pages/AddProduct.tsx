import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductMedia from '../components/ui/ProductMedia';
import ProductStatus from '../components/ui/ProductStatus';
import { Plus } from 'lucide-react';

const AddProduct = () => {
  const { t } = useTranslation();

  const [enabled, setEnabled] = useState(true);

  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    description: '',
    basePrice: '',
    comparePrice: '',
    sku: '',
  });

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
      <div className="mb-8">
        <h1 className="text-h5 font-bold">{t('addProduct.title')}</h1>

        <p className="mt-2 text-body-sm text-gray-500">
          {t('addProduct.subtitle')}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-8">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_280px]">
          {/* Left */}
          <div>
            <h5 className="mb-6 font-semibold">
              {t('addProduct.productInformation')}
            </h5>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block">{t('addProduct.nameAr')}</label>

                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  value={formData.nameAr}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nameAr: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block">{t('addProduct.nameEn')}</label>

                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                  value={formData.nameEn}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nameEn: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block">
                  {t('addProduct.description')}
                </label>

                <textarea
                  rows={5}
                  className="w-full rounded-xl border border-gray-300 p-4"
                />
              </div>

              <div>
                <label className="mb-2 block">
                  {t('addProduct.categories')}
                </label>

                <button className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2">
                  <Plus size={15} /> {t('addProduct.addCategory')}
                </button>
              </div>

              <div>
                <label className="mb-2 block">{t('addProduct.sizes')}</label>

                <button className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2">
                  <Plus size={15} /> {t('addProduct.addSize')}
                </button>
              </div>

              <div>
                <label className="mb-2 block">{t('addProduct.colors')}</label>

                <button className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2">
                  <Plus size={15} /> {t('addProduct.addColor')}
                </button>
              </div>

              <h5 className="pt-6 font-semibold">
                {t('addProduct.pricingRules')}
              </h5>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block">
                    {t('addProduct.basePrice')}
                  </label>

                  <input className="w-full rounded-xl border border-gray-300 px-4 py-3" />
                </div>

                <div>
                  <label className="mb-2 block">
                    {t('addProduct.comparePrice')}
                  </label>

                  <input className="w-full rounded-xl border border-gray-300 px-4 py-3" />
                </div>
              </div>

              <div className="max-w-md">
                <label className="mb-2 block">{t('addProduct.sku')}</label>

                <input className="w-full rounded-xl border border-gray-300 px-4 py-3" />
              </div>
            </div>
          </div>

          {/* Right */}
          <div>
            <ProductMedia />

            <div className="mt-8">
              <ProductStatus enabled={enabled} setEnabled={setEnabled} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <button className="rounded-xl border border-red px-6 py-3 text-red">
            {t('addProduct.cancel')}
          </button>

          <button className="rounded-xl bg-gray-950 px-6 py-3 text-white">
            {t('addProduct.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
