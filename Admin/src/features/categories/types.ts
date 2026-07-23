// ─── Category Entity ──────────────────────────────────────────────────────────
export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  productsCount: number;
  isActive: boolean;
}
