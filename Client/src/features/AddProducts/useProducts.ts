import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../../services/products';

export const useProducts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { data, isLoading, error };
};
