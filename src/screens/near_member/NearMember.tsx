import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, PermissionsAndroid, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLOR } from '../../utils/Color';
import Geolocation from 'react-native-geolocation-service';
import Toast from 'react-native-toast-message';

const NEARBY_MEMBERS = [
  { id: 1, name: 'Rizky Pratama', distance: '450 m', interests: ['Logistik', 'Volunteer'], status: 'Aktif', lat: -6.2088, lng: 106.8456 },
  { id: 2, name: 'Siti Andini', distance: '820 m', interests: ['UMKM', 'Pelatihan'], status: 'Sedang Online', lat: -6.2100, lng: 106.8470 },
  { id: 3, name: 'Ahmad Fauzi', distance: '1.2 km', interests: ['Pertanian', 'Koperasi'], status: 'Aktif', lat: -6.2120, lng: 106.8490 },
  { id: 4, name: 'Maria Fransisca', distance: '1.8 km', interests: ['Kesenian', 'Event Sosial'], status: 'Sedang Offline', lat: -6.2150, lng: 106.8520 },
];

const COMMUNITY_ACTIVITIES = [
  { id: '1', title: 'Kelas UMKM: Branding Produk', date: 'Sabtu, 22 Maret 2025', location: 'Kecamatan Sukmajaya' },
  { id: '2', title: 'Donor Darah Komunitas', date: 'Minggu, 30 Maret 2025', location: 'RSUD Depok' },
];

export default function NearMember({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Izin Lokasi',
            message: 'Aplikasi memerlukan akses lokasi untuk menemukan anggota terdekat',
            buttonNeutral: 'Tanya Nanti',
            buttonNegative: 'Tolak',
            buttonPositive: 'Izinkan',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS handles permissions differently
  };

  const handleEnableLocation = async () => {
    setIsLoadingLocation(true);

    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      Alert.alert(
        'Izin Ditolak',
        'Aplikasi memerlukan izin lokasi untuk menemukan anggota terdekat',
        [{ text: 'OK' }]
      );
      setIsLoadingLocation(false);
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setLocationEnabled(true);
        setIsLoadingLocation(false);

        Toast.show({
          type: 'success',
          text1: 'Lokasi Diaktifkan',
          text2: 'Menampilkan anggota terdekat dari lokasi Anda',
          position: 'top',
        });
      },
      (error) => {
        console.error(error);
        Alert.alert(
          'Gagal Mendapatkan Lokasi',
          'Pastikan GPS Anda aktif dan coba lagi',
          [{ text: 'OK' }]
        );
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.WHITE, paddingTop: insets.top }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: normalize(24) + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingTop: normalize(28),
            paddingBottom: normalize(24),
            backgroundColor: COLOR.SECONDARY,
            borderBottomLeftRadius: normalize(24),
            borderBottomRightRadius: normalize(24),
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: normalize(42),
              height: normalize(42),
              borderRadius: normalize(21),
              backgroundColor: COLOR.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: normalize(20),
            }}
          >
            <Icon name="arrow-left" size={normalize(16)} color={COLOR.SECONDARY} solid />
          </TouchableOpacity>

          <Text style={{ fontSize: normalize(24), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(6) }}>
            Anggota di Sekitarmu
          </Text>
          <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, lineHeight: normalize(20) }}>
            Temukan dan jalin kolaborasi dengan anggota PBI yang berada dekat dengan lokasi Anda.
          </Text>
        </View>

        {/* Map Preview */}
        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <View
            style={{
              height: normalize(180),
              borderRadius: normalize(20),
              backgroundColor: '#f1e4d5',
              padding: normalize(16),
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: normalize(48),
                  height: normalize(48),
                  borderRadius: normalize(24),
                  backgroundColor: COLOR.PRIMARY,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: normalize(12),
                }}
              >
                <Icon name="map-marker-alt" size={normalize(20)} color={COLOR.SECONDARY} solid />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: COLOR.PRIMARY, fontSize: normalize(16), fontWeight: '700' }}>Radar Komunitas</Text>
                <Text style={{ color: COLOR.PRIMARY, fontSize: normalize(12), marginTop: normalize(6), lineHeight: normalize(18) }}>
                  Sistem sedang memindai anggota aktif di radius 5 km dari lokasi Anda.
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: COLOR.WHITE,
                borderRadius: normalize(16),
                paddingHorizontal: normalize(12),
                paddingVertical: normalize(10),
              }}
            >
              <Icon
                name={locationEnabled ? "check-circle" : "location-arrow"}
                size={normalize(14)}
                color={locationEnabled ? COLOR.SUCCESS : COLOR.PRIMARY}
                solid
              />
              <Text style={{ flex: 1, marginLeft: normalize(10), color: COLOR.PRIMARY, fontSize: normalize(12) }}>
                {locationEnabled
                  ? 'Lokasi real-time aktif. Menampilkan jarak akurat ke anggota terdekat.'
                  : 'Lokasi Anda masih menggunakan data terakhir. Aktifkan lokasi real-time untuk hasil lebih akurat.'}
              </Text>
            </View>
            {!locationEnabled && (
              <TouchableOpacity
                activeOpacity={0.85}
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: isLoadingLocation ? '#9AA6A6' : COLOR.PRIMARY,
                  paddingHorizontal: normalize(20),
                  paddingVertical: normalize(10),
                  borderRadius: normalize(20),
                }}
                onPress={handleEnableLocation}
                disabled={isLoadingLocation}
              >
                <Text style={{ color: COLOR.SECONDARY, fontWeight: '700' }}>
                  {isLoadingLocation ? 'Mengaktifkan...' : 'Aktifkan Lokasi Saya'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Member List */}
        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(16) }}>
            <Text style={{ fontSize: normalize(18), fontWeight: '700', color: COLOR.PRIMARY }}>Anggota Terdekat</Text>
            <TouchableOpacity>
              <Text style={{ fontSize: normalize(12), color: COLOR.PRIMARY }}>Lihat semua</Text>
            </TouchableOpacity>
          </View>

          {NEARBY_MEMBERS.map((member) => {
            const displayDistance = locationEnabled && currentLocation
              ? calculateDistance(currentLocation.latitude, currentLocation.longitude, member.lat, member.lng)
              : member.distance;

            return (
              <View
                key={member.id}
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderRadius: normalize(18),
                  padding: normalize(16),
                  marginBottom: normalize(14),
                  borderWidth: 1,
                  borderColor: COLOR.SECONDARY,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(8) }}>
                  <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY }}>{member.name}</Text>
                  <Text style={{ fontSize: normalize(12), color: COLOR.PRIMARY }}>{displayDistance}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(8) }}>
                  <Icon name="circle" size={normalize(8)} color={member.status.includes('Online') ? '#34C759' : '#FFA200'} solid />
                  <Text style={{ marginLeft: normalize(6), color: COLOR.GRAY, fontSize: normalize(12) }}>{member.status}</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {member.interests.map((interest) => (
                    <View
                      key={interest}
                      style={{
                        backgroundColor: COLOR.SECONDARY,
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(6),
                        borderRadius: normalize(16),
                        marginRight: normalize(8),
                        marginBottom: normalize(8),
                      }}
                    >
                      <Text style={{ fontSize: normalize(11), color: COLOR.PRIMARY, fontWeight: '600' }}>{interest}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={{
                    marginTop: normalize(12),
                    backgroundColor: COLOR.PRIMARY,
                    paddingVertical: normalize(10),
                    borderRadius: normalize(16),
                    alignItems: 'center',
                  }}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('Chat', { userName: member.name, userStatus: member.status })}
                >
                  <Text style={{ color: COLOR.SECONDARY, fontWeight: '700' }}>Hubungi</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Community Activities */}
        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(10) }}>
          <Text style={{ fontSize: normalize(18), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(16) }}>
            Kegiatan Komunitas Terdekat
          </Text>

          {COMMUNITY_ACTIVITIES.map((activity) => (
            <View
              key={activity.id}
              style={{
                backgroundColor: COLOR.SECONDARY,
                borderRadius: normalize(18),
                padding: normalize(16),
                marginBottom: normalize(14),
              }}
            >
              <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(6) }}>
                {activity.title}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(4) }}>
                <Icon name="calendar-alt" size={normalize(12)} color={COLOR.PRIMARY} solid />
                <Text style={{ marginLeft: normalize(8), color: COLOR.PRIMARY, fontSize: normalize(12) }}>{activity.date}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(8) }}>
                <Icon name="map-marker-alt" size={normalize(12)} color={COLOR.PRIMARY} solid />
                <Text style={{ marginLeft: normalize(8), color: COLOR.PRIMARY, fontSize: normalize(12) }}>{activity.location}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.85}
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: COLOR.PRIMARY,
                  paddingHorizontal: normalize(18),
                  paddingVertical: normalize(10),
                  borderRadius: normalize(16),
                }}
              >
                <Text style={{ color: COLOR.SECONDARY, fontWeight: '700' }}>Daftar Sekarang</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


