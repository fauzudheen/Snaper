export interface User {
    id: number;
    username: string;
    email?: string;
  }

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignUpRequest  extends SignInRequest {
    username: string;
    confirmPassword: string;
}

export interface SignUpErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

export interface SignInResponse {
    access: string;
    refresh: string;
    user: User;
}

export interface TokenRefreshRequest {
    refresh: string;
}

export interface TokenRefreshResponse {
    access: string;
    refresh: string;
    user: User;
}

export interface PasswordResetRequest {
    email: string;
}

export interface UserProfileUpdateRequest {
    username?: string;
    email?: string;
    password?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
  }