import { create } from 'zustand';

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

const MOCK_LOGIN_RESULTS: Record<string, LoginResult> = {
  'locked-out@company.com': 'locked',
  'vendor@active-store.com': 'expired',
  'temporary@company.com': 'change-password',
  'vendor@company.com': 'success',
};

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
  nextStep: () => void;
  previousStep: () => void;
  submitRegister: () => Promise<void>;
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
  submitLogin: async (email, _password) => {
    set({ loginError: '', loginLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 700));
    set({ loginLoading: false });

    const result = MOCK_LOGIN_RESULTS[email.trim().toLowerCase()] ?? 'success';

    if (result === 'locked' || result === 'expired') {
      set({ loginState: result });
    }

    return result;
  },

  step: 0,
  submitted: false,
  registerLoading: false,
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 2) })),
  previousStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
  submitRegister: async () => {
    set({ registerLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    set({ registerLoading: false, submitted: true });
  },
  resetRegister: () =>
    set({
      step: 0,
      submitted: false,
      registerLoading: false,
    }),
}));
