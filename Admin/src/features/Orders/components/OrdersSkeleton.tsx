import React from 'react';

interface OrdersSkeletonProps {
  isMobile?: boolean;
}

export const OrdersSkeleton: React.FC<OrdersSkeletonProps> = ({ isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs animate-pulse"
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-24 bg-gray-200 rounded-md" />
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
            </div>

            {/* Body */}
            <div className="space-y-2.5 py-2 border-t border-b border-gray-100 mb-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="h-3 w-16 bg-gray-200 rounded-sm" />
                  <div className="h-3 w-28 bg-gray-200 rounded-sm" />
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 bg-gray-200 rounded-md" />
              <div className="h-4 w-16 bg-gray-200 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-white text-xs font-bold text-gray-900">
              <th className="py-4 px-4 text-start font-bold">Order ID</th>
              <th className="py-4 px-4 text-start font-bold">Customer</th>
              <th className="py-4 px-4 text-start font-bold">Vendor</th>
              <th className="py-4 px-4 text-start font-bold">Total (SAR)</th>
              <th className="py-4 px-4 text-start font-bold">Status</th>
              <th className="py-4 px-4 text-start font-bold">Sub-orders</th>
              <th className="py-4 px-4 text-start font-bold">Date</th>
              <th className="py-4 px-4 text-start font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {Array.from({ length: 7 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="py-4 px-4">
                  <div className="h-4 w-28 bg-gray-200 rounded-md" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-32 bg-gray-200 rounded-md" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-24 bg-gray-200 rounded-md" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-20 bg-gray-200 rounded-md" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-6 w-20 bg-gray-200 rounded-full" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-10 bg-gray-200 rounded-md" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-24 bg-gray-200 rounded-md" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-4 w-16 bg-gray-200 rounded-md" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 animate-pulse">
        <div className="h-4 w-36 bg-gray-200 rounded-md" />
        <div className="flex gap-1.5">
          <div className="w-8 h-8 rounded-lg bg-gray-200" />
          <div className="w-8 h-8 rounded-lg bg-gray-200" />
          <div className="w-8 h-8 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
};
