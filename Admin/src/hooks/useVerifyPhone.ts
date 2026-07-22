import { useMutation } from '@tanstack/react-query';
import { verifyPhone } from '../services/auth';

export const useVerifyPhone = () => {
  const verifyMutation = useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      try {
        const response = await verifyPhone(email, code);
        if (response && response.success === false) {
          throw new Error(response.message || 'Verification failed');
        }
        return response;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error.message || 'Verification failed';
        throw new Error(message);
      }
    },
  });

  return {
    verify: verifyMutation.mutateAsync,
    isPending: verifyMutation.isPending,
    error: verifyMutation.error,
    reset: verifyMutation.reset,
  };
};
