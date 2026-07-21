import { type ChangeEvent, useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import type { ProductFormData } from '../../features/AddProducts/types';
import { compressImage } from '../../features/AddProducts/utils';

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
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});

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

  useEffect(() => {
    files.forEach((file) => {
      const key = `${file.name}-${file.size}`;
      if (progressMap[key] === undefined) {
        setProgressMap((prev) => ({ ...prev, [key]: 0 }));
        
        let current = 0;
        const timer = setInterval(() => {
          current += Math.floor(Math.random() * 15) + 10;
          if (current >= 100) {
            current = 100;
            clearInterval(timer);
          }
          setProgressMap((prev) => ({ ...prev, [key]: current }));
        }, 150);
      }
    });
  }, [filesKey]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    const compressed = await Promise.all(
      uploadedFiles.map((file) => compressImage(file))
    );
    setValue('images', [...files, ...compressed], {
      shouldValidate: true,
    });
  };

  const handleDelete = (indexToDelete: number) => {
    const updatedFiles = files.filter((_, idx) => idx !== indexToDelete);
    setValue('images', updatedFiles, {
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
        {previews.map((image, index) => {
          const key = `${image.file.name}-${image.file.size}`;
          const currentProgress = progressMap[key] !== undefined ? progressMap[key] : 100;
          const isUploading = currentProgress < 100;

          return (
            <div key={image.id} className="relative h-28 w-full sm:h-24 group">
              <img
                src={image.preview}
                alt=""
                className="h-full w-full rounded-xl object-cover"
              />

              {/* Progress Overlay */}
              {isUploading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/55 text-white p-2">
                  <span className="text-xs font-semibold">{currentProgress}%</span>
                  <div className="mt-1.5 h-1 w-4/5 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full bg-white transition-all duration-150"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Delete Button */}
              {!isUploading && (
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600 active:scale-95 cursor-pointer z-10"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          );
        })}

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
