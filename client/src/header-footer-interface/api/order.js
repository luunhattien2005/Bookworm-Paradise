// Orders: create from cart, list, update status (admin)
import api from './axios';

export async function createOrder(userId, payload) {
  // payload: { paymentMethod, shippingAddress, deliveryNote }
  const res = await api.post(`/api/orders/${userId}/create`, payload);
  return res.data;
}

export async function getOrders(userId) {
  const res = await api.get(`/api/orders/${userId}`);
  return res.data;
}

export async function updateOrderStatus(orderId, status, token) {
  const res = await api.patch(`/api/orders/${orderId}/status`, { status }, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}