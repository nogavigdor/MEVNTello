import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';

interface User {
  _id: string;
  email: string;
}

interface UsersState {
  user: User | null;
  isAuthenticated: boolean;
}

interface RegisterUserDetails {
  username: string;
  email: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useUserStore = defineStore('users', {
  state: (): UsersState => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async register(userDetails: RegisterUserDetails) {
      try {
        const response = await apiClient.post('/login', credentials);
        this.user = response.data.user;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    async login(credentials: LoginCredentials) {
      try {
        const response = await axios.post('https://mevntello-backend.onrender.com/api/login', credentials);
        this.user = response.data.user;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
