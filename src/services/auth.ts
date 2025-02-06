// src/services/auth.ts
import { AuthResponse, AuthTokens, RefreshTokenResponse, Credentials } from '../types/auth';
import {User} from "../types/user.ts";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from './api/axiosInstance.ts';

class AuthService {
    private static instance: AuthService;

    private constructor() {}

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async signIn(credentials: Credentials): Promise<AuthResponse> {
        try {
            const response = await axiosInstance.post<AuthResponse>(
                '/api/auth/login',
                credentials
            );
            await this.storeTokens(response.data);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getUser(): Promise<User> {
        try {
            const response = await axiosInstance.get<User>('/api/users/me');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async signOut(): Promise<void> {
        await AsyncStorage.removeItem('auth_tokens');
    }

    async isSignedIn(): Promise<boolean> {
        const tokens = await this.getStoredTokens();
        return !!tokens;
    }

    // Helper methods
    private async storeTokens(tokens: AuthTokens): Promise<void> {
        await AsyncStorage.setItem('auth_tokens', JSON.stringify(tokens));
    }

    private async getStoredTokens(): Promise<AuthTokens | null> {
        const tokens = await AsyncStorage.getItem('auth_tokens');
        return tokens ? JSON.parse(tokens) : null;
    }

    private async updateAccessToken(newAccessToken: string): Promise<void> {
        const tokens = await this.getStoredTokens();
        if (tokens) {
            tokens.accessToken = newAccessToken;
            await this.storeTokens(tokens);
        }
    }

    private handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            return new Error(error.response?.data?.message || 'Authentication failed');
        }
        return error;
    }
}

export default AuthService.getInstance();