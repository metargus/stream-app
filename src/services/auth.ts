// src/services/auth.ts
import { AuthResponse, AuthTokens, Credentials } from '../types/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
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
            if (!response.data) throw this.handleError('Wrong email or password!')
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

    async googleSignIn(): Promise<AuthResponse> {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            
            // Send to your backend
            const response = await axiosInstance.post<AuthResponse>(
                '/api/auth/google',
                userInfo.data?.idToken
            );
            
            await this.storeTokens(response.data);
            return response.data;
        } catch (error) {
            console.log(error)
            throw this.handleError(error);
        }
    }

    async googleSignOut(): Promise<void> {
        try {
            await GoogleSignin.signOut();
            await this.signOut();
        } catch (error) {
            throw this.handleError(error);
        }
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