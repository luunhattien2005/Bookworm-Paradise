import api from './axios';

export async function getAllTags() {
  const res = await api.get('/api/tags');
  return res.data;
}

// q = search text (title/author) OR other params
export async function searchBooks(q, { limit = 20, page = 1, tag, author, min, max } = {}) {
  const params = { q, limit, page };
  if (tag) params.tag = tag;
  if (author) params.author = author;
  if (min) params.min = min;
  if (max) params.max = max;
  const res = await api.get('/api/books', { params });
  return res.data;
}

export async function getBookBySlug(slug) {
  const res = await api.get(`/api/books/slug/${slug}`);
  return res.data;
}

export async function getBook(id) {
  const res = await api.get(`/api/books/${id}`);
  return res.data;
}

// create/update use FormData (for file upload)
export async function createBook(data) {
  // data bây giờ là object { name, imgURL, ... }
  // Axios sẽ tự động gửi dưới dạng JSON
  const res = await api.post('/api/books', data);
  return res.data;
}

// 👇 SỬA HÀM updateBook
export async function updateBook(id, data) {
  const res = await api.put(`/api/books/${id}`, data);
  return res.data;
}

export async function deleteBook(id, token) {
  const res = await api.delete(`/api/books/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}


export async function getTopRated() {
  const res = await api.get('/api/books/top-rated');
  return res.data;
}

export async function getBestSellers() {
  const res = await api.get('/api/books/best-sellers');
  return res.data;
}

export async function getSeasonal(tag) {
  const res = await api.get('/api/books/seasonal', { params: { tag } });
  return res.data;
}