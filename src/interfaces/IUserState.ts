import { User } from './IUser';

// State structure for the user store.
export interface UsersState {
    user: User | null;  // Currently logged in user
    token: string | null;  // Authentication token
    users: User[];  // Array to store multiple users
  }
  