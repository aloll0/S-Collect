import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSubOrders, getSubOrderById, updateSubOrder } from '../../services/orders';
import type { SubOrderStatus, UpdateSubOrderDto } from './types/subOrder';
import toast from 'react-hot-toast';

// ────────────────────────────────────────────────────────────────────────────
// List
// ────────────────────────────────────────────────────────────────────────────
export const useSubOrders = (params?: {
  pageNum?: number;
  pageSize?: number;
  status?: SubOrderStatus;
}) => {
  return useQuery({
    queryKey: ['sub-orders', params],
    queryFn: () => getSubOrders(params),
    staleTime: 30_000,
    retry: 1,
  });
};

// ────────────────────────────────────────────────────────────────────────────
// Single
// ────────────────────────────────────────────────────────────────────────────
export const useSubOrder = (id: string | null) => {
  return useQuery({
    queryKey: ['sub-orders', id],
    queryFn: () => getSubOrderById(id!),
    enabled: !!id,
    staleTime: 30_000,
    retry: 1,
  });
};

// ────────────────────────────────────────────────────────────────────────────
// Update (advance status / set tracking number)
// ────────────────────────────────────────────────────────────────────────────
export const useUpdateSubOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateSubOrderDto }) =>
      updateSubOrder(id, body),
    onSuccess: (updated) => {
      // Invalidate the list and the individual order
      queryClient.invalidateQueries({ queryKey: ['sub-orders'] });
      // Optimistically push the updated record into cache
      queryClient.setQueryData(['sub-orders', updated.id], updated);
      toast.success('Order updated successfully!');
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update order.';
      toast.error(msg);
    },
  });
};
