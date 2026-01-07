import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface ProfileProps {
  navigation: any;
}

interface MenuItem {
  id: number;
  title: string;
  subtitle?: string;
  icon: string;
  action: () => void;
  color?: string;
}

export default function Profile({ navigation }: ProfileProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [editPayload, setEditPayload] = useState<{ name: string; email: string; phone: string }>({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user?.id) return;
      try {
        setLoading(true);
        const response = await api.get(`/users/${user.id}`);
        setProfile(response.data?.data || null);
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Gagal memuat profil',
          text2: 'Silakan coba lagi',
          position: 'top',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user?.id]);

  // Initialize edit form values when entering edit mode or when profile changes
  useEffect(() => {
    if (isEditMode) {
      setEditPayload({
        name: (profile?.name ?? '').toString(),
        email: (profile?.email ?? '').toString(),
        phone: (profile?.phone ?? '').toString(),
      });
    }
  }, [isEditMode, profile]);

  // Default user profile data (will be overridden by API data if available)
  const baseUserProfile = {
    name: 'Admin User',
    email: 'admin@pbi.com',
    phone: '+62 812 3456 7890',
    joinDate: 'Oktober 2024',
    location: 'Jakarta, Indonesia',
    bio: 'Relawan aktif PBI yang berkomitmen untuk kemajuan Indonesia melalui dukungan penuh terhadap visi Asta Cita Presiden Prabowo Subianto.',
    avatar: 'https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=AU',
    level: 'Bronze',
    points: 1250,
    achievements: 8,
    volunteerHours: 156,
  };

  const userProfile = {
    ...baseUserProfile,
    name: profile?.name ?? baseUserProfile.name,
    email: profile?.email ?? baseUserProfile.email,
    phone: profile?.phone ?? baseUserProfile.phone,
    joinDate: profile?.createdAt
      ? new Date(profile.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      : baseUserProfile.joinDate,
  };

  const onSaveProfile = async () => {
    if (!user?.id) return;
    // simple validation
    if (!editPayload.name || !editPayload.email) {
      Toast.show({ type: 'error', text1: 'Nama dan email wajib diisi', position: 'top' });
      return;
    }
    try {
      setSaving(true);
      const res = await api.put(`/users/${user.id}`, editPayload);
      const updated = res.data?.data || editPayload;
      setProfile((prev: any) => ({ ...(prev || {}), ...updated }));
      Toast.show({ type: 'success', text1: 'Profil diperbarui', position: 'top' });
      setIsEditMode(false);
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Gagal menyimpan', text2: 'Coba lagi nanti', position: 'top' });
    } finally {
      setSaving(false);
    }
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

        <Text
          style={{
            fontSize: normalize(18),
            fontWeight: 'bold',
            color: COLOR.PRIMARY,
          }}
        >
          Profil Saya
        </Text>

        <TouchableOpacity
          onPress={() => setIsEditMode(true)}
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
            name="pencil-alt"
            size={normalize(16)}
            color={COLOR.SECONDARY}
            solid
          />
        </TouchableOpacity>
      </View>

      {/* Profile Header Card */}
      <View
        style={{
          margin: normalize(20),
          backgroundColor: COLOR.WHITE,
          borderRadius: normalize(20),
          padding: normalize(25),
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
        {/* Profile Picture and Basic Info */}
        <View style={{ alignItems: 'center', marginBottom: normalize(25) }}>
          <View
            style={{
              width: normalize(100),
              height: normalize(100),
              borderRadius: normalize(50),
              backgroundColor: COLOR.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: normalize(15),
              borderWidth: 3,
              borderColor: COLOR.SECONDARY,
            }}
          >
            <Image
              source={{ uri: userProfile.avatar }}
              style={{
                width: normalize(90),
                height: normalize(90),
                borderRadius: normalize(45),
              }}
            />
          </View>

          <Text
            style={{
              fontSize: normalize(20),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
              marginBottom: normalize(5),
            }}
          >
            {userProfile.name}
          </Text>

          <Text
            style={{
              fontSize: normalize(14),
              color: COLOR.GRAY,
              textAlign: 'center',
            }}
          >
            {userProfile.email}
          </Text>

          {/* KYC Status Badge */}
          <View style={{ marginTop: normalize(10) }}>
            {profile?.isKycVerified ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLOR.SUCCESS + '20',
                  paddingHorizontal: normalize(12),
                  paddingVertical: normalize(6),
                  borderRadius: normalize(12),
                }}
              >
                <Icon name="check-circle" size={normalize(14)} color={COLOR.SUCCESS} solid />
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '600',
                    color: COLOR.SUCCESS,
                    marginLeft: normalize(6),
                  }}
                >
                  KYC Terverifikasi
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFA500' + '20',
                  paddingHorizontal: normalize(12),
                  paddingVertical: normalize(6),
                  borderRadius: normalize(12),
                }}
                onPress={() => navigation.navigate('KYCVerification')}
              >
                <Icon name="exclamation-circle" size={normalize(14)} color="#FFA500" solid />
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '600',
                    color: '#FFA500',
                    marginLeft: normalize(6),
                  }}
                >
                  Verifikasi KYC
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Profile Details */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          marginBottom: normalize(20),
        }}
      >
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(15),
            padding: normalize(20),
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
          <Text
            style={{
              fontSize: normalize(16),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
              marginBottom: normalize(15),
            }}
          >
            Informasi Profil
          </Text>

          <View style={{ marginBottom: normalize(15) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(8) }}>
              <Icon name="phone" size={normalize(16)} color={COLOR.PRIMARY} solid style={{ marginRight: normalize(12), width: normalize(20) }} />
              <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, flex: 1 }}>
                {userProfile.phone}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(8) }}>
              <Icon name="map-marker-alt" size={normalize(16)} color={COLOR.PRIMARY} solid style={{ marginRight: normalize(12), width: normalize(20) }} />
              <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, flex: 1 }}>
                {userProfile.location}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="calendar-alt" size={normalize(16)} color={COLOR.PRIMARY} solid style={{ marginRight: normalize(12), width: normalize(20) }} />
              <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, flex: 1 }}>
                Bergabung sejak {userProfile.joinDate}
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: normalize(12),
              backgroundColor: '#F8F9FA',
              borderRadius: normalize(10),
            }}
          >
            <Text
              style={{
                fontSize: normalize(12),
                color: COLOR.DARK_GRAY,
                lineHeight: normalize(18),
                textAlign: 'justify',
              }}
            >
              {userProfile.bio}
            </Text>
          </View>
        </View>
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
          PBI - Profil Relawan
        </Text>
      </View>

      {/* Edit Modal */}
      <Modal visible={isEditMode} transparent animationType="fade" onRequestClose={() => setIsEditMode(false)}>
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
              borderRadius: normalize(16),
              padding: normalize(20),
            }}
          >
            <Text
              style={{
                fontSize: normalize(18),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
                marginBottom: normalize(16),
              }}
            >
              Edit Profil
            </Text>

            {/* Name */}
            <Text style={{ fontSize: normalize(12), color: COLOR.DARK_GRAY, marginBottom: normalize(6) }}>Nama</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: normalize(10),
                marginBottom: normalize(12),
                paddingHorizontal: normalize(12),
              }}
            >
              <TextInput
                value={editPayload.name}
                onChangeText={(v) => setEditPayload((p) => ({ ...p, name: v }))}
                placeholder="Nama lengkap"
                style={{ height: normalize(44), fontSize: normalize(14), color: COLOR.DARK_GRAY }}
              />
            </View>

            {/* Email */}
            <Text style={{ fontSize: normalize(12), color: COLOR.DARK_GRAY, marginBottom: normalize(6) }}>Email</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: normalize(10),
                marginBottom: normalize(12),
                paddingHorizontal: normalize(12),
              }}
            >
              <TextInput
                value={editPayload.email}
                onChangeText={(v) => setEditPayload((p) => ({ ...p, email: v }))}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ height: normalize(44), fontSize: normalize(14), color: COLOR.DARK_GRAY }}
              />
            </View>

            {/* Phone */}
            <Text style={{ fontSize: normalize(12), color: COLOR.DARK_GRAY, marginBottom: normalize(6) }}>Nomor Telepon</Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                borderRadius: normalize(10),
                marginBottom: normalize(16),
                paddingHorizontal: normalize(12),
              }}
            >
              <TextInput
                value={editPayload.phone}
                onChangeText={(v) => setEditPayload((p) => ({ ...p, phone: v }))}
                placeholder="Nomor telepon"
                keyboardType="phone-pad"
                style={{ height: normalize(44), fontSize: normalize(14), color: COLOR.DARK_GRAY }}
              />
            </View>

            {/* Actions */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => setIsEditMode(false)}
                style={{
                  paddingVertical: normalize(12),
                  paddingHorizontal: normalize(16),
                  borderRadius: normalize(10),
                  backgroundColor: '#EAEAEA',
                  marginRight: normalize(10),
                }}
              >
                <Text style={{ color: COLOR.DARK_GRAY, fontWeight: '600' }}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSaveProfile}
                disabled={saving}
                style={{
                  paddingVertical: normalize(12),
                  paddingHorizontal: normalize(16),
                  borderRadius: normalize(10),
                  backgroundColor: saving ? '#9AA6A6' : COLOR.PRIMARY,
                }}
              >
                <Text style={{ color: COLOR.SECONDARY, fontWeight: '600' }}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
