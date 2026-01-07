import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';

interface NotificationProps {
  navigation: any;
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

export default function Notification({ navigation }: NotificationProps) {
  const [displayLimit, setDisplayLimit] = useState(5);

  // Sample notification data
  const allNotifications: NotificationItem[] = [
    {
      id: 1,
      title: 'Kampanye Baru Dimulai',
      message: 'Aksi sosialisasi Asta Cita telah dimulai di wilayah Jakarta. Bergabunglah dalam kegiatan ini untuk mendukung visi Presiden Prabowo.',
      time: '2 jam yang lalu',
      type: 'info',
      read: false,
      category: 'Kampanye',
    },
    {
      id: 2,
      title: 'Pencapaian Baru!',
      message: 'Selamat! Anda telah mencapai 150 jam kegiatan relawan. Teruskan kontribusi Anda untuk Indonesia yang lebih baik.',
      time: '5 jam yang lalu',
      type: 'success',
      read: false,
      category: 'Pencapaian',
    },
    {
      id: 3,
      title: 'Undangan Rapat Koordinasi',
      message: 'Rapat koordinasi PBI akan dilaksanakan hari Minggu pukul 10:00 WIB di kantor pusat. Kehadiran wajib.',
      time: '1 hari yang lalu',
      type: 'warning',
      read: true,
      category: 'Rapat',
    },
    {
      id: 4,
      title: 'Update Program Sosialisasi',
      message: 'Program sosialisasi Asta Cita telah diperluas ke 10 kota besar di Indonesia. Lihat jadwal lengkap di aplikasi.',
      time: '2 hari yang lalu',
      type: 'info',
      read: true,
      category: 'Program',
    },
    {
      id: 5,
      title: 'Badge Relawan Aktif',
      message: 'Anda telah menerima badge "Relawan Aktif" atas kontribusi luar biasa dalam kegiatan kampanye.',
      time: '3 hari yang lalu',
      type: 'success',
      read: true,
      category: 'Penghargaan',
    },
    {
      id: 6,
      title: 'Penting: Perubahan Jadwal',
      message: 'Kegiatan door-to-door campaign di wilayah Surabaya diundur hingga minggu depan karena cuaca buruk.',
      time: '4 hari yang lalu',
      type: 'warning',
      read: true,
      category: 'Jadwal',
    },
    {
      id: 7,
      title: 'Kontribusi Anda Berarti',
      message: 'Terima kasih atas partisipasi Anda dalam kampanye digital. Kontribusi Anda telah menjangkau 1,200 orang.',
      time: '5 hari yang lalu',
      type: 'success',
      read: true,
      category: 'Kontribusi',
    },
    {
      id: 8,
      title: 'Pembaruan Sistem',
      message: 'Aplikasi PBI telah diperbarui dengan fitur baru untuk memudahkan koordinasi antar relawan.',
      time: '1 minggu yang lalu',
      type: 'info',
      read: true,
      category: 'Sistem',
    },
    {
      id: 9,
      title: 'Target Kampanye Tercapai',
      message: 'Selamat! Target sosialisasi di wilayah Anda telah tercapai 100%. Teruskan kerja keras Anda!',
      time: '1 minggu yang lalu',
      type: 'success',
      read: true,
      category: 'Target',
    },
    {
      id: 10,
      title: 'Evaluasi Kegiatan',
      message: 'Laporan evaluasi kegiatan bulan September telah tersedia. Silakan akses melalui menu laporan.',
      time: '2 minggu yang lalu',
      type: 'info',
      read: true,
      category: 'Evaluasi',
    },
  ];

  const displayedNotifications = allNotifications.slice(0, displayLimit);
  const hasMoreNotifications = allNotifications.length > displayLimit;

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

  const renderNotification = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={{
        backgroundColor: item.read ? COLOR.WHITE : '#E3F2FD',
        borderRadius: normalize(15),
        marginBottom: normalize(12),
        overflow: 'hidden',
        borderLeftWidth: normalize(4),
        borderLeftColor: getNotificationColor(item.type),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
      onPress={() => navigation.navigate('NotificationDetail', { notification: item })}
      activeOpacity={0.9}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: normalize(15),
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: normalize(40),
            height: normalize(40),
            borderRadius: normalize(20),
            backgroundColor: getNotificationColor(item.type),
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: normalize(12),
          }}
        >
          <Icon
            name={getNotificationIcon(item.type)}
            size={normalize(16)}
            color={COLOR.WHITE}
            solid
          />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: normalize(4) }}>
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: item.read ? 'normal' : 'bold',
                color: COLOR.PRIMARY,
                flex: 1,
                marginRight: normalize(8),
              }}
            >
              {item.title}
            </Text>
            {!item.read && (
              <View
                style={{
                  width: normalize(8),
                  height: normalize(8),
                  borderRadius: normalize(4),
                  backgroundColor: getNotificationColor(item.type),
                }}
              />
            )}
          </View>

          <Text
            style={{
              fontSize: normalize(12),
              color: COLOR.GRAY,
              lineHeight: normalize(16),
              marginBottom: normalize(6),
            }}
            numberOfLines={2}
          >
            {item.message}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="clock" size={normalize(10)} color={COLOR.GRAY} solid />
              <Text
                style={{
                  fontSize: normalize(10),
                  color: COLOR.GRAY,
                  marginLeft: normalize(4),
                }}
              >
                {item.time}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="tag" size={normalize(10)} color={COLOR.GRAY} solid />
              <Text
                style={{
                  fontSize: normalize(10),
                  color: COLOR.GRAY,
                  marginLeft: normalize(4),
                }}
              >
                {item.category}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    setDisplayLimit(prev => prev + 5);
  };

  const unreadCount = allNotifications.filter(n => !n.read).length;

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
          onPress={() => navigation.goBack()}
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

        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontSize: normalize(18),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
              marginBottom: normalize(4),
            }}
          >
            Notifikasi
          </Text>
          {unreadCount > 0 && (
            <View
              style={{
                backgroundColor: COLOR.DANGER,
                borderRadius: normalize(10),
                paddingHorizontal: normalize(8),
                paddingVertical: normalize(2),
              }}
            >
              <Text
                style={{
                  fontSize: normalize(10),
                  fontWeight: 'bold',
                  color: COLOR.WHITE,
                }}
              >
                {unreadCount} baru
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
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
            name="bars"
            size={normalize(16)}
            color={COLOR.SECONDARY}
            solid
          />
        </TouchableOpacity>
      </View>

      {/* Notification Summary */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: normalize(20),
          padding: normalize(15),
          backgroundColor: COLOR.WHITE,
          borderRadius: normalize(15),
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
          <Icon name="bell" size={normalize(20)} color={COLOR.PRIMARY} solid style={{ marginRight: normalize(10) }} />
          <View>
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
              }}
            >
              Total Notifikasi
            </Text>
            <Text
              style={{
                fontSize: normalize(12),
                color: COLOR.GRAY,
              }}
            >
              {allNotifications.length} notifikasi • {unreadCount} belum dibaca
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            paddingHorizontal: normalize(12),
            paddingVertical: normalize(6),
            backgroundColor: COLOR.PRIMARY,
            borderRadius: normalize(15),
          }}
          onPress={() => {
            // Mark all as read functionality
            Toast.show({
              type: 'success',
              text1: 'Semua Ditandai Dibaca',
              text2: 'Semua notifikasi telah ditandai sebagai dibaca',
              position: 'top',
            });
          }}
        >
          <Text
            style={{
              fontSize: normalize(12),
              fontWeight: 'bold',
              color: COLOR.SECONDARY,
            }}
          >
            Tandai Dibaca
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <View style={{ paddingHorizontal: normalize(20) }}>
        <FlatList
          data={displayedNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ListEmptyComponent={
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: normalize(50),
              }}
            >
              <Icon name="bell-slash" size={normalize(50)} color={COLOR.GRAY} solid />
              <Text
                style={{
                  fontSize: normalize(16),
                  color: COLOR.GRAY,
                  marginTop: normalize(15),
                  textAlign: 'center',
                }}
              >
                Belum ada notifikasi
              </Text>
              <Text
                style={{
                  fontSize: normalize(12),
                  color: COLOR.GRAY,
                  textAlign: 'center',
                  marginTop: normalize(5),
                }}
              >
                Notifikasi akan muncul di sini ketika ada update
              </Text>
            </View>
          }
        />

        {/* Load More Button */}
        {hasMoreNotifications && (
          <TouchableOpacity
            style={{
              backgroundColor: COLOR.PRIMARY,
              borderRadius: normalize(15),
              padding: normalize(15),
              alignItems: 'center',
              marginTop: normalize(10),
              marginBottom: normalize(20),
            }}
            onPress={handleLoadMore}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="chevron-down" size={normalize(16)} color={COLOR.SECONDARY} solid style={{ marginRight: normalize(8) }} />
              <Text
                style={{
                  fontSize: normalize(14),
                  fontWeight: 'bold',
                  color: COLOR.SECONDARY,
                }}
              >
                Lihat Lainnya ({allNotifications.length - displayLimit} tersisa)
              </Text>
            </View>
          </TouchableOpacity>
        )}
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
          PBI - Update & Informasi
        </Text>
      </View>
    </ScrollView>
  );
}
