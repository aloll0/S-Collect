import { api } from "./api";

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/vendor/auth/login", {
    email,
    password,
  });

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
