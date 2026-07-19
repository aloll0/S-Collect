import { Star } from "lucide-react";

export interface RatingCount {
  stars: 1 | 2 | 3 | 4 | 5;
  count: number;
}

export interface ProductRatingProps {
  averageRating: number;
  totalReviews: number;
  counts: RatingCount[];
}

export default function ProductRating({
  averageRating,
  totalReviews,
  counts,
}: ProductRatingProps) {
  const maxCount = Math.max(...counts.map((c) => c.count), 1);
  const sorted = [...counts].sort((a, b) => b.stars - a.stars);

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-10">
        {/* Summary */}
        <div className="flex shrink-0 flex-col items-center">
          <span className="text-4xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </span>
          <div className="mt-1 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>
          <span className="mt-1 whitespace-nowrap text-xs text-gray-400">
            Based on {totalReviews} Reviews
          </span>
        </div>

        {/* Bars */}
        <div className="flex-1 space-y-2.5">
          {sorted.map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-3 text-sm">
              <span className="w-14 shrink-0 text-gray-500">
                {stars} Star{stars > 1 ? "s" : ""}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-amber-400"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-gray-500">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}