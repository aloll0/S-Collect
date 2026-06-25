'use client';

import { type ReactNode, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountSettingsForm } from './settings/AccountSettingsForm';
import { SuccessToast } from './settings/shared';
import { cn } from './settings/utils';
import { StoreProfileForm } from './settings/StoreProfileForm';
import { ChevronsRight } from 'lucide-react';
import type {
  AccountSettingsData,
  PasswordData,
  StoreProfileData,
} from './settings/types';

interface SettingsPageProps {
  initialStoreProfile?: Partial<StoreProfileData>;
  initialAccountSettings?: Partial<AccountSettingsData>;
  onStoreProfileSave?: (data: StoreProfileData) => Promise<void>;
  onAccountSettingsSave?: (
    data: AccountSettingsData & PasswordData
  ) => Promise<void>;
}

const defaultStoreProfile: StoreProfileData = {
  storeName: 'Collect S',
  storeDescription:
    'Your one-stop fashion destination for modern styles and quality products.',
  publicEmail: 'vendor@collectS.com',
  phoneNumber: '+966 50 123 4567',
  storeLogoUrl: null,
  storeLogoFileName: 'logo_final.png',
};

const defaultAccountSettings: AccountSettingsData = {
  firstName: 'Ahmed',
  lastName: 'Al-Rashid',
  email: 'vendor@example.com',
  phoneNumber: '0987654321000',
};

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'py-2.5 px-6 w-full md:w-fit rounded-lg text-sm font-semibold transition-all duration-300 ease-out  active:scale-95',
        active ? 'bg-gray-950 text-white' : 'bg-transparent text-[#545454] '
      )}
    >
      {children}
    </button>
  );
}

export default function SettingsPage({
  initialStoreProfile,
  initialAccountSettings,
  onStoreProfileSave = async () => undefined,
  onAccountSettingsSave = async () => undefined,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'store' | 'account'>('account');
  const [toast, setToast] = useState<string | null>(null);

  const storeData = useMemo(
    () => ({ ...defaultStoreProfile, ...initialStoreProfile }),
    [initialStoreProfile]
  );
  const [accountData, setAccountData] = useState<AccountSettingsData>(() => ({
    ...defaultAccountSettings,
    ...initialAccountSettings,
  }));

  const handleAccountSettingsSave = useCallback(
    async (data: AccountSettingsData & PasswordData) => {
      await onAccountSettingsSave(data);
      setAccountData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      });
    },
    [onAccountSettingsSave]
  );

  const breadcrumb =
    tab === 'store'
      ? t('settings.storeProfile')
      : t('settings.accountSettings');

  return (
    <div className="settings-page-enter min-h-screen bg-gray-100">
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}

      <div className="settings-surface-enter bg-white border-b border-gray-200 p-4 md:px-8 md:py-3">
        <h1 className="text-2xl font-semibold text-[#090909]">
          {t('settings.title')}
        </h1>
        <nav className="mt-3 text-sm flex items-center gap-1">
          <span className="text-[#090909]">{t('settings.title')}</span>
          <span className="mx-0.5 text-[#737373]">
            <ChevronsRight size={16} />
          </span>
          <span className="text-[#737373]">{breadcrumb}</span>
        </nav>
      </div>

      <div className="settings-surface-enter settings-stagger-1 p-4 md:px-8 md:py-7 max-w-[720px]">
        <div
          className="flex mb-4 md:mb-6 justify-center py-1.5 px-2 w-full md:w-fit bg-[#E9E9E9] rounded-lg transition-all duration-300 ease-out "
          role="tablist"
        >
          <TabBtn active={tab === 'store'} onClick={() => setTab('store')}>
            {t('settings.storeProfile')}
          </TabBtn>
          <TabBtn active={tab === 'account'} onClick={() => setTab('account')}>
            {t('settings.accountSettings')}
          </TabBtn>
        </div>

        {tab === 'store' ? (
          <StoreProfileForm
            key="store"
            initialData={storeData}
            onSave={onStoreProfileSave}
            onSuccess={() => setToast(t('settings.toast.storeProfileSaved'))}
          />
        ) : (
          <AccountSettingsForm
            key="account"
            initialData={accountData}
            onSave={handleAccountSettingsSave}
            onSuccess={() => setToast(t('settings.toast.accountSettingsSaved'))}
          />
        )}
      </div>
    </div>
  );
}
