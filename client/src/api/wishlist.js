import api from './axios';

export async function getWishlist() {
  const res = await api.get('/api/wishlists'); 
  return res.data;
}

export async function addToWishlist(bookId) {
  const res = await api.post('/api/wishlists/add', { bookId });
  return res.data;
}

export async function removeFromWishlist(bookId) {
  const res = await api.delete(`/api/wishlists/remove/${bookId}`);
  return res.data;
}