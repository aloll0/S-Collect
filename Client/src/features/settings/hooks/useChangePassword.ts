import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { changePassword } from '../../../services/auth';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      changePassword(payload.currentPassword, payload.newPassword),
    onSuccess: (data: any) => {
      const newAccessToken = data?.accessToken || data?.data?.accessToken;
      const newRefreshToken = data?.refreshToken || data?.data?.refreshToken;
      if (newAccessToken) {
        localStorage.setItem('token', newAccessToken);
      }
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
    },
    onError: (err: any) => {
      console.error('Failed to change password:', err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to change password';
      toast.error(msg);
    },
  });
};

