import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { COLOR } from '../../utils/Color';
import api from '../../services/api';
import { updateUserData } from '../../services/storage';
import { getKycStatus, KycStatus } from '../../utils/kyc';
import { useAuth } from '../../hooks/useAuth';

interface LengkapiKYCProps {
  navigation: any;
}

type Gender = 'L' | 'P' | '';

export default function LengkapiKYC({ navigation }: LengkapiKYCProps) {
  const insets = useSafeAreaInsets();
  const { user, refreshAuth } = useAuth();

  const [nik, setNik] = useState('');
  const [fullName, setFullName] = useState(user?.name || '');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');

  const [ktpImage, setKtpImage] = useState<Asset | null>(null);
  const [selfieImage, setSelfieImage] = useState<Asset | null>(null);
  const [isScanningKtp, setIsScanningKtp] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycStatus, setKycStatus] = useState<KycStatus>(getKycStatus(user));
  const [rejectionReason, setRejectionReason] = useState<string | null>(
    user?.kycRejectionReason || null
  );
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const fetchMyKyc = useCallback(
    async (showLoader = true) => {
      if (showLoader) setIsLoadingStatus(true);
      try {
        const response = await api.get('/kyc/me');
        const data = response.data;
        if (!data) return;

        const nextStatus = getKycStatus(data);
        setKycStatus(nextStatus);
        setRejectionReason(data.kycRejectionReason || null);

        await updateUserData({
          kycStatus: data.kycStatus || nextStatus,
          isKycVerified: Boolean(data.isKycVerified),
          kycRejectionReason: data.kycRejectionReason || null,
        });
        await refreshAuth(true);
      } catch (error) {
        // Keep local cached state if offline or request fails
      } finally {
        setIsLoadingStatus(false);
      }
    },
    [refreshAuth]
  );

  useEffect(() => {
    fetchMyKyc(true);
  }, [fetchMyKyc]);

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Izin Kamera',
          message: 'Aplikasi memerlukan akses kamera untuk verifikasi KYC',
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
  };

  const handleImagePick = (type: 'ktp' | 'selfie') => {
    Alert.alert(
      'Pilih Sumber Foto',
      'Pilih metode pengambilan foto dokumen',
      [
        { text: 'Kamera', onPress: () => openCamera(type) },
        { text: 'Galeri', onPress: () => openGallery(type) },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const autofillFromKtp = (asset: Asset) => {
    setKtpImage(asset);
    setIsScanningKtp(true);

    // Simulate OCR extraction from front e-KTP photo
    setTimeout(() => {
      setNik((prev) => prev || '3174011508950002');
      setFullName((prev) => prev || user?.name || 'Budi Santoso');
      setBirthPlace((prev) => prev || 'Jakarta');
      setBirthDate((prev) => prev || '15/08/1995');
      setGender((prev) => prev || 'L');
      setAddress((prev) => prev || 'Jl. Kemang Raya No. 45, RT 004/RW 002, Kel. Bangka, Kec. Mampang Prapatan');
      setCity((prev) => prev || 'Jakarta Selatan');
      setProvince((prev) => prev || 'DKI Jakarta');

      setIsScanningKtp(false);
      setIsAutofilled(true);
      Toast.show({
        type: 'success',
        text1: 'Data e-KTP Terdeteksi',
        text2: 'Data identitas & alamat diisi otomatis. Mohon periksa kembali.',
        position: 'top',
      });
    }, 1000);
  };

  const openCamera = async (type: 'ktp' | 'selfie') => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Izin Ditolak',
        'Aplikasi memerlukan izin kamera untuk mengambil foto',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      cameraType: type === 'selfie' ? 'front' : 'back',
      saveToPhotos: false,
    });

    if (result.assets && result.assets.length > 0) {
      if (type === 'ktp') {
        autofillFromKtp(result.assets[0]);
      } else {
        setSelfieImage(result.assets[0]);
        Toast.show({
          type: 'success',
          text1: 'Foto Berhasil Diambil',
          text2: 'Foto selfie berhasil disimpan',
          position: 'top',
        });
      }
    }
  };

  const openGallery = async (type: 'ktp' | 'selfie') => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });

    if (result.assets && result.assets.length > 0) {
      if (type === 'ktp') {
        autofillFromKtp(result.assets[0]);
      } else {
        setSelfieImage(result.assets[0]);
        Toast.show({
          type: 'success',
          text1: 'Foto Berhasil Dipilih',
          text2: 'Foto selfie berhasil dipilih',
          position: 'top',
        });
      }
    }
  };

  const validateForm = (): string | null => {
    if (!/^\d{16}$/.test(nik.trim())) {
      return 'NIK harus terdiri dari 16 digit angka';
    }
    if (!fullName.trim()) {
      return 'Nama lengkap sesuai KTP wajib diisi';
    }
    if (!birthPlace.trim() || !birthDate.trim()) {
      return 'Tempat dan tanggal lahir wajib diisi';
    }
    if (!gender) {
      return 'Pilih jenis kelamin terlebih dahulu';
    }
    if (!address.trim() || !city.trim() || !province.trim()) {
      return 'Alamat lengkap, kota, dan provinsi wajib diisi';
    }
    if (!ktpImage) {
      return 'Mohon unggah foto KTP Anda';
    }
    if (!selfieImage) {
      return 'Mohon unggah foto selfie dengan KTP';
    }
    if (!agreed) {
      return 'Mohon setujui pernyataan kebenaran data';
    }
    return null;
  };

  const handleSubmit = async () => {
    if (kycStatus === 'waiting' || kycStatus === 'approved') {
      return;
    }

    const errorMsg = validateForm();
    if (errorMsg) {
      Toast.show({
        type: 'error',
        text1: 'Data Belum Lengkap',
        text2: errorMsg,
        position: 'top',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('nik', nik.trim());
      formData.append('fullName', fullName.trim());
      formData.append('birthPlace', birthPlace.trim());
      formData.append('birthDate', birthDate.trim());
      formData.append('gender', gender);
      formData.append('address', address.trim());
      formData.append('city', city.trim());
      formData.append('province', province.trim());

      if (ktpImage?.uri) {
        formData.append('ktpImage', {
          uri: ktpImage.uri,
          type: ktpImage.type || 'image/jpeg',
          name: ktpImage.fileName || `ktp-${Date.now()}.jpg`,
        } as any);
      }

      if (selfieImage?.uri) {
        formData.append('selfieImage', {
          uri: selfieImage.uri,
          type: selfieImage.type || 'image/jpeg',
          name: selfieImage.fileName || `selfie-${Date.now()}.jpg`,
        } as any);
      }

      const response = await api.post('/kyc/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = response.data?.user;
      await updateUserData({
        name: updatedUser?.name || fullName.trim(),
        kycStatus: updatedUser?.kycStatus || 'waiting',
        isKycVerified: Boolean(updatedUser?.isKycVerified),
        kycRejectionReason: null,
      });
      await refreshAuth(true);

      setKycStatus('waiting');
      setRejectionReason(null);

      Toast.show({
        type: 'success',
        text1: 'KYC Berhasil Dikirim',
        text2: 'Data KYC Anda sedang menunggu persetujuan admin',
        position: 'top',
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1200);
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message || 'Terjadi kesalahan, silakan coba lagi';
      Toast.show({
        type: 'error',
        text1: 'Gagal Mengirim Data',
        text2: serverMessage,
        position: 'top',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderUploadBox = (
    title: string,
    subtitle: string,
    image: Asset | null,
    iconName: string,
    type: 'ktp' | 'selfie'
  ) => (
    <View style={styles.uploadWrapper}>
      <Text style={styles.inputLabel}>{title}</Text>
      <Text style={styles.uploadSubtitle}>{subtitle}</Text>
      {image ? (
        <View>
          <Image
            source={{ uri: image.uri }}
            style={styles.previewImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => handleImagePick(type)}
          >
            <Icon name="camera" size={normalize(14)} color={COLOR.SECONDARY} solid />
            <Text style={styles.retakeButtonText}>Ganti Foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadPlaceholder}
          onPress={() => handleImagePick(type)}
        >
          <Icon name={iconName} size={normalize(32)} color={COLOR.PRIMARY} />
          <Text style={styles.uploadPlaceholderText}>Ketuk untuk Ambil / Pilih Foto</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={normalize(16)} color={COLOR.SECONDARY} solid />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {kycStatus === 'waiting' ? 'Status KYC' : 'Lengkapi KYC'}
        </Text>
        <View style={{ width: normalize(40) }} />
      </View>

      {kycStatus === 'waiting' ? (
        <ScrollView
          contentContainerStyle={[
            styles.waitingContainer,
            { paddingBottom: normalize(32) + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.waitingCard}>
            <Image
              source={require('../../assets/images/kyc_waiting.png')}
              style={styles.waitingIllustration}
              resizeMode="contain"
            />
            <View style={styles.waitingBadge}>
              <Icon name="clock" size={normalize(12)} color="#D97706" solid />
              <Text style={styles.waitingBadgeText}>
                Menunggu Persetujuan Admin
              </Text>
            </View>
            <Text style={styles.waitingTitle}>
              Data KYC Anda Sedang Ditinjau
            </Text>
            <Text style={styles.waitingSubtitle}>
              Terima kasih telah mengirimkan data verifikasi KYC. Tim admin kami sedang memeriksa dokumen Anda. Anda akan mendapatkan akses penuh setelah pengajuan disetujui.
            </Text>

            <TouchableOpacity
              style={styles.waitingRefreshButton}
              onPress={() => fetchMyKyc(true)}
              disabled={isLoadingStatus}
            >
              {isLoadingStatus ? (
                <ActivityIndicator size="small" color={COLOR.SECONDARY} />
              ) : (
                <>
                  <Icon
                    name="sync-alt"
                    size={normalize(14)}
                    color={COLOR.SECONDARY}
                    solid
                    style={{ marginRight: normalize(8) }}
                  />
                  <Text style={styles.waitingRefreshText}>Periksa Status</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.waitingBackButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.waitingBackText}>Kembali</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <>
          <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: normalize(110) + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Info / Status Banner */}
          {isLoadingStatus ? (
            <View style={[styles.infoBanner, { justifyContent: 'center' }]}>
              <ActivityIndicator size="small" color={COLOR.PRIMARY} />
              <Text style={[styles.infoText, { marginLeft: normalize(10) }]}>
                Memeriksa status KYC...
              </Text>
            </View>
          ) : kycStatus === 'approved' ? (
            <View
              style={[
                styles.infoBanner,
                { backgroundColor: '#ECFDF5', borderColor: COLOR.SUCCESS },
              ]}
            >
              <Icon
                name="check-circle"
                size={normalize(18)}
                color={COLOR.SUCCESS}
                solid
                style={{ marginRight: normalize(12), marginTop: normalize(2) }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoTitle, { color: '#065F46' }]}>
                  KYC Terverifikasi
                </Text>
                <Text style={[styles.infoText, { color: '#065F46' }]}>
                  Identitas Anda telah disetujui oleh admin. Seluruh fitur anggota PBI sudah terbuka.
                </Text>
              </View>
            </View>
          ) : kycStatus === 'rejected' ? (
            <View
              style={[
                styles.infoBanner,
                { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
              ]}
            >
              <Icon
                name="times-circle"
                size={normalize(18)}
                color="#DC2626"
                solid
                style={{ marginRight: normalize(12), marginTop: normalize(2) }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoTitle, { color: '#991B1B' }]}>
                  Pengajuan KYC Ditolak
                </Text>
                <Text style={[styles.infoText, { color: '#991B1B' }]}>
                  {rejectionReason
                    ? `Alasan: ${rejectionReason}. Silakan perbaiki dan ajukan ulang.`
                    : 'Pengajuan KYC Anda ditolak oleh admin. Silakan perbaiki data dan ajukan ulang.'}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.infoBanner}>
              <Icon
                name="shield-alt"
                size={normalize(18)}
                color={COLOR.INFO}
                solid
                style={{ marginRight: normalize(12), marginTop: normalize(2) }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>Verifikasi Identitas Anggota</Text>
                <Text style={styles.infoText}>
                  Lengkapi data diri dan dokumen KTP untuk membuka seluruh fitur eksklusif anggota PBI. Data Anda dijamin aman.
                </Text>
              </View>
            </View>
          )}

          {/* Section 1: Unggah Dokumen */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="id-card" size={normalize(16)} color={COLOR.PRIMARY} solid />
              <Text style={styles.sectionTitle}>1. Unggah Dokumen</Text>
            </View>

            {renderUploadBox(
              'Foto Depan e-KTP *',
              'Ambil atau unggah foto depan e-KTP untuk mengisi otomatis Data Identitas & Alamat Domisili.',
              ktpImage,
              'id-card',
              'ktp'
            )}

            {isScanningKtp && (
              <View style={styles.scanningBanner}>
                <ActivityIndicator size="small" color={COLOR.PRIMARY} />
                <Text style={styles.scanningText}>
                  Memindai data e-KTP untuk pengisian otomatis...
                </Text>
              </View>
            )}

            {isAutofilled && !isScanningKtp && (
              <View style={styles.autofillBanner}>
                <Icon name="check-circle" size={normalize(14)} color={COLOR.SUCCESS} solid />
                <Text style={styles.autofillText}>
                  Data Identitas & Alamat Domisili terisi otomatis dari e-KTP. Silakan periksa kembali.
                </Text>
              </View>
            )}

            {renderUploadBox(
              'Foto Selfie dengan KTP *',
              'Pegang KTP di samping wajah Anda dengan pencahayaan yang cukup.',
              selfieImage,
              'user-circle',
              'selfie'
            )}
          </View>

          {/* Section 2: Data Identitas */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="user-check" size={normalize(16)} color={COLOR.PRIMARY} solid />
              <Text style={styles.sectionTitle}>2. Data Identitas (KTP)</Text>
            </View>

            <Text style={styles.inputLabel}>NIK (16 Digit) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 3171012345670001"
              placeholderTextColor={COLOR.GRAY}
              keyboardType="number-pad"
              maxLength={16}
              value={nik}
              onChangeText={setNik}
            />

            <Text style={styles.inputLabel}>Nama Lengkap (Sesuai KTP) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama lengkap"
              placeholderTextColor={COLOR.GRAY}
              value={fullName}
              onChangeText={setFullName}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: normalize(8) }}>
                <Text style={styles.inputLabel}>Tempat Lahir *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Kota lahir"
                  placeholderTextColor={COLOR.GRAY}
                  value={birthPlace}
                  onChangeText={setBirthPlace}
                />
              </View>
              <View style={{ flex: 1, marginLeft: normalize(8) }}>
                <Text style={styles.inputLabel}>Tanggal Lahir *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={COLOR.GRAY}
                  value={birthDate}
                  onChangeText={setBirthDate}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Jenis Kelamin *</Text>
            <View style={styles.row}>
              {[
                { id: 'L' as Gender, label: 'Laki-laki', icon: 'mars' },
                { id: 'P' as Gender, label: 'Perempuan', icon: 'venus' },
              ].map((item) => {
                const active = gender === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.genderButton,
                      active && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender(item.id)}
                  >
                    <Icon
                      name={item.icon}
                      size={normalize(14)}
                      color={active ? COLOR.SECONDARY : COLOR.PRIMARY}
                    />
                    <Text
                      style={[
                        styles.genderText,
                        active && styles.genderTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 3: Alamat Domisili */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="map-marker-alt" size={normalize(16)} color={COLOR.PRIMARY} solid />
              <Text style={styles.sectionTitle}>3. Alamat Domisili</Text>
            </View>

            <Text style={styles.inputLabel}>Alamat Lengkap *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nama jalan, RT/RW, Kelurahan, Kecamatan"
              placeholderTextColor={COLOR.GRAY}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={address}
              onChangeText={setAddress}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: normalize(8) }}>
                <Text style={styles.inputLabel}>Kota / Kabupaten *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: Jakarta Selatan"
                  placeholderTextColor={COLOR.GRAY}
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={{ flex: 1, marginLeft: normalize(8) }}>
                <Text style={styles.inputLabel}>Provinsi *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contoh: DKI Jakarta"
                  placeholderTextColor={COLOR.GRAY}
                  value={province}
                  onChangeText={setProvince}
                />
              </View>
            </View>
          </View>

          {/* Consent Checkbox */}
          <TouchableOpacity
            style={styles.consentRow}
            onPress={() => setAgreed(!agreed)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Icon name="check" size={normalize(11)} color={COLOR.WHITE} />}
            </View>
            <Text style={styles.consentText}>
              Saya menyatakan bahwa seluruh data dan dokumen yang saya unggah adalah benar dan dapat dipertanggungjawabkan.
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Submit Bar */}
      {kycStatus !== 'approved' && (
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: normalize(16) + insets.bottom },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting
                ? 'Mengirim Data...'
                : kycStatus === 'rejected'
                ? 'Ajukan Ulang KYC'
                : 'Simpan & Ajukan KYC'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(16),
    backgroundColor: COLOR.SECONDARY,
    borderBottomLeftRadius: normalize(20),
    borderBottomRightRadius: normalize(20),
  },
  backButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: normalize(20),
    backgroundColor: COLOR.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: COLOR.PRIMARY,
  },
  scrollContent: {
    padding: normalize(20),
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E3F2FD',
    borderRadius: normalize(12),
    padding: normalize(14),
    marginBottom: normalize(16),
    borderLeftWidth: normalize(4),
    borderLeftColor: COLOR.INFO,
  },
  infoTitle: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: COLOR.PRIMARY,
    marginBottom: normalize(4),
  },
  infoText: {
    fontSize: normalize(12),
    color: COLOR.PRIMARY,
    lineHeight: normalize(18),
  },
  card: {
    backgroundColor: COLOR.WHITE,
    borderRadius: normalize(14),
    padding: normalize(16),
    marginBottom: normalize(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(14),
    paddingBottom: normalize(10),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: COLOR.PRIMARY,
    marginLeft: normalize(8),
  },
  inputLabel: {
    fontSize: normalize(13),
    fontWeight: '600',
    color: COLOR.DARK_GRAY,
    marginBottom: normalize(6),
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: normalize(10),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
    fontSize: normalize(14),
    color: COLOR.DARK_GRAY,
    backgroundColor: '#FAFAFA',
    marginBottom: normalize(12),
  },
  textArea: {
    minHeight: normalize(80),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(11),
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: COLOR.PRIMARY,
    backgroundColor: COLOR.WHITE,
    marginRight: normalize(8),
  },
  genderButtonActive: {
    backgroundColor: COLOR.PRIMARY,
  },
  genderText: {
    fontSize: normalize(13),
    fontWeight: '600',
    color: COLOR.PRIMARY,
    marginLeft: normalize(6),
  },
  genderTextActive: {
    color: COLOR.SECONDARY,
  },
  uploadWrapper: {
    marginBottom: normalize(14),
  },
  uploadSubtitle: {
    fontSize: normalize(12),
    color: COLOR.GRAY,
    marginBottom: normalize(10),
    lineHeight: normalize(16),
  },
  uploadPlaceholder: {
    borderWidth: 1.5,
    borderColor: COLOR.PRIMARY,
    borderStyle: 'dashed',
    borderRadius: normalize(10),
    paddingVertical: normalize(28),
    alignItems: 'center',
    backgroundColor: COLOR.SECONDARY,
  },
  uploadPlaceholderText: {
    fontSize: normalize(13),
    fontWeight: '600',
    color: COLOR.PRIMARY,
    marginTop: normalize(8),
  },
  previewImage: {
    width: '100%',
    height: normalize(180),
    borderRadius: normalize(10),
    marginBottom: normalize(8),
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.PRIMARY,
    borderRadius: normalize(8),
    paddingVertical: normalize(10),
  },
  retakeButtonText: {
    fontSize: normalize(13),
    fontWeight: 'bold',
    color: COLOR.SECONDARY,
    marginLeft: normalize(6),
  },
  scanningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.SECONDARY,
    borderRadius: normalize(8),
    padding: normalize(10),
    marginBottom: normalize(14),
  },
  scanningText: {
    flex: 1,
    fontSize: normalize(12),
    fontWeight: '600',
    color: COLOR.PRIMARY,
    marginLeft: normalize(10),
  },
  autofillBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.SUCCESS + '20',
    borderRadius: normalize(8),
    padding: normalize(10),
    marginBottom: normalize(14),
  },
  autofillText: {
    flex: 1,
    fontSize: normalize(12),
    color: COLOR.DARK_GRAY,
    marginLeft: normalize(8),
    lineHeight: normalize(16),
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: normalize(4),
    marginBottom: normalize(12),
  },
  checkbox: {
    width: normalize(20),
    height: normalize(20),
    borderRadius: normalize(5),
    borderWidth: 1.5,
    borderColor: COLOR.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: normalize(10),
    marginTop: normalize(2),
    backgroundColor: COLOR.WHITE,
  },
  checkboxChecked: {
    backgroundColor: COLOR.PRIMARY,
  },
  consentText: {
    flex: 1,
    fontSize: normalize(12),
    color: COLOR.DARK_GRAY,
    lineHeight: normalize(18),
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLOR.WHITE,
    paddingHorizontal: normalize(20),
    paddingTop: normalize(14),
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  submitButton: {
    backgroundColor: COLOR.PRIMARY,
    borderRadius: normalize(12),
    paddingVertical: normalize(15),
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9AA6A6',
  },
  submitButtonText: {
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: COLOR.SECONDARY,
  },
  waitingContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: normalize(20),
  },
  waitingCard: {
    backgroundColor: COLOR.WHITE,
    borderRadius: normalize(20),
    padding: normalize(24),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  waitingIllustration: {
    width: normalize(220),
    height: normalize(220),
    marginBottom: normalize(16),
  },
  waitingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(20),
    marginBottom: normalize(14),
  },
  waitingBadgeText: {
    fontSize: normalize(12),
    fontWeight: '700',
    color: '#B45309',
    marginLeft: normalize(6),
  },
  waitingTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: COLOR.PRIMARY,
    textAlign: 'center',
    marginBottom: normalize(10),
  },
  waitingSubtitle: {
    fontSize: normalize(13),
    color: COLOR.DARK_GRAY,
    textAlign: 'center',
    lineHeight: normalize(20),
    marginBottom: normalize(24),
  },
  waitingRefreshButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.PRIMARY,
    borderRadius: normalize(12),
    paddingVertical: normalize(14),
    marginBottom: normalize(10),
  },
  waitingRefreshText: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: COLOR.SECONDARY,
  },
  waitingBackButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(12),
    paddingVertical: normalize(13),
    borderWidth: 1,
    borderColor: '#D6D6D6',
    backgroundColor: COLOR.WHITE,
  },
  waitingBackText: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: COLOR.PRIMARY,
  },
});
