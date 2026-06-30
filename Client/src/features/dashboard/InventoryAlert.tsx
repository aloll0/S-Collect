import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InventoryCard from './InventoryCard';
import { Link } from 'react-router-dom';

interface InventoryItem {
  id: string;
  image: string;
  name: string;
  sku: string;
  stockCount: number;
  status: 'Out of Stock' | 'Low Stock' | 'In Stock';
  theme: {
    text: 'var(--red)' | 'var(--yellow)' | 'var(--green)';
    background:
      'var(--red-light)' | 'var(--yellow-light)' | 'var(--green-light)';
  };
}

interface InventoryAlertsCard {
  items: InventoryItem[];
}

const inventoryAlertsData: InventoryAlertsCard = {
  items: [
    {
      id: '1',
      name: 'CROPPED FIT LOVE SLOGAN T-SHIRT',
      sku: 'KBM-003',
      stockCount: 0,
      status: 'Out of Stock',
      theme: { text: 'var(--red)', background: 'var(--red-light)' },
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    },
    {
      id: '2',
      name: 'CROPPED FIT LOVE SLOGAN T-SHIRT',
      sku: 'KBM-003',
      stockCount: 5,
      status: 'Low Stock',
      theme: { text: 'var(--yellow)', background: 'var(--yellow-light)' },
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    },
    {
      id: '3',
      name: 'CROPPED FIT LOVE SLOGAN T-SHIRT',
      sku: 'KBM-003',
      stockCount: 5,
      status: 'Low Stock',
      theme: { text: 'var(--yellow)', background: 'var(--yellow-light)' },
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    },
    {
      id: '4',
      name: 'OVERSIZED GRAPHIC HOODIE',
      sku: 'KBM-007',
      stockCount: 25,
      status: 'In Stock',
      theme: { text: 'var(--green)', background: 'var(--green-light)' },
      image:
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
    },
    {
      id: '5',
      name: 'CLASSIC LOGO CAP',
      sku: 'KBM-012',
      stockCount: 15,
      status: 'In Stock',
      theme: { text: 'var(--green)', background: 'var(--green-light)' },
      image:
        'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=500&fit=crop',
    },
    {
      id: '6',
      name: 'NYLON PUFFER JACKET',
      sku: 'KBM-019',
      stockCount: 2,
      status: 'Low Stock',
      theme: { text: 'var(--yellow)', background: 'var(--yellow-light)' },
      image:
        'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop',
    },
    {
      id: '7',
      name: 'CARGO UTILITY PANTS',
      sku: 'KBM-024',
      stockCount: 0,
      status: 'Out of Stock',
      theme: { text: 'var(--red)', background: 'var(--red-light)' },
      image:
        'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=400&h=500&fit=crop',
    },
    {
      id: '8',
      name: 'STRIPED KNIT SWEATER',
      sku: 'KBM-031',
      stockCount: 8,
      status: 'In Stock',
      theme: { text: 'var(--green)', background: 'var(--green-light)' },
      image:
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop',
    },
  ],
};

const InventoryAlert = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Scoped animation styles matching the DashboardGrid easing */}
      <style>{`
        @keyframes invFadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .inv-animate-in {
          opacity: 0;
          animation: invFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="w-full rounded-lg bg-white p-3 lg:p-8 shadow h-[300px]  lg:h-[512px] inv-animate-in">
        {/* Header & Alert Banner appear with the container */}
        <div className="flex gap-2 items-center mb-3 lg:mb-6">
          <TriangleAlert className="text-yellow w-4 h-4 lg:w-6 lg:h-6" />
          <h3 className="text-sm lg:text-xl font-bold">
            {t('inventoryAlerts')}
          </h3>
        </div>

        <div className="bg-yellow-light text-yellow px-4 py-2.5 rounded-lg text-sm mb-6 hidden lg:block">
          <p>{t('inventoryItem.alertMessage')}</p>
        </div>

        {/* Scrollable list area */}
        <div className="mb-6 flex flex-col gap-3 h-[60%] overflow-y-auto pr-1">
          {inventoryAlertsData.items.map((item, index) => (
            <div
              key={item.id}
              className="inv-animate-in"
              // Stagger each inventory card after the container has started appearing
              // Base delay of 200ms + 80ms per item for a tighter cascade than the dashboard
              style={{ animationDelay: `${200 + index * 80}ms` }}
            >
              <InventoryCard cardData={item} />
            </div>
          ))}
        </div>

        <Link
          to={'/inventory'}
          className="w-full text-center rounded-lg border block py-1.5   lg:py-3 mt-auto inv-animate-in hover:bg-gray-50 transition-colors"
          style={{ animationDelay: '600ms' }}
        >
          {t('inventoryItem.manageInventory')}
        </Link>
      </div>
    </>
  );
};

export default InventoryAlert;
