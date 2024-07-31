import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';
import router from '../router';
import { User } from '../interfaces/IUser';
import { UsersState } from '../interfaces/IUserState';
import { LoginCredentials } from '../interfaces/ILoginCredentials';
import { RegisterUserDetails } from '../interfaces/IRegisterUserDetails';

// Define the user store using Pinia.
export const useUserStore = defineStore('users', {
  // Initial state of the store.
  state: (): UsersState => ({
      user: null, // Initially, no user is logged in.
      token: localStorage.getItem('authToken') || null, // Get the auth token from localStorage or default to null.
      users: [] as User[], // Initially, the users array is empty.
    }),
  actions: {
    // Action to fetch all users.
    async fetchAllUsers() {
      try {
        const response = await apiClient.get('/users');
        this.users = response.data;
      } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
      }
    },
    // Action to register a new user.
    async register(userDetails: RegisterUserDetails) {
      try {
        // Make a POST request to the register endpoint.
        const response = await apiClient.post('/users/register', userDetails);
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
        const response = await apiClient.post('/users/login', credentials);
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
      router.push({ name: 'Home' }); // Redirect to the Home view after logout
    },
    // Action to initialize the store with the user data.
    async initializeStore() {
      if (this.token) {
        try {
          const response = await apiClient.get('/users/me', {
            headers: {
              'auth-token': this.token,
            },
          });
          this.user = response.data;
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          this.logout();
        }
      }
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
    // Getter to retrieve all users.
    getUsers(state): User[] {
      return state.users;
    },
  },
});
