import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER_DATA: '@pbi_user_data',
  AUTH_TOKEN: '@pbi_auth_token',
  IS_LOGGED_IN: '@pbi_is_logged_in',
};

// User data interface
export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  kycStatus?: string;
  kycVerified?: boolean;
  isKycVerified?: boolean;
  kycLevel?: string;
}

// Auth data interface
export interface AuthData {
  user: UserData;
  token: string;
}

/**
 * Save authentication data to AsyncStorage
 */
export const saveAuthData = async (authData: AuthData): Promise<void> => {
  try {
    const userData = JSON.stringify(authData.user || {});
    const token = authData.token || '';

    await AsyncStorage.multiSet([
      [STORAGE_KEYS.USER_DATA, userData],
      [STORAGE_KEYS.AUTH_TOKEN, token],
      [STORAGE_KEYS.IS_LOGGED_IN, 'true'],
    ]);
    console.log('Auth data saved successfully');
  } catch (error) {
    console.error('Error saving auth data:', error);
    throw error;
  }
};

/**
 * Get user data from AsyncStorage
 */
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (userDataString) {
      return JSON.parse(userDataString);
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Get auth token from AsyncStorage
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Get complete auth data (user + token)
 */
export const getAuthData = async (): Promise<AuthData | null> => {
  try {
    const userData = await getUserData();
    const token = await getAuthToken();

    if (userData && token) {
      return {
        user: userData,
        token,
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting auth data:', error);
    return null;
  }
};

/**
 * Check if user is logged in
 */
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const isLoggedInString = await AsyncStorage.getItem(
      STORAGE_KEYS.IS_LOGGED_IN,
    );
    return isLoggedInString === 'true';
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

/**
 * Clear all auth data (logout)
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.IS_LOGGED_IN,
    ]);
    console.log('Auth data cleared successfully');
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

/**
 * Update user data in AsyncStorage with partial updates
 */
export const updateUserData = async (
  updates: Partial<UserData>,
): Promise<void> => {
  try {
    const currentUserData = await getUserData();
    if (currentUserData) {
      const updatedUserData = { ...currentUserData, ...updates };
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(updatedUserData),
      );
      console.log('User data updated successfully');
    }
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};
