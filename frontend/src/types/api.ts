/**
 * API Types untuk Frontend-Backend Communication
 *
 * Types ini sesuai dengan backend API endpoints:
 * - POST /api/users (registration)
 * - POST /api/auth/login (login)
 */

// === REGISTRATION TYPES ===

export interface UserRegistrationRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface UserRegistrationResponse {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// === LOGIN TYPES ===

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  tokenType?: string;
  userId?: number;
  email?: string;
  fullName?: string;
  loginTime?: string;
}

// === ERROR TYPES ===

export interface ApiError {
  message: string;
  errorCode?: string;
  fieldErrors?: Record<string, string>;
  timestamp?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}

// === FRONTEND FORM TYPES ===
// Types untuk forms di frontend (sebelum dikirim ke backend)

export interface RegistrationFormData {
  name: string;          // Frontend: "name"
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// === AUTH STATE TYPES ===

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

// === PROFILE PICTURE TYPES ===

export interface ProfilePictureResponse {
  userId: number;
  userEmail: string;
  userName: string;
  pictureUrl: string | null;
  success: boolean;
  message: string;
  timestamp: string;
}