import api from './axios';

function authHeader(token) {
  // Lấy token từ localStorage nếu token truyền vào null (để chắc chắn)
  const t = token || localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function registerAccount(payload) {
  const res = await api.post('/api/accounts/register', payload);
  return res.data;
}

export async function loginAccount(payload) {
  const res = await api.post('/api/accounts/login', payload);
  return res.data;
}

export async function forgotPassword(email) {
  const res = await api.post('/api/accounts/forgot-password', { email });
  return res.data;
}

export async function getMe(token) {
  const res = await api.get('/api/accounts/me', { headers: authHeader(token) });
  return res.data;
}

export async function updateProfile(formData) {
  // Backend route mới: PUT /api/accounts/me
  // Không cần truyền ID vào URL nữa
  const res = await api.put('/api/accounts/me', formData);
  return res.data;
}