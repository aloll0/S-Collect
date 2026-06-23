'use client';

import {
  Camera,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import {
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  useCallback,
  useId,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface StoreProfileData {
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  publicEmail: string;
  phoneNumber: string;
  storeLogoUrl: string | null;
  storeBannerUrl: string | null;
}

interface AccountSettingsData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SettingsPageProps {
  initialStoreProfile?: Partial<StoreProfileData>;
  initialAccountSettings?: Partial<AccountSettingsData>;
  onStoreProfileSave?: (data: StoreProfileData) => Promise<void>;
  onAccountSettingsSave?: (
    data: AccountSettingsData & PasswordData
  ) => Promise<void>;
}

interface ValidationErrors {
  [fieldName: string]: string | undefined;
}

interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}

interface TabButtonProps {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}

interface CardProps {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

interface PasswordFieldProps {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

interface StorePreviewProps {
  storeName: string;
  storeDescription: string;
  logoUrl: string | null;
}

interface StoreLogoUploadProps {
  logoUrl: string | null;
  fileName: string;
  error?: string;
  onChange: (file: File) => void;
  onRemove: () => void;
}

interface StoreProfileFormProps {
  initialData: StoreProfileData;
  onSave: (data: StoreProfileData) => Promise<void>;
  onSuccess: (message: string) => void;
}

interface AccountSettingsFormProps {
  initialData: AccountSettingsData;
  onSave: (data: AccountSettingsData & PasswordData) => Promise<void>;
  onSuccess: (message: string) => void;
}

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

const defaultStoreProfile: StoreProfileData = {
  storeName: 'TechStore Pro',
  storeSlug: 'techstore-pro',
  storeDescription:
    'Premium electronics and cutting-edge technology solutions for modern businesses.',
  publicEmail: 'contact@techstorepro.com',
  phoneNumber: '+1 (555) 123-4567',
  storeLogoUrl: '/logo.png',
  storeBannerUrl: null,
};

const defaultAccountSettings: AccountSettingsData = {
  firstName: 'Ahmed',
  lastName: 'Al-Rashid',
  email: 'vendor@example.com',
  phoneNumber: '+966 987654321000',
};

const emptyPasswordData: PasswordData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhoneNumber(phoneNumber: string) {
  return /^\+?[1-9]\d{7,14}$/.test(phoneNumber.replace(/[\s()-]/g, ''));
}

function isValidStoreSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim());
}

function getImageFileError(file: File) {
  if (!file.type.startsWith('image/')) {
    return 'Upload a valid image file.';
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image size must be 2MB or less.';
  }

  return undefined;
}

function getPasswordStrength(password: string) {
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  return checks.filter(Boolean).length;
}

function validateStoreProfile(data: StoreProfileData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.storeName.trim()) errors.storeName = 'Store name is required.';
  if (!data.storeSlug.trim())
    errors.storeSlug = 'Store profile URL is required.';
  if (data.storeSlug && !isValidStoreSlug(data.storeSlug)) {
    errors.storeSlug = 'Use lowercase letters, numbers, and hyphens only.';
  }
  if (!data.storeDescription.trim())
    errors.storeDescription = 'Store description is required.';
  if (!isValidEmail(data.publicEmail))
    errors.publicEmail = 'Enter a valid email address.';
  if (!isValidPhoneNumber(data.phoneNumber))
    errors.phoneNumber = 'Enter a valid phone number.';

  return errors;
}

function validateAccountSettings(
  data: AccountSettingsData,
  password: PasswordData
): ValidationErrors {
  const errors: ValidationErrors = {};
  const hasPasswordChange = Boolean(
    password.currentPassword || password.newPassword || password.confirmPassword
  );

  if (!data.firstName.trim()) errors.firstName = 'First name is required.';
  if (!data.lastName.trim()) errors.lastName = 'Last name is required.';
  if (!isValidEmail(data.email)) errors.email = 'Enter a valid email address.';
  if (!isValidPhoneNumber(data.phoneNumber))
    errors.phoneNumber = 'Enter a valid phone number.';

  if (hasPasswordChange) {
    if (!password.currentPassword)
      errors.currentPassword = 'Current password is required.';
    if (getPasswordStrength(password.newPassword) < 4) {
      errors.newPassword =
        'Must contain at least 8 characters, one uppercase letter, and one number.';
    }
    if (password.newPassword !== password.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
  }

  return errors;
}

function Field({
  id,
  label,
  error,
  helperText,
  className,
  startAdornment,
  endAdornment,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-xs font-semibold text-gray-950"
      >
        {label}
      </label>
      <div className="relative">
        {startAdornment ? (
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            {startAdornment}
          </span>
        ) : null}
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'h-10 w-full rounded-lg border bg-white text-sm text-gray-950 outline-none transition',
            'placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-950/5',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
            startAdornment ? 'pl-14 pr-3' : 'px-3',
            endAdornment ? 'pr-10' : '',
            error ? 'border-red-500' : 'border-gray-200',
            className
          )}
          {...props}
        />
        {endAdornment ? (
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            {endAdornment}
          </span>
        ) : null}
      </div>
      {helperText && !error ? (
        <p className="text-[11px] text-gray-400">{helperText}</p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="text-[11px] font-medium text-red-500"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function TextAreaField({
  id,
  label,
  error,
  helperText,
  className,
  ...props
}: TextAreaFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-xs font-semibold text-gray-950"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'min-h-[92px] w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-950 outline-none transition',
          'placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-950/5',
          error ? 'border-red-500' : 'border-gray-200',
          className
        )}
        {...props}
      />
      {helperText && !error ? (
        <p className="text-[11px] text-gray-400">{helperText}</p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="text-[11px] font-medium text-red-500"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PasswordField({ label, value, error, onChange }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Field
      label={label}
      type={visible ? 'text' : 'password'}
      value={value}
      error={error}
      onChange={(event) => onChange(event.target.value)}
      endAdornment={
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="rounded p-0.5 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      }
    />
  );
}

function TabButton({ active, children, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'relative h-8 overflow-hidden rounded-md px-4 text-[11px] font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-950/20',
        active
          ? 'bg-gray-950 text-white shadow-sm'
          : 'bg-gray-100 text-gray-600 hover:-translate-y-0.5 hover:bg-gray-200'
      )}
    >
      <span className="relative z-10">{children}</span>
      {active ? (
        <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-white/80 animate-[settingsTabLine_260ms_ease-out]" />
      ) : null}
    </button>
  );
}

function Card({ title, description, children, action }: CardProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-950">{title}</h2>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function SuccessToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div
      role="status"
      className="fixed right-8 top-28 z-20 w-[300px] rounded-lg border border-emerald-200 bg-white p-4 shadow-sm"
    >
      <div className="flex gap-3">
        <span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <ShieldCheck size={14} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-emerald-700">{message}</p>
          <p className="mt-1 text-[10px] leading-4 text-gray-500">
            Changes have been saved and will be reflected in the marketplace
            within 2 minutes.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close notification"
          className="text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          x
        </button>
      </div>
    </div>
  );
}

function StorePreview({
  storeName,
  storeDescription,
  logoUrl,
}: StorePreviewProps) {
  return (
    <div className="space-y-2 animate-[settingsFadeIn_220ms_ease-out]">
      <p className="text-xs font-semibold text-gray-950">Store Preview</p>
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${storeName} logo preview`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Camera size={18} className="text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-950">
              {storeName}
            </p>
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">
              {storeDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreLogoUpload({
  logoUrl,
  fileName,
  error,
  onChange,
  onRemove,
}: StoreLogoUploadProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) onChange(file);
      event.target.value = '';
    },
    [onChange]
  );

  return (
    <div className="space-y-2 animate-[settingsFadeIn_220ms_ease-out]">
      <p className="text-[11px] font-semibold text-gray-950">Store Logo</p>
      <div
        className={cn(
          'flex items-center gap-4 rounded-lg border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md',
          error ? 'border-red-300' : 'border-gray-100'
        )}
      >
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200 transition-transform duration-300 hover:scale-105">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Store logo preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <Camera size={20} className="text-gray-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-gray-950">
            {fileName}
          </p>
          <p className="mt-0.5 text-[10px] text-gray-500">
            PNG, JPG, or WebP. Maximum 2MB.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <label
            htmlFor={inputId}
            className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md bg-gray-950 px-3 text-[11px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-800 focus-within:ring-2 focus-within:ring-gray-950/20"
          >
            Upload
            <input
              id={inputId}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              onChange={handleChange}
            />
          </label>
          {logoUrl ? (
            <button
              type="button"
              className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 bg-white px-3 text-[11px] font-semibold text-gray-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-50 hover:text-red-600"
              onClick={onRemove}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {error ? (
        <p
          id={errorId}
          className="text-[10px] font-medium text-red-500"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function StoreProfileForm({
  initialData,
  onSave,
  onSuccess,
}: StoreProfileFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isPending, startTransition] = useTransition();

  const updateField = useCallback(
    (field: keyof StoreProfileData, value: string | null) => {
      setFormData((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    },
    []
  );

  const updateImage = useCallback(
    (field: 'storeLogoUrl' | 'storeBannerUrl', file: File) => {
      const error = getImageFileError(file);

      if (error) {
        setErrors((current) => ({ ...current, [field]: error }));
        return;
      }

      setFormData((current) => {
        const existingUrl = current[field];

        if (existingUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(existingUrl);
        }

        return { ...current, [field]: URL.createObjectURL(file) };
      });
      setErrors((current) => ({ ...current, [field]: undefined }));
    },
    []
  );

  const removeImage = useCallback(
    (field: 'storeLogoUrl' | 'storeBannerUrl') => {
      setFormData((current) => {
        const existingUrl = current[field];

        if (existingUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(existingUrl);
        }

        return { ...current, [field]: null };
      });
      setErrors((current) => ({ ...current, [field]: undefined }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validationErrors = validateStoreProfile(formData);

      if (Object.values(validationErrors).some(Boolean)) {
        setErrors(validationErrors);
        return;
      }

      startTransition(async () => {
        await onSave(formData);
        onSuccess('Store profile updated successfully.');
      });
    },
    [formData, onSave, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Card
        title="Store Profile"
        description="Update your store information and branding"
      >
        <div className="space-y-6">
          <StorePreview
            storeName={formData.storeName}
            storeDescription={formData.storeDescription}
            logoUrl={formData.storeLogoUrl}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Store Name"
              value={formData.storeName}
              error={errors.storeName}
              disabled={isPending}
              onChange={(event) => updateField('storeName', event.target.value)}
            />
            <Field
              label="Store URL Slug"
              value={formData.storeSlug}
              error={errors.storeSlug}
              disabled={isPending}
              startAdornment={
                <span className="text-[10px] text-gray-400">venda.store/</span>
              }
              onChange={(event) =>
                updateField(
                  'storeSlug',
                  event.target.value.toLowerCase().replace(/\s+/g, '-')
                )
              }
            />
          </div>

          <StoreLogoUpload
            logoUrl={formData.storeLogoUrl}
            fileName={
              formData.storeLogoUrl ? 'store-logo.png' : 'No logo uploaded'
            }
            error={errors.storeLogoUrl}
            onChange={(file) => updateImage('storeLogoUrl', file)}
            onRemove={() => removeImage('storeLogoUrl')}
          />

          <TextAreaField
            label="Store Description"
            value={formData.storeDescription}
            error={errors.storeDescription}
            disabled={isPending}
            rows={4}
            helperText={`${formData.storeDescription.length}/160 characters recommended`}
            onChange={(event) =>
              updateField('storeDescription', event.target.value)
            }
          />

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-950">
                Contact Information
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                Public details customers use to contact your store.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Public Email"
                type="email"
                value={formData.publicEmail}
                error={errors.publicEmail}
                disabled={isPending}
                onChange={(event) =>
                  updateField('publicEmail', event.target.value)
                }
              />
              <Field
                label="Phone Number"
                type="tel"
                value={formData.phoneNumber}
                error={errors.phoneNumber}
                disabled={isPending}
                onChange={(event) =>
                  updateField('phoneNumber', event.target.value)
                }
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="h-8 rounded-md bg-gray-950 px-4 text-[11px] font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

function AccountSettingsForm({
  initialData,
  onSave,
  onSuccess,
}: AccountSettingsFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [passwordData, setPasswordData] = useState(emptyPasswordData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const passwordStrength = useMemo(
    () => getPasswordStrength(passwordData.newPassword),
    [passwordData.newPassword]
  );
  const strengthLabel =
    passwordStrength >= 4 ? 'Good' : passwordStrength >= 3 ? 'Weak' : '';

  const updateField = useCallback(
    (field: keyof AccountSettingsData, value: string) => {
      setFormData((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    },
    []
  );

  const updatePasswordField = useCallback(
    (field: keyof PasswordData, value: string) => {
      setPasswordData((current) => ({ ...current, [field]: value }));
      setErrors((current) => ({ ...current, [field]: undefined }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const validationErrors = validateAccountSettings(formData, passwordData);

      if (Object.values(validationErrors).some(Boolean)) {
        setErrors(validationErrors);
        if (
          validationErrors.currentPassword ||
          validationErrors.newPassword ||
          validationErrors.confirmPassword
        ) {
          setPasswordOpen(true);
        }
        return;
      }

      startTransition(async () => {
        await onSave({ ...formData, ...passwordData });
        setPasswordData(emptyPasswordData);
        onSuccess('Account settings updated successfully.');
      });
    },
    [formData, onSave, onSuccess, passwordData]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Card
        title="Personal Information"
        description="Display current account information."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="First Name"
            value={formData.firstName}
            error={errors.firstName}
            disabled={isPending}
            onChange={(event) => updateField('firstName', event.target.value)}
          />
          <Field
            label="Last Name"
            value={formData.lastName}
            error={errors.lastName}
            disabled={isPending}
            onChange={(event) => updateField('lastName', event.target.value)}
          />
        </div>
        <div className="mt-4 space-y-4">
          <Field
            label="Email Address"
            type="email"
            value={formData.email}
            error={errors.email}
            helperText="Email address cannot be changed from this page. Please contact the administrator to request an email change."
            disabled={isPending}
            endAdornment={<Lock size={14} />}
            onChange={(event) => updateField('email', event.target.value)}
          />
          <Field
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            error={errors.phoneNumber}
            disabled={isPending}
            startAdornment={
              <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
                SA
              </span>
            }
            onChange={(event) => updateField('phoneNumber', event.target.value)}
          />
        </div>
      </Card>

      <Card
        title="Change Password"
        description="Update your account password."
        action={
          <button
            type="button"
            aria-expanded={passwordOpen}
            aria-label={
              passwordOpen
                ? 'Collapse change password'
                : 'Expand change password'
            }
            className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onClick={() => setPasswordOpen((current) => !current)}
          >
            {passwordOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        }
      >
        {passwordOpen ? (
          <div className="space-y-4">
            <PasswordField
              label="Current Password"
              value={passwordData.currentPassword}
              error={errors.currentPassword}
              onChange={(value) =>
                updatePasswordField('currentPassword', value)
              }
            />
            <div>
              <PasswordField
                label="New Password"
                value={passwordData.newPassword}
                error={errors.newPassword}
                onChange={(value) => updatePasswordField('newPassword', value)}
              />
              {passwordData.newPassword ? (
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        passwordStrength >= 4 ? 'bg-emerald-500' : 'bg-red-500'
                      )}
                      style={{
                        width: `${Math.min(passwordStrength * 20, 100)}%`,
                      }}
                    />
                  </div>
                  {strengthLabel ? (
                    <span
                      className={cn(
                        'text-[10px]',
                        passwordStrength >= 4
                          ? 'text-emerald-600'
                          : 'text-red-500'
                      )}
                    >
                      {strengthLabel}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
            <PasswordField
              label="Confirm Password"
              value={passwordData.confirmPassword}
              error={errors.confirmPassword}
              onChange={(value) =>
                updatePasswordField('confirmPassword', value)
              }
            />
            <div className="flex gap-2 rounded-md bg-blue-50 px-3 py-2 text-[10px] leading-4 text-blue-700">
              <ShieldCheck size={14} className="mt-0.5 shrink-0" />
              <p>
                Changing your password will sign out all other active sessions.
                You cannot reuse either of your last two passwords.
              </p>
            </div>
          </div>
        ) : null}
      </Card>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="h-8 rounded-md bg-gray-950 px-4 text-[11px] font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

export default function SettingsPage({
  initialStoreProfile,
  initialAccountSettings,
  onStoreProfileSave = async () => undefined,
  onAccountSettingsSave = async () => undefined,
}: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'store' | 'account'>('store');
  const [toast, setToast] = useState<StatusMessage | null>(null);

  const storeProfile = useMemo(
    () => ({ ...defaultStoreProfile, ...initialStoreProfile }),
    [initialStoreProfile]
  );
  const accountSettings = useMemo(
    () => ({ ...defaultAccountSettings, ...initialAccountSettings }),
    [initialAccountSettings]
  );

  const handleSuccess = useCallback((message: string) => {
    setToast({ type: 'success', message });
  }, []);

  const activeSectionLabel =
    activeTab === 'store' ? 'Store Profile' : 'Account Settings';

  return (
    <main className="min-h-screen bg-gray-100 text-gray-950">
      {toast ? (
        <SuccessToast message={toast.message} onClose={() => setToast(null)} />
      ) : null}

      <section className="border-b border-gray-200 bg-white px-8 py-4">
        <h1 className="text-xl font-bold tracking-tight text-gray-950">
          Settings
        </h1>
        <nav aria-label="Breadcrumb" className="mt-1">
          <ol className="flex items-center gap-1 text-[11px] text-gray-500">
            <li>Settings</li>
            <li aria-hidden="true">›</li>
            <li className="text-gray-700">{activeSectionLabel}</li>
          </ol>
        </nav>
      </section>

      <section className="w-full max-w-[760px] px-8 py-8">
        <div
          role="tablist"
          aria-label="Settings sections"
          className="mb-6 flex gap-2"
        >
          <TabButton
            active={activeTab === 'store'}
            onClick={() => setActiveTab('store')}
          >
            Store Profile
          </TabButton>
          <TabButton
            active={activeTab === 'account'}
            onClick={() => setActiveTab('account')}
          >
            Account Settings
          </TabButton>
        </div>

        <div role="tabpanel" tabIndex={0} className="outline-none">
          <div
            key={activeTab}
            className="animate-[settingsTabPanel_280ms_ease-out]"
          >
            {activeTab === 'store' ? (
              <StoreProfileForm
                initialData={storeProfile}
                onSave={onStoreProfileSave}
                onSuccess={handleSuccess}
              />
            ) : (
              <AccountSettingsForm
                initialData={accountSettings}
                onSave={onAccountSettingsSave}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes settingsTabPanel {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes settingsFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes settingsTabLine {
          from { opacity: 0; transform: scaleX(0.35); }
          to { opacity: 1; transform: scaleX(1); }
        }
      `}</style>
    </main>
  );
}
