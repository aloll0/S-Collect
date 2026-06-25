import { useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Trash2, X } from "lucide-react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import ProductRow from "./ProductRow";
import { CATEGORIES, INITIAL_PRODUCTS, STATUS_FILTERS } from "./constant";
import type { Product, StatusFilter } from "./mangement";

const ITEMS_PER_PAGE = 8;

const DD_BTN =
  "flex items-center gap-1.5 h-9 px-3 border border-gray-200 rounded-lg bg-white text-sm cursor-pointer hover:bg-gray-50 whitespace-nowrap";

const DD_MENU =
  "absolute top-[calc(100%+6px)] left-0 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden";

const DD_ITEM =
  "flex items-center gap-2.5 px-3.5 py-2.5 text-sm cursor-pointer hover:bg-gray-50";

interface CategoryDropdownProps {
  selected: string[];
  onChange: (cats: string[]) => void;
}

function CategoryDropdown({ selected, onChange }: CategoryDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  const allSelected = selected.length === 0;
  const label = allSelected
    ? t("managementTable.category")
    : selected.length === 1
      ? t(`managementTable.categories.${selected[0]}`)
      : t("managementTable.categoriesCount", { count: selected.length });

  const toggle = (cat: string) =>
    onChange(
      selected.includes(cat)
        ? selected.filter((c) => c !== cat)
        : [...selected, cat]
    );

  return (
    <div className="relative" ref={ref}>
      <button className={DD_BTN} onClick={() => setOpen(!open)}>
        {label}
        <i className="ti ti-chevron-down text-gray-400 text-base" aria-hidden="true" />
      </button>

      {open && (
        <div className={`${DD_MENU} min-w-[200px]`}>
          <div className={DD_ITEM} onClick={() => onChange([])}>
            <input
              type="checkbox"
              readOnly
              checked={allSelected}
              className="accent-indigo-600 w-3.5 h-3.5 cursor-pointer"
            />
            <span>{t("managementTable.allCategories")}</span>
          </div>
          <div className="h-px bg-gray-100 my-1" />
          {CATEGORIES.map((cat) => (
            <div key={cat} className={DD_ITEM} onClick={() => toggle(cat)}>
              <input
                type="checkbox"
                readOnly
                checked={selected.includes(cat)}
                className="accent-indigo-600 w-3.5 h-3.5 cursor-pointer"
              />
              <span>{t(`managementTable.categories.${cat}`)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface StatusDropdownProps {
  selected: StatusFilter;
  onChange: (s: StatusFilter) => void;
}

function StatusDropdown({ selected, onChange }: StatusDropdownProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button className={DD_BTN} onClick={() => setOpen(!open)}>
        {selected === "All"
          ? t("managementTable.status")
          : t(`managementTable.statuses.${selected}`)}
        <i className="ti ti-chevron-down text-gray-400 text-base" aria-hidden="true" />
      </button>

      {open && (
        <div className={`${DD_MENU} min-w-[180px]`}>
          {STATUS_FILTERS.map((s) => (
            <div
              key={s}
              className={DD_ITEM}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
            >
              <input
                type="radio"
                readOnly
                checked={selected === s}
                className="accent-indigo-600 w-3.5 h-3.5 cursor-pointer"
              />
              <span>
                {s === "All"
                  ? t("managementTable.allStatuses")
                  : t(`managementTable.statuses.${s}`)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductTable() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selCats, setSelCats] = useState<string[]>([]);
  const [selStatus, setSelStatus] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selRows, setSelRows] = useState<number[]>([]);

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (selCats.length > 0 && !selCats.includes(p.category)) return false;
    if (selStatus !== "All" && p.status !== selStatus) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const totalItems = filtered.length;

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, page]);

  const toggleProduct = (id: number) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );

  const publishSelectedProducts = () => {
    setProducts((prev) =>
      prev.map((p) => (selRows.includes(p.id) ? { ...p, enabled: true } : p))
    );
  };

  const unpublishSelectedProducts = () => {
    setProducts((prev) =>
      prev.map((p) => (selRows.includes(p.id) ? { ...p, enabled: false } : p))
    );
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setSelRows((prev) => prev.filter((rowId) => rowId !== id));
  };

  const deleteSelectedProducts = () => {
    setProducts((prev) => prev.filter((p) => !selRows.includes(p.id)));
    setSelRows([]);
  };

 const confirmDeleteSelectedProducts = () => {
  toast.custom(
    (toastItem) => (
      <div className="fixed inset-0 z-9999 h-screen w-screen flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
        <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-2xl absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]">
          {/* Warning Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-4xl font-bold leading-none text-red-500">
              !
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-5 text-center text-2xl font-semibold text-gray-900">
            {t("managementTable.deleteConfirmTitle")}
          </h3>

          {/* Description */}
          <p className="mt-3 text-center text-sm text-gray-500">
            {t("managementTable.deleteSelectedConfirmMessage", {
              count: selectedCount,
            })}
          </p>

          <p className="mt-1 text-center text-sm text-gray-400">
            {t("managementTable.cannotUndo")}
          </p>

          {/* Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => {
                deleteSelectedProducts();
                toast.dismiss(toastItem.id);
              }}
              className="flex-1 cursor-pointer rounded-lg bg-red-600 py-3 text-sm font-medium text-white transition hover:bg-red-700"
            >
              {t("managementTable.delete")}
            </button>

            <button
              type="button"
              onClick={() => toast.dismiss(toastItem.id)}
              className="flex-1 cursor-pointer rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {t("managementTable.cancel")}
            </button>
          </div>
        </div>
      </div>
    ),
    {
      duration: Infinity,
    }
  );
};

  const toggleRow = (id: number) =>
    setSelRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  const toggleAll = (e: ChangeEvent<HTMLInputElement>) =>
    setSelRows(e.target.checked ? paginatedData.map((p) => p.id) : []);

  const allChecked =
    paginatedData.length > 0 && paginatedData.every((p) => selRows.includes(p.id));

  const tableHeaders = [
    t("managementTable.productName"),
    t("managementTable.category"),
    t("managementTable.price"),
    t("managementTable.inventory"),
    t("managementTable.status"),
    t("managementTable.procedures"),
  ];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (cats: string[]) => {
    setSelCats(cats);
    setPage(1);
  };

  const handleStatusChange = (status: StatusFilter) => {
    setSelStatus(status);
    setPage(1);
  };

  const selectedCount = selRows.length;

  return (
    <div className="font-sans text-gray-800">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 bg-white h-9 flex-1 max-w-[240px]">
          <i className="ti ti-search text-gray-400 text-base" aria-hidden="true" />
          <input
            type="text"
            placeholder={t("managementTable.search")}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="border-none outline-none bg-transparent text-sm w-full placeholder:text-gray-400"
          />
        </div>

        <CategoryDropdown selected={selCats} onChange={handleCategoryChange} />
        <StatusDropdown selected={selStatus} onChange={handleStatusChange} />
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-9 px-3 py-2.5 border-b border-gray-100 text-left">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="accent-indigo-600 w-4 h-4 cursor-pointer"
                />
              </th>
              {tableHeaders.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 border-b border-gray-100 text-left text-xs font-medium text-gray-500 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  <i className="ti ti-package-off text-2xl block mb-2" aria-hidden="true" />
                  {t("managementTable.noProducts")}
                </td>
              </tr>
            ) : (
              paginatedData.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  selected={selRows.includes(product.id)}
                  onSelect={() => toggleRow(product.id)}
                  onDelete={() => deleteProduct(product.id)}
                  onToggle={() => toggleProduct(product.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {totalItems === 0
            ? t("managementTable.showing", {
              start: 0,
              end: 0,
              total: totalItems,
            })
            : t("managementTable.showing", {
              start: (page - 1) * ITEMS_PER_PAGE + 1,
              end: Math.min(page * ITEMS_PER_PAGE, totalItems),
              total: totalItems,
            })}
        </span>

        {totalPages > 1 && (
          <div className="flex gap-1">
            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-sm font-medium border transition-colors ${n === page
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="fixed left-1/2 bottom-6 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold">
            {selectedCount}
          </div>
          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
            {t("managementTable.selectedProducts", { count: selectedCount })}
          </span>
          <button
            type="button"
            onClick={publishSelectedProducts}
            className="flex px-3.5 py-1 items-center justify-center rounded-md border-2 border-green-600 text-green-600 transition-colors hover:bg-green-300 text-sm font-medium"
            aria-label={t("managementTable.publishSelected")}
          >
            {t("managementTable.publish")}
          </button>
          <button
            type="button"
            onClick={unpublishSelectedProducts}
            className="flex px-3.5 py-1 items-center justify-center rounded-md border-2 border-amber-600 text-amber-600 transition-colors hover:bg-amber-300 text-sm font-medium"
            aria-label={t("managementTable.unpublishSelected")}
          >
            {t("managementTable.unpublish")}
          </button>
          <button
            type="button"
            onClick={confirmDeleteSelectedProducts}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100"
            aria-label={t("managementTable.deleteSelected")}
          >
            <Trash2 size={17} />
          </button>
          <button
            type="button"
            onClick={() => setSelRows([])}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label={t("managementTable.clearSelection")}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
