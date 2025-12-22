// Account API: register, login, getMe, updateProfile
import api from './axios';

function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerAccount(payload) {
  // payload: { email, username, password, fullname, phone?, address? }
  const res = await api.post('/api/accounts/register', payload);
  return res.data;
}

export async function loginAccount(payload) {
  // payload: { emailOrUsername, password }
  const res = await api.post('/api/accounts/login', payload);
  return res.data;
}

export async function getMe(token) {
  const res = await api.get('/api/accounts/me', { headers: authHeader(token) });
  return res.data;
}

export async function updateProfile(token, updates) {
  const res = await api.put('/api/accounts/me', updates, { headers: authHeader(token) });
  return res.data;
}