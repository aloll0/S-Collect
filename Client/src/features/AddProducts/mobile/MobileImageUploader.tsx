import { useRef, useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { UploadCloud, X } from "lucide-react";
import type { ProductFormData } from "../types";

interface PreviewImage {
  id: string;
  file: File;
  preview: string;
}


const MAX_SIZE = 10 * 1024 * 1024; // 10MB

const MobileImageUploader = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { setValue, watch } = useFormContext<ProductFormData>();

  const files = watch("images") || [];

  const [previews, setPreviews] = useState<PreviewImage[]>([]);

  useEffect(() => {
    const newPreviews = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach((image) =>
        URL.revokeObjectURL(image.preview)
      );
    };
  }, [files]);

  const handleSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const validFiles = Array.from(selectedFiles).filter((file) => {
      if (!file.type.startsWith("image/")) return false;
      if (file.size > MAX_SIZE) return false;
      return true;
    });

    setValue("images", [...files, ...validFiles], {
      shouldValidate: true,
    });
  };

  const removeImage = (index: number) => {
    const updated = files.filter((_, i) => i !== index);

    setValue("images", updated, {
      shouldValidate: true,
    });
  };

  return (
    <div className="mb-6">
      {/* Upload Box */}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-35 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white transition hover:bg-gray-50 cursor-pointer"
      >
        <UploadCloud className="mb-3 h-8 w-8 text-gray-400" />

        <p className="text-sm font-medium text-gray-700">
          Tap to upload photos
        </p>

        <span className="text-xs text-gray-400">
          JPG, PNG up to 10MB
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        hidden
        multiple
        accept="image/*"
        onChange={(e) => handleSelect(e.target.files)}
      />

      {/* Preview */}

      {previews.length > 0 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {previews.map((image, index) => (
            <div
              key={image.id}
              className="relative h-20 w-20 flex-shrink-0 mt-4"
            >
              <img
                src={image.preview}
                alt=""
                className="h-full w-full rounded-xl object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileImageUploader;