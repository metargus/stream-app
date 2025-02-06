// src/types/auth.ts

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiryTime: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiryTime: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
}

export interface Credentials {
    username: string;
    password: string;
}

export interface AuthError {
    message: string;
    code?: string;
}