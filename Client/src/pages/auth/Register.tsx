import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AuthLeftPanel from "../../components/auth/AuthLeftPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface StoreInfo {
  storeName: string;
  category: string;
  website: string;
  description: string;
}

interface PasswordInfo {
  password: string;
  confirmPassword: string;
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

const STEP_KEYS = ["register.step1", "register.step2", "register.step3"] as const;

const StepIndicator = ({ current }: { current: number }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-start mb-12">
      {STEP_KEYS.map((key, i) => {
        const done = i < current;
        const active = i === current;

        return (
          <div key={i} className={`flex items-start ${i < STEP_KEYS.length - 1 ? "flex-1" : ""}`}>
            <div className="flex flex-col items-center gap-1.5">
              {/* Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  done || active ? "bg-green" : "bg-gray-200"
                }`}
              >
                {done ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className={`text-caption-sm font-semibold ${active ? "text-gray-50" : "text-gray-400"}`}>
                    {i + 1}
                  </span>
                )}
              </div>
              {/* Label */}
              <span
                className={`text-md whitespace-nowrap ${
                  active ? "text-gray-900 font-semibold" : "text-gray-400"
                }`}
              >
                {t(key)}
              </span>
            </div>

            {/* Connector line */}
            {i < STEP_KEYS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mt-6.5 mx-1.5 rounded-full transition-colors ${
                  done ? "bg-green" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Shared Input ─────────────────────────────────────────────────────────────

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
}

const Input = ({ label, placeholder, value, onChange, type = "text", required, error }: InputProps) => (
  <div>
    <label className="block text-label-sm text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-red ml-0.5">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2.5 border rounded-lg text-body-md text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 ${
        error ? "border-red bg-red-light" : "border-gray-300 bg-gray-50"
      }`}
    />
    {error && <p className="text-red text-caption-sm mt-1">{error}</p>}
  </div>
);

// ─── Eye Icon ─────────────────────────────────────────────────────────────────

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="icon-stroke">
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

// ─── Step 1: Personal Info ────────────────────────────────────────────────────

interface Step1Props {
  data: PersonalInfo;
  onChange: (k: keyof PersonalInfo, v: string) => void;
  errors: Partial<Record<keyof PersonalInfo, string>>;
}

const Step1 = ({ data, onChange, errors }: Step1Props) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t("register.firstNameLabel")}
          placeholder={t("register.firstNamePlaceholder")}
          value={data.firstName}
          onChange={(v) => onChange("firstName", v)}
          required
          error={errors.firstName}
        />
        <Input
          label={t("register.lastNameLabel")}
          placeholder={t("register.lastNamePlaceholder")}
          value={data.lastName}
          onChange={(v) => onChange("lastName", v)}
          required
          error={errors.lastName}
        />
      </div>
      <Input
        label={t("register.emailLabel")}
        placeholder={t("register.emailPlaceholder")}
        value={data.email}
        onChange={(v) => onChange("email", v)}
        type="email"
        required
        error={errors.email}
      />
      <Input
        label={t("register.phoneLabel")}
        placeholder={t("register.phonePlaceholder")}
        value={data.phone}
        onChange={(v) => onChange("phone", v)}
        type="tel"
        required
        error={errors.phone}
      />
    </div>
  );
};

// ─── Step 2: Store Info ───────────────────────────────────────────────────────

interface Step2Props {
  data: StoreInfo;
  onChange: (k: keyof StoreInfo, v: string) => void;
  errors: Partial<Record<keyof StoreInfo, string>>;
}

const CATEGORY_KEYS = [
  "electronics", "fashion", "homeGarden", "sports",
  "books", "beauty", "food", "other",
] as const;

const Step2 = ({ data, onChange, errors }: Step2Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <Input
        label={t("register.storeNameLabel")}
        placeholder={t("register.storeNamePlaceholder")}
        value={data.storeName}
        onChange={(v) => onChange("storeName", v)}
        required
        error={errors.storeName}
      />

      {/* Category select */}
      <div>
        <label className="block text-label-sm text-gray-700 mb-1.5">
          {t("register.categoryLabel")}
          <span className="text-red ml-0.5">*</span>
        </label>
        <select
          value={data.category}
          onChange={(e) => onChange("category", e.target.value)}
          className={`w-full px-3 py-2.5 border rounded-lg text-body-md outline-none transition-colors cursor-pointer focus:border-gray-900 ${
            errors.category ? "border-red bg-red-light text-gray-900" : "border-gray-300 bg-gray-50"
          } ${!data.category ? "text-gray-400" : "text-gray-900"}`}
        >
          <option value="">{t("register.categoryPlaceholder")}</option>
          {CATEGORY_KEYS.map((key) => (
            <option key={key} value={key}>
              {t(`register.categories.${key}`)}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red text-caption-sm mt-1">{errors.category}</p>}
      </div>

      <Input
        label={t("register.websiteLabel")}
        placeholder={t("register.websitePlaceholder")}
        value={data.website}
        onChange={(v) => onChange("website", v)}
      />

      {/* Description textarea */}
      <div>
        <label className="block text-label-sm text-gray-700 mb-1.5">
          {t("register.descriptionLabel")}
          <span className="text-red ml-0.5">*</span>
        </label>
        <textarea
          placeholder={t("register.descriptionPlaceholder")}
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
          className={`w-full px-3 py-2.5 border rounded-lg text-body-md text-gray-900 outline-none resize-vertical transition-colors placeholder:text-gray-400 focus:border-gray-900 font-sans ${
            errors.description ? "border-red bg-red-light" : "border-gray-300 bg-gray-50"
          }`}
        />
        {errors.description && <p className="text-red text-caption-sm mt-1">{errors.description}</p>}
      </div>
    </div>
  );
};

// ─── Password Strength ────────────────────────────────────────────────────────

const PasswordStrength = ({ password }: { password: string }) => {
  const { t } = useTranslation();

  const checks = [
    { label: t("register.passwordStrength.chars"),    ok: password.length >= 8 },
    { label: t("register.passwordStrength.uppercase"), ok: /[A-Z]/.test(password) },
    { label: t("register.passwordStrength.number"),   ok: /[0-9]/.test(password) },
    { label: t("register.passwordStrength.special"),  ok: /[^a-zA-Z0-9]/.test(password) },
  ];

  const score = checks.filter((c) => c.ok).length;
  const barColors = ["bg-gray-200", "bg-red", "bg-yellow", "bg-gray-400", "bg-green"];
  const strengthLabels = [
    "",
    t("register.passwordStrength.weak"),
    t("register.passwordStrength.fair"),
    t("register.passwordStrength.good"),
    t("register.passwordStrength.strong"),
  ];
  const strengthTextColors = [
    "", "text-red", "text-yellow", "text-gray-600", "text-green",
  ];

  if (!password) return null;

  return (
    <div className="mt-2">
      {/* Bar */}
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 h-0.5 rounded-full transition-all ${i <= score ? barColors[score] : "bg-gray-200"}`}
          />
        ))}
      </div>
      {/* Checks */}
      <div className="flex items-center justify-between flex-wrap gap-x-3 gap-y-1">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map(({ label, ok }) => (
            <span
              key={label}
              className={`text-caption-sm flex items-center gap-0.5 ${ok ? "text-green" : "text-gray-400"}`}
            >
              {ok ? "✓" : "○"} {label}
            </span>
          ))}
        </div>
        <span className={`text-caption-sm font-semibold ${strengthTextColors[score]}`}>
          {strengthLabels[score]}
        </span>
      </div>
    </div>
  );
};

// ─── Step 3: Set Password ─────────────────────────────────────────────────────

interface Step3Props {
  data: PasswordInfo;
  onChange: (k: keyof PasswordInfo, v: string) => void;
  errors: Partial<Record<keyof PasswordInfo, string>>;
}

const Step3 = ({ data, onChange, errors }: Step3Props) => {
  const { t } = useTranslation();
  const [show, setShow] = useState({ password: false, confirm: false });

  return (
    <div className="flex flex-col gap-5">
      {/* Password */}
      <div>
        <label className="block text-label-sm text-gray-700 mb-1.5">
          {t("register.passwordLabel")}
          <span className="text-red ml-0.5">*</span>
        </label>
        <div className="relative">
          <input
            type={show.password ? "text" : "password"}
            placeholder={t("register.passwordPlaceholder")}
            value={data.password}
            onChange={(e) => onChange("password", e.target.value)}
            className={`w-full px-3 py-2.5 pr-10 border rounded-lg text-body-md text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 ${
              errors.password ? "border-red bg-red-light" : "border-gray-300 bg-gray-50"
            }`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, password: !s.password }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <EyeIcon open={show.password} />
          </button>
        </div>
        {errors.password && <p className="text-red text-caption-sm mt-1">{errors.password}</p>}
        <PasswordStrength password={data.password} />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-label-sm text-gray-700 mb-1.5">
          {t("register.confirmPasswordLabel")}
          <span className="text-red ml-0.5">*</span>
        </label>
        <div className="relative">
          <input
            type={show.confirm ? "text" : "password"}
            placeholder={t("register.confirmPasswordPlaceholder")}
            value={data.confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            className={`w-full px-3 py-2.5 pr-10 border rounded-lg text-body-md text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-900 ${
              errors.confirmPassword ? "border-red bg-red-light" : "border-gray-300 bg-gray-50"
            }`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <EyeIcon open={show.confirm} />
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red text-caption-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>
    </div>
  );
};

// ─── Email Sent Screen ────────────────────────────────────────────────────────

const EmailSent = ({ email, onResend }: { email: string; onResend: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="text-center py-5">
      <div className="w-16 h-16 rounded-full bg-green-light border-2 border-green/20 inline-flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#218c21" strokeWidth="1.5">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>

      <h2 className="text-h6 text-gray-900 mb-2">{t("register.emailSentTitle")}</h2>
      <p className="text-body-md text-gray-500 leading-relaxed mb-1">{t("register.emailSentSubtitle")}</p>
      <p className="text-body-md text-gray-900 font-semibold mb-6">{email}</p>
      <p className="text-body-sm text-gray-500 leading-relaxed mb-6">{t("register.emailSentBody")}</p>

      <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3.5 text-body-sm text-gray-500 text-left">
        <strong className="text-gray-700">{t("register.didntGetEmail")}</strong>
        <br />
        {t("register.checkSpam")}{" "}
        <button
          onClick={onResend}
          className="text-gray-900 font-semibold hover:underline"
        >
          {t("register.resend")}
        </button>
        .
      </div>
    </div>
  );
};

// ─── Register ─────────────────────────────────────────────────────────────────

interface RegisterProps {}


const Register = ({}: RegisterProps) => {

  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [personal, setPersonal] = useState<PersonalInfo>({ firstName: "", lastName: "", email: "", phone: "" });
  const [store, setStore] = useState<StoreInfo>({ storeName: "", category: "", website: "", description: "" });
  const [passwords, setPasswords] = useState<PasswordInfo>({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (key: string) =>
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });

  const updatePersonal = (k: keyof PersonalInfo, v: string) => {
    setPersonal((p) => ({ ...p, [k]: v }));
    clearError(k);
  };
  const updateStore = (k: keyof StoreInfo, v: string) => {
    setStore((s) => ({ ...s, [k]: v }));
    clearError(k);
  };
  const updatePasswords = (k: keyof PasswordInfo, v: string) => {
    setPasswords((p) => ({ ...p, [k]: v }));
    clearError(k);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (step === 0) {
      if (!personal.firstName.trim()) e.firstName = t("register.errors.firstNameRequired");
      if (!personal.lastName.trim())  e.lastName  = t("register.errors.lastNameRequired");
      if (!personal.email.trim())     e.email     = t("register.errors.emailRequired");
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email))
                                      e.email     = t("register.errors.emailInvalid");
      if (!personal.phone.trim())     e.phone     = t("register.errors.phoneRequired");
    }

    if (step === 1) {
      if (!store.storeName.trim())    e.storeName   = t("register.errors.storeNameRequired");
      if (!store.category)            e.category    = t("register.errors.categoryRequired");
      if (!store.description.trim())  e.description = t("register.errors.descriptionRequired");
    }

    if (step === 2) {
      if (!passwords.password)                          e.password        = t("register.errors.passwordRequired");
      else if (passwords.password.length < 8)           e.password        = t("register.errors.passwordMinLength");
      if (!passwords.confirmPassword)                   e.confirmPassword = t("register.errors.confirmPasswordRequired");
      else if (passwords.password !== passwords.confirmPassword)
                                                        e.confirmPassword = t("register.errors.passwordsMismatch");
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    if (step < 2) { setStep((s) => s + 1); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    // ← plug in your register API call here, then send verification email
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-800">
      <AuthLeftPanel />

      <div className="flex-1 bg-gray-50 flex items-center justify-center px-10 py-12 overflow-y-auto flex justify-center items-start">
        <div className="w-full max-w-[480px] mt-32">
          {submitted ? (
            <EmailSent email={personal.email} onResend={() => { /* resend logic */ }} />
          ) : (
            <>
              <StepIndicator current={step} />

              {step === 0 && (
                <Step1
                  data={personal}
                  onChange={updatePersonal}
                  errors={errors as Partial<Record<keyof PersonalInfo, string>>}
                />
              )}
              {step === 1 && (
                <Step2
                  data={store}
                  onChange={updateStore}
                  errors={errors as Partial<Record<keyof StoreInfo, string>>}
                />
              )}
              {step === 2 && (
                <Step3
                  data={passwords}
                  onChange={updatePasswords}
                  errors={errors as Partial<Record<keyof PasswordInfo, string>>}
                />
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 mt-7">
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1 py-3 bg-gray-50 text-gray-700 border border-gray-300 rounded-lg text-label-md font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {t("register.back")}
                  </button>
                )}
                <button
                  onClick={handleContinue}
                  disabled={loading}
                  className="flex-[2] py-3 bg-gray-900 text-gray-50 rounded-lg text-label-md font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading
                    ? t("register.creatingAccount")
                    : step === 2
                    ? t("register.createAccount")
                    : t("register.continue")}
                </button>
              </div>

              <p className="text-center mt-5 text-body-sm text-gray-500">
                {t("register.alreadyHaveAccount")}{" "}
                <Link to="/login" className="text-gray-900 font-semibold hover:underline">
                  {t("register.logIn")}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;