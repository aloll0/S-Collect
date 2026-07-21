import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProductFull } from '../../services/products';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return useMutation({
    mutationFn: (formData: FormData) => createProductFull(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(
        isRtl
          ? 'تم نشر المنتج بنجاح!'
          : 'Product published successfully!'
      );
    },
    onError: (error: any) => {
      console.error('Create product API error:', error);
      const responseData = error?.response?.data;
      const apiError = responseData?.error || responseData;
      let detailsMsg = '';
      
      if (apiError && typeof apiError === 'object') {
        const details = apiError.validation || apiError.details || apiError.errors;
        if (Array.isArray(details)) {
          detailsMsg = details.map((d: any) => `${d.field || d.property}: ${d.issue || d.message}`).join(', ');
        } else if (details && typeof details === 'object') {
          detailsMsg = Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(', ');
        }
      }

      const mainMsg = apiError?.message || responseData?.message || detailsMsg || error.message || '';
      const fallbackMsg = isRtl
        ? 'فشل نشر المنتج. يرجى التحقق من المدخلات.'
        : 'Failed to publish product. Please verify inputs.';
      
      toast.error(mainMsg ? `${fallbackMsg} (${mainMsg})` : fallbackMsg);
    }
  });
};
