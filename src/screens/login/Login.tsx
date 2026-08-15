import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import normalize from 'react-native-normalize';
import { COLOR } from '../../utils/Color';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const { width, height } = Dimensions.get('window');

// Simple JWT decoder for React Native
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    let str = base64.replace(/=+$/, '');
    for (
      let bc = 0, bs = 0, buffer, idx = 0;
      (buffer = str.charAt(idx++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }
    return JSON.parse(output);
  } catch (e) {
    console.error('JWT Decode Error:', e);
    return null;
  }
};

export default function Login({ navigation }: { navigation: any }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { isLoading: authLoading, login } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Navigate to Prelogin instead of going back
        navigation.navigate('Prelogin');
        return true; // Prevent default behavior
      }
    );

    // Configure Google Sign-In with the web client ID from google-services.json
    GoogleSignin.configure({
      webClientId:
        '309321457545-6633urc5h02pne6j1ik3egfv5a2h7tbj.apps.googleusercontent.com',
    });

    return () => backHandler.remove();
  }, [navigation]);

  const handleGoogleLogin = async () => {
    console.log('[GoogleLogin] Starting Google Sign-In...');
    setIsLoading(true);
    try {
      // Check if Google Play Services is available
      const hasPlayServices = await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      console.log('[GoogleLogin] hasPlayServices:', hasPlayServices);

      const userInfo = await GoogleSignin.signIn();
      console.log('[GoogleLogin] signIn success, userInfo keys:', Object.keys(userInfo));
      console.log('[GoogleLogin] idToken:', userInfo.idToken ? 'PRESENT' : 'MISSING');
      console.log('[GoogleLogin] user:', JSON.stringify(userInfo.user, null, 2));
      console.log(
        '[GoogleLogin] serverAuthCode:',
        userInfo.serverAuthCode ? 'PRESENT' : 'MISSING'
      );

      const idToken = userInfo.idToken;
      if (!idToken) {
        throw new Error('No idToken returned from Google Sign-In');
      }

      // Send the ID token to the backend for verification + session creation
      console.log('[GoogleLogin] Sending idToken to backend /auth/google...');
      const response = await api.post('/auth/google', {
        idToken,
      });
      console.log('[GoogleLogin] Backend response status:', response.status);
      console.log(
        '[GoogleLogin] Backend response data:',
        JSON.stringify(response.data, null, 2)
      );

      // Same token/user extraction pattern as email login
      const responseData = response.data?.data || response.data;
      const token = responseData?.token || responseData?.accessToken;
      let user = responseData?.user;

      console.log('[GoogleLogin] Extracted Token:', token ? 'Found' : 'Not Found');
      console.log('[GoogleLogin] Extracted User:', user ? 'Found' : 'Not Found');

      if (token) {
        if (!user) {
          // Fallback user from Google profile
          user = {
            id: userInfo.user.id,
            email: userInfo.user.email,
            name: userInfo.user.name,
          };
        }
        await login({ user, token });
        console.log('[GoogleLogin] Auth data saved, login complete');
        Toast.show({
          type: 'success',
          text1: 'Login Berhasil',
          text2: 'Selamat datang kembali!',
        });
      } else {
        throw new Error('Google login response missing token');
      }
    } catch (error: any) {
      console.log('[GoogleLogin] ERROR:', JSON.stringify(error, null, 2));
      console.log('[GoogleLogin] Error message:', error?.message);
      console.log('[GoogleLogin] Error code:', error?.code);

      let errorMessage = 'Login Google gagal, coba lagi';

      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Login Google dibatalkan';
        console.log('[GoogleLogin] User cancelled sign-in');
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Login sedang berlangsung';
        console.log('[GoogleLogin] Sign-in already in progress');
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services tidak tersedia';
        console.log('[GoogleLogin] Play services not available');
      } else if (error?.response) {
        // Backend rejected the token
        console.log(
          '[GoogleLogin] Backend error status:',
          error.response.status,
          'data:',
          JSON.stringify(error.response.data)
        );
        const errData = error.response.data;
        errorMessage = errData?.message || 'Token Google ditolak server';
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email dan password harus diisi',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(
        '/auth/login',
        {
          email,
          password,
        }
      );
      console.log('Login successful:', response.data);

      console.log('Login successful, response data:', JSON.stringify(response.data, null, 2));

      // Extract token with fallbacks
      const responseData = response.data?.data || response.data;
      const token = responseData?.token || responseData?.accessToken;
      let user = responseData?.user;

      console.log('Extracted Token:', token ? 'Found' : 'Not Found');
      console.log('Extracted User initial:', user ? 'Found' : 'Not Found');

      if (token) {
        // If user is missing, try to fetch it using information from token
        if (!user) {
          console.log('User data missing from login response, attempting to fetch profile...');
          const payload = decodeJwt(token);

          if (payload && payload.id) {
            try {
              // Temporarily set token for the profile request
              const profileRes = await api.get(`/users/${payload.id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              const profileData = profileRes.data?.data || profileRes.data;
              if (profileData) {
                user = profileData;
                console.log('Successfully fetched user profile after login');
              } else {
                throw new Error('Profile response empty');
              }
            } catch (profileError) {
              console.error('Error fetching user profile after login:', profileError);
              // Construct a skeleton user if fetching fails
              user = {
                id: payload.id,
                email: payload.email || email,
                name: payload.name || email.split('@')[0],
              };
            }
          } else {
            // Skeleton if decode fails
            user = { id: 0, email, name: email.split('@')[0] };
          }
        }

        // Final safety check to ensure user is never undefined
        if (!user) {
          user = { id: 0, email, name: email.split('@')[0] };
        }

        const authData = {
          user,
          token,
        };

        // Save to AuthContext (which handles AsyncStorage)
        try {
          await login(authData);
          console.log('Auth data updated in context');
        } catch (storageError) {
          console.error('Error updating login status:', storageError);
          Toast.show({
            type: 'error',
            text1: 'Warning',
            text2: 'Gagal memperbarui status login',
            position: 'top',
          });
        }
      } else {
        throw new Error('Login response missing token');
      }

      Toast.show({
        type: 'success',
        text1: 'Login Berhasil',
        text2: 'Selamat datang kembali!',
      });

      // No need for navigation.navigate('MainApp') here if AppNavigator 
      // is conditionally rendering based on isAuthenticated
      setIsLoading(false);
    } catch (error: any) {
      console.log('Login error:', error);

      // Extract error message from API response
      let errorMessage = 'Login gagal, coba lagi';

      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const errorData = error.response.data;

        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData && errorData.error) {
          errorMessage = errorData.error;
        } else if (status === 400) {
          errorMessage = 'Email atau password tidak valid';
        } else if (status === 401) {
          errorMessage = 'Email atau password salah';
        } else if (status === 404) {
          errorMessage = 'Pengguna tidak ditemukan';
        } else if (status === 500) {
          errorMessage = 'Server error, coba lagi nanti';
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Tidak dapat terhubung ke server';
      }

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'top',
      });
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.PRIMARY }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header with gradient */}
      <View
        style={{
          backgroundColor: COLOR.PRIMARY,
          paddingTop: normalize(50),
          paddingBottom: normalize(0),
          paddingHorizontal: normalize(20),
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: normalize(20),
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: normalize(40),
              height: normalize(40),
              borderRadius: normalize(20),
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: normalize(15),
            }}
          >
            <Icon
              solid
              name="chevron-left"
              size={normalize(18)}
              color={COLOR.WHITE}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: normalize(24),
              fontWeight: 'bold',
              color: COLOR.WHITE,
            }}
          >
            Masuk
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: normalize(30),
          marginTop: normalize(40),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Form Container */}
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            marginHorizontal: normalize(20),
            marginTop: normalize(-20),
            borderRadius: normalize(16),
            padding: normalize(24),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Email Input */}
          <View style={{ marginBottom: normalize(20) }}>
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: '600',
                color: '#333',
                marginBottom: normalize(8),
              }}
            >
              Email
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: normalize(12),
                paddingHorizontal: normalize(16),
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
            >
              <Icon
                name="envelope"
                size={normalize(16)}
                color="#666"
                solid
                style={{ marginRight: normalize(12) }}
              />
              <TextInput
                placeholder="Masukkan email Anda"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  flex: 1,
                  fontSize: normalize(16),
                  color: '#333',
                  paddingVertical: normalize(16),
                }}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: normalize(20) }}>
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: '600',
                color: '#333',
                marginBottom: normalize(8),
              }}
            >
              Password
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: normalize(12),
                paddingHorizontal: normalize(16),
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
            >
              <Icon
                name="lock"
                size={normalize(16)}
                color="#666"
                solid
                style={{ marginRight: normalize(12) }}
              />
              <TextInput
                placeholder="Masukkan password Anda"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isVisible}
                style={{
                  flex: 1,
                  fontSize: normalize(16),
                  color: '#333',
                  paddingVertical: normalize(16),
                }}
              />
              <TouchableOpacity
                onPress={() => setIsVisible(!isVisible)}
                style={{ padding: normalize(4) }}
              >
                <Icon
                  name={isVisible ? 'eye' : 'eye-slash'}
                  size={normalize(16)}
                  color="#666"
                  solid
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              marginBottom: normalize(30),
            }}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: '600',
                color: COLOR.PRIMARY,
              }}
            >
              Lupa Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={{
              backgroundColor: COLOR.PRIMARY,
              paddingVertical: normalize(18),
              borderRadius: normalize(12),
              shadowColor: COLOR.PRIMARY,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
              opacity: isLoading ? 0.7 : 1,
            }}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isLoading && (
                <Icon
                  name="spinner"
                  size={normalize(16)}
                  color={COLOR.WHITE}
                  solid
                  style={{ marginRight: normalize(8) }}
                />
              )}
              <Text
                style={{
                  color: COLOR.WHITE,
                  fontSize: normalize(16),
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: normalize(20),
            }}
          >
            <View
              style={{
                height: 1,
                backgroundColor: '#e9ecef',
                flex: 1,
              }}
            />
            <Text
              style={{
                marginHorizontal: normalize(16),
                fontSize: normalize(14),
                color: '#999',
                fontWeight: '500',
              }}
            >
              atau
            </Text>
            <View
              style={{
                height: 1,
                backgroundColor: '#e9ecef',
                flex: 1,
              }}
            />
          </View>

          {/* Google Login Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              paddingVertical: normalize(16),
              borderRadius: normalize(12),
              borderWidth: 1,
              borderColor: '#e9ecef',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 3,
              opacity: isLoading ? 0.7 : 1,
            }}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <View
              style={{
                width: normalize(20),
                height: normalize(20),
                borderRadius: normalize(10),
                backgroundColor: '#4285F4',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(10),
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: normalize(13),
                  fontWeight: '700',
                }}
              >
                G
              </Text>
            </View>
            <Text
              style={{
                color: '#333',
                fontSize: normalize(16),
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              Masuk dengan Google
            </Text>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: normalize(30),
            paddingHorizontal: normalize(20),
          }}
        >
          <Text
            style={{
              fontSize: normalize(14),
              color: COLOR.SECONDARY,
            }}
          >
            Belum punya akun?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: '600',
                color: COLOR.WHITE,
              }}
            >
              Daftar Sekarang
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
