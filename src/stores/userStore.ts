import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';

interface User {
  _id: string;
  email: string;
}

interface UsersState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
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
    isAuthenticated: !!localStorage.getItem('authToken'),
    token: localStorage.getItem('authToken'),
  }),
  actions: {
    async register(userDetails: RegisterUserDetails) {
      try {
        const response = await apiClient.post('/user/register', userDetails);
        this.user = response.data.user;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    async login(credentials: LoginCredentials) {
      try {
        const response = await apiClient.post('/user/login', credentials);
        this.user = response.data.user;
        this.isAuthenticated = true;
        this.token = response.data.token;
        localStorage.setItem('authToken', this.token);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
      localStorage.removeItem('authToken');
    },
    isAuthenticated(): boolean {
      return this.isAuthenticated;
    },
  },
});
