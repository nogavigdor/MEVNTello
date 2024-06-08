import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  id: number;
  name: string;
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
        const response = await axios.post('/api/register', userDetails);
        this.user = response.data.user;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    async login(credentials: LoginCredentials) {
      try {
        const response = await axios.post('/api/login', credentials);
        this.user = response.data.user;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
