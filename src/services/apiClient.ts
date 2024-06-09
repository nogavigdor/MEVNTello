// src/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['auth-token'] = token; // Use 'auth-token' instead of 'Authorization'
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
export default apiClient;
