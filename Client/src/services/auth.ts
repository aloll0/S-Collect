import { api } from "./api";

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/vendor/auth/login", {
    email,
    password,
  });

  return data;
};

export const verifyPhone = async (phone: string, otp?: string) => {
  const { data } = await api.post("/vendor/auth/verify-phone", {
    phone,
    otp,
  });
  return data;
};

export const resendOtp = async (phone: string) => {
  const { data } = await api.post("/vendor/auth/resend-otp", { phone });
  return data;
};

export const refresh = async () => {
  const { data } = await api.post("/vendor/auth/refresh");
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/vendor/auth/logout");
  return data;
};

export const forgotPassword = async (email: string) => {
  const { data } = await api.post("/vendor/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const { data } = await api.post("/vendor/auth/reset-password", {
    token,
    newPassword,
  });
  return data;
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const { data } = await api.post("/vendor/auth/change-password", {
    oldPassword,
    newPassword,
  });
  return data;
};

export const changeEmail = async (newEmail: string) => {
  const { data } = await api.post("/vendor/auth/change-email", { newEmail });
  return data;
};

export const confirmChangeEmail = async (token: string) => {
  const { data } = await api.post("/vendor/auth/confirm-change-email", { token });
  return data;
};