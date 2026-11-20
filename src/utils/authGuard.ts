import { Alert } from 'react-native';
import { isLoggedIn, getUserData } from '../services/storage';
import { getKycStatus } from './kyc';

/**
 * Check if user is authenticated and prompt login if needed
 * @param navigation - Navigation object for redirecting to login
 * @param callback - Function to execute if user is authenticated or after login
 * @param message - Optional message to show when login is required
 * @returns Promise<boolean> - true if user is authenticated, false if not
 */
export const requireAuth = async (
  navigation: any,
  callback?: () => void,
  message: string = 'Fitur ini memerlukan login terlebih dahulu'
): Promise<boolean> => {
  const authenticated = await isLoggedIn();

  if (!authenticated) {
    Alert.alert(
      'Login Diperlukan',
      message,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Masuk',
          onPress: () => {
            navigation.navigate('Login');
            // If callback is provided, execute it after navigation
            // Note: This will only work if user successfully logs in
            // You might want to use a navigation listener instead
            if (callback) {
              // Store callback to be executed after login
              // This is a simple approach; you might want a more robust solution
              setTimeout(() => {
                // This is a workaround - ideally use React Navigation state management
                callback();
              }, 500);
            }
          },
        },
      ],
      { cancelable: true }
    );
    return false;
  }

  // User is authenticated, execute callback if provided
  if (callback) {
    callback();
  }
  return true;
};

/**
 * Check if user is authenticated (simple check without prompt)
 * @returns Promise<boolean> - true if user is authenticated
 */
export const checkAuth = async (): Promise<boolean> => {
  return await isLoggedIn();
};

/**
 * Ensure user is authenticated and has completed KYC verification
 * @param navigation Navigation object
 * @param callback Function executed if user passes all checks
 * @param loginMessage Message shown when login required
 * @param kycMessage Message shown when KYC is required
 */
export const requireKyc = async (
  navigation: any,
  callback?: () => void,
  loginMessage: string = 'Fitur ini memerlukan login terlebih dahulu',
  kycMessage: string = 'Fitur ini memerlukan verifikasi KYC (KTP). Silakan lengkapi data Anda di profil.'
): Promise<boolean> => {
  const authenticated = await requireAuth(navigation, undefined, loginMessage);

  if (!authenticated) {
    return false;
  }

  const userData = await getUserData();
  const kycStatus = getKycStatus(userData);

  if (kycStatus === 'waiting') {
    Alert.alert(
      'Menunggu Persetujuan Admin',
      'Data KYC Anda sudah dikirim dan sedang menunggu persetujuan admin. Mohon tunggu hingga proses verifikasi selesai.',
      [{ text: 'OK' }]
    );
    return false;
  }

  if (kycStatus === 'rejected') {
    const reason = userData?.kycRejectionReason;
    Alert.alert(
      'Verifikasi KYC Ditolak',
      reason
        ? `Pengajuan KYC Anda ditolak: ${reason}. Silakan ajukan ulang.`
        : 'Pengajuan KYC Anda ditolak oleh admin. Silakan ajukan ulang.',
      [
        {
          text: 'Nanti',
          style: 'cancel',
        },
        {
          text: 'Ajukan Ulang',
          onPress: () => navigation.navigate('LengkapiKYC'),
        },
      ]
    );
    return false;
  }

  if (kycStatus !== 'approved') {
    Alert.alert('Verifikasi KYC Diperlukan', kycMessage, [
      {
        text: 'Nanti',
        style: 'cancel',
      },
      {
        text: 'Lengkapi Sekarang',
        onPress: () => navigation.navigate('LengkapiKYC'),
      },
    ]);
    return false;
  }

  if (callback) {
    callback();
  }

  return true;
};

