import { useTranslation } from 'react-i18next';
import TopSellingCard from './TopSellingCard';

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
  {
    id: 'prod_001',
    name: 'Wireless Earbuds Pro',
    imageUrl:
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=150&h=150&fit=crop&crop=center&auto=format',
    unitsSold: 830,
    revenue: 28400,
    currency: 'SAR',
    percentage: 8.6,
  },
  {
    id: 'prod_002',
    name: 'Smart Fitness Watch Series 7',
    imageUrl:
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=150&h=150&fit=crop&crop=center&auto=format',
    unitsSold: 542,
    revenue: 18970,
    currency: 'SAR',
    percentage: 12.4,
  },
  {
    id: 'prod_003',
    name: 'Ergonomic Mesh Office Chair',
    imageUrl:
      'https://images.unsplash.com/photo-1505797055758-61de4d72c9d8?w=150&h=150&fit=crop&crop=center&auto=format',
    unitsSold: 215,
    revenue: 32250,
    currency: 'SAR',
    percentage: 5.2,
  },
  {
    id: 'prod_004',
    name: '4K Ultra HD Action Camera',
    imageUrl:
      'https://images.unsplash.com/photo-1513137025866-56c8906dda3c?w=150&h=150&fit=crop&crop=center&auto=format',
    unitsSold: 410,
    revenue: 16400,
    currency: 'SAR',
    percentage: 9.8,
  },
  {
    id: 'prod_005',
    name: 'Portable Power Bank 20000mAh',
    imageUrl:
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=150&h=150&fit=crop&crop=center&auto=format',
    unitsSold: 1205,
    revenue: 18075,
    currency: 'SAR',
    percentage: 15.3,
  },
  {
    id: 'prod_006',
    name: 'Mechanical Gaming Keyboard',
    imageUrl:
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=150&h=150&fit=crop&crop=center&auto=format',
    unitsSold: 678,
    revenue: 27120,
    currency: 'SAR',
    percentage: 11.2,
  },
  {
    id: 'prod_007',
    name: 'Wireless Charging Stand',
    imageUrl:
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=150&h=150&fit=crop&crop=center&auto=format',
    unitsSold: 945,
    revenue: 18900,
    currency: 'SAR',
    percentage: 14.1,
  },
  {
    id: 'prod_008',
    name: 'Premium Leather Backpack',
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=150&h=150&fit=crop&crop=center&auto=format',
    unitsSold: 312,
    revenue: 24960,
    currency: 'SAR',
    percentage: 7.5,
  },
  {
    id: 'prod_009',
    name: 'Smart Home Security Camera',
    imageUrl:
      'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=150&h=150&fit=crop&crop=center&auto=format',
    unitsSold: 524,
    revenue: 20960,
    currency: 'SAR',
    percentage: 10.3,
  },
  {
    id: 'prod_010',
    name: 'Noise-Cancelling Headphones',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=150&fit=crop&crop=center&auto=format',
    unitsSold: 867,
    revenue: 34680,
    currency: 'SAR',
    percentage: 18.9,
  },
];

const TopSelling = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Scoped animation styles matching the rest of the dashboard */}
      <style>{`
        @keyframes topSellFadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ts-animate-in {
          opacity: 0;
          animation: topSellFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="flex flex-col gap-4 overflow-hidden bg-white p-4 rounded-xl shadow h-[550px] ts-animate-in">
        {/* Header appears with container */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <h2 className="text-xl font-bold">{t('topSelling.title')}</h2>
          <button className="text-sm text-primary flex items-center gap-2 hover:opacity-80 transition-opacity">
            {t('topSelling.viewAll')}
          </button>
        </div>

        {/* Scrollable product list with staggered children */}
        <div className="flex flex-col gap-2 overflow-y-auto h-full pr-1">
          {topSellingProducts.map((product, index) => (
            <div
              key={product.id}
              className="ts-animate-in"
              // Tighter stagger (70ms) since there are 10 items
              // Base delay of 150ms lets the header settle first
              style={{ animationDelay: `${150 + index * 70}ms` }}
            >
              <TopSellingCard cardData={product} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TopSelling;
