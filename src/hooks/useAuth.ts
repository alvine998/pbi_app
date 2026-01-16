import { useMemo } from 'react';
import { useAuthContext } from '../context/AuthContext';

/**
 * Custom hook to check authentication state
 * @returns Object with auth state and user data
 */
export const useAuth = () => {
  const authContext = useAuthContext();

  return useMemo(
    () => ({
      isAuthenticated: authContext.isAuthenticated,
      user: authContext.user,
      token: authContext.token,
      isLoading: authContext.isLoading,
      hasCompletedKyc: authContext.hasCompletedKyc,
      refreshAuth: authContext.refreshAuth,
      login: authContext.login,
      logout: authContext.logout,
    }),
    [
      authContext.isAuthenticated,
      authContext.user,
      authContext.token,
      authContext.isLoading,
      authContext.hasCompletedKyc,
      authContext.refreshAuth,
      authContext.login,
      authContext.logout,
    ],
  );
};

export default useAuth;
