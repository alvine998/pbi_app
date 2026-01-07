import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLOR } from '../../utils/Color';
import { requireKyc } from '../../utils/authGuard';

const EMERGENCY_SERVICES = [
  {
    id: 'call-center',
    title: 'Call Center PBI',
    description: 'Terhubung langsung dengan tim tanggap darurat PBI untuk penanganan cepat.',
    icon: 'phone-alt',
    color: '#FF6B6B',
    action: () => Linking.openURL('tel:088293477465'),
    actionLabel: 'Hubungi',
  },
  {
    id: 'chat',
    title: 'Live Chat',
    description: 'Dapatkan bantuan melalui chat 24/7 langsung dengan petugas kami.',
    icon: 'comments',
    color: '#1A73E8',
    action: (navigation: any) => requireKyc(navigation, () => navigation.navigate('SOSLiveChat')),
    actionLabel: 'Mulai Chat',
  },
  {
    id: 'wa',
    title: 'WhatsApp Resmi',
    description: 'Terhubung lewat WhatsApp untuk respons cepat mengenai keadaan darurat.',
    icon: 'whatsapp',
    color: '#25D366',
    action: () => Linking.openURL('https://wa.me/6288293477465'),
    actionLabel: 'Buka WhatsApp',
  },
];

const EMERGENCY_GUIDES = [
  {
    id: 'medical',
    title: 'Pertolongan Pertama',
    steps: [
      'Tetap tenang dan hubungi petugas medis.',
      'Pastikan lokasi aman sebelum membantu korban.',
      'Gunakan perlengkapan P3K yang tersedia di lokasi.',
    ],
    icon: 'briefcase-medical',
  },
  {
    id: 'disaster',
    title: 'Keadaan Darurat Bencana',
    steps: [
      'Ikuti jalur evakuasi yang telah ditetapkan.',
      'Hubungi koordinator lapangan PBI terdekat.',
      'Gunakan alat komunikasi cadangan jika jaringan terputus.',
    ],
    icon: 'sign-out-alt',
  },
];

export default function SOS({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();

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
            Bantuan Darurat
          </Text>
          <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, lineHeight: normalize(20) }}>
            Gunakan menu ini untuk menghubungi tim PBI dalam keadaan darurat atau mengikuti panduan keselamatan.
          </Text>
        </View>

        {/* Emergency Services */}
        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <Text style={{ fontSize: normalize(18), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(16) }}>
            Layanan Darurat
          </Text>

          {EMERGENCY_SERVICES.map((service) => (
            <View
              key={service.id}
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
            >
              <View
                style={{
                  width: normalize(48),
                  height: normalize(48),
                  borderRadius: normalize(24),
                  backgroundColor: service.color,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: normalize(14),
                }}
              >
                <Icon name={service.icon as string} size={normalize(20)} color={COLOR.WHITE} solid />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY }}>{service.title}</Text>
                <Text style={{ fontSize: normalize(12), color: COLOR.GRAY, marginTop: normalize(6), lineHeight: normalize(18) }}>
                  {service.description}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => service.action(navigation)}
                activeOpacity={0.85}
                style={{
                  backgroundColor: service.color,
                  paddingHorizontal: normalize(18),
                  paddingVertical: normalize(10),
                  borderRadius: normalize(16),
                }}
              >
                <Text style={{ color: COLOR.WHITE, fontWeight: '700', fontSize: normalize(12) }}>{service.actionLabel}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Emergency Guides */}
        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(16) }}>
          <Text style={{ fontSize: normalize(18), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(16) }}>
            Panduan Keselamatan
          </Text>

          {EMERGENCY_GUIDES.map((guide) => (
            <View
              key={guide.id}
              style={{
                backgroundColor: COLOR.SECONDARY,
                borderRadius: normalize(18),
                padding: normalize(16),
                marginBottom: normalize(14),
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(12) }}>
                <View
                  style={{
                    width: normalize(42),
                    height: normalize(42),
                    borderRadius: normalize(21),
                    backgroundColor: COLOR.PRIMARY,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: normalize(12),
                  }}
                >
                  <Icon name={guide.icon} size={normalize(18)} color={COLOR.SECONDARY} solid />
                </View>
                <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY }}>{guide.title}</Text>
              </View>

              {guide.steps.map((step, index) => (
                <View key={`${guide.id}-${index}`} style={{ flexDirection: 'row', marginBottom: normalize(6) }}>
                  <Text style={{ width: normalize(20), color: COLOR.PRIMARY, fontWeight: '700' }}>{index + 1}.</Text>
                  <Text style={{ flex: 1, color: COLOR.PRIMARY, fontSize: normalize(12), lineHeight: normalize(18) }}>{step}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Quick Tips */}
        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(16), paddingBottom: normalize(24) }}>
          <Text style={{ fontSize: normalize(18), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(12) }}>
            Tips Cepat Keadaan Darurat
          </Text>
          <View
            style={{
              backgroundColor: COLOR.WHITE,
              borderRadius: normalize(18),
              padding: normalize(16),
              borderWidth: 1,
              borderColor: COLOR.SECONDARY,
            }}
          >
            <Text style={{ color: COLOR.PRIMARY, fontSize: normalize(12), lineHeight: normalize(18) }}>
              - Aktifkan lokasi real-time di perangkat Anda agar tim kami dapat menemukan Anda dengan cepat.{'\n'}
              - Simpan nomor penting PBI pada kontak favorit Anda.{'\n'}
              - Periksa secara berkala perlengkapan P3K dan alat keselamatan di rumah atau kantor Anda.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


