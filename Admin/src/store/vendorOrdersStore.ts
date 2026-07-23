import { create } from 'zustand';

// ── Types ────────────────────────────────────────────────────────────────────

type VendorOrdersStore = {
  // Applied filter values (drive actual data filtering)
  appliedFrom: string;
  appliedTo: string;
  statusFilter: string;
  search: string;
  page: number;
  // Row selection
  selectedIds: string[];

  // Actions
  setAppliedFrom: (v: string) => void;
  setAppliedTo: (v: string) => void;
  setStatusFilter: (v: string) => void;
  setSearch: (v: string) => void;
  setPage: (v: number) => void;
  applyFilter: (from: string, to: string) => void;
  reset: () => void;

  toggleSelect: (id: string) => void;
  toggleSelectAll: (ids: string[]) => void;
  clearSelection: () => void;
};

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_FROM = '2024-01-01';
const DEFAULT_TO   = '2026-12-31';

// ── Store ────────────────────────────────────────────────────────────────────

export const useVendorOrdersStore = create<VendorOrdersStore>((set, get) => ({
  appliedFrom: DEFAULT_FROM,
  appliedTo:   DEFAULT_TO,
  statusFilter: 'all',
  search: '',
  page: 1,
  selectedIds: [],

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
      selectedIds:  [],
    }),

  toggleSelect: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((i) => i !== id)
        : [...s.selectedIds, id],
    })),

  /**
   * If every `ids` entry is already selected → deselect them all.
   * Otherwise select all of them (union).
   */
  toggleSelectAll: (ids) =>
    set((s) => {
      const allSelected = ids.every((id) => s.selectedIds.includes(id));
      return {
        selectedIds: allSelected
          ? s.selectedIds.filter((id) => !ids.includes(id))
          : [...s.selectedIds, ...ids.filter((id) => !s.selectedIds.includes(id))],
      };
    }),

  clearSelection: () => set({ selectedIds: [] }),
}));
