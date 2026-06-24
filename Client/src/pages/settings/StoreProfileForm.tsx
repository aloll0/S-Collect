import { ImageIcon } from 'lucide-react';
import {
  type DragEvent,
  type FormEvent,
  useCallback,
  useId,
  useState,
  useTransition,
} from 'react';

import { FieldWrap, TextInput } from './shared';
import type { StoreProfileData, ValidationErrors } from './types';
import { cn, isValidEmail, isValidPhoneNumber } from './utils';

function validateStoreProfile(data: StoreProfileData): ValidationErrors {
  const e: ValidationErrors = {};
  if (!data.storeName.trim()) e.storeName = 'Store name is required.';
  if (!data.storeDescription.trim())
    e.storeDescription = 'Store description is required.';
  if (!isValidEmail(data.publicEmail))
    e.publicEmail = 'Please enter a valid email address.';
  if (!isValidPhoneNumber(data.phoneNumber))
    e.phoneNumber = 'Please enter a valid phone number.';
  return e;
}

function LogoNormal({
  logoUrl,
  fileName,
  onReplace,
  onRemove,
}: {
  logoUrl: string;
  fileName: string;
  onReplace: (f: File) => void;
  onRemove: () => void;
}) {
  const id = useId();
  return (
    <div className="border border-gray-200 rounded-md bg-white px-4 py-3 flex items-center gap-3">
      <div className="w-9 h-9 shrink-0 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center overflow-hidden">
        <img src={logoUrl} alt="logo" className="w-full h-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-gray-800 leading-tight">
          {fileName}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <label
            htmlFor={id}
            className="text-[12px] text-gray-500 cursor-pointer hover:text-gray-700"
          >
            Replace
            <input
              id={id}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onReplace(f);
                e.target.value = '';
              }}
            />
          </label>
          <button
            type="button"
            className="text-[12px] text-red-500 hover:text-red-700"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function LogoEmpty({ onUpload }: { onUpload: (f: File) => void }) {
  const id = useId();
  const [drag, setDrag] = useState(false);
  return (
    <label
      htmlFor={id}
      className={cn(
        'flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-7 cursor-pointer transition-colors',
        drag
          ? 'border-gray-400 bg-gray-50'
          : 'border-gray-300 bg-white hover:bg-gray-50'
      )}
      onDrop={(e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onUpload(f);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
    >
      <input
        id={id}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = '';
        }}
      />
      <p className="text-[13px] font-medium text-gray-700">
        Drag & drop or click to upload
      </p>
      <p className="text-[12px] text-gray-400 mt-0.5">
        Maximum size 2MB — JPG, PNG, WebP
      </p>
    </label>
  );
}

function LogoError({
  error,
  onUpload,
}: {
  error: string;
  onUpload: (f: File) => void;
}) {
  const id = useId();
  const [drag, setDrag] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          'flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-7 cursor-pointer transition-colors',
          drag
            ? 'border-red-400 bg-red-100'
            : 'border-red-300 bg-red-50 hover:bg-red-100'
        )}
        onDrop={(e: DragEvent<HTMLLabelElement>) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onUpload(f);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
      >
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
            e.target.value = '';
          }}
        />
        <div className="w-8 h-8 rounded-full border-2 border-red-400 flex items-center justify-center mb-2">
          <span className="text-red-400 font-bold text-[15px] leading-none select-none">
            !
          </span>
        </div>
        <p className="text-[13px] font-medium text-gray-700">
          Drag & drop or click to upload
        </p>
        <p className="text-[12px] text-gray-400 mt-0.5">
          Maximum size 2MB — JPG, PNG, WebP
        </p>
      </label>
      <p className="mt-1.5 text-[12px] text-red-500">{error}</p>
    </div>
  );
}

export function StoreProfileForm({
  initialData,
  onSave,
  onSuccess,
}: {
  initialData: StoreProfileData;
  onSave: (d: StoreProfileData) => Promise<void>;
  onSuccess: () => void;
}) {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isPending, startTransition] = useTransition();

  const update = useCallback(
    (field: keyof StoreProfileData, value: string | null) => {
      setData((d) => ({ ...d, [field]: value }));
      setErrors((e) => ({ ...e, [field]: undefined }));
    },
    []
  );

  const handleLogoUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      setErrors((e) => ({
        ...e,
        storeLogoUrl:
          'Unable to upload image. Please check the file format and size.',
      }));
      setData((d) => {
        if (d.storeLogoUrl?.startsWith('blob:'))
          URL.revokeObjectURL(d.storeLogoUrl);
        return { ...d, storeLogoUrl: null };
      });
      return;
    }
    setData((d) => {
      if (d.storeLogoUrl?.startsWith('blob:'))
        URL.revokeObjectURL(d.storeLogoUrl);
      return {
        ...d,
        storeLogoUrl: URL.createObjectURL(file),
        storeLogoFileName: file.name,
      };
    });
    setErrors((e) => ({ ...e, storeLogoUrl: undefined }));
  }, []);

  const handleLogoRemove = useCallback(() => {
    setData((d) => {
      if (d.storeLogoUrl?.startsWith('blob:'))
        URL.revokeObjectURL(d.storeLogoUrl);
      return { ...d, storeLogoUrl: null };
    });
    setErrors((e) => ({ ...e, storeLogoUrl: undefined }));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const errs = validateStoreProfile(data);
      if (Object.values(errs).some(Boolean)) {
        setErrors(errs);
        return;
      }
      startTransition(async () => {
        await onSave(data);
        onSuccess();
      });
    },
    [data, onSave, onSuccess]
  );

  const hasErrors = Object.values(errors).some(Boolean);

  const logoSection = errors.storeLogoUrl ? (
    <LogoError error={errors.storeLogoUrl} onUpload={handleLogoUpload} />
  ) : data.storeLogoUrl ? (
    <LogoNormal
      logoUrl={data.storeLogoUrl}
      fileName={data.storeLogoFileName ?? 'logo.png'}
      onReplace={handleLogoUpload}
      onRemove={handleLogoRemove}
    />
  ) : (
    <LogoEmpty onUpload={handleLogoUpload} />
  );

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-5">
        <p className="text-[12px] text-gray-500 mb-2">Store Preview</p>
        <div className="border border-gray-200 rounded-lg bg-white p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 shrink-0 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              {data.storeLogoUrl ? (
                <img
                  src={data.storeLogoUrl}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon size={16} className="text-gray-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-gray-900 leading-tight">
                {data.storeName || 'Store Name'}
              </p>
              <p className="text-[12px] text-gray-500 mt-0.5 leading-tight line-clamp-2">
                {data.storeDescription || 'Store description'}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5 flex-wrap">
                {data.publicEmail && <span>{data.publicEmail}</span>}
                {data.publicEmail && data.phoneNumber && <span>•</span>}
                {data.phoneNumber && <span>{data.phoneNumber}</span>}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <FieldWrap label="Store Name" required error={errors.storeName}>
          <TextInput
            value={data.storeName}
            error={errors.storeName}
            placeholder="Enter store name"
            disabled={isPending}
            onChange={(e) => update('storeName', e.target.value)}
          />
        </FieldWrap>
      </div>

      <div className="mb-4">
        <p className="text-[12px] font-medium text-gray-700 mb-1.5">
          Store Logo
        </p>
        {logoSection}
      </div>

      <div className="mb-6">
        <label
          htmlFor="store-description"
          className="block text-[12px] font-medium leading-5 text-gray-950 mb-3"
        >
          Store Description
        </label>
        <div className="relative">
          <textarea
            id="store-description"
            value={data.storeDescription}
            placeholder="Enter store description"
            disabled={isPending}
            onChange={(e) => update('storeDescription', e.target.value)}
            className={cn(
              'w-full h-[140px] resize-none rounded-lg border bg-white px-4 pt-3.5 pb-8 text-[17px] leading-6 text-gray-950 shadow-none outline-none transition-colors placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-default',
              errors.storeDescription
                ? 'border-red-400 bg-red-50 focus:border-red-400 focus:ring-1 focus:ring-red-100'
                : 'border-gray-200 focus:border-gray-300 focus:ring-1 focus:ring-gray-100'
            )}
          />
          {!errors.storeDescription && (
            <span className="pointer-events-none absolute bottom-3 right-3.5 text-[14px] leading-none text-gray-400">
              {data.storeDescription.length} / 500
            </span>
          )}
        </div>
        {errors.storeDescription && (
          <p className="mt-1 text-[12px] text-red-500">
            {errors.storeDescription}
          </p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-[14px] font-semibold text-gray-900 mb-3">
          Contact Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap label="Public Email" error={errors.publicEmail}>
            <TextInput
              type="email"
              value={data.publicEmail}
              error={errors.publicEmail}
              placeholder="Email"
              disabled={isPending}
              onChange={(e) => update('publicEmail', e.target.value)}
            />
          </FieldWrap>
          <FieldWrap label="Phone Number" error={errors.phoneNumber}>
            <TextInput
              type="tel"
              value={data.phoneNumber}
              error={errors.phoneNumber}
              placeholder="Phone"
              disabled={isPending}
              onChange={(e) => update('phoneNumber', e.target.value)}
            />
          </FieldWrap>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            'h-9 px-6 rounded-md text-[13px] font-semibold text-white transition-colors',
            hasErrors || isPending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-950 hover:bg-gray-800'
          )}
        >
          {isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
