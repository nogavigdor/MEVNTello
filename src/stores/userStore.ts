import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';

// Interface for the User object.
interface User {
  _id: string;
  email: string;
  username: string;
}

// State structure for the user store.
interface UsersState {
  user: User | null;
  token: string | null;
}

// Structure for user registration details.
interface RegisterUserDetails {
  username: string;
  email: string;
  password: string;
}

// Structure for user login credentials.
interface LoginCredentials {
  email: string;
  password: string;
}

// Define the user store using Pinia.
export const useUserStore = defineStore('users', {
  // Initial state of the store.
  state: (): UsersState => ({
    user: null, // Initially, no user is logged in.
    token: localStorage.getItem('authToken') || null, // Get the auth token from localStorage or default to null.
  }),
  actions: {
    // Action to register a new user.
    async register(userDetails: RegisterUserDetails) {
      try {
        // Make a POST request to the register endpoint.
        const response = await apiClient.post('/user/register', userDetails);
      } catch (error: any) {
        // If an error occurs, log it and rethrow.
        console.error('Registration failed:', error?.response?.data || error.message);
        throw error;
      }
    },
    // Action to log in a user.
    async login(credentials: LoginCredentials) {
      try {
        // Make a POST request to the login endpoint.
        const response = await apiClient.post('/user/login', credentials);
        // Update the state with the user data and token from the response.
        this.user = response.data.user;
        this.token = response.data.token;
        // Store the token and user data in localStorage.
        localStorage.setItem('authToken', this.token || '');
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error: any) {
        // If an error occurs, log it and rethrow.
        console.error('Login failed:', error?.response?.data || error.message);
        throw error;
      }
    },
    // Action to log out a user.
    logout() {
      // Clear user and token from the state.
      this.user = null;
      this.token = null;
      // Remove user data and token from localStorage.
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
  },
  getters: {
    // Getter to check if the user is authenticated.
    isAuthenticated: (state) => !!state.token, // Returns true if there is a token.
    // Getter to retrieve the current token.
    getToken(state): string | null {
      return state.token;
    },
    // Getter to retrieve the current username.
    getUsername(state): string | null {
      return state.user?.username || null;
    },
    // Getter to retrieve the current email.
    getEmail(state): string | null {
      return state.user?.email || null;
    },
    // Getter to retrieve the current user object.
    getUser(state): User | null {
      return state.user;
    },
  },
});
