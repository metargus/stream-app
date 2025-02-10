// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';
import { User } from '../types/user.ts';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    signIn: (username: string, password: string) => Promise<void>;
    googleSignIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const isSignedIn = await authService.isSignedIn();
            setIsAuthenticated(isSignedIn);
            if (isSignedIn) {
                // Get user profile
                const userProfile = await authService.getUser();
                setUser(userProfile);
            }
        } catch (error) {
            console.error('Auth state check failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (username: string, password: string) => {
        try {
            await authService.signIn({ username, password });
            const userProfile = await authService.getUser();
            setUser(userProfile);
            setIsAuthenticated(true);
        } catch (error) {
            throw error;
        }
    };

    const googleSignIn = async () => {
        try {
            const userProfile = await authService.getUser();
            setUser(userProfile);
            setIsAuthenticated(true);
        } catch (error) {
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await authService.signOut();
            await authService.googleSignOut();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Sign out failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                isLoading,
                signIn,
                signOut,
                googleSignIn
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};