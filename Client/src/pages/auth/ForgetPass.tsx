import { useState } from "react";
import { Eye, EyeOff, KeyRound, Info } from "lucide-react";
import AuthLeftPanel from "../../components/auth/AuthLeftPanel";

const ForgetPass = () => {
  const [showTempPass, setShowTempPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <div className="flex min-h-screen">
      <AuthLeftPanel />

      <div className="flex-1 bg-white flex items-center justify-center px-10">
        <div className="w-full max-w-md">

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <KeyRound size={20} className="text-gray-700" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-center text-gray-900">
            Change Your Password
          </h1>

          <p className="text-center text-sm text-gray-500 mt-3 mb-6">
            You must change your temporary password before accessing
            your dashboard.
          </p>

          {/* Alert */}
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs rounded-md px-4 py-3 mb-6">
            <Info size={14} />
            This is your first time signing in. Please update your password.
          </div>

          <form className="space-y-4">

            {/* Temporary Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Temporary Password
              </label>

              <div className="relative">
                <input
                  type={showTempPass ? "text" : "password"}
                  placeholder="Enter temporary password"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 outline-none focus:border-gray-900"
                />

                <button
                  type="button"
                  onClick={() => setShowTempPass(!showTempPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showTempPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  placeholder="Create new password"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 outline-none focus:border-gray-900"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Confirm New Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 outline-none focus:border-gray-900"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-3 bg-black text-white py-3 rounded-md font-medium hover:opacity-90 transition"
            >
              Set New Password
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ForgetPass;