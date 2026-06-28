// pages/AddProduct/QuantityInput.tsx
import { AlertCircle } from 'lucide-react';

const LOW_STOCK_THRESHOLD = 10;

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
}

const QuantityInput = ({ value, onChange }: QuantityInputProps) => (
  <div>
    <label className="mb-2 block font-medium">
      Stock Quantity <span className="text-red-500">*</span>
    </label>

    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 text-lg font-semibold transition hover:bg-gray-50"
      >
        −
      </button>

      <input
        type="number"
        value={value}
        min={0}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
        className="w-20 rounded-xl pl-4 py-2 text-center focus:border-gray-950 focus:outline-none"
      />

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-300 text-lg font-semibold transition hover:bg-gray-50"
      >
        +
      </button>
    </div>

    {value > 0 && value <= LOW_STOCK_THRESHOLD && (
      <div className="mt-2 flex items-center gap-1.5 text-sm text-amber-600">
        <AlertCircle size={14} />
        <span>
          Low stock alert will trigger at {LOW_STOCK_THRESHOLD} units.
        </span>
      </div>
    )}
  </div>
);

export default QuantityInput;
