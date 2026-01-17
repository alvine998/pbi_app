import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { isLoggedIn, getUserData, getAuthToken, saveAuthData, clearAuthData, AuthData, UserData } from '../services/storage';
import { isKycVerified } from '../utils/kyc';

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserData | null;
    token: string | null;
    isLoading: boolean;
    hasCompletedKyc: boolean;
    isGuest: boolean;
    login: (authData: AuthData) => Promise<void>;
    logout: () => Promise<void>;
    continueAsGuest: () => void;
    refreshAuth: (silent?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasCompletedKyc, setHasCompletedKyc] = useState<boolean>(false);
    const [isGuest, setIsGuest] = useState<boolean>(false);

    const checkAuthStatus = useCallback(async (silent = false) => {
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
                setIsGuest(false);
            } else {
                // If state is inconsistent, clear everything
                if (loggedIn || authToken || userData) {
                    await clearAuthData();
                }
                setIsAuthenticated(false);
                setToken(null);
                setUser(null);
                setHasCompletedKyc(false);
                // We don't clear isGuest here because it's a transient session state
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            if (!silent) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = useCallback(async (authData: AuthData) => {
        try {
            await saveAuthData(authData);
            setIsAuthenticated(true);
            setToken(authData.token);
            setUser(authData.user);
            setHasCompletedKyc(isKycVerified(authData.user));
            setIsGuest(false);
        } catch (error) {
            console.error('Error during login context update:', error);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await clearAuthData();
            setIsAuthenticated(false);
            setToken(null);
            setUser(null);
            setHasCompletedKyc(false);
            setIsGuest(false);
        } catch (error) {
            console.error('Error during logout context update:', error);
            throw error;
        }
    }, []);

    const continueAsGuest = useCallback(() => {
        setIsGuest(true);
        setIsAuthenticated(false);
    }, []);

    const contextValue = useMemo(() => ({
        isAuthenticated,
        user,
        token,
        isLoading,
        hasCompletedKyc,
        isGuest,
        login,
        logout,
        continueAsGuest,
        refreshAuth: checkAuthStatus,
    }), [isAuthenticated, user, token, isLoading, hasCompletedKyc, isGuest, login, logout, continueAsGuest, checkAuthStatus]);

    return (
        <AuthContext.Provider
            value={contextValue}
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
