import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Trash2, X } from "lucide-react";
import ProductRow from "./ProductRow";
import { showDeleteConfirmation } from "./deleteConfirmation";
import {
  useManagementStore,
  useManagementTable,
} from "./managementStore";
import CategoryDropdown from "./CategoryDropdown";
import StatusDropdown from "./StatusDropdown";

export default function ProductTable() {
  const { t } = useTranslation();
  const {
    selectedCategories,
    selectedStatus,
    search,
    page,
    selectedRows,
    paginatedProducts,
    totalItems,
    totalPages,
    selectedCount,
    allChecked,
    itemsPerPage,
  } = useManagementTable();
  const setSearch = useManagementStore((state) => state.setSearch);
  const setSelectedCategories = useManagementStore(
    (state) => state.setSelectedCategories
  );
  const setSelectedStatus = useManagementStore(
    (state) => state.setSelectedStatus
  );
  const setPage = useManagementStore((state) => state.setPage);
  const toggleProduct = useManagementStore((state) => state.toggleProduct);
  const publishSelectedProducts = useManagementStore(
    (state) => state.publishSelectedProducts
  );
  const unpublishSelectedProducts = useManagementStore(
    (state) => state.unpublishSelectedProducts
  );
  const deleteProduct = useManagementStore((state) => state.deleteProduct);
  const deleteSelectedProducts = useManagementStore(
    (state) => state.deleteSelectedProducts
  );
  const toggleRow = useManagementStore((state) => state.toggleRow);
  const setSelectedRows = useManagementStore((state) => state.setSelectedRows);
  const clearSelection = useManagementStore((state) => state.clearSelection);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleDeleteSelected = () => {
    showDeleteConfirmation(
      "managementTable.deleteSelectedConfirmMessage",
      { count: selectedCount },
      deleteSelectedProducts
    );
  };

  const handlePublishSelected = () => {
    showDeleteConfirmation(
      "managementTable.publishSelectedConfirmMessage",
      { count: selectedCount },
      publishSelectedProducts,
      {
        titleKey: "managementTable.publishConfirmTitle",
        confirmKey: "managementTable.publish",
        confirmClassName: "bg-green-600 hover:bg-green-700",
      }
    );
  };

  const handleUnpublishSelected = () => {
    showDeleteConfirmation(
      "managementTable.unpublishSelectedConfirmMessage",
      { count: selectedCount },
      unpublishSelectedProducts,
      {
        titleKey: "managementTable.unpublishConfirmTitle",
        confirmKey: "managementTable.unpublish",
        confirmClassName: "bg-amber-600 hover:bg-amber-700",
      }
    );
  };

  const toggleAll = (e: ChangeEvent<HTMLInputElement>) =>
    setSelectedRows(e.target.checked ? paginatedProducts.map((p) => p.id) : []);

  const tableHeaders = [
    t("managementTable.productName"),
    t("managementTable.category"),
    t("managementTable.price"),
    t("managementTable.inventory"),
    t("managementTable.status"),
    t("managementTable.procedures"),
  ];

  return (
    <div className="font-sans text-gray-800">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 bg-white h-9 flex-1 max-w-[240px]">
          <i className="ti ti-search text-gray-400 text-base" aria-hidden="true" />
          <input
            type="text"
            placeholder={t("managementTable.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none outline-none bg-transparent text-sm w-full placeholder:text-gray-400"
          />
        </div>

        <CategoryDropdown
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />
        <StatusDropdown selected={selectedStatus} onChange={setSelectedStatus} />
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
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  <i className="ti ti-package-off text-2xl block mb-2" aria-hidden="true" />
                  <p>{t("managementTable.noProducts")}</p>
                  <Link
                    to="/add-product"
                    className="mt-4 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    {t("managementTable.addFirstProduct")}
                  </Link>
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  selected={selectedRows.includes(product.id)}
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
              start: (page - 1) * itemsPerPage + 1,
              end: Math.min(page * itemsPerPage, totalItems),
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
            onClick={handlePublishSelected}
            className="flex px-3.5 py-1 items-center justify-center rounded-md border-2 border-green-600 text-green-600 transition-colors hover:bg-green-300 text-sm font-medium"
            aria-label={t("managementTable.publishSelected")}
          >
            {t("managementTable.publish")}
          </button>
          <button
            type="button"
            onClick={handleUnpublishSelected}
            className="flex px-3.5 py-1 items-center justify-center rounded-md border-2 border-amber-600 text-amber-600 transition-colors hover:bg-amber-300 text-sm font-medium"
            aria-label={t("managementTable.unpublishSelected")}
          >
            {t("managementTable.unpublish")}
          </button>
          <button
            type="button"
            onClick={handleDeleteSelected}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100"
            aria-label={t("managementTable.deleteSelected")}
          >
            <Trash2 size={17} />
          </button>
          <button
            type="button"
            onClick={clearSelection}
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
