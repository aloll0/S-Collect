import { Star, Pencil } from "lucide-react";

export interface ProductInfoProps {
  imageUrl: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  currency?: string;
  inStock: boolean;
  stockCount: number;
  averageRating: number;
  totalReviews: number;
  onEdit?: () => void;
}

export default function ProductInfo({
  imageUrl,
  name,
  category,
  brand,
  sku,
  price,
  compareAtPrice,
  cost,
  currency = "SAR",
  inStock,
  stockCount,
  averageRating,
  totalReviews,
  onEdit,
}: ProductInfoProps) {
  return (
    <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex gap-6">
        {/* Image */}
        <div className="h-48 w-40 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
            <button
              type="button"
              onClick={onEdit}
              aria-label="Edit product"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
            >
              <Pencil size={16} />
            </button>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="text-gray-400">Category:</span>
            <span className="font-medium text-gray-700">{category}</span>
            <span className="mx-1 text-gray-300">|</span>
            <span className="text-gray-400">Brand:</span>
            <span className="font-medium text-gray-700">{brand}</span>
            <span className="mx-1 text-gray-300">|</span>
            <span className="text-gray-400">SKU:</span>
            <span className="font-medium text-gray-700">{sku}</span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {price} {currency}
            </span>
            {compareAtPrice && (
              <span className="text-sm text-gray-400 line-through">
                {compareAtPrice} {currency}
              </span>
            )}
            <span className="ml-2 text-sm text-gray-400">Cost:</span>
            <span className="text-sm font-semibold text-gray-700">
              {cost} {currency}
            </span>
          </div>

          <hr className="my-4 border-gray-100" />

          <div className="flex items-center gap-16">
            <div>
              <p className="text-xs text-gray-400">Inventory</p>
              <p className="mt-1">
                <span
                  className={`rounded-md px-2 py-1 text-xs font-medium ${inStock
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                    }`}
                >
                  {inStock ? "In Stock" : "Out of Stock"} ({stockCount} units)
                </span>
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Average Rating</p>
              <p className="mt-1.5 flex items-center gap-1 text-sm font-semibold text-gray-800">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                {averageRating.toFixed(1)}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Total Reviews</p>
              <p className="mt-1.5 text-sm font-semibold text-gray-800">
                {totalReviews} Reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}