import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, KeyRound, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AuthLeftPanel from '../../components/auth/AuthLeftPanel';

interface ForgetPassFormValues {
  tempPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgetPass = () => {
  const { t } = useTranslation();
  const [showTempPass, setShowTempPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgetPassFormValues>();

  const newPassword = watch('newPassword');

  const onSubmit = (data: ForgetPassFormValues) => {
    console.log('Password change:', data);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-sans">
      <AuthLeftPanel />

      <div className="flex-1 bg-gray-50 flex items-start justify-center px-10">
        <div className="w-full max-w-md mt-6 lg:mt-40">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <KeyRound size={20} className="text-gray-700" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="lg:text-h3 text-h5 font-bold text-gray-900 text-center">
            {t('forgetPass.title')}
          </h1>

          <p className="text-center text-body-md text-gray-500 mt-3 mb-6">
            {t('forgetPass.subtitle')}
          </p>

          {/* Alert */}
          <div className="flex items-center gap-2 bg-blue-light border border-blue-100 text-blue-700 text-body-sm rounded-lg px-4 py-3 mb-6">
            <Info size={14} />
            {t('forgetPass.alert')}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Temporary Password */}
            <div>
              <label className="block text-label-sm text-gray-700 mb-1.5">
                {t('forgetPass.tempPassword')}
              </label>

              <div className="relative">
                <input
                  type={showTempPass ? 'text' : 'password'}
                  placeholder={t('forgetPass.tempPasswordPlaceholder')}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2.5 pr-10 text-body-md text-gray-900 outline-none focus:border-gray-900 placeholder:text-gray-400 transition-colors"
                  {...register('tempPassword', {
                    required: t('forgetPass.errors.tempPasswordRequired'),
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowTempPass(!showTempPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showTempPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.tempPassword && (
                <p className="text-red text-caption-sm mt-1">
                  {errors.tempPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-label-sm text-gray-700 mb-1.5">
                {t('forgetPass.newPassword')}
              </label>

              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  placeholder={t('forgetPass.newPasswordPlaceholder')}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2.5 pr-10 text-body-md text-gray-900 outline-none focus:border-gray-900 placeholder:text-gray-400 transition-colors"
                  {...register('newPassword', {
                    required: t('forgetPass.errors.newPasswordRequired'),
                    minLength: {
                      value: 8,
                      message: t('forgetPass.errors.newPasswordMinLength'),
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d).+$/,
                      message: t('forgetPass.errors.newPasswordWeak'),
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red text-caption-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-label-sm text-gray-700 mb-1.5">
                {t('forgetPass.confirmPassword')}
              </label>

              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  placeholder={t('forgetPass.confirmPasswordPlaceholder')}
                  className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2.5 pr-10 text-body-md text-gray-900 outline-none focus:border-gray-900 placeholder:text-gray-400 transition-colors"
                  {...register('confirmPassword', {
                    required: t('forgetPass.errors.confirmPasswordRequired'),
                    validate: (val) =>
                      val === newPassword ||
                      t('forgetPass.errors.passwordsMismatch'),
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red text-caption-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-3 bg-gray-900 text-gray-50 py-3 rounded-lg text-label-md font-semibold hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {t('forgetPass.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPass;
