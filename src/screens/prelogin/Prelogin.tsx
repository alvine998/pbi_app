import { View, Text, Image, TouchableOpacity, StatusBar, Dimensions, BackHandler } from 'react-native';
import React, { useEffect } from 'react';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';

const { width, height } = Dimensions.get('window');

interface PreloginProps {
  navigation: any;
}

export default function Prelogin({ navigation }: PreloginProps) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Prevent going back from Prelogin screen
        // Exit app instead
        BackHandler.exitApp();
        return true; // Prevent default behavior
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLOR.SECONDARY} />

      {/* Header with gradient background */}
      <View
        style={{
          height: height * 0.45,
          paddingTop: normalize(60),
          paddingHorizontal: normalize(20),
          alignItems: 'center',
        }}
      >
        {/* Logo and welcome text */}
        <View style={{ alignItems: 'center', marginTop: normalize(40) }}>
          <View
            style={{
              width: normalize(120),
              height: normalize(120),
              borderRadius: normalize(60),
              backgroundColor: COLOR.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: normalize(20),
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Image
              source={require('../../assets/images/logo2.png')}
              style={{
                width: normalize(150),
                height: normalize(150),
                borderRadius: normalize(40),
              }}
            />
          </View>

          <Text
            style={{
              fontSize: normalize(28),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
              textAlign: 'center',
              marginBottom: normalize(8),
            }}
          >
            Selamat Datang
          </Text>

          <Text
            style={{
              fontSize: normalize(16),
              color: COLOR.DARK_GRAY,
              textAlign: 'center',
              lineHeight: normalize(22),
            }}
          >
            Selamat Datang di Rumah Besar{'\n'}Perserikatan Baramuda Indonesia (PBI)
          </Text>
        </View>
      </View>

      {/* Bottom section with buttons */}
      <View
        style={{
          flex: 1,
          paddingHorizontal: normalize(24),
          paddingTop: normalize(40),
          paddingBottom: normalize(30),
        }}
      >
        {/* Login Button */}
        <TouchableOpacity
          style={{
            backgroundColor: COLOR.WHITE,
            paddingVertical: normalize(18),
            borderRadius: normalize(12),
            marginBottom: normalize(20),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            borderWidth: 1,
            borderColor: '#E5E5E5',
          }}
          onPress={() => navigation.navigate('Login')}
        >
          <Text
            style={{
              color: COLOR.PRIMARY,
              fontSize: normalize(16),
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Masuk
          </Text>
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
              backgroundColor: '#E5E5E5',
              flex: 1,
            }}
          />
          <Text
            style={{
              marginHorizontal: normalize(16),
              fontSize: normalize(14),
              color: '#666',
              fontWeight: '500',
            }}
          >
            atau
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: '#E5E5E5',
              flex: 1,
            }}
          />
        </View>

        {/* Register Button */}
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
          }}
          onPress={() => navigation.navigate('Register')}
        >
          <Text
            style={{
              color: COLOR.WHITE,
              fontSize: normalize(16),
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            Daftar Sekarang
          </Text>
        </TouchableOpacity>

        {/* Terms and Privacy */}
        <View style={{ marginTop: normalize(30), alignItems: 'center' }}>
          <Text
            style={{
              fontSize: normalize(12),
              color: '#666',
              textAlign: 'center',
              lineHeight: normalize(18),
            }}
          >
            Dengan melanjutkan, Anda menyetujui{'\n'}
            <Text style={{ color: COLOR.PRIMARY, fontWeight: '500' }}>
              Syarat & Ketentuan
            </Text>
            {' '}dan{' '}
            <Text style={{ color: COLOR.PRIMARY, fontWeight: '500' }}>
              Kebijakan Privasi
            </Text>
          </Text>
        </View>

        {/* Continue without login */}
        <View style={{ marginTop: normalize(30), alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainApp')}
            style={{ paddingVertical: normalize(10) }}
          >
            <Text
              style={{
                fontSize: normalize(14),
                color: COLOR.GRAY,
                textAlign: 'center',
                textDecorationLine: 'underline',
              }}
            >
              Lanjutkan sebagai tamu
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
