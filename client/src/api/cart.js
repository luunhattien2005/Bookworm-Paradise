import api from './axios';

export async function getCart() {
  const res = await api.get('/api/carts');
  return res.data;
}

export async function addToCart({ bookId, quantity = 1 }) {
  const res = await api.post('/api/carts/add', { bookId, quantity });
  return res.data;
}

export async function updateCartItem({ bookId, quantity }) {
  const res = await api.put('/api/carts/update', { bookId, quantity });
  return res.data;
}

export async function removeFromCart({ bookId }) {
  const res = await api.delete(`/api/carts/remove/${bookId}`);
  return res.data;
}

export async function clearCart() {
  const res = await api.delete('/api/carts/clear');
  return res.data;
}
