import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLOR } from '../../utils/Color';
import { requireKyc } from '../../utils/authGuard';

const FEATURE_SHORTCUTS = [
  {
    id: 'forum',
    title: 'Forum Diskusi',
    description: 'Ruang thread untuk berdiskusi dengan komunitas.',
    icon: 'comments',
    route: 'ForumDiskusi',
  },
  {
    id: 'polling',
    title: 'Polling & Survey',
    description: 'Kirim suara Anda untuk program terbaru.',
    icon: 'poll',
    route: 'PollingSurvey',
  },
  {
    id: 'event',
    title: 'Acara & Webinar',
    description: 'Ikuti kegiatan online/offline terbaru.',
    icon: 'calendar-check',
    route: 'Event',
  },
  {
    id: 'volunteer',
    title: 'Volunteer',
    description: 'Daftar untuk kegiatan sosial PBI.',
    icon: 'hands-helping',
    route: 'Volunteer',
  },
];

const COMMUNITY_POSTS = [
  {
    id: '1',
    author: 'Bambang S',
    time: '2 jam lalu',
    content: 'Terima kasih tim PBI! Event pelatihan marketing sangat membantu UMKM kami meningkatkan penjualan.',
    likes: 24,
    comments: 4,
  },
  {
    id: '2',
    author: 'Lina P',
    time: '5 jam lalu',
    content: 'Halo semua, ada yang berminat kolaborasi untuk program literasi keuangan di sekolah minggu depan?',
    likes: 18,
    comments: 7,
  },
];

const UPCOMING_SESSIONS = [
  { id: 'a', title: 'Town Hall Komunitas', date: 'Rabu, 19 Maret 2025', time: '19.00 WIB', medium: 'Zoom Meeting' },
  { id: 'b', title: 'Sesi Q&A Founder', date: 'Jumat, 28 Maret 2025', time: '20.00 WIB', medium: 'Instagram Live' },
];

export default function InteractionMenu({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.WHITE, paddingTop: insets.top, paddingBottom: normalize(24) + insets.bottom }}>
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
            Ruang Interaksi
          </Text>
          <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, lineHeight: normalize(20) }}>
            Terhubung dengan komunitas PBI: forum, kegiatan, dan kolaborasi terbaru untuk Anda.
          </Text>
        </View>

        {/* Shortcut Cards */}
        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <Text style={{ fontSize: normalize(18), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(16) }}>
            Pilihan Cepat
          </Text>

          {FEATURE_SHORTCUTS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                backgroundColor: COLOR.WHITE,
                borderRadius: normalize(18),
                padding: normalize(16),
                marginBottom: normalize(14),
                borderWidth: 1,
                borderColor: COLOR.SECONDARY,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              activeOpacity={0.85}
              onPress={item.route ? () => {
                if (item.id === 'volunteer' || item.id === 'polling') {
                  requireKyc(navigation, () => navigation.navigate(item.route));
                } else {
                  navigation.navigate(item.route);
                }
              } : undefined}
            >
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
                <Icon name={item.icon} size={normalize(18)} color={COLOR.SECONDARY} solid />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY }}>{item.title}</Text>
                <Text style={{ fontSize: normalize(12), color: COLOR.GRAY, marginTop: normalize(6) }}>{item.description}</Text>
              </View>
              <Icon name="chevron-right" size={normalize(14)} color={COLOR.PRIMARY} solid />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


