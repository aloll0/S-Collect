const InventoryCardSkeleton = () => {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      {/* Image */}
      <div className="h-14 w-14 rounded-lg bg-gray-200 shrink-0" />

      {/* Content */}
      <div className="flex flex-col gap-2.5 flex-1">
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>

      {/* Status + Stock */}
      <div className="flex flex-col items-end pe-1.5">
        <div className="h-7 w-24 rounded-full bg-gray-200 mb-3" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default InventoryCardSkeleton;