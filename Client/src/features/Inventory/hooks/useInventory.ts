// features/Inventory/hooks/useInventory.ts
import { useState, useMemo } from 'react';
import { ITEMS_PER_PAGE, type Product, type ProductRow } from '../types';
import { FAKE_PRODUCTS } from '../data/ fakeProducts';
import { getStatus } from '../utils';
import type { FilterKey } from '../constants';

export function useInventory() {
  const [products, setProducts] = useState<Product[]>(FAKE_PRODUCTS);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterKey>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Convert products to rows with status
  const rows: ProductRow[] = useMemo(
    () => products.map((p) => ({ ...p, status: getStatus(p.stock) })),
    [products]
  );

  // Filter data
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

  // Pagination
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

  // Handlers
  const handleFilterChange = (key: FilterKey) => {
    setActiveTab(key);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSave = async () => {
    // TODO: استبدل بـ API call
    console.log('Saving inventory:', products);
  };

  return {
    // State
    products,
    search,
    activeTab,
    currentPage,
    // Derived data
    paginatedData,
    totalItems,
    totalPages,
    pageNumbers,
    // Handlers
    handleFilterChange,
    handleSearchChange,
    handleStockChange,
    handlePageChange,
    handleSave,
  };
}
