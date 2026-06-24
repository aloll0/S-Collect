'use client';

import { type ReactNode, useMemo, useState } from 'react';

import { AccountSettingsForm } from './settings/AccountSettingsForm';
import { SuccessToast } from './settings/shared';
import { cn } from './settings/utils';
import { StoreProfileForm } from './settings/StoreProfileForm';
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
        'h-9 px-5 rounded-md text-[13px] font-semibold transition-colors',
        active
          ? 'bg-gray-950 text-white'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
  const [tab, setTab] = useState<'store' | 'account'>('store');
  const [toast, setToast] = useState<string | null>(null);

  const storeData = useMemo(
    () => ({ ...defaultStoreProfile, ...initialStoreProfile }),
    [initialStoreProfile]
  );
  const accountData = useMemo(
    () => ({ ...defaultAccountSettings, ...initialAccountSettings }),
    [initialAccountSettings]
  );

  const breadcrumb = tab === 'store' ? 'Store Profile' : 'Account Settings';

  return (
    <div className="min-h-screen bg-gray-100">
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}

      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <h1 className="text-[18px] font-bold text-gray-900">Settings</h1>
        <nav className="mt-0.5 text-[12px] text-gray-400 flex items-center gap-1">
          <span>Settings</span>
          <span className="mx-0.5">&gt;&gt;</span>
          <span className="text-gray-600">{breadcrumb}</span>
        </nav>
      </div>

      <div className="px-8 py-7 max-w-[640px]">
        <div className="flex gap-2 mb-6" role="tablist">
          <TabBtn active={tab === 'store'} onClick={() => setTab('store')}>
            Store Profile
          </TabBtn>
          <TabBtn active={tab === 'account'} onClick={() => setTab('account')}>
            Account Settings
          </TabBtn>
        </div>

        {tab === 'store' ? (
          <StoreProfileForm
            key="store"
            initialData={storeData}
            onSave={onStoreProfileSave}
            onSuccess={() => setToast('Store Profile updated successfully.')}
          />
        ) : (
          <AccountSettingsForm
            key="account"
            initialData={accountData}
            onSave={onAccountSettingsSave}
            onSuccess={() => setToast('Account Settings updated successfully.')}
          />
        )}
      </div>
    </div>
  );
}
