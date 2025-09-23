// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  code: string;
  details: Record<string, any>;
  timestamp: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  birthDate: string | null;
  avatarUrl: string | null;
  status: string;
  createdAt: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  addressType: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  default: boolean;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  birthDate?: string;
  avatarUrl?: string;
}

export interface AuthData {
  user: User;
  token: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LoginResponse extends ApiResponse<AuthData> { }

export interface RefreshTokenRequest {
  token: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface RefreshTokenResponse extends ApiResponse<{ token: string }> { }

// Password Reset Types
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API Request Options
export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  requiresAuth?: boolean;
}
