
export interface User {
  username: string;
  role: UserRole; 
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
  role: UserRole; 
  userName: string;
}

export enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  OPERATOR = 'ROLE_OPERATOR', 
}