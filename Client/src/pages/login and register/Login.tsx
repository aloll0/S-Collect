import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from "../../components/ui/Logo";
import { Star, ShieldCheck, Grid2x2Check  } from "lucide-react";



// ─── Left Panel ───────────────────────────────────────────────────────────────

const LeftPanel = () => {
  const { t } = useTranslation();

    const features = [
    { icon: <Star color="white" size={20}/>, label: t("panel.feature1") },
    { icon: <ShieldCheck color="white" size={20}/>, label: t("panel.feature3") },
    { icon: <Grid2x2Check  color="white" size={20}/>, label: t("panel.feature2") },
  ];

  return (
    <div
      className="w-[40%] px-10 py-12 flex flex-col relative overflow-hidden min-h-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/bg_login.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10">
        <Logo />

        <div className="mt-12">
          <h1 className="text-white text-[32px] font-bold leading-tight mb-3">
            {t('panel.tagline1')}
            <br />
            {t('panel.tagline2')}
          </h1>

          <p className="text-[#ddd] text-sm leading-relaxed mb-10">
            {t('panel.subtitle')}
          </p>

          <div className="mb-8">
            <h3 className="text-white text-base font-semibold mb-2">
              {t('panel.becomeVendor')}
            </h3>

            <p className="text-[#ddd] text-[13px] leading-relaxed mb-5">
              {t('panel.becomeVendorDesc')}
            </p>
          </div>

          <div className="flex flex-col gap-3">
          {features.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className="text-[#888] text-xs">{icon}</span>
              <span className="text-[#ccc] text-[13px]">{label}</span>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

// ─── Eye Icon ─────────────────────────────────────────────────────────────────

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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

// ─── Login ────────────────────────────────────────────────────────────────────

interface LoginProps {
  onGoToRegister?: () => void;
}

const Login = ({ onGoToRegister }: LoginProps) => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('login.errorFillAll'));
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    // ← plug in your auth logic here
  };

  return (
    <div className="flex min-h-screen font-sans">
      <LeftPanel />

      {/* Right panel */}
      <div className="flex-1 bg-white flex items-center justify-center px-10 py-12">
        <div className="container flex justify-center">
          <div className="w-full max-w-[360px]">
            {/* Avatar icon */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="1.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" opacity="0.4" />
                </svg>
              </div>
            </div>

            <h2 className="text-[22px] font-bold text-gray-900 text-center mb-2">
              {t('login.title')}
            </h2>
            <p className="text-gray-500 text-[13px] text-center leading-relaxed mb-8">
              {t('login.subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  {t('login.emailLabel')}
                </label>
                <input
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                  {t('login.passwordLabel')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.passwordPlaceholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400"
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

              {/* Forgot password */}
              <div>
                <button
                  type="button"
                  className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {t('login.forgotPassword')}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? t('login.signingIn') : t('login.signIn')}
              </button>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 text-red-600 text-[13px]">
                  {error}
                </div>
              )}
            </form>

            <p className="text-center mt-6 text-[13px] text-gray-500">
              {t('login.trouble')}{' '}
              <button className="text-gray-900 font-semibold hover:underline">
                {t('login.contactSupport')}
              </button>
            </p>

            {onGoToRegister && (
              <p className="text-center mt-3 text-[13px] text-gray-500">
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
