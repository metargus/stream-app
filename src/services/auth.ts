// src/services/auth.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, AuthTokens, RefreshTokenResponse, Credentials } from '../types/auth';

const API_URL = 'YOUR_API_URL'; // Replace with your actual API URL

class AuthService {
    private static instance: AuthService;
    private isRefreshingToken: boolean = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    private constructor() {}

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async signIn(credentials: Credentials): Promise<AuthResponse> {
        try {
            const response = await axios.post<AuthResponse>(
                `${API_URL}/api/auth/login`,
                credentials,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-LiveStream-Remote': 'true'
                    }
                }
            );

            await this.storeTokens({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken,
                refreshTokenExpiryTime: response.data.refreshTokenExpiryTime
            });

            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async refreshToken(): Promise<RefreshTokenResponse> {
        try {
            const tokens = await this.getStoredTokens();
            if (!tokens) throw new Error('No refresh token available');

            const response = await axios.get<RefreshTokenResponse>(
                `${API_URL}/api/auth/refresh-token`,
                {
                    headers: {
                        'Authorization': `Bearer ${tokens.refreshToken}`
                    }
                }
            );

            // Update stored access token
            await this.updateAccessToken(response.data.accessToken);

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