import { useState } from "react";
import { useTranslation } from "react-i18next";
import ProductMedia from "../components/ui/ProductMedia";
import ProductStatus from "../components/ui/ProductStatus";
import { Plus, X } from "lucide-react";

const AddProduct = () => {
  const { t } = useTranslation();

  const [enabled, setEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSave = () => {
  setIsLoading(true);

  setTimeout(() => {
    setIsLoading(false);
    setIsSuccess(true);
  }, 2000);
};

  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    description: "",
    basePrice: "",
    comparePrice: "",
    sku: "",
  });

  // State for dynamic lists
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  // Input states for modals/inline adding
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showSizeInput, setShowSizeInput] = useState(false);
  const [showColorInput, setShowColorInput] = useState(false);
  
  const [newCategory, setNewCategory] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setShowCategoryInput(false);
    }
  };

  const handleAddSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize("");
      setShowSizeInput(false);
    }
  };

  const handleAddColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor("");
      setShowColorInput(false);
    }
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const removeSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const removeColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
      <div className="mb-8 ml-4">
        <h1 className="text-h5 font-bold">
          {t("addProduct.title")}
        </h1>

        <p className="mt-2 text-body-sm text-gray-500">
          {t("addProduct.subtitle")}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_400px]">
          {/* Left */}
          <div>
            <h5 className="mb-6 font-semibold">
              {t("addProduct.productInformation")}
            </h5>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-medium">
                  {t("addProduct.nameAr")} <span className="text-red-500">*</span>
                </label>

                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-[10px] focus:border-gray-950 focus:outline-none"
                  value={formData.nameAr}
                  name="nameAr"
                  required
                  onChange={handleChange}
                  placeholder={t("addProduct.nameArPlaceholder")}
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  {t("addProduct.nameEn")} <span className="text-red-500">*</span>
                </label>

                <input
                  className="w-full rounded-xl border border-gray-300 px-4 py-[10px] focus:border-gray-950 focus:outline-none"
                  value={formData.nameEn}
                  name="nameEn"
                  required
                  onChange={handleChange}
                  placeholder={t("addProduct.nameEnPlaceholder")}
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  {t("addProduct.description")} <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 p-4 focus:border-gray-950 focus:outline-none"
                  placeholder={t("addProduct.descriptionPlaceholder")}
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  {t("addProduct.categories")} <span className="text-red-500">*</span>
                </label>

                <div className="space-y-3 flex items-center gap-3">
                  {/* Categories Tags */}
                  {categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-0">
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
                    <div className="flex gap-2">
                      <input
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:border-gray-950 focus:outline-none"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                        placeholder={t("addProduct.enterCategory")}
                        autoFocus
                      />
                      <button
                        onClick={handleAddCategory}
                        className="rounded-xl bg-gray-950 px-4 py-2 text-white"
                      >
                        {t("addProduct.add")}
                      </button>
                      <button
                        onClick={() => {
                          setShowCategoryInput(false);
                          setNewCategory("");
                        }}
                        className="rounded-xl border border-gray-300 px-4 py-2"
                      >
                        {t("addProduct.cancel")}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCategoryInput(true)}
                      className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-gray-600 transition hover:border-gray-950 hover:text-gray-950"
                    >
                      <Plus size={15} /> {t("addProduct.addCategory")}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  {t("addProduct.sizes")} <span className="text-red-500">*</span>
                </label>

                <div className="space-y-3 flex items-center gap-3">
                  {/* Sizes Tags */}
                  {sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-0">
                      {sizes.map((size, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2  text-sm"
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
                    <div className="flex gap-2">
                      <input
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:border-gray-950 focus:outline-none"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSize()}
                        placeholder={t("addProduct.enterSize")}
                        autoFocus
                      />
                      <button
                        onClick={handleAddSize}
                        className="rounded-xl bg-gray-950 px-4 py-2 text-white"
                      >
                        {t("addProduct.add")}
                      </button>
                      <button
                        onClick={() => {
                          setShowSizeInput(false);
                          setNewSize("");
                        }}
                        className="rounded-xl border border-gray-300 px-4 py-2"
                      >
                        {t("addProduct.cancel")}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowSizeInput(true)}
                      className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-gray-600 transition hover:border-gray-950 hover:text-gray-950"
                    >
                      <Plus size={15} /> {t("addProduct.addSize")}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  {t("addProduct.colors")} <span className="text-red-500">*</span>
                </label>

                <div className="space-y-3 flex items-center gap-3">
                  {/* Colors Tags */}
                  {colors.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-0">
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
                    <div className="flex gap-2">
                      <input
                        className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:border-gray-950 focus:outline-none"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddColor()}
                        placeholder={t("addProduct.enterColor")}
                        autoFocus
                      />
                      <button
                        onClick={handleAddColor}
                        className="rounded-xl bg-gray-950 px-4 py-2 text-white"
                      >
                        {t("addProduct.add")}
                      </button>
                      <button
                        onClick={() => {
                          setShowColorInput(false);
                          setNewColor("");
                        }}
                        className="rounded-xl border border-gray-300 px-4 py-2"
                      >
                        {t("addProduct.cancel")}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowColorInput(true)}
                      className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-gray-600 transition hover:border-gray-950 hover:text-gray-950"
                    >
                      <Plus size={15} /> {t("addProduct.addColor")}
                    </button>
                  )}
                </div>
              </div>

              <h6 className="pt-6 font-semibold">
                {t("addProduct.pricingRules")}
              </h6>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium">
                    {t("addProduct.basePrice")} <span className="text-red-500">*</span>
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
                    {t("addProduct.comparePrice")} <span className="text-red-500">*</span>
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
                  {t("addProduct.sku")} <span className="text-red-500">*</span>
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
              <ProductStatus
                enabled={enabled}
                setEnabled={setEnabled}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <button
            onClick={handleSave}
            className="rounded-xl bg-gray-950 px-6 py-3 text-white transition hover:bg-gray-800 cursor-pointer"
          >
            {t("addProduct.save")}
          </button>

          <button className="rounded-xl border border-red-500 px-6 py-3 text-red-500 transition hover:bg-red-50 cursor-pointer">
            {t("addProduct.cancel")}
          </button>
        </div>
      </div>
      {/* Loading Popup */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[400px] rounded-2xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>

            <h3 className="text-xl font-semibold">
              Adding Product...
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Please wait while we add your product.
            </p>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-full animate-pulse bg-green-500"></div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[400px] rounded-2xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold">
              Product Added Successfully
            </h3>

            <p className="mt-2 text-gray-500">
              Your product has been added.
            </p>

            <button
              onClick={() => setIsSuccess(false)}
              className="mt-6 w-full rounded-lg bg-green-600 py-3 text-white hover:bg-green-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;