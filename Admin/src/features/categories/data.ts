import type { Category } from './types';

// ─── Dummy Data ───────────────────────────────────────────────────────────────
// NOTE: When switching to an API, replace this file with a custom hook
// (e.g. useCategories.ts) and update Categories.tsx to use it instead
// of useState(INITIAL_CATEGORIES). All components stay untouched.

export const ITEMS_PER_PAGE = 8;

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: '1',
    nameEn: 'Handicrafts',
    nameAr: 'الحرف اليدوية',
    slug: 'handicrafts',
    productsCount: 245,
    isActive: false,
  },
  {
    id: '2',
    nameEn: 'Electronics',
    nameAr: 'إلكترونيات',
    slug: 'electronics',
    productsCount: 126,
    isActive: true,
  },
  {
    id: '3',
    nameEn: 'Clothing',
    nameAr: 'ملابس',
    slug: 'clothing',
    productsCount: 542,
    isActive: true,
  },
  {
    id: '4',
    nameEn: 'Home Decor',
    nameAr: 'ديكور المنزل',
    slug: 'home-decor',
    productsCount: 312,
    isActive: false,
  },
  {
    id: '5',
    nameEn: 'Books',
    nameAr: 'كتب',
    slug: 'books',
    productsCount: 89,
    isActive: true,
  },
  {
    id: '6',
    nameEn: 'Beauty',
    nameAr: 'تجميل',
    slug: 'beauty',
    productsCount: 156,
    isActive: true,
  },
  {
    id: '7',
    nameEn: 'Jewelry',
    nameAr: 'مجوهرات',
    slug: 'jewelry',
    productsCount: 74,
    isActive: false,
  },
  {
    id: '8',
    nameEn: 'Collectibles',
    nameAr: 'مقتنيات',
    slug: 'collectibles',
    productsCount: 38,
    isActive: true,
  },
  {
    id: '9',
    nameEn: 'Rare Trading Cards',
    nameAr: 'بطاقات تداول نادرة',
    slug: 'rare-trading-cards',
    productsCount: 21,
    isActive: true,
  },
  {
    id: '10',
    nameEn: 'Sports',
    nameAr: 'رياضة',
    slug: 'sports',
    productsCount: 198,
    isActive: true,
  },
];
