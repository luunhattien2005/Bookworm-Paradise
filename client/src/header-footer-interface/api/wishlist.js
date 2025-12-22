// Wishlist: get, add, remove
import api from './axios';

export async function getWishlist(userId) {
  const res = await api.get(`/api/wishlists/${userId}`);
  return res.data;
}

export async function addToWishlist(userId, bookId) {
  const res = await api.post(`/api/wishlists/${userId}/add`, { bookId });
  return res.data;
}

export async function removeFromWishlist(userId, bookId) {
  const res = await api.post(`/api/wishlists/${userId}/remove`, { bookId });
  return res.data;
}