import { useTranslation } from "react-i18next";
import TopSellingCard from "./TopSellingCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

type ProductSale = {
  id: string;
  name: string;
  imageUrl: string;
  unitsSold: number;
  revenue: number;
  currency: string;
  percentage: number;
};

const topSellingProducts: ProductSale[] = [
  // --- Original 5 Products ---
  {
    id: "prod_001",
    name: "Wireless Earbuds Pro",
    imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=150&h=150&fit=crop&crop=center&auto=format",
    unitsSold: 830,
    revenue: 28400,
    currency: "SAR",
    percentage: 8.6,
  },
  {
    id: "prod_002",
    name: "Smart Fitness Watch Series 7",
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=150&h=150&fit=crop&crop=center&auto=format",
    unitsSold: 542,
    revenue: 18970,
    currency: "SAR",
    percentage: 12.4,
  },
  {
    id: "prod_003",
    name: "Ergonomic Mesh Office Chair",
    imageUrl: "https://images.unsplash.com/photo-1505797055758-61de4d72c9d8?w=150&h=150&fit=crop&crop=center&auto=format",
    unitsSold: 215,
    revenue: 32250,
    currency: "SAR",
    percentage: 5.2,
  },
  {
    id: "prod_004",
    name: "4K Ultra HD Action Camera",
    imageUrl: "https://images.unsplash.com/photo-1513137025866-56c8906dda3c?w=150&h=150&fit=crop&crop=center&auto=format",
    unitsSold: 410,
    revenue: 16400,
    currency: "SAR",
    percentage: 9.8,
  },
  {
    id: "prod_005",
    name: "Portable Power Bank 20000mAh",
    imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=150&h=150&fit=crop&crop=center&auto=format",
    unitsSold: 1205,
    revenue: 18075,
    currency: "SAR",
    percentage: 15.3,
  },

  // --- 5 New Products ---
  {
    id: "prod_006",
    name: "Mechanical Gaming Keyboard",
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=150&h=150&fit=crop&crop=center&auto=format",
    unitsSold: 678,
    revenue: 27120,
    currency: "SAR",
    percentage: 11.2,
  },
  {
    id: "prod_007",
    name: "Wireless Charging Stand",
    imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=150&h=150&fit=crop&crop=center&auto=format",
    unitsSold: 945,
    revenue: 18900,
    currency: "SAR",
    percentage: 14.1,
  },
  {
    id: "prod_008",
    name: "Premium Leather Backpack",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop&crop=center&auto=format",
    unitsSold: 312,
    revenue: 24960,
    currency: "SAR",
    percentage: 7.5,
  },
  {
    id: "prod_009",
    name: "Smart Home Security Camera",
    imageUrl: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=150&h=150&fit=crop&crop=center&auto=format",
    unitsSold: 524,
    revenue: 20960,
    currency: "SAR",
    percentage: 10.3,
  },
  {
    id: "prod_010",
    name: "Noise-Cancelling Headphones",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop&crop=center&auto=format",
    unitsSold: 867,
    revenue: 34680,
    currency: "SAR",
    percentage: 18.9,
  },
];

const TopSelling = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 overflow-y-auto bg-white p-4 rounded-xl shadow h-[550px]  ">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-bold">{t("topSelling.title")}</h2>
        <button className="text-sm text-primary flex items-center gap-2">
          {t("topSelling.viewAll")}
          {window.dir === "ltr" ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
        </button>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto h-[85%] ">
        {topSellingProducts.map((product) => (
          <TopSellingCard key={product.id} cardData={product} />
        ))}
      </div>
    </div>
  )
}

export default TopSelling