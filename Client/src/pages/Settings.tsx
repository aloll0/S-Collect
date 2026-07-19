'use client';

import { type ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import BankSettings, {
  type BankAccountFormValues,
} from '../features/settings/BankSettings';
import ShippingSettingsForm, {
  type ShippingSettingsValues,
} from '../features/settings/Shippingsettingsform';
import { SuccessToast } from '../features/settings/shared';
import { cn } from '../features/settings/utils';
import { StoreProfileForm } from '../features/settings/StoreProfileForm';
import { ChevronsRight } from 'lucide-react';
import type { StoreProfileData } from '../features/settings/types';

type SettingsTab = 'store-details' | 'bank-account' | 'shipping';

interface SettingsPageProps {
  initialStoreProfile?: Partial<StoreProfileData>;
  onStoreProfileSave?: (data: StoreProfileData) => Promise<void>;
  onBankAccountSave?: (data: BankAccountFormValues) => void;
  onShippingSave?: (data: ShippingSettingsValues) => void;
}

const defaultStoreProfile: StoreProfileData = {
  storeName: '',
  storeDescription: '',
  publicEmail: '',
  phoneNumber: '',
  storeLogoUrl: null,
  storeLogoFileName: null,
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
  onStoreProfileSave = async () => undefined,
  onBankAccountSave,
  onShippingSave,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<SettingsTab>('store-details');
  const [toast, setToast] = useState<string | null>(null);

  const storeData = useMemo(
    () => ({ ...defaultStoreProfile, ...initialStoreProfile }),
    [initialStoreProfile]
  );

  const breadcrumb =
    tab === 'store-details'
      ? t('settings.storeProfile')
      : tab === 'bank-account'
        ? t('settings.bankAccount')
        : t('settings.shipping');

  return (
    <div className="settings-page-enter min-h-screen bg-gray-100">
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}

      <div className="bg-white border-b border-gray-200 p-4 md:px-8 md:py-3">
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
          <TabBtn
            active={tab === 'store-details'}
            onClick={() => setTab('store-details')}
          >
            {t('settings.storeProfile')}
          </TabBtn>
          <TabBtn
            active={tab === 'bank-account'}
            onClick={() => setTab('bank-account')}
          >
            {t('settings.bankAccount')}
          </TabBtn>
          <TabBtn
            active={tab === 'shipping'}
            onClick={() => setTab('shipping')}
          >
            {t('settings.shipping')}
          </TabBtn>
        </div>

        <div key={tab} className="settings-surface-enter">
          {tab === 'store-details' && (
            <StoreProfileForm
              initialData={storeData}
              onSave={onStoreProfileSave}
              onSuccess={() => setToast(t('settings.toast.storeProfileSaved'))}
            />
          )}

          {tab === 'bank-account' && (
            <BankSettings
              onSave={(values) => {
                onBankAccountSave?.(values);
                setToast(t('settings.toast.bankAccountSaved'));
              }}
            />
          )}

          {tab === 'shipping' && (
            <ShippingSettingsForm
              onSave={(values) => {
                onShippingSave?.(values);
                setToast(t('settings.toast.shippingSaved'));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
