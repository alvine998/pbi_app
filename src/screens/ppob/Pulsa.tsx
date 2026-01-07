import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLOR } from '../../utils/Color';

interface PulsaPackage {
  id: string;
  label: string;
  price: string;
  value: number;
}

const PULSA_PACKAGES: PulsaPackage[] = [
  { id: 'p-10', label: 'Pulsa 10K', price: 'Rp10.500', value: 10000 },
  { id: 'p-20', label: 'Pulsa 20K', price: 'Rp20.500', value: 20000 },
  { id: 'p-50', label: 'Pulsa 50K', price: 'Rp50.500', value: 50000 },
  { id: 'p-100', label: 'Pulsa 100K', price: 'Rp100.500', value: 100000 },
  { id: 'p-150', label: 'Pulsa 150K', price: 'Rp150.500', value: 150000 },
  { id: 'p-200', label: 'Pulsa 200K', price: 'Rp200.500', value: 200000 },
];

interface PulsaProps {
  navigation: any;
}

export default function Pulsa({ navigation }: PulsaProps) {
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [selectedPackage, setSelectedPackage] = React.useState<PulsaPackage | null>(null);

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.WHITE, paddingTop: insets.top }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: normalize(32) + insets.bottom }}
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
            Beli Pulsa
          </Text>
          <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, lineHeight: normalize(20) }}>
            Isi ulang pulsa prabayar semua operator hanya dalam beberapa langkah.
          </Text>
        </View>

        {/* Phone Input */}
        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <Text style={{ fontSize: normalize(14), color: COLOR.PRIMARY, fontWeight: '700', marginBottom: normalize(10) }}>
            Nomor Handphone
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLOR.SECONDARY,
              borderRadius: normalize(16),
              paddingHorizontal: normalize(16),
              paddingVertical: normalize(10),
            }}
          >
            <Icon name="mobile-alt" size={normalize(18)} color={COLOR.PRIMARY} solid style={{ marginRight: normalize(12) }} />
            <TextInput
              placeholder="Contoh: 0812 3456 7890"
              placeholderTextColor={COLOR.GRAY}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={{ flex: 1, fontSize: normalize(16), color: COLOR.PRIMARY }}
            />
            {phoneNumber.length > 0 && (
              <TouchableOpacity onPress={() => setPhoneNumber('')}>
                <Icon name="times-circle" size={normalize(18)} color={COLOR.GRAY} solid />
              </TouchableOpacity>
            )}
          </View>
          <Text style={{ fontSize: normalize(12), color: COLOR.GRAY, marginTop: normalize(6) }}>
            Pastikan nomor tujuan sudah benar sebelum melanjutkan pembayaran.
          </Text>
        </View>

        {/* Package Selection */}
        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(28) }}>
          <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(14) }}>
            Pilih Nominal Pulsa
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {PULSA_PACKAGES.map((pkg) => {
              const selected = selectedPackage?.id === pkg.id;
              return (
                <TouchableOpacity
                  key={pkg.id}
                  onPress={() => setSelectedPackage(pkg)}
                  style={{
                    width: '47%',
                    borderWidth: 1.5,
                    borderColor: selected ? COLOR.PRIMARY : COLOR.SECONDARY,
                    backgroundColor: selected ? COLOR.PRIMARY : COLOR.WHITE,
                    borderRadius: normalize(18),
                    paddingVertical: normalize(16),
                    paddingHorizontal: normalize(16),
                    marginBottom: normalize(14),
                  }}
                  activeOpacity={0.85}
                >
                  <Text
                    style={{
                      fontSize: normalize(14),
                      fontWeight: '700',
                      color: selected ? COLOR.SECONDARY : COLOR.PRIMARY,
                      marginBottom: normalize(4),
                    }}
                  >
                    {pkg.label}
                  </Text>
                  <Text
                    style={{
                      fontSize: normalize(12),
                      color: selected ? '#f7ebe2' : COLOR.DARK_GRAY,
                    }}
                  >
                    {pkg.price}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Summary & CTA */}
        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(12) }}>
          <View
            style={{
              backgroundColor: COLOR.SECONDARY,
              borderRadius: normalize(20),
              padding: normalize(18),
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(10) }}>
              <Text style={{ fontSize: normalize(14), color: COLOR.PRIMARY, fontWeight: '600' }}>Nomor Tujuan</Text>
              <Text style={{ fontSize: normalize(14), color: COLOR.PRIMARY, fontWeight: '700' }}>
                {phoneNumber.length > 0 ? phoneNumber : '-'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(10) }}>
              <Text style={{ fontSize: normalize(14), color: COLOR.PRIMARY, fontWeight: '600' }}>Produk</Text>
              <Text style={{ fontSize: normalize(14), color: COLOR.PRIMARY, fontWeight: '700' }}>
                {selectedPackage ? selectedPackage.label : '-'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: normalize(14), color: COLOR.PRIMARY, fontWeight: '600' }}>Total Bayar</Text>
              <Text style={{ fontSize: normalize(16), color: COLOR.PRIMARY, fontWeight: '700' }}>
                {selectedPackage ? selectedPackage.price : 'Rp0'}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              backgroundColor: selectedPackage && phoneNumber.length >= 8 ? COLOR.PRIMARY : COLOR.GRAY,
              paddingVertical: normalize(16),
              borderRadius: normalize(20),
              alignItems: 'center',
            }}
            disabled={!selectedPackage || phoneNumber.length < 8}
          >
            <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.SECONDARY }}>Lanjutkan Pembayaran</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: normalize(12), color: COLOR.GRAY, marginTop: normalize(10), lineHeight: normalize(18) }}>
            Dengan melanjutkan, Anda menyetujui syarat & ketentuan transaksi PPOB PBI. Bukti pembayaran akan dikirim melalui email terdaftar.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}


