import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isLoggedIn, getUserData, getAuthToken, saveAuthData, clearAuthData, AuthData, UserData } from '../services/storage';
import { isKycVerified } from '../utils/kyc';

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserData | null;
    token: string | null;
    isLoading: boolean;
    hasCompletedKyc: boolean;
    login: (authData: AuthData) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: (silent?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasCompletedKyc, setHasCompletedKyc] = useState<boolean>(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async (silent = false) => {
        try {
            if (!silent) setIsLoading(true);
            const loggedIn = await isLoggedIn();
            const authToken = await getAuthToken();
            const userData = await getUserData();

            if (loggedIn && authToken && userData) {
                setIsAuthenticated(true);
                setToken(authToken);
                setUser(userData);
                setHasCompletedKyc(isKycVerified(userData));
            } else {
                // If state is inconsistent, clear everything
                if (loggedIn || authToken || userData) {
                    await clearAuthData();
                }
                setIsAuthenticated(false);
                setToken(null);
                setUser(null);
                setHasCompletedKyc(false);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    const login = async (authData: AuthData) => {
        try {
            await saveAuthData(authData);
            setIsAuthenticated(true);
            setToken(authData.token);
            setUser(authData.user);
            setHasCompletedKyc(isKycVerified(authData.user));
        } catch (error) {
            console.error('Error during login context update:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await clearAuthData();
            setIsAuthenticated(false);
            setToken(null);
            setUser(null);
            setHasCompletedKyc(false);
        } catch (error) {
            console.error('Error during logout context update:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                token,
                isLoading,
                hasCompletedKyc,
                login,
                logout,
                refreshAuth: checkAuthStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
