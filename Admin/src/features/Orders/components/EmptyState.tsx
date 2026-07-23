import React from 'react';
import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center py-14 sm:py-16 px-4">
      {/* 3D Package Icon Circle */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100/70 flex items-center justify-center mb-4 text-gray-400">
        <Package size={34} strokeWidth={1.5} />
      </div>

      {/* Main Title */}
      <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1.5">
        {title || t('ordersPage.noOrdersFound', 'No Orders Found')}
      </h3>

      {/* Subtitle / Description */}
      <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm font-medium leading-relaxed">
        {description ||
          t(
            'ordersPage.noOrdersMatch',
            'No orders match your current filters. Try adjusting your search criteria.'
          )}
      </p>
    </div>
  );
};
