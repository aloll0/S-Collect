'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronsRight } from 'lucide-react';

import BankSettings, {
  type BankAccountFormValues,
} from '../features/settings/BankSettings';
import ShippingSettingsForm, {
  type ShippingSettingsValues,
  regionIdToZoneCode,
  zoneCodeToRegionId,
} from '../features/settings/Shippingsettingsform';
import { SuccessToast } from '../features/settings/shared';
import { cn } from '../features/settings/utils';
import { StoreProfileForm } from '../features/settings/StoreProfileForm';
import type { StoreProfileData } from '../features/settings/types';
import { getVendorOnboardingStatus } from '../services/auth';
import {
  getVendorShippingSettings,
  updateFlatShippingRate,
  upsertZoneShippingRate,
  removeZoneShippingRate,
} from '../services/shipping';

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
        'py-2.5 px-6 w-full md:w-fit rounded-lg text-xs whitespace-nowrap md:text-sm font-semibold transition-all duration-300 ease-out active:scale-95 cursor-pointer',
        active ? 'bg-gray-950 text-white' : 'bg-transparent text-[#545454]'
      )}
    >
      {children}
    </button>
  );
}

export default function SettingsPage({
  initialStoreProfile,
  onStoreProfileSave,
  onBankAccountSave,
  onShippingSave,
}: SettingsPageProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<SettingsTab>('store-details');
  const [toast, setToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Store Profile State
  const [fetchedStoreProfile, setFetchedStoreProfile] = useState<Partial<StoreProfileData>>({});
  const [storeLoading, setStoreLoading] = useState(true);

  // Shipping Settings State
  const [shippingValues, setShippingValues] = useState<ShippingSettingsValues>({
    flatRate: 0,
    regionalRates: {},
  });
  const [shippingConfigured, setShippingConfigured] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(true);
  const [shippingSaving, setShippingSaving] = useState(false);

  // Fetch Store Profile & Shipping Settings
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [onboardingData, shippingData] = await Promise.allSettled([
          getVendorOnboardingStatus(),
          getVendorShippingSettings(),
        ]);

        if (isMounted && onboardingData.status === 'fulfilled' && onboardingData.value) {
          const v = onboardingData.value;
          setFetchedStoreProfile({
            storeName: v.storeName || '',
            storeDescription: typeof v.storeDescription === 'string' ? v.storeDescription : '',
            publicEmail: v.email || '',
            phoneNumber: v.phoneNumber || '',
          });
        }

        if (isMounted && shippingData.status === 'fulfilled' && shippingData.value) {
          const s = shippingData.value;
          const regRates: Record<string, number | undefined> = {};
          if (s.zoneRates && Array.isArray(s.zoneRates)) {
            s.zoneRates.forEach((zr) => {
              const regId = zoneCodeToRegionId(zr.zone);
              regRates[regId] = zr.rate;
            });
          }
          setShippingValues({
            flatRate: s.flatRate ?? 0,
            regionalRates: regRates,
          });
          setShippingConfigured(s.flatRate !== null || (s.zoneRates && s.zoneRates.length > 0));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        if (isMounted) {
          setStoreLoading(false);
          setShippingLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const storeData = useMemo(
    () => ({
      ...defaultStoreProfile,
      ...initialStoreProfile,
      ...fetchedStoreProfile,
    }),
    [initialStoreProfile, fetchedStoreProfile]
  );

  const handleSaveShipping = async (values: ShippingSettingsValues) => {
    setShippingSaving(true);
    setErrorToast(null);
    try {
      // Update Flat Rate
      if (values.flatRate !== undefined && values.flatRate !== null) {
        await updateFlatShippingRate(values.flatRate);
      }

      // Update Regional Rates
      if (values.regionalRates) {
        const promises: Promise<void>[] = [];
        for (const [regionId, rate] of Object.entries(values.regionalRates)) {
          const code = regionIdToZoneCode(regionId);
          if (rate !== undefined && rate !== null && !isNaN(rate) && rate > 0) {
            promises.push(upsertZoneShippingRate(code, rate));
          } else {
            promises.push(removeZoneShippingRate(code).catch(() => {}));
          }
        }
        await Promise.all(promises);
      }

      setShippingValues(values);
      setShippingConfigured(true);
      onShippingSave?.(values);
      setToast(t('settings.toast.shippingSaved') || 'Shipping settings saved successfully');
    } catch (err: any) {
      console.error('Failed to save shipping settings:', err);
      const msg = err?.response?.data?.message || err?.message || 'Failed to save shipping settings';
      setErrorToast(msg);
    } finally {
      setShippingSaving(false);
    }
  };

  const handleSaveStoreProfile = async (data: StoreProfileData) => {
    if (onStoreProfileSave) {
      await onStoreProfileSave(data);
    }
    setFetchedStoreProfile(data);
    setToast(t('settings.toast.storeProfileSaved') || 'Store profile saved successfully');
  };

  const breadcrumb =
    tab === 'store-details'
      ? t('settings.storeProfile')
      : tab === 'bank-account'
        ? t('settings.bankAccount')
        : t('settings.shipping');

  return (
    <>
      <div className="bg-white border-b border-gray-200 sidebar-page-container-header">
        <h1 className="heading-page-title">
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
    <div className="settings-page-enter min-h-screen bg-gray-100">
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
      {errorToast && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-red-600 text-white rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium">
          <span>{errorToast}</span>
          <button onClick={() => setErrorToast(null)} className="ml-2 font-bold cursor-pointer">×</button>
        </div>
      )}

      <div className="settings-surface-enter settings-stagger-1 p-2 md:p-4 md:px-8 md:py-7 max-w-[720px]">
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
            storeLoading ? (
              <div className="p-8 flex items-center justify-center bg-white rounded-xl border border-gray-200">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
              </div>
            ) : (
              <StoreProfileForm
                initialData={storeData}
                onSave={handleSaveStoreProfile}
                onSuccess={() => setToast(t('settings.toast.storeProfileSaved'))}
              />
            )
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
            shippingLoading ? (
              <div className="p-8 flex items-center justify-center bg-white rounded-xl border border-gray-200">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
              </div>
            ) : (
              <ShippingSettingsForm
                defaultValues={shippingValues}
                isConfigured={shippingConfigured}
                isPending={shippingSaving}
                onSave={handleSaveShipping}
              />
            )
          )}
        </div>
      </div>
    </div>
    </>
  );
}
