import { api } from './api';
import type {
  PaginatedSubOrders,
  SubOrder,
  SubOrderStatus,
  UpdateSubOrderDto,
} from '../features/Orders/types/subOrder';

// Helper: some API responses are wrapped as { success, data: <payload>, meta }
// while others return the payload directly. This unwraps both shapes.
const unwrap = <T>(res: any): T => {
  if (res && typeof res === 'object' && 'data' in res && 'success' in res) {
    return res.data as T;
  }
  return res as T;
};

export const getSubOrders = async (params?: {
  pageNum?: number;
  pageSize?: number;
  status?: SubOrderStatus;
}): Promise<PaginatedSubOrders> => {
  const { data } = await api.get('/vendor/sub-orders', { params });
  return unwrap<PaginatedSubOrders>(data);
};

export const getSubOrderById = async (id: string): Promise<SubOrder> => {
  const { data } = await api.get(`/vendor/sub-orders/${id}`);
  return unwrap<SubOrder>(data);
};

export const updateSubOrder = async (
  id: string,
  body: UpdateSubOrderDto
): Promise<SubOrder> => {
  const { data } = await api.patch(`/vendor/sub-orders/${id}`, body);
  return unwrap<SubOrder>(data);
};
