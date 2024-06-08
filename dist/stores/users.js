import { defineStore } from 'pinia';
import axios from 'axios';
export const useUsersStore = defineStore('users', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async register(userDetails) {
      try {
        const response = await axios.post('/api/register', userDetails);
        this.user = response.data.user;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },
    async login(credentials) {
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
