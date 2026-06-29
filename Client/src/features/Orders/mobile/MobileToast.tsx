// features/Orders/mobile/MobileToast.tsx
import { X, CircleCheckBig, AlertCircle } from 'lucide-react';

interface MobileToastProps {
  type: 'success' | 'warning';
  message: string;
  description?: string;
  onClose: () => void;
}

export const MobileToast = ({
  type,
  message,
  description,
  onClose,
}: MobileToastProps) => {
  const isSuccess = type === 'success';

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-sm ${
        isSuccess
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      {isSuccess ? (
        <CircleCheckBig size={18} className="shrink-0 mt-0.5 text-green-600" />
      ) : (
        <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight">{message}</p>
        {description && (
          <p
            className={`text-xs mt-0.5 ${isSuccess ? 'text-green-600' : 'text-red-500'}`}
          >
            {description}
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        className={`shrink-0 mt-0.5 transition-colors ${
          isSuccess
            ? 'text-green-500 hover:text-green-700'
            : 'text-red-400 hover:text-red-600'
        }`}
      >
        <X size={15} />
      </button>
    </div>
  );
};
