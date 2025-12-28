import api from './axios';

// Hàm lấy header xác thực
function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
// Tạo đơn hàng mới
export async function createOrder(payload) {
  const res = await api.post(`/api/orders/place-order`, payload, { headers: authHeader() });
  return res.data;
}

// Lấy đơn hàng của user
export async function getMyOrders() {
  const res = await api.get(`/api/orders/my-orders`, { headers: authHeader() });
  return res.data;
}

// Admin lấy TẤT CẢ đơn hàng
export async function getAllOrders() {
    const res = await api.get('/api/orders', { headers: authHeader() });
    return res.data;
}

// Lấy chi tiết 1 đơn hàng (cho trang Edit)
export async function getOrderById(orderId) {
    const res = await api.get(`/api/orders/${orderId}`, { headers: authHeader() });
    return res.data;
}

// Cập nhật trạng thái đơn hàng (Admin)
export async function updateOrderStatus(orderId, status) {
  const res = await api.patch(`/api/orders/${orderId}/status`, { status }, {
    headers: authHeader(),
  });
  return res.data;
}

export async function cancelOrder(orderId) {
  const res = await api.patch(`/api/orders/${orderId}/cancel`, {}, { headers: authHeader() });
  return res.data;
}