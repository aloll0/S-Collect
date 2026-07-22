const RecentOrdersSkeleton = () => (
  <div className="p-6 space-y-4 animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="h-12 bg-gray-100 rounded-xl w-full" />
    ))}
  </div>
);

export default RecentOrdersSkeleton;
