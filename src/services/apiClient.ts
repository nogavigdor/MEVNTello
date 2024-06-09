// src/services/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
    (config) => {
      const userStore = useUserStore();
      const token = userStore.token || localStorage.getItem('authToken');
      if (token) {
        config.headers['auth-token'] = token; // Use the custom header your backend expects
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default apiClient;
