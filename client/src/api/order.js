import api from './axios';

// Hàm lấy header xác thực
function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
// Tạo đơn hàng mới
export async function createOrder(userId, payload) {
  const res = await api.post(`/api/orders/${userId}/create`, payload);
  return res.data;
}

// Lấy đơn hàng của user
export async function getOrders(userId) {
  const res = await api.get(`/api/orders/${userId}`);
  return res.data;
}

// Admin lấy TẤT CẢ đơn hàng
export async function getAllOrders() {
    const res = await api.get('/api/orders', { headers: authHeader() });
    return res.data;
}

// Lấy chi tiết 1 đơn hàng (cho trang Edit)
export async function getOrderById(orderId) {
    const res = await api.get(`/api/orders/detail/${orderId}`, { headers: authHeader() });
    return res.data;
}

// Cập nhật trạng thái đơn hàng (Admin)
export async function updateOrderStatus(orderId, status) {
  const res = await api.patch(`/api/orders/${orderId}/status`, { status }, {
    headers: authHeader(),
  });
  return res.data;
}