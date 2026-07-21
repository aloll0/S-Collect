import { type ChangeEvent, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import type { ProductFormData } from '../../features/AddProducts/types';

interface PreviewImage {
  id: string;
  file: File;
  preview: string;
}

const ProductMedia = () => {
  const { t } = useTranslation();
  const { setValue, watch } = useFormContext<ProductFormData>();
  const files = watch('images') || [];
  const [previews, setPreviews] = useState<PreviewImage[]>([]);

  const filesKey = files.map((f) => `${f.name}-${f.size}`).join(',');

  useEffect(() => {
    const newPreviews = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [filesKey]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    setValue('images', [...files, ...uploadedFiles], {
      shouldValidate: true,
    });
  };

  return (
    <div>
      <h5 className="mb-4 font-semibold">{t('addProduct.productMedia')}</h5>

      <input
        id="images"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {previews.map((image) => (
          <img
            key={image.id}
            src={image.preview}
            alt=""
            className="h-28 w-full rounded-xl object-cover sm:h-24"
          />
        ))}

        <label
          htmlFor="images"
          className="flex h-28 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 sm:h-24"
        >
          <Plus />
        </label>
      </div>
    </div>
  );
};

export default ProductMedia;
