import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ordersApi from '../../api/orders';

/**
 * useOrdersQuery(userId)
 * useCreateOrder / useUpdateOrderStatus
 */

export function useOrdersQuery(userId, options = {}) {
  return useQuery(['orders', userId], () => ordersApi.getOrders(userId), {
    enabled: !!userId,
    staleTime: 1000 * 60,
    ...options,
  });
}

export function useCreateOrder(userId, options = {}) {
  const qc = useQueryClient();
  return useMutation(
    (payload) => ordersApi.createOrder(userId, payload),
    {
      onSuccess() {
        qc.invalidateQueries(['orders', userId]);
        qc.invalidateQueries(['cart', userId]);
        if (options.onSuccess) options.onSuccess();
      },
      ...options,
    }
  );
}

export function useUpdateOrderStatus(options = {}) {
  const qc = useQueryClient();
  return useMutation(
    ({ orderId, status }) => ordersApi.updateOrderStatus(orderId, status, options.token),
    {
      onSuccess() {
        // admin may want to refresh orders list
        if (options.onSuccess) options.onSuccess();
      },
      ...options,
    }
  );
}