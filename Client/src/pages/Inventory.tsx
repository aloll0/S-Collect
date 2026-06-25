import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

// ============================================================
// FAKE DATA — استبدلها بـ API call لما تستلم الباك إند
// ============================================================
const FAKE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Cotton Summer Dress',
    sku: 'DRS-001',
    variant: 'Blue / M',
    stock: 45,
    updatedAt: '2h ago',
  },
  {
    id: 2,
    name: 'Classic Slim Jeans',
    sku: 'JNS-205',
    variant: 'Black / 32',
    stock: 3,
    updatedAt: '5h ago',
  },
  {
    id: 3,
    name: 'Running Sneakers',
    sku: 'SHOE-99',
    variant: 'White / 42',
    stock: 0,
    updatedAt: '1d ago',
  },
  {
    id: 4,
    name: 'Leather Tote Bag',
    sku: 'ACC-442',
    variant: 'Brown',
    stock: 12,
    updatedAt: '3h ago',
  },
  {
    id: 5,
    name: 'Graphic Cotton Tee',
    sku: 'TSH-881',
    variant: 'White / L',
    stock: 52,
    updatedAt: '12h ago',
  },
  {
    id: 6,
    name: 'Wool Blend Sweater',
    sku: 'SWT-112',
    variant: 'Grey / S',
    stock: 4,
    updatedAt: '1d ago',
  },
  {
    id: 7,
    name: 'Formal Silk Shirt',
    sku: 'SHR-772',
    variant: 'White / XL',
    stock: 15,
    updatedAt: '6h ago',
  },
  {
    id: 8,
    name: 'Denim Jacket',
    sku: 'JKT-339',
    variant: 'Light Blue / M',
    stock: 8,
    updatedAt: '2d ago',
  },
  {
    id: 9,
    name: 'Summer Shorts',
    sku: 'SHT-555',
    variant: 'Khaki / 34',
    stock: 22,
    updatedAt: '4h ago',
  },
  {
    id: 10,
    name: 'Cashmere Scarf',
    sku: 'ACC-789',
    variant: 'Red',
    stock: 7,
    updatedAt: '1h ago',
  },
  {
    id: 11,
    name: 'Leather Belt',
    sku: 'ACC-654',
    variant: 'Brown / 38',
    stock: 0,
    updatedAt: '3d ago',
  },
  {
    id: 12,
    name: 'Oxford Shoes',
    sku: 'SHOE-321',
    variant: 'Black / 43',
    stock: 3,
    updatedAt: '6h ago',
  },
];
// ============================================================

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

interface Product {
  id: number;
  name: string;
  sku: string;
  variant: string;
  stock: number;
  updatedAt: string;
}

interface ProductRow extends Product {
  status: StockStatus;
}

function getStatus(stock: number): StockStatus {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 5) return 'Low Stock';
  return 'In Stock';
}

const STATUS_STYLES: Record<StockStatus, string> = {
  'In Stock': 'bg-green-light text-green',
  'Low Stock': 'bg-yellow-light text-yellow',
  'Out of Stock': 'bg-red-light text-red',
};

const ITEMS_PER_PAGE = 8;

const Inventory = () => {
  const { t } = useTranslation();

  // ── State ──────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>(FAKE_PRODUCTS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<StockStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // ── Filter tabs config (driven by t()) ────────────────────
  const FILTER_TABS = [
    { key: 'all', label: t('inventoryPage.allProducts') },
    { key: 'In Stock', label: t('inventoryPage.inStock') },
    { key: 'Low Stock', label: t('inventoryPage.lowStock') },
    { key: 'Out of Stock', label: t('inventoryPage.outOfStock') },
  ] as const;

  // ── Derived data ──────────────────────────────────────────
  const rows: ProductRow[] = useMemo(
    () => products.map((p) => ({ ...p, status: getStatus(p.stock) })),
    [products]
  );

  const filtered = useMemo(() => {
    return rows.filter((p) => {
      const matchTab = activeTab === 'all' || p.status === activeTab;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.variant.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [rows, search, activeTab]);

  // ── Pagination ────────────────────────────────────────────
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  // ── Handlers ──────────────────────────────────────────────
  const handleFilterChange = (key: string) => {
    setActiveTab(key as StockStatus | 'all');
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStockChange = (id: number, value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: num } : p))
    );
  };

  const handleSave = async () => {
    // TODO: استبدل الكود ده بـ API call
    // await fetch("/api/inventory", {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(products),
    // });
    console.log('Saving inventory:', products);
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
      {/* Page Header */}
      <div className="mb-8">
        <h5 className="font-bold text-gray-900">{t('inventoryPage.title')}</h5>
        <p className="text-gray-500 mt-1">{t('inventoryPage.subtitle')}</p>
      </div>

      {/* Main Card */}
      <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="icon-stroke"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </span>
            <input
              type="text"
              placeholder={t('inventoryPage.search')}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-3 py-2 text-body-md border border-gray-300 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:border-gray-600 w-48 placeholder:text-gray-400 transition-colors"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleFilterChange(tab.key)}
                className={`px-4 py-2 rounded-lg text-label-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-gray-900 text-gray-50'
                    : 'border border-gray-300 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-body-md">
            <thead>
              <tr className="border-b border-gray-200">
                {[
                  t('inventoryPage.colProductName'),
                  t('inventoryPage.colSku'),
                  t('inventoryPage.colVariant'),
                  t('inventoryPage.colCurrentStock'),
                  t('inventoryPage.colStatus'),
                  t('inventoryPage.colLastUpdated'),
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left rtl:text-right  py-3 px-3 text-caption-sm font-bold text-gray-950 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    {t('inventoryPage.noProducts')}
                  </td>
                </tr>
              ) : (
                paginatedData.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <td className="py-3 px-3 text-body-md font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="py-3 px-3 text-body-sm text-gray-400">
                      {product.sku}
                    </td>
                    <td className="py-3 px-3 text-body-md text-gray-500">
                      {product.variant}
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="number"
                        min={0}
                        value={product.stock}
                        onChange={(e) =>
                          handleStockChange(product.id, e.target.value)
                        }
                        className="w-16 text-center border border-gray-300 rounded-lg py-1.5 text-body-md focus:outline-none focus:border-gray-600 bg-gray-50 transition-colors"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-3 py-1 rounded-full text-caption font-medium ${STATUS_STYLES[product.status]}`}
                      >
                        {t(
                          `inventoryPage.${
                            product.status === 'In Stock'
                              ? 'inStock'
                              : product.status === 'Low Stock'
                                ? 'lowStock'
                                : 'outOfStock'
                          }`
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-body-sm text-gray-400">
                      {product.updatedAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200">
          <span className="text-caption-sm text-gray-400">
            {t('inventoryPage.showing')}{' '}
            {totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} –{' '}
            {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}{' '}
            {t('inventoryPage.of')} {totalItems} {t('inventoryPage.results')}
          </span>
          {totalPages > 1 && (
            <div className="flex gap-1">
              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`w-8 h-8 rounded-lg text-label-md border transition-colors ${
                    n === currentPage
                      ? 'bg-gray-900 text-gray-50 border-gray-900'
                      : 'border-gray-300 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-5">
        <button
          onClick={handleSave}
          className="bg-gray-900 text-gray-50 px-6 py-2.5 rounded-lg text-label-md font-semibold hover:bg-gray-800 transition-colors"
        >
          {t('inventoryPage.saveChanges')}
        </button>
      </div>
    </div>
  );
};

export default Inventory;
