import api from './axios';

// Hàm lấy header xác thực
function authHeader(token) {
  const t = token || localStorage.getItem('token');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// Đăng ký tài khoản mới
export async function registerAccount(payload) {
  const res = await api.post('/api/accounts/register', payload);
  return res.data;
}

// Đăng nhập tài khoản
export async function loginAccount(payload) {
  const res = await api.post('/api/accounts/login', payload);
  return res.data;
}

// Quên mật khẩu
export async function forgotPassword(email) {
  const res = await api.post('/api/accounts/forgot-password', { email });
  return res.data;
}

// Lấy thông tin tài khoản hiện tại
export async function getMe(token) {
  const res = await api.get('/api/accounts/me', { headers: authHeader(token) });
  return res.data;
}

// Cập nhật thông tin tài khoản hiện tại
export async function updateProfile(formData) {
  const token = localStorage.getItem('token');
  
  const res = await api.put('/api/accounts/me', formData, { 
    headers: { 
        ...authHeader(token),
        // Dòng này để Server hiểu đang gửi file
        'Content-Type': 'multipart/form-data' 
    } 
  });
  return res.data;
}

// Lấy tất cả tài khoản
export async function getAllAccounts() {
    const res = await api.get('/api/accounts/', { headers: authHeader() });
    return res.data;
}

// Ban/Unban tài khoản
export async function banAccount(id) {
    const res = await api.put(`/api/accounts/ban/${id}`, {}, { headers: authHeader() });
    return res.data;
}

export async function checkPassword(password) {
    // Gửi { password: "..." } lên server
    const res = await api.post('/api/accounts/check-password', { password }, { headers: authHeader() });
    return res.data; // Backend trả về: { isCorrect: true/false }
}