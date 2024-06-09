import { defineStore } from 'pinia';
import apiClient from '../services/apiClient';

// Define the User interface
interface User {
  _id: string;
  email: string;
  username: string;
}

// Define the UsersState interface
interface UsersState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

// Define the RegisterUserDetails interface
interface RegisterUserDetails {
  username: string;
  email: string;
  password: string;
}

// Define the LoginCredentials interface
interface LoginCredentials {
  email: string;
  password: string;
}

//create the user store using  Pinia
export const useUserStore = defineStore('users', {
  state: (): UsersState => ({
    //user object to hold the user information
    user: null,  
    // Check if the user is authenticated
    isAuthenticated: !!localStorage.getItem('authToken'), 
    // Token for authenticated user
    token: localStorage.getItem('authToken'),
  }),
  actions: {
    // Register a new user
    async register(userDetails: RegisterUserDetails) {
      try {
        // Make a POST request to the /user/register endpoint
        const response = await apiClient.post('/user/register', userDetails);
        // Set the user object and isAuthenticated to true
        this.user = response.data.user;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
        // Throw the error to the calling function
        throw error;
      }
    },
    //Log in an existing user
    async login(credentials: LoginCredentials) {
      try {
        console.log('Logging in with credentials:', credentials);
        // Make a POST request to the /user/login endpoint
        const response = await apiClient.post('/user/login', credentials);
        console.log('Logging in with credentials:', credentials);
        //set the user data from the response
        this.user = response.data.user;
        //set isAuthenticated to true
        this.isAuthenticated = true;
        //set the token from the response
        this.token = response.data.token;
        //store the token and user data in the local storage
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        // Throw the error to the calling function
        throw error;
      }
    },
    // Log out the user
    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    //check if the user is authenticated
    isAuthenticated(): boolean {
      return this.isAuthenticated;
    },
  },
  //getters to get the user data
  getters: {
    getToken(state): string | null {
      return state.token;
    },
    getUsername(state): string | null {
      return state.user?.username || null;
    },
    getEmail(state): string | null {
      return state.user?.email || null;
    },
    getUser(state): User | null {
      return state.user;
    },
  },
});
