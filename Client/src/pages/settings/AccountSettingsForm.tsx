import { ArrowRight, ChevronDown, EyeOff, Info, Lock } from 'lucide-react';
import { type FormEvent, useCallback, useState, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import {
  FieldWrap,
  PasswordInput,
  PasswordStrengthBar,
  SectionCard,
  TextInput,
} from './shared';
import { getPasswordStrength, cn } from './utils';
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
  pw: PasswordData,
  t: TFunction
): ValidationErrors {
  const e: ValidationErrors = {};
  const hasPw = Boolean(
    pw.currentPassword || pw.newPassword || pw.confirmPassword
  );
  if (!data.firstName.trim())
    e.firstName = t('settings.errors.firstNameRequired');
  if (!data.lastName.trim()) e.lastName = t('settings.errors.lastNameRequired');
  if (hasPw) {
    if (!pw.currentPassword)
      e.currentPassword = t('settings.errors.currentPasswordRequired');
    if (getPasswordStrength(pw.newPassword) < 4)
      e.newPassword = t('settings.errors.newPasswordWeak');
    if (pw.newPassword !== pw.confirmPassword)
      e.confirmPassword = t('settings.errors.passwordMismatch');
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
  const { t } = useTranslation();
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
      const errs = validateAccountSettings(initialData, pw, t);
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
    [initialData, pw, onSave, onSuccess, t]
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-3 settings-surface-enter"
    >
      <SectionCard>
        <div className="md:p-5 px-4 py-6">
          <p className="text-base font-bold text-[#090909">
            {t('settings.account.personalInformation')}
          </p>
          <p className="text-xs text-[#737373] mt-1  mb-2 md:mb-4 font-normal">
            {t('settings.account.personalInformationDescription')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-bold text-[#090909] mb-1.5">
                {t('settings.account.firstName')}
              </p>
              <div className="h-10 px-3 flex items-center border border-gray-200 rounded-md bg-white transition-all duration-200 ease-out ">
                <span className="text-[13px] text-gray-900">
                  {initialData.firstName}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[#090909] mb-1.5">
                {t('settings.account.lastName')}
              </p>
              <div className="h-10 px-3 flex items-center border border-gray-200 rounded-md bg-white transition-all duration-200 ease-out ">
                <span className="text-[13px] text-gray-900">
                  {initialData.lastName}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-xs font-bold text-[#090909] mb-1.5">
              {t('settings.account.emailAddress')}
            </p>
            <div className="relative">
              <div className="h-10 px-3 pr-10 flex items-center border border-gray-200 rounded-md bg-white transition-all duration-200 ease-out ">
                <span className="text-[13px] text-gray-500">
                  {initialData.email}
                </span>
              </div>
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                <Lock size={14} />
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 leading-4">
              {t('settings.account.emailLockedHint')}
            </p>
            <button
              type="button"
              className="mt-1 flex items-center gap-0.5 text-[12px] text-gray-500 transition-all duration-200 ease-out hover:translate-x-0.5 hover:text-gray-700"
            >
              {t('settings.account.requestEmailChange')}
              <ArrowRight size={11} className="mt-0.5" />
            </button>
          </div>

          <div>
            <p className="text-xs font-bold text-[#090909] mb-1.5">
              {t('settings.account.phoneNumber')}
            </p>
            <div className="h-10 px-3 flex items-center gap-2 border border-gray-200 rounded-md bg-white transition-all duration-200 ease-out ">
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
        <div className="md:p-5 px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-bold text-[#090909]">
                {t('settings.account.changePassword')}
              </p>
              <p className="text-xs font-normal text-[#545454] mt-1">
                {t('settings.account.changePasswordDescription')}
              </p>
            </div>
            <button
              type="button"
              aria-expanded={pwOpen}
              className="p-1 rounded text-gray-500 transition-all duration-300 ease-out hover:bg-gray-100 hover:scale-110 mt-0.5"
              onClick={() => setPwOpen((v) => !v)}
            >
              <ChevronDown
                size={16}
                className={cn(
                  'transition-transform duration-300 ease-out',
                  pwOpen ? 'rotate-180' : 'rotate-0'
                )}
              />
            </button>
          </div>

          <div
            className={cn(
              'grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out',
              pwOpen
                ? 'grid-rows-[1fr] opacity-100 mt-5'
                : 'grid-rows-[0fr] opacity-0 mt-0'
            )}
          >
            <div className="overflow-hidden">
              <div
                className={cn(
                  'space-y-4 transition-transform duration-500 ease-in-out',
                  pwOpen ? 'translate-y-0' : '-translate-y-2'
                )}
              >
                <PasswordInput
                  label={t('settings.account.currentPassword')}
                  value={pw.currentPassword}
                  error={errors.currentPassword}
                  onChange={(v) => updatePw('currentPassword', v)}
                />

                <div>
                  <FieldWrap
                    label={t('settings.account.newPassword')}
                    error={errors.newPassword}
                  >
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
                        aria-label={t('settings.account.toggleVisibility')}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 transition-all duration-200 hover:scale-110 hover:text-gray-600"
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
                  label={t('settings.account.confirmPassword')}
                  value={pw.confirmPassword}
                  error={errors.confirmPassword}
                  onChange={(v) => updatePw('confirmPassword', v)}
                />

                <div className="settings-surface-enter flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-md px-3 py-2.5">
                  <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-blue-700 leading-4">
                    {t('settings.account.passwordInfo')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="settings-surface-enter settings-stagger-2 flex justify-center md:justify-end pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="py-3 px-4 rounded-lg text-sm font-semibold text-white bg-[#090909] md:w-fit w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 ease-out active:scale-95 min-w-[130px] flex items-center justify-center"
        >
          {isPending ? (
            <span className="flex items-center gap-1 text-white">
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </span>
          ) : (
            t('settings.saveChanges')
          )}
        </button>
      </div>
    </form>
  );
}
