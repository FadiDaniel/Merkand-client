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

export interface AuthResponse {
  token: string;
  user?: User; // Optional, in case backend sends user info. If not, we might need to decode token or just use username.
}
