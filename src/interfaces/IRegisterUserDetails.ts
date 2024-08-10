// Structure for user registration details.
export interface RegisterUserDetails {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
  }
  