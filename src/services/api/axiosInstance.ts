// src/services/api/axios-instance.ts
import axios, { AxiosError, AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api-dev.mismatch.gr'; // Replace with your actual API URL

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-Mismatch-App': 'livestream-remote',
    }
});

axiosInstance.interceptors.request.use(
    async config => {
        const tokens = await AsyncStorage.getItem('auth_tokens');
        if (tokens) {
            const { accessToken } = JSON.parse(tokens);
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const tokens = await AsyncStorage.getItem('auth_tokens');
                if (!tokens) throw new Error('No refresh token available');

                const { refreshToken } = JSON.parse(tokens);
                const response = await axios.get(`${API_URL}/api/auth/refresh-token`, {
                    headers: { Authorization: `Bearer ${refreshToken}` }
                });

                const { accessToken } = response.data;
                const storedTokens = JSON.parse(tokens);
                await AsyncStorage.setItem('auth_tokens', JSON.stringify({
                    ...storedTokens,
                    accessToken
                }));

                processQueue(null, accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as AxiosError, null);
                await AsyncStorage.removeItem('auth_tokens');
                throw refreshError;
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;