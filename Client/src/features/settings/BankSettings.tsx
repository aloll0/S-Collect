import {
  useForm,
  type UseFormRegisterReturn,
  type FieldError,
} from "react-hook-form";
import { Info } from "lucide-react";

export interface BankAccountFormValues {
  bankName: string;
  iban: string;
  accountHolderName: string;
}

export interface BankAccountFormProps {
  defaultValues?: Partial<BankAccountFormValues>;
  onSave?: (values: BankAccountFormValues) => void;
}

const EMPTY_VALUES: BankAccountFormValues = {
  bankName: "",
  iban: "",
  accountHolderName: "",
};

const IBAN_MAX_LENGTH = 24;

type InputFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  hint?: string;
  error?: FieldError;
  registration: UseFormRegisterReturn;
  maxLength?: number;
};

function InputField({
  id,
  label,
  placeholder,
  hint,
  error,
  registration,
  maxLength,
}: InputFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-semibold text-gray-900"
      >
        {label}
      </label>

      <input
        id={id}
        placeholder={placeholder}
        maxLength={maxLength}
        {...registration}
        className={`mt-2 w-full rounded-xl border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none ${error
            ? "border-red-400 text-red-600 focus:border-red-400"
            : "border-gray-200 focus:border-gray-400"
          }`}
      />

      <p
        className={`mt-1.5 text-xs ${error ? "text-red-500" : "text-gray-400"
          }`}
      >
        {error?.message || hint}
      </p>
    </div>
  );
}

export default function BankAccountForm({
  defaultValues,
  onSave,
}: BankAccountFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<BankAccountFormValues>({
    defaultValues: {
      ...EMPTY_VALUES,
      ...defaultValues,
    },
    mode: "onBlur",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const ibanValue = watch("iban") ?? "";

  const onSubmit = (data: BankAccountFormValues) => {
    onSave?.(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900">
        Bank Account
      </h2>

      <p className="mt-1.5 text-sm text-gray-500">
        Used only for vendor payouts. This information is visible
        only to Admin users and never shown to customers.
      </p>

      <div className="mt-4 flex gap-3 rounded-xl bg-indigo-50 p-4">
        <Info
          size={18}
          className="mt-0.5 shrink-0 text-indigo-500"
        />

        <p className="text-sm leading-relaxed text-indigo-700">
          Bank account details are encrypted and stored securely.
          Only authorized Admin users can view this information.
        </p>
      </div>

      <div className="mt-6">
        <InputField
          id="bankName"
          label="Bank Name"
          placeholder="Enter your bank name"
          hint="Enter the official bank name."
          registration={register("bankName")}
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="iban"
          className="text-sm font-semibold text-gray-900"
        >
          IBAN <span className="text-red-500">*</span>
        </label>

        <input
          id="iban"
          placeholder="SA0000000000000000000000"
          maxLength={IBAN_MAX_LENGTH}
          {...register("iban", {
            required: "IBAN is required.",
            pattern: {
              value: /^SA\d{22}$/,
              message: "Please enter a valid Saudi IBAN.",
            },
            setValueAs: (value: string) =>
              value?.toUpperCase() || "",
          })}
          className={`mt-2 w-full rounded-xl border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:outline-none ${errors.iban
              ? "border-red-400 text-red-600 focus:border-red-400"
              : "border-gray-200 focus:border-gray-400"
            }`}
        />

        <div className="mt-1.5 flex items-center justify-between">
          <p
            className={`text-xs ${errors.iban ? "text-red-500" : "text-gray-400"
              }`}
          >
            {errors.iban?.message || " "}
          </p>

          <span className="text-xs text-gray-400">
            {ibanValue.length} / {IBAN_MAX_LENGTH}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <InputField
          id="accountHolderName"
          label="Account Holder Name"
          placeholder="Enter account holder name"
          hint="Enter the name exactly as registered with your bank."
          registration={register("accountHolderName")}
        />
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => reset()}
          disabled={!isDirty}
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
        >
          Reset Changes
        </button>

        <button
          type="submit"
          disabled={!isDirty || !isValid}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${isDirty && isValid
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "cursor-not-allowed bg-gray-100 text-gray-400"
            }`}
        >
          Save Bank Account
        </button>
      </div>
    </form>
  );
}