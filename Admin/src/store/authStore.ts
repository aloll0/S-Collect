import { create } from 'zustand';

export type LoginState = 'default' | 'expired' | 'locked';

interface AuthStore {
  loginState: LoginState;
  showLoginPassword: boolean;
  initializeLogin: (loginState: LoginState) => void;
  toggleLoginPassword: () => void;

  step: number;
  nextStep: () => void;
  previousStep: () => void;
  resetRegister: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  loginState: 'default',
  showLoginPassword: false,
  initializeLogin: (loginState) => set({ loginState }),
  toggleLoginPassword: () =>
    set((state) => ({ showLoginPassword: !state.showLoginPassword })),

  step: 0,
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 2) })),
  previousStep: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
  resetRegister: () => set({ step: 0 }),
}));
