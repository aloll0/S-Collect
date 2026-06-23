import { t } from "i18next";

type ProductSale = {
  id: string;
  name: string;
  imageUrl: string;
  unitsSold: number;
  revenue: number;
  currency: string;
  percentage: number;
};

const TopSellingCard = ({ cardData }: { cardData: ProductSale }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-3">
      {/* Product Image */}
      <div className="h-14 w-14 rounded-lg overflow-hidden shrink-0">
        <img
          className="object-cover w-full h-full"
          src={cardData.imageUrl}
          alt={cardData.name}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h6 className="text-base font-medium text-gray-900 mb-2">
          {cardData.name}
        </h6>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {cardData.unitsSold} {t("dashboardMetrics.unit.product")}
          </span>

          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-700 rounded-full transition-all"
              style={{
                width: `${Math.min(cardData.percentage * 5, 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Revenue */}
      <div className="flex flex-col items-end min-w-[100px]">
        <span className="text-lg font-bold text-green-600">
          {cardData.revenue.toLocaleString()} {cardData.currency}
        </span>

        <span className="text-sm text-gray-400 mt-2">
          {cardData.percentage}%
        </span>
      </div>
    </div>
  );
};

export default TopSellingCard;