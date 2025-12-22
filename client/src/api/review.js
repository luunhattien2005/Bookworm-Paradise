import api from './axios';

export async function addReview({ userId, bookId, rating, comment }) {
  const res = await api.post('/api/reviews', { userId, bookId, rating, comment });
  return res.data;
}

export async function getReviewsForBook(bookId) {
  const res = await api.get(`/api/reviews/book/${bookId}`);
  return res.data;
}

export async function deleteReview(reviewId, token) {
  const res = await api.delete(`/api/reviews/${reviewId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}