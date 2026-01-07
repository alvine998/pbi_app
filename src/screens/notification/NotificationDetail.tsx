import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface NotificationDetailProps {
  navigation: any;
  route: any;
}

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  category: string;
}

export default function NotificationDetail({
  navigation,
  route,
}: NotificationDetailProps) {
  const { notification } = route.params || {};

  // Default notification if none provided
  const defaultNotification: NotificationItem = {
    id: 1,
    title: 'Kampanye Baru Dimulai',
    message:
      'Aksi sosialisasi Asta Cita telah dimulai di wilayah Jakarta. Bergabunglah dalam kegiatan ini untuk mendukung visi Presiden Prabowo.',
    time: '2 jam yang lalu',
    type: 'info',
    read: false,
    category: 'Kampanye',
  };

  const currentNotification = notification || defaultNotification;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'warning':
        return 'exclamation-triangle';
      case 'error':
        return 'times-circle';
      default:
        return 'info-circle';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return COLOR.SUCCESS;
      case 'warning':
        return COLOR.WARNING;
      case 'error':
        return COLOR.DANGER;
      default:
        return COLOR.INFO;
    }
  };

  const renderActionButtons = () => {
    if (currentNotification.category === 'Kampanye') {
      return (
        <View
          style={{
            flexDirection: 'row',
            marginTop: normalize(20),
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: COLOR.PRIMARY,
              borderRadius: normalize(10),
              padding: normalize(15),
              marginRight: normalize(10),
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: 'bold',
                color: COLOR.SECONDARY,
              }}
            >
              Bergabung Kampanye
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: COLOR.WHITE,
              borderWidth: 2,
              borderColor: COLOR.PRIMARY,
              borderRadius: normalize(10),
              padding: normalize(15),
              marginLeft: normalize(10),
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
              }}
            >
              Bagikan
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (currentNotification.category === 'Pencapaian') {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: COLOR.PRIMARY,
            borderRadius: normalize(10),
            padding: normalize(15),
            marginTop: normalize(20),
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: normalize(14),
              fontWeight: 'bold',
              color: COLOR.SECONDARY,
            }}
          >
            Lihat Semua Pencapaian
          </Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: normalize(20),
          paddingTop: normalize(50),
          paddingBottom: normalize(20),
          backgroundColor: COLOR.SECONDARY,
          borderBottomLeftRadius: normalize(20),
          borderBottomRightRadius: normalize(20),
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('Notification')}
          style={{
            width: normalize(40),
            height: normalize(40),
            borderRadius: normalize(20),
            backgroundColor: COLOR.PRIMARY,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon
            name="arrow-left"
            size={normalize(16)}
            color={COLOR.SECONDARY}
            solid
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: normalize(18),
            fontWeight: 'bold',
            color: COLOR.PRIMARY,
          }}
        >
          Detail Notifikasi
        </Text>

        <View style={{ width: normalize(40) }} />
      </View>

      {/* Notification Detail Card */}
      <View
        style={{
          margin: normalize(20),
          backgroundColor: COLOR.WHITE,
          borderRadius: normalize(20),
          overflow: 'hidden',
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: normalize(20),
            borderBottomWidth: 1,
            borderBottomColor: '#E5E5E5',
          }}
        >
          <View
            style={{
              width: normalize(50),
              height: normalize(50),
              borderRadius: normalize(25),
              backgroundColor: getNotificationColor(currentNotification.type),
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: normalize(15),
            }}
          >
            <Icon
              name={getNotificationIcon(currentNotification.type)}
              size={normalize(24)}
              color={COLOR.WHITE}
              solid
            />
          </View>

          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: normalize(4),
              }}
            >
              <Text
                style={{
                  fontSize: normalize(12),
                  color: COLOR.GRAY,
                  marginRight: normalize(8),
                }}
              >
                {currentNotification.category}
              </Text>
              <View
                style={{
                  width: normalize(6),
                  height: normalize(6),
                  borderRadius: normalize(3),
                  backgroundColor: getNotificationColor(
                    currentNotification.type,
                  ),
                }}
              />
            </View>
            <Text
              style={{
                fontSize: normalize(12),
                color: COLOR.GRAY,
              }}
            >
              {currentNotification.time}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={{ padding: normalize(20) }}>
          <Text
            style={{
              fontSize: normalize(20),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
              marginBottom: normalize(15),
            }}
          >
            {currentNotification.title}
          </Text>

          <Text
            style={{
              fontSize: normalize(14),
              color: COLOR.DARK_GRAY,
              lineHeight: normalize(24),
              textAlign: 'justify',
            }}
          >
            {currentNotification.message}
          </Text>

          {/* Action Buttons */}
          {renderActionButtons()}
        </View>
      </View>

      {/* Related Notifications */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          marginBottom: normalize(20),
        }}
      >
        <Text
          style={{
            fontSize: normalize(16),
            fontWeight: 'bold',
            color: COLOR.PRIMARY,
            marginBottom: normalize(15),
          }}
        >
          Notifikasi Terkait
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(15),
            padding: normalize(15),
            marginBottom: normalize(10),
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: normalize(40),
                height: normalize(40),
                borderRadius: normalize(20),
                backgroundColor: COLOR.SUCCESS,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(12),
              }}
            >
              <Icon
                name="check-circle"
                size={normalize(16)}
                color={COLOR.WHITE}
                solid
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: normalize(14),
                  fontWeight: 'bold',
                  color: COLOR.PRIMARY,
                  marginBottom: normalize(4),
                }}
              >
                Pencapaian Baru!
              </Text>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: COLOR.GRAY,
                }}
              >
                5 jam yang lalu • Pencapaian
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(15),
            padding: normalize(15),
            marginBottom: normalize(10),
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: normalize(40),
                height: normalize(40),
                borderRadius: normalize(20),
                backgroundColor: COLOR.INFO,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(12),
              }}
            >
              <Icon
                name="info-circle"
                size={normalize(16)}
                color={COLOR.WHITE}
                solid
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: normalize(14),
                  fontWeight: 'bold',
                  color: COLOR.PRIMARY,
                  marginBottom: normalize(4),
                }}
              >
                Update Program Sosialisasi
              </Text>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: COLOR.GRAY,
                }}
              >
                2 hari yang lalu • Program
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View
        style={{
          padding: normalize(20),
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: normalize(12),
            color: COLOR.GRAY,
            textAlign: 'center',
          }}
        >
          PBI - Detail Notifikasi
        </Text>
      </View>
    </ScrollView>
  );
}
