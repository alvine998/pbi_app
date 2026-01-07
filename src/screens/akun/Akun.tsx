import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { clearAuthData } from '../../services/storage';
import { useAuth } from '../../hooks/useAuth';

interface AkunProps {
  navigation: any;
}

export default function Akun({ navigation }: AkunProps) {
  const { isAuthenticated, user } = useAuth();

  const displayName = isAuthenticated && user?.name ? user.name : 'Tamu';
  const displayEmail = isAuthenticated && user?.email ? user.email : '-';
  const displayPhone = isAuthenticated && (user as any)?.phone ? (user as any).phone : '-';
  const joinDateISO = isAuthenticated && (user as any)?.createdAt ? (user as any).createdAt : undefined;
  const displayJoinDate = joinDateISO
    ? new Date(joinDateISO).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    : '-';
  const avatarUri = undefined as string | undefined; // Placeholder if you later add avatar in profile

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: COLOR.WHITE,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          paddingTop: normalize(50),
          paddingBottom: normalize(20),
          backgroundColor: COLOR.SECONDARY,
          borderBottomLeftRadius: normalize(20),
          borderBottomRightRadius: normalize(20),
        }}
      >
        <Text
          style={{
            fontSize: normalize(24),
            fontWeight: 'bold',
            color: COLOR.PRIMARY,
            textAlign: 'center',
          }}
        >
          Akun Saya
        </Text>
      </View>

      {/* Profile Section */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          paddingVertical: normalize(30),
        }}
      >
        {!isAuthenticated && (
          <View
            style={{
              backgroundColor: COLOR.SECONDARY,
              borderRadius: normalize(12),
              padding: normalize(14),
              marginBottom: normalize(16),
            }}
          >
            <Text
              style={{
                fontSize: normalize(13),
                color: COLOR.PRIMARY,
                marginBottom: normalize(8),
              }}
            >
              Anda belum masuk. Masuk untuk mengakses semua fitur.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{
                backgroundColor: COLOR.PRIMARY,
                alignSelf: 'flex-start',
                paddingVertical: normalize(10),
                paddingHorizontal: normalize(16),
                borderRadius: normalize(20),
              }}
            >
              <Text
                style={{ color: COLOR.WHITE, fontWeight: '600', fontSize: normalize(12) }}
              >
                Masuk
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Profile Card */}
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(20),
            padding: normalize(20),
            marginBottom: normalize(20),
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: normalize(20),
            }}
          >
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={{
                  width: normalize(80),
                  height: normalize(80),
                  borderRadius: normalize(40),
                  marginRight: normalize(15),
                }}
              />
            ) : (
              <View
                style={{
                  width: normalize(80),
                  height: normalize(80),
                  borderRadius: normalize(40),
                  marginRight: normalize(15),
                  backgroundColor: COLOR.PRIMARY,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: COLOR.WHITE, fontSize: normalize(22), fontWeight: '700' }}>
                  {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: normalize(20),
                  fontWeight: 'bold',
                  color: COLOR.PRIMARY,
                  marginBottom: normalize(4),
                }}
              >
                {displayName}
              </Text>
              <Text
                style={{
                  fontSize: normalize(14),
                  color: COLOR.GRAY,
                  marginBottom: normalize(2),
                }}
              >
                {displayEmail}
              </Text>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: COLOR.GRAY,
                }}
              >
                {displayPhone !== '-' ? displayPhone + ' • ' : ''}Bergabung {displayJoinDate}
              </Text>
            </View>
          </View>

          {isAuthenticated && (
            <TouchableOpacity
              style={{
                backgroundColor: COLOR.PRIMARY,
                paddingVertical: normalize(12),
                paddingHorizontal: normalize(20),
                borderRadius: normalize(25),
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text
                style={{
                  fontSize: normalize(14),
                  fontWeight: 'bold',
                  color: COLOR.WHITE,
                }}
              >
                Edit Profil
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Menu Items */}
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(16),
            padding: normalize(20),
            marginBottom: normalize(16),
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >

          {/* <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: normalize(15),
              borderBottomWidth: 1,
              borderBottomColor: '#F0F0F0',
            }}
          >
            <View
              style={{
                width: normalize(40),
                height: normalize(40),
                backgroundColor: '#FECA57',
                borderRadius: normalize(20),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(15),
              }}
            >
              <Icon
                name="cog"
                size={normalize(18)}
                color={COLOR.WHITE}
                solid
              />
            </View>
            <Text
              style={{
                fontSize: normalize(16),
                color: COLOR.PRIMARY,
                flex: 1,
              }}
            >
              Pengaturan
            </Text>
            <Icon
              name="chevron-right"
              size={normalize(14)}
              color={COLOR.GRAY}
              solid
            />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: normalize(15),
              borderBottomWidth: 1,
              borderBottomColor: '#F0F0F0',
            }}
            onPress={() => navigation.navigate('NotificationSettings')}
          >
            <View
              style={{
                width: normalize(40),
                height: normalize(40),
                backgroundColor: '#96CEB4',
                borderRadius: normalize(20),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(15),
              }}
            >
              <Icon
                name="bell"
                size={normalize(18)}
                color={COLOR.WHITE}
                solid
              />
            </View>
            <Text
              style={{
                fontSize: normalize(16),
                color: COLOR.PRIMARY,
                flex: 1,
              }}
            >
              Notifikasi
            </Text>
            <Icon
              name="chevron-right"
              size={normalize(14)}
              color={COLOR.GRAY}
              solid
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: normalize(15),
              borderBottomWidth: 1,
              borderBottomColor: '#F0F0F0',
            }}
            onPress={() => navigation.navigate('TransactionHistory')}
          >
            <View
              style={{
                width: normalize(40),
                height: normalize(40),
                backgroundColor: '#FF6B35',
                borderRadius: normalize(20),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(15),
              }}
            >
              <Icon
                name="receipt"
                size={normalize(18)}
                color={COLOR.WHITE}
                solid
              />
            </View>
            <Text
              style={{
                fontSize: normalize(16),
                color: COLOR.PRIMARY,
                flex: 1,
              }}
            >
              Riwayat Transaksi
            </Text>
            <Icon
              name="chevron-right"
              size={normalize(14)}
              color={COLOR.GRAY}
              solid
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: normalize(15),
            }}
            onPress={() => navigation.navigate('Bantuan')}
          >
            <View
              style={{
                width: normalize(40),
                height: normalize(40),
                backgroundColor: '#DDA0DD',
                borderRadius: normalize(20),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(15),
              }}
            >
              <Icon
                name="question-circle"
                size={normalize(18)}
                color={COLOR.WHITE}
                solid
              />
            </View>
            <Text
              style={{
                fontSize: normalize(16),
                color: COLOR.PRIMARY,
                flex: 1,
              }}
            >
              Bantuan
            </Text>
            <Icon
              name="chevron-right"
              size={normalize(14)}
              color={COLOR.GRAY}
              solid
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#FF6B6B',
            paddingVertical: normalize(15),
            paddingHorizontal: normalize(20),
            borderRadius: normalize(25),
            alignItems: 'center',
            marginTop: normalize(20),
          }}
          onPress={async () => {
            try {
              await clearAuthData();
            } catch { }
            navigation.reset({
              index: 0,
              routes: [{ name: 'Prelogin' }],
            });
          }}
        >
          <Text
            style={{
              fontSize: normalize(16),
              fontWeight: 'bold',
              color: COLOR.WHITE,
            }}
          >
            Keluar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
