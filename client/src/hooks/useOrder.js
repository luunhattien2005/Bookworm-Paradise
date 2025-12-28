import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ordersApi from '../api/order';

// Hook lấy đơn hàng của user
export function useOrders(options = {}) {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getMyOrders(),
    staleTime: 1000 * 60, // 1 phút
    ...options,
  });
}

// Hook tạo đơn hàng mới
export function useCreateOrder(options = {}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      ordersApi.createOrder(payload),

    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['cart'] });
      options.onSuccess?.(...args);
    },

    ...options,
  });
}

// Hook lấy tất cả đơn hàng (Admin)
export function useAllOrders(options = {}) {
    return useQuery({
        queryKey: ['admin', 'orders'],
        queryFn: ordersApi.getAllOrders,
        ...options
    });
}

// Hook lấy chi tiết 1 đơn hàng (cho trang Edit)
export function useOrderById(orderId, options = {}) {
    return useQuery({
        queryKey: ['order', orderId],
        queryFn: () => ordersApi.getOrderById(orderId),
        enabled: !!orderId,
        ...options
    });
}

// Hook cập nhật trạng thái đơn hàng (Admin)
export function useUpdateOrderStatus(options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }) => ordersApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] }); // Refresh list
      qc.invalidateQueries({ queryKey: ['order'] }); // Refresh detail
    },
    ...options,
  });
}
// khách Hủy đơn 
export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => ordersApi.cancelOrder(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] }); // Refresh list
      qc.invalidateQueries({ queryKey: ['order'] });  // Refresh chi tiết đơn
    },
  });
}