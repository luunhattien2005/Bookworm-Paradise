import api from './axios';

// q = search text (title/author) OR other params
export async function searchBooks(q, { limit = 20, page = 1, tag, author } = {}) {
  const params = { q, limit, page };
  if (tag) params.tag = tag;
  if (author) params.author = author;
  const res = await api.get('/api/books', { params });
  return res.data;
}

export async function getBook(id) {
  const res = await api.get(`/api/books/${id}`);
  return res.data;
}

// create/update use FormData (for file upload)
export async function createBook(formData, token) {
  const res = await api.post('/api/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateBook(id, formData, token) {
  const res = await api.put(`/api/books/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteBook(id, token) {
  const res = await api.delete(`/api/books/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
}