import { View, Text, Image, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import React, { useState } from 'react';
import normalize from 'react-native-normalize';
import { COLOR } from '../../utils/Color';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';

interface ForgotPasswordProps {
  navigation: any;
}

export default function ForgotPassword({ navigation }: ForgotPasswordProps) {
  const [email, setEmail] = useState<string>('');

  const handleSendOTP = () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Email Harus Diisi',
        position: 'top',
      });
      return;
    }

    if (!email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: 'Email Tidak Valid',
        position: 'top',
      });
      return;
    }

    // Here you would typically send OTP to the email
    Toast.show({
      type: 'success',
      text1: 'Kode OTP Dikirim',
      text2: 'Silakan periksa email Anda',
      position: 'top',
    });

    // Navigate back to login after sending OTP
    navigation.navigate('Login');
  };

  return (
    <View
      style={{
        flex: 1,
        padding: normalize(20),
        backgroundColor: COLOR.PRIMARY,
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLOR.PRIMARY} />
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: normalize(20),
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            solid
            name="chevron-left"
            size={normalize(20)}
            color={COLOR.WHITE}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: normalize(20),
            fontWeight: 'bold',
            color: COLOR.WHITE,
          }}
        >
          Lupa Password
        </Text>
        <View style={{ width: normalize(20) }} />
      </View>

      <View style={{ marginTop: normalize(20) }}>
        <Text style={{ fontSize: normalize(16), textAlign: 'justify', color: COLOR.SECONDARY }}>
          Masukkan alamat email anda untuk mendapatkan kode OTP dan melakukan
          reset password
        </Text>
      </View>

      {/* Form */}
      <View style={{ marginTop: normalize(20) }}>
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(10),
            marginTop: normalize(10),
            paddingHorizontal: normalize(10),
            paddingLeft: normalize(20),
          }}
        >
          <TextInput
            placeholder="Email"
            placeholderTextColor={COLOR.GRAY}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
              fontSize: normalize(20),
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: COLOR.SECONDARY,
          padding: normalize(20),
          borderRadius: normalize(10),
          marginTop: normalize(20),
          width: '100%',
        }}
        onPress={handleSendOTP}
      >
        <Text
          style={{
            color: COLOR.PRIMARY,
            fontSize: normalize(16),
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Kirim
        </Text>
      </TouchableOpacity>
    </View>
  );
}
