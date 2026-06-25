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

const initialPersonal: PersonalInfo = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

const initialStore: StoreInfo = {
  storeName: '',
  category: '',
  website: '',
  description: '',
};

const initialPasswords: PasswordInfo = {
  password: '',
  confirmPassword: '',
};

const MOCK_LOGIN_RESULTS: Record<string, LoginResult> = {
  'locked-out@company.com': 'locked',
  'vendor@active-store.com': 'expired',
  'temporary@company.com': 'change-password',
  'vendor@company.com': 'success',
};

interface AuthStore {
  loginEmail: string;
  loginPassword: string;
  showLoginPassword: boolean;
  loginLoading: boolean;
  loginError: string;
  loginState: LoginState;
  initializeLogin: (
    loginState: LoginState,
    email: string,
    password: string
  ) => void;
  setLoginEmail: (email: string) => void;
  setLoginPassword: (password: string) => void;
  setLoginError: (error: string) => void;
  toggleLoginPassword: () => void;
  submitLogin: () => Promise<LoginResult>;

  step: number;
  submitted: boolean;
  registerLoading: boolean;
  personal: PersonalInfo;
  store: StoreInfo;
  passwords: PasswordInfo;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  updatePersonal: (key: keyof PersonalInfo, value: string) => void;
  updateStore: (key: keyof StoreInfo, value: string) => void;
  updatePasswords: (key: keyof PasswordInfo, value: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  submitRegister: () => Promise<void>;
  resetRegister: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  loginEmail: '',
  loginPassword: '',
  showLoginPassword: false,
  loginLoading: false,
  loginError: '',
  loginState: 'default',
  initializeLogin: (loginState, email, password) =>
    set({
      loginState,
      loginEmail: email,
      loginPassword: password,
      loginError: '',
    }),
  setLoginEmail: (email) =>
    set({ loginEmail: email, loginState: 'default', loginError: '' }),
  setLoginPassword: (password) =>
    set({ loginPassword: password, loginState: 'default', loginError: '' }),
  setLoginError: (loginError) => set({ loginError }),
  toggleLoginPassword: () =>
    set((state) => ({ showLoginPassword: !state.showLoginPassword })),
  submitLogin: async () => {
    set({ loginError: '', loginLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 700));
    set({ loginLoading: false });

    const result =
      MOCK_LOGIN_RESULTS[get().loginEmail.trim().toLowerCase()] ?? 'success';

    if (result === 'locked' || result === 'expired') {
      set({ loginState: result });
    }

    return result;
  },

  step: 0,
  submitted: false,
  registerLoading: false,
  personal: initialPersonal,
  store: initialStore,
  passwords: initialPasswords,
  errors: {},
  setErrors: (errors) => set({ errors }),
  updatePersonal: (key, value) =>
    set((state) => {
      const errors = { ...state.errors };
      delete errors[key];
      return {
        personal: { ...state.personal, [key]: value },
        errors,
      };
    }),
  updateStore: (key, value) =>
    set((state) => {
      const errors = { ...state.errors };
      delete errors[key];
      return {
        store: { ...state.store, [key]: value },
        errors,
      };
    }),
  updatePasswords: (key, value) =>
    set((state) => {
      const errors = { ...state.errors };
      delete errors[key];
      return {
        passwords: { ...state.passwords, [key]: value },
        errors,
      };
    }),
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
      personal: initialPersonal,
      store: initialStore,
      passwords: initialPasswords,
      errors: {},
    }),
}));
