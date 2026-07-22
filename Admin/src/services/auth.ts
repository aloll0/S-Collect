import { api } from "./api";

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/vendor/auth/login", {
    email,
    password,
  });

  return data;
};

export const verifyPhone = async (email: string, code: string) => {
  const { data } = await api.post("/vendor/auth/verify-phone", {
    email,
    code,
  });
  return data;
};

export const resendOtp = async (email: string) => {
  const { data } = await api.post("/vendor/auth/resend-otp", { email });
  return data;
};

export const refresh = async (refreshToken: string) => {
  const { data } = await api.post("/vendor/auth/refresh", { refreshToken });
  return data;
};

export const logout = async (refreshToken: string) => {
  const { data } = await api.post("/vendor/auth/logout", { refreshToken });
  return data;
};

export const forgotPassword = async (email: string) => {
  const { data } = await api.post("/vendor/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (email: string, code: string, newPassword: string) => {
  const { data } = await api.post("/vendor/auth/reset-password", {
    email,
    code,
    newPassword,
  });
  return data;
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const { data } = await api.post("/vendor/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return data;
};

export const changeEmail = async (newEmail: string) => {
  const { data } = await api.post("/vendor/auth/change-email", { newEmail });
  return data;
};

export const confirmChangeEmail = async (code: string, refreshToken: string) => {
  const { data } = await api.post("/vendor/auth/confirm-change-email", { code, refreshToken });
  return data;
};

export interface OnboardingApplyParams {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  storeName: string;
  storeDescription: string;
  commercialRegisterNumber: string;
}

export const applyVendorOnboarding = async (params: OnboardingApplyParams) => {
  const { data } = await api.post("/vendor/onboarding/apply", params);
  return data;
};

export interface VendorStatusResponse {
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'APPROVED' | 'REJECTED' | 'DEACTIVATED' | string;
  rejectionReason?: any;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  storeName?: string;
  storeDescription?: string;
  commercialRegisterNumber?: string;
}

export const getVendorOnboardingStatus = async (): Promise<VendorStatusResponse> => {
  const { data } = await api.get("/vendor/onboarding/status");
  return data;
};