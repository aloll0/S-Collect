import { useInventory } from './hooks/useInventory';
import { InventoryHeader } from './InventoryHeader';
import { InventoryToolbar } from './InventoryToolbar';
import { InventoryTable } from './InventoryTable';
import { InventoryPagination } from './InventoryPagination';
import { InventoryFooter } from './InventoryFooter';

const InventoryDesktop = () => {
  const {
    search,
    activeTab,
    currentPage,
    paginatedData,
    totalItems,
    totalPages,
    pageNumbers,
    handleFilterChange,
    handleSearchChange,
    handleStockChange,
    handlePageChange,
    handleSave,
  } = useInventory();

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
      <InventoryHeader />
      <InventoryToolbar
        search={search}
        activeTab={activeTab}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />
      <div className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 pb-4 px-4 pt-2">
        <InventoryTable
          data={paginatedData}
          onStockChange={handleStockChange}
        />
        <InventoryPagination
          currentPage={currentPage}
          totalItems={totalItems}
          totalPages={totalPages}
          pageNumbers={pageNumbers}
          onPageChange={handlePageChange}
        />
      </div>
      <InventoryFooter onSave={handleSave} />
    </div>
  );
};

export default InventoryDesktop;
