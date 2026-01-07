import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import normalize from 'react-native-normalize';
import { COLOR } from '../../utils/Color';
import Toast from 'react-native-toast-message';

const VOLUNTEER_PROGRAMS = [
  {
    id: 'vol-1',
    title: 'Relawan Tanggap Cepat',
    description: 'Bantu tim lapangan mendistribusikan logistik dan koordinasi warga.',
    quota: '20 relawan',
    location: 'Jakarta Timur',
    schedule: 'Setiap Sabtu, 08.00 - 15.00 WIB',
  },
  {
    id: 'vol-2',
    title: 'Mentor UMKM Lokal',
    description: 'Dampingi pelaku UMKM dalam digitalisasi dan pemasaran produk.',
    quota: '15 relawan',
    location: 'Hybrid (Online & Onsite)',
    schedule: 'Rabu & Jumat malam',
  },
  {
    id: 'vol-3',
    title: 'Sahabat Sekolah',
    description: 'Fasilitasi kelas kreatif dan literasi teknologi untuk siswa SMP.',
    quota: '25 relawan',
    location: 'Kota Bandung',
    schedule: '10-12 April 2025',
  },
];

const REQUIREMENTS = [
  'Minimal usia 18 tahun dan bersedia mengikuti kode etik PBI.',
  'Memiliki komitmen minimal 1 bulan untuk program berjalan.',
  'Mengikuti sesi onboarding dan briefing bersama koordinator relawan.',
];

export default function Volunteer({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const [selectedProgram, setSelectedProgram] = React.useState<(typeof VOLUNTEER_PROGRAMS)[number] | null>(null);
  const [isModalVisible, setModalVisible] = React.useState(false);

  const handleApply = (program: (typeof VOLUNTEER_PROGRAMS)[number]) => {
    setSelectedProgram(program);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    if (selectedProgram) {
      Toast.show({
        type: 'success',
        text1: 'Permohonan dikirim',
        text2: `Tim kami akan menghubungi Anda untuk ${selectedProgram.title}.`,
        position: 'top',
      });
    }
    setModalVisible(false);
    setSelectedProgram(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.WHITE, paddingTop: insets.top }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: normalize(32) + insets.bottom }}
      >
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
            Volunteer PBI
          </Text>
          <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, lineHeight: normalize(20) }}>
            Pilih program yang sesuai dengan passion Anda dan jadilah bagian dari perubahan positif di komunitas.
          </Text>
        </View>

        {/* <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <View
            style={{
              backgroundColor: COLOR.PRIMARY,
              borderRadius: normalize(18),
              padding: normalize(18),
              marginBottom: normalize(20),
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: normalize(48),
                height: normalize(48),
                borderRadius: normalize(24),
                backgroundColor: '#7D2441',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(12),
              }}
            >
              <Icon name="hands-helping" size={normalize(20)} color={COLOR.SECONDARY} solid />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLOR.SECONDARY, fontWeight: '700', fontSize: normalize(15), marginBottom: normalize(4) }}>
                Belum pernah ikut?
              </Text>
              <Text style={{ color: '#f8d1c6', fontSize: normalize(12) }}>
                Sesi briefing daring tersedia setiap Senin, 19.30 WIB.
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: COLOR.SECONDARY,
                paddingHorizontal: normalize(16),
                paddingVertical: normalize(10),
                borderRadius: normalize(14),
              }}
            >
              <Text style={{ color: COLOR.PRIMARY, fontWeight: '700', fontSize: normalize(12) }}>Daftar</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        <View style={{ paddingHorizontal: normalize(20), marginTop: normalize(24) }}>
          <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(14) }}>
            Program Aktif
          </Text>

          {VOLUNTEER_PROGRAMS.map((program) => (
            <View
              key={program.id}
              style={{
                backgroundColor: COLOR.WHITE,
                borderRadius: normalize(18),
                borderWidth: 1,
                borderColor: COLOR.SECONDARY,
                padding: normalize(16),
                marginBottom: normalize(14),
              }}
            >
              <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(6) }}>
                {program.title}
              </Text>
              <Text style={{ fontSize: normalize(13), color: COLOR.DARK_GRAY, lineHeight: normalize(20), marginBottom: normalize(10) }}>
                {program.description}
              </Text>

              <View style={{ marginBottom: normalize(8), flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="users" size={normalize(12)} color={COLOR.PRIMARY} solid />
                <Text style={{ marginLeft: normalize(8), color: COLOR.PRIMARY, fontSize: normalize(12) }}>{program.quota}</Text>
              </View>
              <View style={{ marginBottom: normalize(8), flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="map-marker-alt" size={normalize(12)} color={COLOR.PRIMARY} solid />
                <Text style={{ marginLeft: normalize(8), color: COLOR.PRIMARY, fontSize: normalize(12) }}>{program.location}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="clock" size={normalize(12)} color={COLOR.PRIMARY} solid />
                <Text style={{ marginLeft: normalize(8), color: COLOR.PRIMARY, fontSize: normalize(12) }}>{program.schedule}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                style={{
                  marginTop: normalize(14),
                  backgroundColor: COLOR.PRIMARY,
                  paddingVertical: normalize(12),
                  borderRadius: normalize(16),
                  alignItems: 'center',
                }}
                onPress={() => handleApply(program)}
              >
                <Text style={{ color: COLOR.SECONDARY, fontWeight: '700' }}>Ajukan Sebagai Relawan</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(10) }}>
          <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(14) }}>
            Persyaratan Umum
          </Text>

          <View
            style={{
              backgroundColor: COLOR.SECONDARY,
              borderRadius: normalize(18),
              padding: normalize(16),
            }}
          >
            {REQUIREMENTS.map((item, index) => (
              <View key={`req-${index}`} style={{ flexDirection: 'row', marginBottom: normalize(10) }}>
                <Icon name="check-circle" size={normalize(14)} color={COLOR.PRIMARY} solid style={{ marginRight: normalize(10), marginTop: normalize(2) }} />
                <Text style={{ flex: 1, color: COLOR.PRIMARY, fontSize: normalize(13), lineHeight: normalize(20) }}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal transparent visible={isModalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: normalize(20),
          }}
        >
          <View
            style={{
              width: '100%',
              backgroundColor: COLOR.WHITE,
              borderRadius: normalize(20),
              padding: normalize(20),
            }}
          >
            <Text style={{ fontSize: normalize(18), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(6) }}>
              Konfirmasi Pengajuan
            </Text>
            <Text style={{ fontSize: normalize(13), color: COLOR.DARK_GRAY, marginBottom: normalize(16), lineHeight: normalize(20) }}>
              Pastikan Anda siap mengikuti jadwal dan komitmen program berikut.
            </Text>
            {selectedProgram && (
              <View
                style={{
                  backgroundColor: COLOR.SECONDARY,
                  borderRadius: normalize(16),
                  padding: normalize(14),
                  marginBottom: normalize(16),
                }}
              >
                <Text style={{ fontSize: normalize(15), fontWeight: '700', color: COLOR.PRIMARY }}>{selectedProgram.title}</Text>
                <Text style={{ fontSize: normalize(12), color: COLOR.PRIMARY, marginTop: normalize(6) }}>{selectedProgram.location}</Text>
                <Text style={{ fontSize: normalize(12), color: COLOR.PRIMARY, marginTop: normalize(4) }}>{selectedProgram.schedule}</Text>
              </View>
            )}

            <Text style={{ fontSize: normalize(12), color: COLOR.GRAY, marginBottom: normalize(16) }}>
              Dengan melanjutkan, data Anda akan dikirim ke koordinator relawan untuk proses seleksi.
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedProgram(null);
                }}
                style={{
                  flex: 1,
                  borderWidth: 1.5,
                  borderColor: COLOR.PRIMARY,
                  borderRadius: normalize(16),
                  paddingVertical: normalize(12),
                  alignItems: 'center',
                  marginRight: normalize(10),
                }}
              >
                <Text style={{ color: COLOR.PRIMARY, fontWeight: '700' }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleConfirm}
                style={{
                  flex: 1,
                  backgroundColor: COLOR.PRIMARY,
                  borderRadius: normalize(16),
                  paddingVertical: normalize(12),
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: COLOR.SECONDARY, fontWeight: '700' }}>Kirim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


