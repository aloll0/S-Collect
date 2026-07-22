import { useState, type ChangeEvent } from 'react';
import { ChevronLeft, ChevronRight, X, ChevronDown, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useVendorStore, useVendorTable } from './vendorStore';
import VendorCategoryDropdown from './VendorCategoryDropdown';
import VendorConfirmModal from './VendorConfirmModal';
import Toggle from '../mangement/Toggle';
import type { ActiveFilter, VendorTab } from './vendors';
import PortalDropdown from '../../components/ui/PortalDropdown';

export default function VendorTable() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const navigate = useNavigate();

  const activeTab = useVendorStore((s) => s.activeTab);
  const search = useVendorStore((s) => s.search);
  const selectedCategory = useVendorStore((s) => s.selectedCategory);
  const activeFilter = useVendorStore((s) => s.activeFilter);
  const setActiveTab = useVendorStore((s) => s.setActiveTab);
  const setSearch = useVendorStore((s) => s.setSearch);
  const setSelectedCategory = useVendorStore((s) => s.setSelectedCategory);
  const setActiveFilter = useVendorStore((s) => s.setActiveFilter);
  const setPage = useVendorStore((s) => s.setPage);
  const bulkApprove = useVendorStore((s) => s.bulkApprove);
  const bulkReject = useVendorStore((s) => s.bulkReject);
  const toggleVendorActive = useVendorStore((s) => s.toggleVendorActive);
  const toggleRow = useVendorStore((s) => s.toggleRow);
  const setSelectedRows = useVendorStore((s) => s.setSelectedRows);
  const clearSelection = useVendorStore((s) => s.clearSelection);

  const {
    paginated,
    totalItems,
    totalPages,
    page,
    itemsPerPage,
    pendingCount,
    selectedRows,
    selectedCount,
    allChecked,
    paginatedIds,
  } = useVendorTable();

  type ModalType = 'approve' | 'reject' | 'deactivate';
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: ModalType;
    ids: number[];
    vendorName?: string;
  }>({ isOpen: false, type: 'approve', ids: [] });

  const tabs: { key: VendorTab; label: string; count?: number }[] = [
    { key: 'pending', label: t('vendors.tabs.pending'), count: pendingCount },
    { key: 'all', label: t('vendors.tabs.all') },
  ];


  const activeFilters: { key: ActiveFilter; label: string }[] = [
    { key: 'all', label: t('vendors.table.allStatuses') },
    { key: 'active', label: t('vendors.table.active') },
    { key: 'inactive', label: t('vendors.table.inactive') },
  ];

  // Columns differ by tab
  const isAllTab = activeTab === 'all';

  const pendingSuspendedHeaders = [
    t('vendors.table.businessName'),
    t('vendors.table.owner'),
    t('vendors.table.email'),
    t('vendors.table.submittedDate'),
    t('vendors.table.category'),
    t('vendors.table.actions'),
  ];

  const allVendorHeaders = [
    t('vendors.table.vendorName'),
    t('vendors.table.owner'),
    t('vendors.table.revenue'),
    t('vendors.table.submittedDate'),
    t('vendors.table.email'),
    t('vendors.table.orders'),
    t('vendors.table.status'),
  ];

  const tableHeaders = isAllTab ? allVendorHeaders : pendingSuspendedHeaders;
  const colSpan = tableHeaders.length + 1; // +1 for checkbox

  const startItem = totalItems === 0 ? 0 : (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalItems);


  const activeFilterLabel =
    activeFilters.find((f) => f.key === activeFilter)?.label ??
    t('vendors.table.statusFilter');

  const toggleAll = (e: ChangeEvent<HTMLInputElement>) =>
    setSelectedRows(e.target.checked ? paginatedIds : []);

  const openConfirm = (type: ModalType, ids: number[], vendorName?: string) =>
    setConfirmModal({ isOpen: true, type, ids, vendorName });

  const handleConfirm = () => {
    const { type, ids } = confirmModal;
    if (type === 'approve') bulkApprove(ids);
    else if (type === 'reject') bulkReject(ids);
    else {
      ids.forEach((id) => {
        const store = useVendorStore.getState();
        const vendor = store.vendors.find((v) => v.id === id);
        if (vendor?.active) store.toggleVendorActive(id);
      });
      clearSelection();
    }
    setConfirmModal({ isOpen: false, type: 'approve', ids: [] });
  };

  const handleCancel = () =>
    setConfirmModal({ isOpen: false, type: 'approve', ids: [] });

  return (
    <div className="font-sans text-gray-800" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                  activeTab === tab.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 bg-white h-9 flex-1 max-w-[200px]">
          <i className="ti ti-search text-gray-400 text-base" aria-hidden="true" />
          <input
            type="text"
            placeholder={t('vendors.table.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none outline-none bg-transparent text-sm w-full placeholder:text-gray-400"
          />
        </div>

        {/* Category filter — only for non-all tabs (pending / suspended) */}
        {!isAllTab && (
          <VendorCategoryDropdown
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        )}

        {/* Status filter — only for All Vendors tab */}
        {isAllTab && (
          <PortalDropdown
            minWidth={150}
            animate={false}
            menuClassName="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
            trigger={({ isOpen, toggle }) => (
              <button
                className="flex items-center gap-1.5 h-9 px-3 border border-gray-200 rounded-lg bg-white text-sm cursor-pointer hover:bg-gray-50 whitespace-nowrap"
                onClick={toggle}
              >
                <span className="font-medium">{t('vendors.table.statusFilter')}</span>
                {activeFilter !== 'all' && (
                  <span className="text-xs text-indigo-600 font-semibold">
                    · {activeFilterLabel}
                  </span>
                )}
                <ChevronDown
                  size={14}
                  color="black"
                  className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            )}
          >
            {({ close }) => (
              <>
                {activeFilters.map((f) => (
                  <div
                    key={f.key}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setActiveFilter(f.key);
                      close();
                    }}
                  >
                    <input
                      type="radio"
                      readOnly
                      checked={activeFilter === f.key}
                      className="accent-black w-3.5 h-3.5"
                    />
                    <span>{f.label}</span>
                  </div>
                ))}
              </>
            )}
          </PortalDropdown>
        )}

      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm bg-gray-100">
          <thead>
            <tr>
              <th className="w-9 px-3 py-3 border-b border-gray-200 text-start bg-gray-50">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="accent-black w-4 h-4 cursor-pointer"
                />
              </th>
              {tableHeaders.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 border-b border-gray-200 text-start text-xs font-semibold text-gray-500 whitespace-nowrap bg-gray-50"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="text-center py-16 text-gray-400">
                  {activeTab === 'pending' ? (
                    /* ── "No Pending Requests" empty state ── */
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                        <i className="ti ti-mail text-2xl text-gray-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-700 mb-1">
                          {t('vendors.table.noPendingRequests')}
                        </p>
                        <p className="text-sm text-gray-400 max-w-xs mx-auto">
                          {t('vendors.table.noPendingSubtext')}
                        </p>
                      </div>
                      <button
                        onClick={() => window.location.reload()}
                        className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <RefreshCw size={14} />
                        {t('vendors.table.refresh')}
                      </button>
                    </div>
                  ) : (
                    /* ── Generic empty state ── */
                    <div className="flex flex-col items-center gap-2">
                      <i className="ti ti-building-store text-2xl block" aria-hidden="true" />
                      <p>{t('vendors.table.noVendors')}</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : isAllTab ? (
              // ── All Vendors: approved only with toggle, rows navigate to detail ──
              paginated.map((vendor) => {
                const isSelected = selectedRows.includes(vendor.id);
                return (
                  <tr
                    key={vendor.id}
                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                    className={`border-b border-gray-100 transition-colors cursor-pointer ${
                      isSelected ? 'bg-indigo-50/60' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <td
                      className="px-3 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(vendor.id)}
                        className="accent-black w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900 whitespace-nowrap">
                      {vendor.businessName}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {vendor.owner}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-gray-900 whitespace-nowrap">
                      {(vendor.revenue ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                      {vendor.submittedDate}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {vendor.email}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {vendor.orders ?? 0}
                    </td>
                    <td
                      className="px-4 py-3.5 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Toggle
                        checked={vendor.active ?? true}
                        onChange={() => {
                          if (vendor.active) {
                            openConfirm('deactivate', [vendor.id]);
                          } else {
                            toggleVendorActive(vendor.id);
                          }
                        }}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              // ── Pending / Suspended: original columns ──
              paginated.map((vendor) => {
                const isSelected = selectedRows.includes(vendor.id);
                return (
                  <tr
                    key={vendor.id}
                    className={`border-b border-gray-100 transition-colors ${
                      isSelected ? 'bg-indigo-50/60' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-3 py-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(vendor.id)}
                        className="accent-black w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/vendors/${vendor.id}`)}
                        className="font-medium text-gray-900 hover:text-indigo-600 hover:underline underline-offset-2 transition-colors text-start"
                      >
                        {vendor.businessName}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {vendor.owner}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {vendor.email}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                      {vendor.submittedDate}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">
                      {vendor.category}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {vendor.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              openConfirm('approve', [vendor.id], vendor.businessName)
                            }
                            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#1e8528] text-white hover:bg-green-800 transition-colors shadow-2xs"
                          >
                            {t('vendors.table.approve')}
                          </button>
                          <button
                            onClick={() =>
                              openConfirm('reject', [vendor.id], vendor.businessName)
                            }
                            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-red-300 text-red-700 bg-white hover:bg-red-50 transition-colors shadow-2xs"
                          >
                            {t('vendors.table.reject')}
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                          {t('vendors.table.suspendedStatus')}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {t('vendors.table.showing', {
            start: startItem,
            end: endItem,
            total: totalItems,
          })}
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isRtl ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-sm font-medium border transition-colors ${
                  n === page
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {selectedCount > 0 && (
        <div className="fixed left-1/2 bottom-6 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-gray-900 text-sm font-semibold">
            {selectedCount}
          </div>
          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
            {t('vendors.table.selected', { count: selectedCount })}
          </span>

          {activeTab === 'pending' && (
            <>
              <button
                onClick={() => openConfirm('approve', selectedRows)}
                className="flex px-3.5 py-1 items-center justify-center rounded-md border border-green-600 text-green-600 transition-colors hover:bg-green-50 text-sm font-medium"
              >
                {t('vendors.table.approveSelected')}
              </button>
              <button
                onClick={() => openConfirm('reject', selectedRows)}
                className="flex px-3.5 py-1 items-center justify-center rounded-md border border-red-500 text-red-500 transition-colors hover:bg-red-50 text-sm font-medium"
              >
                {t('vendors.table.rejectSelected')}
              </button>
            </>
          )}

          {activeTab === 'all' && (
            <button
              onClick={() => openConfirm('deactivate', selectedRows)}
              className="flex px-3.5 py-1 items-center justify-center rounded-md border border-red-500 text-red-600 transition-colors hover:bg-red-50 text-sm font-medium"
            >
              {t('vendors.table.deactivateSelected')}
            </button>
          )}

          {activeTab === 'suspended' && (
            <button
              onClick={() => openConfirm('approve', selectedRows)}
              className="flex px-3.5 py-1 items-center justify-center rounded-md border border-green-600 text-green-600 transition-colors hover:bg-green-50 text-sm font-medium"
            >
              {t('vendors.table.approveSelected')}
            </button>
          )}

          <button
            onClick={clearSelection}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label={t('vendors.table.clearSelection')}
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* Confirmation modal */}
      <VendorConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        count={confirmModal.ids.length}
        vendorName={confirmModal.vendorName}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
