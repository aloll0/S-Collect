'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronsRight } from 'lucide-react';

import { AccountSettingsForm } from '../features/settings/AccountSettingsForm';
import { SuccessToast } from '../features/settings/shared';
import type {
  AccountSettingsData,
  PasswordData,
} from '../features/settings/types';
import { getVendorOnboardingStatus } from '../services/auth';

interface AccountSettingsPageProps {
  initialAccountSettings?: Partial<AccountSettingsData>;
  onAccountSettingsSave?: (
    data: AccountSettingsData & PasswordData
  ) => Promise<void>;
}

const defaultAccountSettings: AccountSettingsData = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
};

export default function AccountSettingsPage({
  initialAccountSettings,
  onAccountSettingsSave = async () => undefined,
}: AccountSettingsPageProps) {
  const { t } = useTranslation();
  const [toast, setToast] = useState<string | null>(null);
  const [fetchedData, setFetchedData] = useState<Partial<AccountSettingsData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchVendorData = async () => {
      try {
        const data = await getVendorOnboardingStatus();
        if (isMounted && data) {
          setFetchedData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch vendor status info:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchVendorData();
    return () => {
      isMounted = false;
    };
  }, []);

  const accountData = useMemo(
    () => ({
      ...defaultAccountSettings,
      ...initialAccountSettings,
      ...fetchedData,
    }),
    [initialAccountSettings, fetchedData]
  );

  return (
    <>
          <div className="border-b border-gray-200 sidebar-page-container-header">
        <h1 className="heading-page-title">
          {t('settings.accountSettings')}
        </h1>
        <nav className="mt-3 text-sm flex items-center gap-1">
          <span className="text-[#090909]">{t('settings.accountSettings')}</span>
          <span className="mx-0.5 text-[#737373]">
            <ChevronsRight size={16} />
          </span>
          <span className="text-[#737373]">
            {t('settings.account.personalInformation')}
          </span>
        </nav>
      </div>
    <div className="settings-page-enter min-h-screen bg-gray-100">
      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}

      <div className="settings-surface-enter settings-stagger-1 sidebar-page-container max-w-180">
        {loading ? (
          <div className="p-8 flex items-center justify-center bg-white rounded-xl border border-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
          </div>
        ) : (
          <AccountSettingsForm
            initialData={accountData}
            onSave={onAccountSettingsSave}
            onSuccess={() =>
              setToast(t('settings.toast.accountSettingsSaved'))
            }
          />
        )}
      </div>
    </div>
    </>
  );
}
