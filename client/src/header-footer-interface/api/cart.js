// Cart API: get cart, add, update, remove, clear
import api from './axios';

export async function getCart(userId) {
  const res = await api.get(`/api/carts/${userId}`);
  return res.data;
}

export async function addToCart(userId, { bookId, quantity = 1 }) {
  const res = await api.post(`/api/carts/${userId}/add`, { bookId, quantity });
  return res.data;
}

export async function updateCartItem(userId, { bookId, quantity }) {
  const res = await api.put(`/api/carts/${userId}/update`, { bookId, quantity });
  return res.data;
}

export async function removeFromCart(userId, bookId) {
  const res = await api.delete(`/api/carts/${userId}/remove`, { data: { bookId } });
  return res.data;
}

export async function clearCart(userId) {
  const res = await api.post(`/api/carts/${userId}/clear`);
  return res.data;
}