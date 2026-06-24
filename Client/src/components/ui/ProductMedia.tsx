import { useState, type ChangeEvent } from "react";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ImageFile {
  file: File;
  preview: string;
}

const ProductMedia = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState<ImageFile[]>([]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const previews: ImageFile[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...previews]);
  };

  return (
    <div>
      <h5 className="mb-4 font-semibold">
        {t("addProduct.productMedia")}
      </h5>

      <input
        id="images" 
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />

      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.preview}
            alt=""
            className="h-24 w-full rounded-xl object-cover"
          />
        ))}

        <label
          htmlFor="images"
          className="flex h-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300"
        >
          <Plus />
        </label>
      </div>
    </div>
  );
};

export default ProductMedia;