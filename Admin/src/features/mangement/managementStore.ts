import { create } from 'zustand';
import { INITIAL_PRODUCTS } from './constant';
import type { Product, StatusFilter } from './mangement';

const ITEMS_PER_PAGE = 8;

type ManagementStore = {
  products: Product[];
  selectedCategories: string[];
  selectedStatus: StatusFilter;
  search: string;
  page: number;
  selectedRows: number[];
  setSearch: (search: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  setSelectedStatus: (status: StatusFilter) => void;
  setPage: (page: number) => void;
  toggleProduct: (id: number) => void;
  publishSelectedProducts: () => void;
  unpublishSelectedProducts: () => void;
  deleteProduct: (id: number) => void;
  deleteSelectedProducts: () => void;
  toggleRow: (id: number) => void;
  setSelectedRows: (ids: number[]) => void;
  clearSelection: () => void;
};

export const useManagementStore = create<ManagementStore>((set) => ({
  products: INITIAL_PRODUCTS,
  selectedCategories: [],
  selectedStatus: 'All',
  search: '',
  page: 1,
  selectedRows: [],
  setSearch: (search) => set({ search, page: 1 }),
  setSelectedCategories: (selectedCategories) =>
    set({ selectedCategories, page: 1 }),
  setSelectedStatus: (selectedStatus) => set({ selectedStatus, page: 1 }),
  setPage: (page) => set({ page }),
  toggleProduct: (id) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, enabled: !product.enabled } : product
      ),
    })),
  publishSelectedProducts: () =>
    set((state) => ({
      products: state.products.map((product) =>
        state.selectedRows.includes(product.id)
          ? { ...product, enabled: true }
          : product
      ),
    })),
  unpublishSelectedProducts: () =>
    set((state) => ({
      products: state.products.map((product) =>
        state.selectedRows.includes(product.id)
          ? { ...product, enabled: false }
          : product
      ),
    })),
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
      selectedRows: state.selectedRows.filter((rowId) => rowId !== id),
    })),
  deleteSelectedProducts: () =>
    set((state) => ({
      products: state.products.filter(
        (product) => !state.selectedRows.includes(product.id)
      ),
      selectedRows: [],
    })),
  toggleRow: (id) =>
    set((state) => ({
      selectedRows: state.selectedRows.includes(id)
        ? state.selectedRows.filter((rowId) => rowId !== id)
        : [...state.selectedRows, id],
    })),
  setSelectedRows: (selectedRows) => set({ selectedRows }),
  clearSelection: () => set({ selectedRows: [] }),
}));

export function useManagementTable() {
  const products = useManagementStore((state) => state.products);
  const selectedCategories = useManagementStore(
    (state) => state.selectedCategories
  );
  const selectedStatus = useManagementStore((state) => state.selectedStatus);
  const search = useManagementStore((state) => state.search);
  const page = useManagementStore((state) => state.page);
  const selectedRows = useManagementStore((state) => state.selectedRows);

  const filteredProducts = products.filter((product) => {
    if (search && !product.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.category)
    ) {
      return false;
    }

    if (selectedStatus !== 'All' && product.status !== selectedStatus) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return {
    itemsPerPage: ITEMS_PER_PAGE,
    products,
    selectedCategories,
    selectedStatus,
    search,
    page,
    selectedRows,
    filteredProducts,
    paginatedProducts,
    totalItems: filteredProducts.length,
    totalPages,
    selectedCount: selectedRows.length,
    allChecked:
      paginatedProducts.length > 0 &&
      paginatedProducts.every((product) => selectedRows.includes(product.id)),
  };
}
