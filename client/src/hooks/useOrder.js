import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ordersApi from '../api/order';

/**
 * useOrdersQuery(userId)
 * useCreateOrder / useUpdateOrderStatus
 */

export function useOrders(userId, options = {}) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => ordersApi.getOrders(userId),
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
    ...options,
  });
}

/**
 * Create order (checkout)
 */
export function useCreateOrder(userId, options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      ordersApi.createOrder(userId, payload),

    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['orders', userId] });
      qc.invalidateQueries({ queryKey: ['cart', userId] });
      options.onSuccess?.(...args);
    },

    ...options,
  });
}

/**
 * Update order status (admin)
 */
export function useUpdateOrderStatus(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) =>
      ordersApi.updateOrderStatus(
        orderId,
        status,
        options.token
      ),

    onSuccess: (...args) => {
      // Admin might want to refresh orders
      qc.invalidateQueries({ queryKey: ['orders'] });
      options.onSuccess?.(...args);
    },

    ...options,
  });
}