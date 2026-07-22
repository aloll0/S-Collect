import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../../services/products';

export const useProduct = (productId?: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const raw = await getProductById(productId!);

      // Unwrap if the response is in a { success: boolean, data: T } envelope
      return raw && typeof raw === 'object' && 'success' in raw && 'data' in raw
        ? raw.data
        : raw;
    },
    enabled: !!productId,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, isError };
};
