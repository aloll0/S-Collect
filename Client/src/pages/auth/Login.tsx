import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  Clock3,
  LockKeyhole,
  TimerReset,
  UserRound,
} from 'lucide-react';
import AuthLeftPanel from '../../components/auth/AuthLeftPanel';

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="icon-stroke"
  >
    {open ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    )}
  </svg>
);

interface LoginProps {
  onGoToRegister?: () => void;
}

type LoginState = 'default' | 'expired' | 'locked';

const MOCK_LOGIN_RESULTS: Record<
  string,
  LoginState | 'change-password' | 'success'
> = {
  'locked-out@company.com': 'locked',
  'vendor@active-store.com': 'expired',
  'temporary@company.com': 'change-password',
  'vendor@company.com': 'success',
};

const Login = ({ onGoToRegister }: LoginProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialState =
    searchParams.get('state') === 'locked'
      ? 'locked'
      : searchParams.get('state') === 'expired'
        ? 'expired'
        : 'default';
  const initialEmail =
    initialState === 'locked'
      ? 'locked-out@company.com'
      : initialState === 'expired'
        ? 'vendor@active-store.com'
        : '';

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(
    initialState === 'locked' ? '••••••••' : ''
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginState, setLoginState] = useState<LoginState>(initialState);

  const isLocked = loginState === 'locked';
  const isExpired = loginState === 'expired';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (!email || !password) {
      setError(t('login.errorFillAll'));
      return;
    }

    setError('');
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);

    const result = MOCK_LOGIN_RESULTS[email.trim().toLowerCase()] ?? 'success';

    if (result === 'locked' || result === 'expired') {
      setLoginState(result);
      return;
    }

    if (result === 'change-password') {
      navigate('/forget-pass');
      return;
    }

    navigate('/');
  };

  const icon = isLocked ? (
    <LockKeyhole size={22} />
  ) : isExpired ? (
    <TimerReset size={22} />
  ) : (
    <UserRound size={22} />
  );
  const title = isLocked
    ? t('login.lockedTitle')
    : isExpired
      ? t('login.expiredTitle')
      : t('login.title');
  const subtitle = isLocked
    ? t('login.lockedSubtitle')
    : isExpired
      ? t('login.expiredSubtitle')
      : t('login.subtitle');

  return (
    <div className="flex min-h-screen font-sans">
      <AuthLeftPanel />

      <div className="flex-1 bg-gray-50 flex items-start justify-center px-10 py-12">
        <div className="container flex justify-center">
          <div className="w-full max-w-[380px] mt-25">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-800">
                {icon}
              </div>
            </div>

            <h2 className="text-h5 text-gray-900 text-center mb-2">{title}</h2>
            <p className="text-body-md text-gray-500 text-center leading-relaxed mb-6">
              {subtitle}
            </p>

            {isExpired && (
              <div className="flex items-center gap-2 bg-orange-light text-orange text-body-sm rounded-lg px-3.5 py-3 mb-4">
                <AlertTriangle size={15} />
                {t('login.expiredAlert')}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-label-sm text-gray-700 mb-1.5">
                  {t('login.emailLabel')}
                </label>
                <input
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  disabled={isLocked}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLoginState('default');
                  }}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-body-md text-gray-900 outline-none focus:border-gray-900 disabled:bg-gray-100 disabled:text-gray-500 transition-colors placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-label-sm text-gray-700 mb-1.5">
                  {t('login.passwordLabel')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.passwordPlaceholder')}
                    value={password}
                    disabled={isLocked}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setLoginState('default');
                    }}
                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-body-md text-gray-900 outline-none focus:border-gray-900 disabled:bg-gray-100 disabled:text-gray-500 transition-colors placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {!isLocked && (
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => navigate('/forget-pass')}
                    className="text-label-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                  >
                    {t('login.forgotPassword')}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || isLocked}
                className="w-full py-3 bg-gray-900 text-gray-50 rounded-lg text-label-md font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-700 disabled:cursor-not-allowed transition-colors"
              >
                {isLocked
                  ? t('login.tryAgain')
                  : loading
                    ? t('login.signingIn')
                    : t('login.signIn')}
              </button>

              {isLocked && (
                <p className="flex items-center justify-center gap-1.5 text-body-sm text-gray-700">
                  <Clock3 size={14} />
                  {t('login.nextAttempt')}
                </p>
              )}

              {!isLocked && !isExpired && (
                <>
                  <div className="relative flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <p className="mx-4 text-gray-400 text-body-md">or</p>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="w-full py-3 bg-gray-900 text-gray-50 rounded-lg text-label-md font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('login.register')}
                  </button>
                </>
              )}

              {error && (
                <div className="bg-red-light border border-red rounded-lg px-3.5 py-2.5 text-red text-body-sm">
                  {error}
                </div>
              )}
            </form>

            {!isLocked && !isExpired && (
              <p className="text-center mt-6 text-body-sm text-gray-500">
                {t('login.trouble')}{' '}
                <button className="text-gray-900 font-semibold hover:underline">
                  {t('login.contactSupport')}
                </button>
              </p>
            )}

            {onGoToRegister && !isLocked && !isExpired && (
              <p className="text-center mt-3 text-body-sm text-gray-500">
                {t('login.noAccount')}{' '}
                <button
                  onClick={onGoToRegister}
                  className="text-gray-900 font-semibold hover:underline"
                >
                  {t('login.register')}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
