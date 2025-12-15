export interface User {
  username: string;
  isAdmin: boolean;
  email?: string;
  fullName?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
