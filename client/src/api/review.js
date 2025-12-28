import api from './axios';

// Lấy danh sách review - cursor pagination
export async function getReviewsForBook({ bookId, limit = 5, pageParam = null }) {
  const params = { limit };
  if (pageParam) {
    params.cursor = pageParam;
  }
  const res = await api.get(`/api/reviews/${bookId}/reviews`, { params });
  return res.data;
}

export async function addReview({ bookId, star, content }) {
  const res = await api.post(`/api/reviews/${bookId}/reviews`, { star, content });
  return res.data;
}

export async function deleteReview(reviewId) {
  const res = await api.delete(`/api/reviews/reviews/${reviewId}`);
  return res.data;
}