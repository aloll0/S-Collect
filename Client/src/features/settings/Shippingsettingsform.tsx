import { useForm } from "react-hook-form";
import { AlertTriangle, Info } from "lucide-react";

export interface ShippingSettingsValues {
  flatRate: number;
  regionalRates: Record<string, number | undefined>;
}

export interface Region {
  id: string;
  label: string;
}

export interface ShippingSettingsFormProps {
  regions?: Region[];
  defaultValues?: Partial<ShippingSettingsValues>;
  currency?: string;
  isConfigured?: boolean;
  onSave?: (values: ShippingSettingsValues) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SAUDI_REGIONS: Region[] = [
  { id: "riyadh", label: "Riyadh" },
  { id: "makkah", label: "Makkah" },
  { id: "madinah", label: "Madinah" },
  { id: "eastern-province", label: "Eastern Province" },
  { id: "qassim", label: "Qassim" },
  { id: "asir", label: "Asir" },
  { id: "tabuk", label: "Tabuk" },
  { id: "hail", label: "Hail" },
  { id: "northern-borders", label: "Northern Borders" },
  { id: "jazan", label: "Jazan" },
  { id: "najran", label: "Najran" },
  { id: "al-bahah", label: "Al Bahah" },
  { id: "al-jouf", label: "Al Jouf" },
];

export default function ShippingSettingsForm({
  regions = SAUDI_REGIONS,
  defaultValues,
  currency = "SAR",
  isConfigured = false,
  onSave,
}: ShippingSettingsFormProps) {
  const values: ShippingSettingsValues = {
    flatRate: defaultValues?.flatRate ?? 0,
    regionalRates: defaultValues?.regionalRates ?? {},
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ShippingSettingsValues>({
    defaultValues: values,
    mode: "onBlur",
  });

  const onSubmit = (data: ShippingSettingsValues) => {
    onSave?.(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[720px] rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900">
        Shipping Settings
      </h2>
      <p className="mt-1.5 text-sm text-gray-500">
        Configure your shipping prices across Saudi Arabia.
      </p>

      {!isConfigured && (
        <div className="mt-4 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <AlertTriangle
            size={16}
            className="mt-0.5 shrink-0 text-amber-500"
          />
          <p className="text-sm text-amber-700">
            Your store cannot receive new orders until shipping settings are
            configured.
          </p>
        </div>
      )}

      {/* Flat rate */}
      <div className="mt-6">
        <label htmlFor="flatRate" className="text-sm font-semibold text-gray-900">
          Flat Rate <span className="text-red-500">*</span>
        </label>
        <div
          className={`mt-2 flex items-center overflow-hidden rounded-xl border ${errors.flatRate ? "border-red-400" : "border-gray-200"
            } focus-within:border-gray-400`}
        >
          <span className="border-r border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-500">
            {currency}
          </span>
          <input
            id="flatRate"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("flatRate", {
              required: true,
              valueAsNumber: true,
              min: 0,
            })}
            className="w-full px-3 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none"
          />
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          This rate is automatically applied to any region without a custom
          shipping price.
        </p>
      </div>

      {/* Regional shipping */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-900">
          Regional Shipping
        </p>
        <div className="mt-2 overflow-hidden rounded-xl border border-gray-200">
          {regions.map((region, i) => (
            <div
              key={region.id}
              className={`flex items-center justify-between px-4 py-2.5 ${i % 2 === 1 ? "bg-gray-50" : "bg-white"
                } ${i !== 0 ? "border-t border-gray-100" : ""}`}
            >
              <span className="text-sm text-gray-700">{region.label}</span>
              <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                <span className="border-r border-gray-200 px-2 py-1.5 text-xs text-gray-400">
                  {currency}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register(`regionalRates.${region.id}` as const, {
                    valueAsNumber: true,
                    min: 0,
                  })}
                  className="w-20 px-2 py-1.5 text-right text-xs placeholder:text-gray-300 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="mt-6 flex gap-2.5 rounded-xl border border-indigo-200 bg-indigo-50 p-3.5">
        <Info size={16} className="mt-0.5 shrink-0 text-indigo-500" />
        <p className="text-sm text-indigo-700">
          Regions without a custom shipping price automatically use the
          Default Flat Rate.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={!isValid}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${isValid
            ? "bg-gray-900 text-white hover:bg-gray-800"
            : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
        >
          Save Shipping Settings
        </button>
      </div>
    </form>
  );
}