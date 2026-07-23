import { ChevronLeft, ChevronRight, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Pagination ────────────────────────────────────────────────────────────────
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationProps) => {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between gap-4 flex-wrap">
      <p className="text-xs text-gray-400">
        Showing{' '}
        <span className="font-medium text-gray-700">{start}–{end}</span> of{' '}
        <span className="font-medium text-gray-700">{totalItems}</span> categories
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`inline-flex items-center justify-center h-8 w-8 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              p === currentPage
                ? 'bg-gray-950 text-white shadow-sm'
                : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

// ─── Bulk Action Navbar ────────────────────────────────────────────────────────
export interface BulkNavbarProps {
  selectedCount: number;
  onDelete: () => void;
  onClearSelection: () => void;
}

export const BulkNavbar = ({ selectedCount, onDelete, onClearSelection }: BulkNavbarProps) => (
  <AnimatePresence>
    {selectedCount > 0 && (
      <motion.div
        key="bulk-navbar"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      >
        <div className="flex items-center gap-3 bg-gray-950 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-black/30 border border-white/10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/15 text-xs font-bold">
              {selectedCount}
            </span>
            <span className="text-sm font-medium text-white/80">
              {selectedCount === 1 ? 'category' : 'categories'} selected
            </span>
          </div>

          <div className="w-px h-5 bg-white/20" />

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red text-white text-sm font-semibold hover:bg-red/90 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            Delete {selectedCount > 1 ? `(${selectedCount})` : ''}
          </button>

          <button
            type="button"
            onClick={onClearSelection}
            className="inline-flex items-center justify-center h-7 w-7 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Clear selection"
          >
            <X size={15} />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
