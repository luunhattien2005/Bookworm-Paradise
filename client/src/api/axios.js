import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/accounts', // Đổi URL/Port cho đúng server của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});


// Interceptor: Tự động chui vào LocalStorage lấy token gắn vào Header trước khi gửi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Giả sử bạn lưu token tên là 'access_token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý phản hồi (VD: Trả về data luôn cho gọn)
apiClient.interceptors.response.use(
  (response) => response.data, // Chỉ lấy cục data, bỏ qua config/headers thừa
  (error) => {
    // Có thể xử lý lỗi chung ở đây (ví dụ: Token hết hạn -> tự logout)
    return Promise.reject(error);
  }
);

export default apiClient;