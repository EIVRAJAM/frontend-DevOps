import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/apiEndpoints';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    try {
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.token;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      // Ignorar errores silenciados
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
