export interface StoreProfileData {
  storeName: string;
  storeDescription: string;
  publicEmail: string;
  phoneNumber: string;
  storeLogoUrl: string | null;
  storeLogoFileName: string | null;
}

export interface AccountSettingsData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}
