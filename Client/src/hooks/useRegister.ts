import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { applyVendorOnboarding } from '../services/auth';

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  storeName: string;
  category: string;
  website: string;
  description: string;
  password: string;
  confirmPassword: string;
}

export const useRegister = (setError: any) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [submitted, setSubmitted] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormData) => {
      try {
        const data = await applyVendorOnboarding({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
          phoneNumber: values.phone,
          storeName: values.storeName,
          storeDescription: values.description,
          commercialRegisterNumber: values.website,
        });
        return data;
      } catch (error: any) {
        const responseData = error?.response?.data;
        const errObj = responseData?.errors || responseData;
        if (errObj && typeof errObj === 'object' && !Array.isArray(errObj)) {
          let mainMsg = '';
          let hasMappedField = false;
          Object.keys(errObj).forEach((key) => {
            if (key === 'message' || key === 'success' || key === 'status' || key === 'statusCode') return;

            let fieldName: keyof RegisterFormData | undefined;
            if (key === 'firstName') fieldName = 'firstName';
            else if (key === 'lastName') fieldName = 'lastName';
            else if (key === 'email') fieldName = 'email';
            else if (key === 'phoneNumber' || key === 'phone') fieldName = 'phone';
            else if (key === 'storeName') fieldName = 'storeName';
            else if (key === 'storeDescription' || key === 'description') fieldName = 'description';
            else if (key === 'commercialRegisterNumber' || key === 'website') fieldName = 'website';
            else if (key === 'password') fieldName = 'password';

            const messages = Array.isArray(errObj[key])
              ? errObj[key]
              : [errObj[key]];
            const messageStr = messages.join(', ');

            if (fieldName && setError) {
              setError(fieldName, {
                type: 'server',
                message: messageStr,
              });
              hasMappedField = true;
            } else {
              mainMsg += `${key}: ${messageStr}\n`;
            }
          });

          if (hasMappedField || mainMsg) {
            throw new Error(
              mainMsg ||
                responseData?.message ||
                (isRtl
                  ? 'فشلت عملية التسجيل. يرجى التحقق من الحقول المطلوبة.'
                  : 'Registration failed. Please check the fields.')
            );
          }
        }

        const message =
          responseData?.message ||
          error.message ||
          (isRtl
            ? 'فشلت عملية التسجيل. يرجى المحاولة مرة أخرى.'
            : 'Registration failed. Please try again.');
        throw new Error(message);
      }
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success(
        isRtl
          ? 'تم تقديم طلبك بنجاح!'
          : 'Your application has been submitted successfully!'
      );
    },
  });

  return {
    register: registerMutation.mutate,
    isPending: registerMutation.isPending,
    submitted,
    error: registerMutation.error,
    setSubmitted,
    reset: registerMutation.reset,
  };
};
