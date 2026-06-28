import { useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import ProductMedia from '../components/ui/ProductMedia';
import ProductStatus from '../components/ui/ProductStatus';
import { Plus, X, CircleCheckBig, AlertCircle } from 'lucide-react';

// ─── Review / Confirmation Page ───────────────────────────────────────────────
const ReviewPage = ({
  formData,
  categories,
  sizes,
  colors,
  quantity,
  onPrevious,
  onPublish,
}: {
  formData: {
    nameAr: string;
    nameEn: string;
    description: string;
    basePrice: string;
    comparePrice: string;
    sku: string;
  };
  categories: string[];
  sizes: string[];
  colors: string[];
  quantity: number;
  onPrevious: () => void;
  onPublish: () => void;
}) => {
  const steps = [
    { label: 'Basic Info' },
    { label: 'Categorization' },
    { label: 'Pricing' },
    { label: 'Inventory' },
    { label: 'Review' },
  ];

  const { t } = useTranslation();

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 px-4 py-6 md:p-8">
      {/* Breadcrumb */}
      <div className="mb-6 md:mb-8 md:ml-4">
        <h1 className="text-h5 font-bold">Add Product</h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
          <span className="cursor-pointer hover:underline" onClick={onPrevious}>
            Add Product
          </span>
          <span>»</span>
          <span className="text-gray-800 font-medium">Published</span>
        </div>
      </div>

      <div className="rounded-2xl p-4 shadow-sm md:p-6 md:shadow-none">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_440px] xl:gap-10">
          {/* Left – Product Preview Card */}
          <div className="rounded-2xl border border-gray-200 p-6 bg-white">
            <div className="flex gap-5">
              {/* Placeholder image */}
              <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                <svg
                  className="h-10 w-10 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-0.5">Product</p>
                <h2 className="text-lg font-bold leading-tight">
                  {formData.nameEn || formData.nameAr || '—'}
                </h2>
                {formData.basePrice && (
                  <p className="mt-1 text-base font-semibold text-gray-800">
                    ${formData.basePrice}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs mb-0.5">Brand</p>
                <p className="font-medium">—</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-0.5">SKU</p>
                <p className="font-medium">{formData.sku || '—'}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-0.5">Stock</p>
                <p className="font-medium">{quantity} units</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-0.5">Status</p>
                <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                  Active
                </span>
              </div>

              {formData.comparePrice && (
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Discount</p>
                  <p className="font-medium">${formData.comparePrice}</p>
                </div>
              )}

              {formData.basePrice && (
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Cost</p>
                  <p className="font-medium">${formData.basePrice}</p>
                </div>
              )}
            </div>

            {categories.length > 0 && (
              <div className="mt-5">
                <p className="text-gray-400 text-xs mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-400 text-xs mb-2">Sizes</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-400 text-xs mb-2">Colors</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right – Step Summary */}
          <div>
            <div className="rounded-2xl border border-gray-200 p-5 bg-white">
              <h5 className="mb-4 font-semibold text-gray-800">Step Summary</h5>
              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{step.label}</span>
                    <CircleCheckBig size={18} className="text-green-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onPrevious}
                className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-medium transition hover:bg-gray-50 cursor-pointer w-full"
              >
                {t('addProduct.previous')}
              </button>
              <button
                onClick={onPublish}
                className="rounded-xl bg-gray-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 cursor-pointer w-full"
              >
                {t('addProduct.publish')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Add Product Page ─────────────────────────────────────────────────────
const AddProduct = () => {
  const { t } = useTranslation();

  const LOW_STOCK_THRESHOLD = 10;

  const [enabled, setEnabled] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Quantity
  const [quantity, setQuantity] = useState(0);

  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    description: '',
    basePrice: '',
    comparePrice: '',
    sku: '',
  });

  // Dynamic lists
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  // Input visibility
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [showColorInput, setShowColorInput] = useState(false);

  const [newCategory, setNewCategory] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  const handleAddSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize('');
      setShowSizeInput(false);
    }
  };

  const handleAddColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor('');
      setShowColorInput(false);
    }
  };

  const removeCategory = (index: number) =>
    setCategories(categories.filter((_, i) => i !== index));

  const removeSize = (index: number) =>
    setSizes(sizes.filter((_, i) => i !== index));

  const removeColor = (index: number) =>
    setColors(colors.filter((_, i) => i !== index));

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Go to review page instead of showing loading popup
  const handleContinue = () => {
    setShowReview(true);
  };

  // Publish action
  const handlePublish = () => {
    setShowReview(false);
    setIsSuccess(true);
  };

  // ── Review Page ──
  if (showReview) {
    return (
      <ReviewPage
        formData={formData}
        categories={categories}
        sizes={sizes}
        colors={colors}
        quantity={quantity}
        onPrevious={() => setShowReview(false)}
        onPublish={handlePublish}
      />
    );
  }

  // ── Main Form ──
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

            <div className="space-y-5">
              {/* Name AR */}
              <div>
                <label className="mb-2 block font-medium">
                  {t('addProduct.nameAr')}{' '}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-gray-950 focus:outline-none"
                  value={formData.nameAr}
                  name="nameAr"
                  required
                  onChange={handleChange}
                  placeholder={t('addProduct.nameArPlaceholder')}
                />
              </div>

              {/* Name EN */}
              <div>
                <label className="mb-2 block font-medium">
                  {t('addProduct.nameEn')}{' '}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 focus:border-gray-950 focus:outline-none"
                  value={formData.nameEn}
                  name="nameEn"
                  required
                  onChange={handleChange}
                  placeholder={t('addProduct.nameEnPlaceholder')}
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block font-medium">
                  {t('addProduct.description')}{' '}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 p-4 focus:border-gray-950 focus:outline-none"
                  placeholder={t('addProduct.descriptionPlaceholder')}
                />
              </div>

              {/* ── Stock Quantity ── */}
              <div>
                <label className="mb-2 block font-medium">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 text-lg font-semibold hover:bg-gray-50 transition"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    value={quantity}
                    min={0}
                    onChange={(e) =>
                      setQuantity(Math.max(0, Number(e.target.value)))
                    }
                    className="w-20 rounded-xl pl-4 py-2 text-center focus:border-gray-950 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 text-lg font-semibold hover:bg-gray-50 transition"
                  >
                    +
                  </button>
                </div>

                {/* Low stock warning */}
                {quantity > 0 && quantity <= LOW_STOCK_THRESHOLD && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-amber-600">
                    <AlertCircle size={14} />
                    <span>
                      Low stock alert will trigger at {LOW_STOCK_THRESHOLD}{' '}
                      units.
                    </span>
                  </div>
                )}
              </div>

              {/* Categories */}
              <div>
                <label className="mb-2 block font-medium">
                  {t('addProduct.categories')}{' '}
                  <span className="text-red-500">*</span>
                </label>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm"
                        >
                          {category}
                          <button
                            onClick={() => removeCategory(index)}
                            className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {showCategoryInput ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:border-gray-950 focus:outline-none"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleAddCategory()
                        }
                        placeholder={t('addProduct.enterCategory')}
                        autoFocus
                      />
                      <button
                        onClick={handleAddCategory}
                        className="rounded-xl bg-gray-950 px-4 py-2 text-white"
                      >
                        {t('addProduct.add')}
                      </button>
                      <button
                        onClick={() => {
                          setShowCategoryInput(false);
                          setNewCategory('');
                        }}
                        className="rounded-xl border border-gray-300 px-4 py-2"
                      >
                        {t('addProduct.cancel')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCategoryInput(true)}
                      className="flex w-fit items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-gray-600 transition hover:border-gray-950 hover:text-gray-950"
                    >
                      <Plus size={15} /> {t('addProduct.addCategory')}
                    </button>
                  )}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="mb-2 block font-medium">
                  {t('addProduct.sizes')}{' '}
                  <span className="text-red-500">*</span>
                </label>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  {sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm"
                        >
                          {size}
                          <button
                            onClick={() => removeSize(index)}
                            className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {showSizeInput ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:border-gray-950 focus:outline-none"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSize()}
                        placeholder={t('addProduct.enterSize')}
                        autoFocus
                      />
                      <button
                        onClick={handleAddSize}
                        className="rounded-xl bg-gray-950 px-4 py-2 text-white"
                      >
                        {t('addProduct.add')}
                      </button>
                      <button
                        onClick={() => {
                          setShowSizeInput(false);
                          setNewSize('');
                        }}
                        className="rounded-xl border border-gray-300 px-4 py-2"
                      >
                        {t('addProduct.cancel')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowSizeInput(true)}
                      className="flex w-fit items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-gray-600 transition hover:border-gray-950 hover:text-gray-950"
                    >
                      <Plus size={15} /> {t('addProduct.addSize')}
                    </button>
                  )}
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="mb-2 block font-medium">
                  {t('addProduct.colors')}{' '}
                  <span className="text-red-500">*</span>
                </label>

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  {colors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {colors.map((color, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm"
                        >
                          {color}
                          <button
                            onClick={() => removeColor(index)}
                            className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {showColorInput ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:border-gray-950 focus:outline-none"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleAddColor()
                        }
                        placeholder={t('addProduct.enterColor')}
                        autoFocus
                      />
                      <button
                        onClick={handleAddColor}
                        className="rounded-xl bg-gray-950 px-4 py-2 text-white"
                      >
                        {t('addProduct.add')}
                      </button>
                      <button
                        onClick={() => {
                          setShowColorInput(false);
                          setNewColor('');
                        }}
                        className="rounded-xl border border-gray-300 px-4 py-2"
                      >
                        {t('addProduct.cancel')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowColorInput(true)}
                      className="flex w-fit items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-gray-600 transition hover:border-gray-950 hover:text-gray-950"
                    >
                      <Plus size={15} /> {t('addProduct.addColor')}
                    </button>
                  )}
                </div>
              </div>

              {/* Pricing Rules */}
              <h6 className="pt-6 font-semibold">
                {t('addProduct.pricingRules')}
              </h6>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium">
                    {t('addProduct.basePrice')}{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-950 focus:outline-none"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
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
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-950 focus:outline-none"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
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
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-gray-950 focus:outline-none"
                  placeholder="SKU-001"
                />
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

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-4">
          <button className="rounded-xl border border-red-500 px-6 py-3 text-red-500 transition hover:bg-red-50 cursor-pointer">
            {t('addProduct.cancel')}
          </button>

          <button
            onClick={handleContinue}
            className="rounded-xl bg-gray-950 px-6 py-3 text-white transition hover:bg-gray-800 cursor-pointer"
          >
            {t('addProduct.continue')}
          </button>
        </div>
      </div>

      {/* Success Popup – after Publish */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-100 rounded-2xl bg-white p-6 text-center shadow-xl sm:p-8">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold">
              {t('addProduct.productAddedSuccessfully')}
            </h3>

            <p className="mt-2 text-gray-500">
              {t('addProduct.productAddedMessage')}
            </p>

            <button
              onClick={() => setIsSuccess(false)}
              className="mt-6 w-full rounded-lg bg-green-600 py-3 text-white hover:bg-green-700"
            >
              {t('addProduct.done')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
