import { ImageIcon } from 'lucide-react';
import {
  type DragEvent,
  type FormEvent,
  useCallback,
  useId,
  useState,
  useTransition,
} from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import { FieldWrap, TextInput } from './shared';
import type { StoreProfileData, ValidationErrors } from './types';
import { cn, isValidEmail, isValidPhoneNumber } from './utils';

function validateStoreProfile(
  data: StoreProfileData,
  t: TFunction
): ValidationErrors {
  const e: ValidationErrors = {};
  if (!data.storeName.trim())
    e.storeName = t('settings.errors.storeNameRequired');
  if (!data.storeDescription.trim())
    e.storeDescription = t('settings.errors.storeDescriptionRequired');
  if (!isValidEmail(data.publicEmail))
    e.publicEmail = t('settings.errors.invalidEmail');
  if (!isValidPhoneNumber(data.phoneNumber))
    e.phoneNumber = t('settings.errors.invalidPhone');
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
  const { t } = useTranslation();
  return (
    <div className="settings-surface-enter border border-gray-200 rounded-lg bg-white px-4 py-3 flex items-center gap-3 transition-all duration-300 ease-out ">
      <div className="w-9 h-9 shrink-0 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center overflow-hidden">
        <img
          src={logoUrl}
          alt={t('settings.logo.alt')}
          className="w-full h-full object-cover"
        />
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
            {t('settings.logo.replace')}
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
            {t('settings.logo.remove')}
          </button>
        </div>
      </div>
    </div>
  );
}

function LogoEmpty({ onUpload }: { onUpload: (f: File) => void }) {
  const id = useId();
  const [drag, setDrag] = useState(false);
  const { t } = useTranslation();
  return (
    <label
      htmlFor={id}
      className={cn(
        'settings-surface-enter flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-7 cursor-pointer transition-all duration-300 ease-out ',
        drag
          ? 'border-gray-400 bg-gray-50'
          : 'border-gray-300 bg-white/50 hover:bg-gray-50'
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
        {t('settings.logo.upload')}
      </p>
      <p className="text-[12px] text-gray-400 mt-0.5">
        {t('settings.logo.hint')}
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
  const { t } = useTranslation();
  return (
    <div>
      <label
        htmlFor={id}
        className={cn(
          'settings-surface-enter flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-7 cursor-pointer transition-all duration-300 ease-out ',
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
          {t('settings.logo.upload')}
        </p>
        <p className="text-[12px] text-gray-400 mt-0.5">
          {t('settings.logo.hint')}
        </p>
      </label>
      <p className="settings-pop-enter mt-1.5 text-[12px] text-red-500">
        {error}
      </p>
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
  const { t } = useTranslation();
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

  const handleLogoUpload = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
        setErrors((e) => ({
          ...e,
          storeLogoUrl: t('settings.errors.imageUpload'),
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
    },
    [t]
  );

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
      const errs = validateStoreProfile(data, t);
      if (Object.values(errs).some(Boolean)) {
        setErrors(errs);
        return;
      }
      startTransition(async () => {
        await onSave(data);
        onSuccess();
      });
    },
    [data, onSave, onSuccess, t]
  );

  const hasErrors = Object.values(errors).some(Boolean);

  const logoSection = errors.storeLogoUrl ? (
    <LogoError error={errors.storeLogoUrl} onUpload={handleLogoUpload} />
  ) : data.storeLogoUrl ? (
    <LogoNormal
      logoUrl={data.storeLogoUrl}
      fileName={data.storeLogoFileName ?? t('settings.logo.fileFallback')}
      onReplace={handleLogoUpload}
      onRemove={handleLogoRemove}
    />
  ) : (
    <LogoEmpty onUpload={handleLogoUpload} />
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="settings-surface-enter settings-stagger-1 mb-5">
        <p className="text-xs font-bold text-[#969696] mb-3">
          {t('settings.storePreview')}
        </p>
        <div className="settings-surface-enter border border-[#E9E9E9] rounded-lg bg-white/50 p-5 transition-all duration-300 ease-out ">
          <div className="flex items-start gap-5">
            <div className="w-10 h-10 md:w-20 md:h-20 shrink-0 rounded-full bg-[#F8F8F8]  flex items-center justify-center overflow-hidden">
              {data.storeLogoUrl ? (
                <img
                  src={data.storeLogoUrl}
                  alt={t('settings.logo.alt')}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon size={16} className="text-[#969696] w-8 h-8" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-medium text-[#090909]">
                {data.storeName || t('settings.storeNameFallback')}
              </p>
              <p className="text-sm font-medium text-[#969696] mt-0.5  line-clamp-2">
                {data.storeDescription ||
                  t('settings.storeDescriptionFallback')}
              </p>
              <p className="text-xs text-[#969696] mt-1 flex items-center gap-1.5 flex-wrap font-normal">
                {data.publicEmail && <span>{data.publicEmail}</span>}
                {data.publicEmail && data.phoneNumber && <span>•</span>}
                {data.phoneNumber && <span>{data.phoneNumber}</span>}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-surface-enter settings-stagger-2 mb-4">
        <FieldWrap
          label={t('settings.storeName')}
          required
          error={errors.storeName}
        >
          <TextInput
            value={data.storeName}
            error={errors.storeName}
            placeholder={t('settings.storeNamePlaceholder')}
            disabled={isPending}
            onChange={(e) => update('storeName', e.target.value)}
          />
        </FieldWrap>
      </div>

      <div className="settings-surface-enter settings-stagger-2 mb-4">
        <p className="text-sm font-bold text-[#090909] mb-2">
          {t('settings.storeLogo')}
        </p>
        {logoSection}
      </div>

      <div className="settings-surface-enter settings-stagger-3 mb-6">
        <label
          htmlFor="store-description"
          className="block text-sm font-bold text-[#090909] mb-3"
        >
          {t('settings.storeDescription')}
        </label>
        <div className="relative">
          <textarea
            id="store-description"
            value={data.storeDescription}
            placeholder={t('settings.storeDescriptionPlaceholder')}
            disabled={isPending}
            onChange={(e) => update('storeDescription', e.target.value)}
            className={cn(
              'w-full h-[140px] resize-none rounded-lg border bg-white/50 px-4 pt-3 pb-8 text-sm text-[#090909] shadow-none outline-none transition-all duration-200 ease-out placeholder:text-gray-400 disabled:bg-white/50 disabled:text-[#969696] disabled:cursor-default focus:-translate-y-0.5',
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
          <p className="settings-pop-enter mt-1 text-[12px] text-red-500">
            {errors.storeDescription}
          </p>
        )}
      </div>

      <div className="settings-surface-enter settings-stagger-3 mb-6">
        <h3 className="text-xl font-medium text-[#090909] mb-3">
          {t('settings.contactInformation')}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FieldWrap
            label={t('settings.publicEmail')}
            error={errors.publicEmail}
          >
            <TextInput
              type="email"
              value={data.publicEmail}
              error={errors.publicEmail}
              placeholder={t('settings.emailPlaceholder')}
              disabled={isPending}
              onChange={(e) => update('publicEmail', e.target.value)}
            />
          </FieldWrap>
          <FieldWrap
            label={t('settings.phoneNumber')}
            error={errors.phoneNumber}
          >
            <TextInput
              type="tel"
              value={data.phoneNumber}
              error={errors.phoneNumber}
              placeholder={t('settings.phonePlaceholder')}
              disabled={isPending}
              onChange={(e) => update('phoneNumber', e.target.value)}
            />
          </FieldWrap>
        </div>
      </div>

      <div className="settings-surface-enter settings-stagger-3 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            'py-3 px-4 rounded-lg text-sm font-semibold text-white transition-all duration-200 ease-out active:scale-95',
            hasErrors || isPending
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-950 '
          )}
        >
          {isPending ? t('settings.saving') : t('settings.saveChanges')}
        </button>
      </div>
    </form>
  );
}
