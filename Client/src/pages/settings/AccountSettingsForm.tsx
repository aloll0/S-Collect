import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  EyeOff,
  Info,
  Lock,
} from 'lucide-react';
import { type FormEvent, useCallback, useState, useTransition } from 'react';

import {
  FieldWrap,
  PasswordInput,
  PasswordStrengthBar,
  SectionCard,
  TextInput,
} from './shared';
import { getPasswordStrength } from './utils';
import type {
  AccountSettingsData,
  PasswordData,
  ValidationErrors,
} from './types';

const emptyPasswordData: PasswordData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function validateAccountSettings(
  data: AccountSettingsData,
  pw: PasswordData
): ValidationErrors {
  const e: ValidationErrors = {};
  const hasPw = Boolean(
    pw.currentPassword || pw.newPassword || pw.confirmPassword
  );
  if (!data.firstName.trim()) e.firstName = 'First name is required.';
  if (!data.lastName.trim()) e.lastName = 'Last name is required.';
  if (hasPw) {
    if (!pw.currentPassword)
      e.currentPassword = 'Current password is required.';
    if (getPasswordStrength(pw.newPassword) < 4)
      e.newPassword =
        'Must contain at least 8 characters, one uppercase letter, and one number.';
    if (pw.newPassword !== pw.confirmPassword)
      e.confirmPassword = 'Passwords do not match.';
  }
  return e;
}

export function AccountSettingsForm({
  initialData,
  onSave,
  onSuccess,
}: {
  initialData: AccountSettingsData;
  onSave: (d: AccountSettingsData & PasswordData) => Promise<void>;
  onSuccess: () => void;
}) {
  const [pw, setPw] = useState(emptyPasswordData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [pwOpen, setPwOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const updatePw = useCallback((field: keyof PasswordData, val: string) => {
    setPw((d) => ({ ...d, [field]: val }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const errs = validateAccountSettings(initialData, pw);
      if (Object.values(errs).some(Boolean)) {
        setErrors(errs);
        if (errs.currentPassword || errs.newPassword || errs.confirmPassword)
          setPwOpen(true);
        return;
      }
      startTransition(async () => {
        await onSave({ ...initialData, ...pw });
        setPw(emptyPasswordData);
        onSuccess();
      });
    },
    [initialData, pw, onSave, onSuccess]
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <SectionCard>
        <div className="p-5">
          <p className="text-[14px] font-semibold text-gray-900">
            Personal Information
          </p>
          <p className="text-[12px] text-gray-500 mt-0.5 mb-4">
            Display current account information.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-[12px] font-medium text-gray-700 mb-1.5">
                First Name
              </p>
              <div className="h-10 px-3 flex items-center border border-gray-200 rounded-md bg-white">
                <span className="text-[13px] text-gray-900">
                  {initialData.firstName}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[12px] font-medium text-gray-700 mb-1.5">
                Last Name
              </p>
              <div className="h-10 px-3 flex items-center border border-gray-200 rounded-md bg-white">
                <span className="text-[13px] text-gray-900">
                  {initialData.lastName}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-[12px] font-medium text-gray-700 mb-1.5">
              Email Address
            </p>
            <div className="relative">
              <div className="h-10 px-3 pr-10 flex items-center border border-gray-200 rounded-md bg-white">
                <span className="text-[13px] text-gray-500">
                  {initialData.email}
                </span>
              </div>
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <Lock size={14} />
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 leading-4">
              Email address cannot be changed from this page. Please contact the
              administrator to request an email change.
            </p>
            <button
              type="button"
              className="mt-1 flex items-center gap-0.5 text-[12px] text-gray-500 hover:text-gray-700"
            >
              Request email change
              <ArrowRight size={11} className="mt-0.5" />
            </button>
          </div>

          <div>
            <p className="text-[12px] font-medium text-gray-700 mb-1.5">
              Phone Number
            </p>
            <div className="h-10 px-3 flex items-center gap-2 border border-gray-200 rounded-md bg-white">
              <span className="text-[9px] font-bold text-white bg-green-600 rounded px-1.5 py-0.5 leading-none shrink-0">
                SA
              </span>
              <span className="text-[13px] text-gray-500">+966</span>
              <span className="text-[13px] text-gray-900">
                {initialData.phoneNumber}
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard>
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[14px] font-semibold text-gray-900">
                Change Password
              </p>
              <p className="text-[12px] text-gray-500 mt-0.5">
                Update your account password.
              </p>
            </div>
            <button
              type="button"
              aria-expanded={pwOpen}
              className="p-1 rounded text-gray-500 hover:bg-gray-100 transition-colors mt-0.5"
              onClick={() => setPwOpen((v) => !v)}
            >
              {pwOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {pwOpen && (
            <div className="mt-5 space-y-4">
              <PasswordInput
                label="Current Password"
                value={pw.currentPassword}
                error={errors.currentPassword}
                onChange={(v) => updatePw('currentPassword', v)}
              />

              <div>
                <FieldWrap label="New Password" error={errors.newPassword}>
                  <div className="relative">
                    <TextInput
                      type="password"
                      value={pw.newPassword}
                      error={errors.newPassword}
                      className="pr-10"
                      onChange={(e) => {
                        updatePw('newPassword', e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      aria-label="Toggle visibility"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <EyeOff size={15} />
                    </button>
                  </div>
                </FieldWrap>
                <PasswordStrengthBar
                  password={pw.newPassword}
                  error={errors.newPassword}
                />
              </div>

              <PasswordInput
                label="Confirm Password"
                value={pw.confirmPassword}
                error={errors.confirmPassword}
                onChange={(v) => updatePw('confirmPassword', v)}
              />

              <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-md px-3 py-2.5">
                <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[12px] text-blue-700 leading-4">
                  Changing your password will sign out all other active
                  sessions. You cannot reuse either of your last two passwords.
                </p>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="h-9 px-6 rounded-md bg-gray-950 text-[13px] font-semibold text-white hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors min-w-[130px] flex items-center justify-center"
        >
          {isPending ? (
            <span className="flex items-center gap-1 text-white">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </span>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
