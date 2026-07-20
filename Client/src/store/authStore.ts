import { create } from 'zustand';
import { login, applyVendorOnboarding, type OnboardingApplyParams } from '../services/auth';

export type LoginState = 'default' | 'expired' | 'locked';
export type LoginResult = LoginState | 'change-password' | 'success';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface StoreInfo {
  storeName: string;
  category: string;
  website: string;
  description: string;
}

export interface PasswordInfo {
  password: string;
  confirmPassword: string;
}

interface AuthStore {
  loginLoading: boolean;
  loginError: string;
  loginState: LoginState;
  showLoginPassword: boolean;
  initializeLogin: (loginState: LoginState) => void;
  setLoginError: (error: string) => void;
  toggleLoginPassword: () => void;
  submitLogin: (email: string, password: string) => Promise<LoginResult>;

  step: number;
  submitted: boolean;
  registerLoading: boolean;
  registerError: string;
  nextStep: () => void;
  previousStep: () => void;
  submitRegister: (params: OnboardingApplyParams) => Promise<boolean>;
  resetRegister: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  loginLoading: false,
  loginError: '',
  loginState: 'default',
  showLoginPassword: false,
  initializeLogin: (loginState) => set({ loginState, loginError: '' }),
  setLoginError: (loginError) => set({ loginError }),
  toggleLoginPassword: () =>
    set((state) => ({ showLoginPassword: !state.showLoginPassword })),
  submitLogin: async (email, password) => {
    set({ loginError: '', loginLoading: true });
    try {
      const data = await login(email, password);
      
      if (data && data.success === false) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token if it exists in response
      const token = data?.accessToken || data?.token || data?.data?.accessToken || data?.data?.token;
      const refreshToken = data?.refreshToken || data?.data?.refreshToken;
      if (token) {
        localStorage.setItem('token', token);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Assuming the API returns an object with a `status` field indicating login result
      const result = data?.status ?? 'success';
      if (result === 'locked' || result === 'expired') {
        set({ loginState: result });
      } else {
        set({ loginState: 'default' });
      }
      return result as LoginResult;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || 'Login failed';
      set({ loginError: message, loginState: 'default' });
      return 'default' as LoginResult;
    } finally {
      set({ loginLoading: false });
    }
  },

  step: 0,
  submitted: false,
  registerLoading: false,
  registerError: '',
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 2) })),
  previousStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
  submitRegister: async (params) => {
    set({ registerLoading: true, registerError: '' });
    try {
      const data = await applyVendorOnboarding(params);
      
      if (data && data.success === false) {
        throw new Error(data.message || 'Registration failed');
      }
      
      set({ registerLoading: false, submitted: true });
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || error.message || 'Registration failed';
      set({ registerError: message, registerLoading: false });
      return false;
    }
  },
  resetRegister: () =>
    set({
      step: 0,
      submitted: false,
      registerLoading: false,
      registerError: '',
    }),
}));
