import { create } from 'zustand';

// ── Types ────────────────────────────────────────────────────────────────────

type VendorProductsStore = {
  // Applied filter values (drive actual data filtering)
  appliedFrom: string;
  appliedTo: string;
  statusFilter: string;
  search: string;
  page: number;

  // Actions
  setAppliedFrom: (v: string) => void;
  setAppliedTo: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setSearch: (v: string) => void;
  setPage: (v: number) => void;
  applyFilter: (from: string, to: string) => void;
  reset: () => void;
};

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_FROM = '2024-01-01';
const DEFAULT_TO   = '2026-12-31';

// ── Store ────────────────────────────────────────────────────────────────────

export const useVendorProductsStore = create<VendorProductsStore>((set) => ({
  appliedFrom:  DEFAULT_FROM,
  appliedTo:    DEFAULT_TO,
  statusFilter: 'all',
  search:       '',
  page:         1,

  setAppliedFrom:  (appliedFrom)  => set({ appliedFrom }),
  setAppliedTo:    (appliedTo)    => set({ appliedTo }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  setSearch:       (search)       => set({ search,       page: 1 }),
  setPage:         (page)         => set({ page }),

  /** Commit staging date values and reset to page 1 */
  applyFilter: (from, to) => set({ appliedFrom: from, appliedTo: to, page: 1 }),

  reset: () =>
    set({
      appliedFrom:  DEFAULT_FROM,
      appliedTo:    DEFAULT_TO,
      statusFilter: 'all',
      search:       '',
      page:         1,
    }),
}));
