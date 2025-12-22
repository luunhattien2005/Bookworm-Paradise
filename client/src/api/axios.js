import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL?.trim() || 'http://localhost:5000';   //default local host server port

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  // set to true if your backend uses cookies for auth
  withCredentials: false,
});

api.interceptors.request.use(config => {
  console.log('[API REQUEST]', config.method?.toUpperCase(), config.baseURL + config.url)
  console.log('Headers:', config.headers)
  console.log('Data:', config.data)
  return config
})


export default api;