import { create } from 'zustand';

export type LoginState = 'default' | 'expired' | 'locked';

interface AuthStore {
  loginState: LoginState;
  showLoginPassword: boolean;
  initializeLogin: (loginState: LoginState) => void;
  toggleLoginPassword: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  loginState: 'default',
  showLoginPassword: false,
  initializeLogin: (loginState) => set({ loginState }),
  toggleLoginPassword: () =>
    set((state) => ({ showLoginPassword: !state.showLoginPassword })),
}));
