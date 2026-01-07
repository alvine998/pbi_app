import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    PermissionsAndroid,
    Platform,
} from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import { updateUserData } from '../../services/storage';

interface KYCVerificationProps {
    navigation: any;
}

export default function KYCVerification({ navigation }: KYCVerificationProps) {
    const [ktpImage, setKtpImage] = useState<Asset | null>(null);
    const [selfieImage, setSelfieImage] = useState<Asset | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
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
        }
        return true;
    };

    const handleTakePhoto = async (type: 'ktp' | 'selfie') => {
        const hasPermission = await requestCameraPermission();

        if (!hasPermission) {
            Alert.alert(
                'Izin Ditolak',
                'Aplikasi memerlukan izin kamera untuk mengambil foto',
                [{ text: 'OK' }]
            );
            return;
        }

        Alert.alert(
            'Pilih Sumber Foto',
            'Pilih dari mana Anda ingin mengambil foto',
            [
                {
                    text: 'Kamera',
                    onPress: () => openCamera(type),
                },
                {
                    text: 'Galeri',
                    onPress: () => openGallery(type),
                },
                {
                    text: 'Batal',
                    style: 'cancel',
                },
            ]
        );
    };

    const openCamera = async (type: 'ktp' | 'selfie') => {
        const result = await launchCamera({
            mediaType: 'photo',
            quality: 0.8,
            cameraType: type === 'selfie' ? 'front' : 'back',
            saveToPhotos: false,
        });

        if (result.assets && result.assets.length > 0) {
            if (type === 'ktp') {
                setKtpImage(result.assets[0]);
            } else {
                setSelfieImage(result.assets[0]);
            }
            Toast.show({
                type: 'success',
                text1: 'Foto Berhasil Diambil',
                text2: `Foto ${type === 'ktp' ? 'KTP' : 'selfie'} berhasil diambil`,
                position: 'top',
            });
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
                setKtpImage(result.assets[0]);
            } else {
                setSelfieImage(result.assets[0]);
            }
            Toast.show({
                type: 'success',
                text1: 'Foto Berhasil Dipilih',
                text2: `Foto ${type === 'ktp' ? 'KTP' : 'selfie'} berhasil dipilih`,
                position: 'top',
            });
        }
    };

    const handleSubmit = async () => {
        if (!ktpImage || !selfieImage) {
            Toast.show({
                type: 'error',
                text1: 'Data Tidak Lengkap',
                text2: 'Mohon upload foto KTP dan selfie dengan KTP',
                position: 'top',
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(async () => {
            // Update KYC status in storage
            await updateUserData({
                kycStatus: 'verified',
                isKycVerified: true
            });

            Toast.show({
                type: 'success',
                text1: 'Verifikasi Berhasil',
                text2: 'Data KYC Anda telah diverifikasi otomatis',
                position: 'top',
            });
            setIsSubmitting(false);

            // Navigate back to profile
            setTimeout(() => {
                navigation.goBack();
            }, 1500);
        }, 2000);
    };

    const renderUploadCard = (
        title: string,
        description: string,
        image: Asset | null,
        onPress: () => void,
        icon: string
    ) => (
        <View
            style={{
                backgroundColor: COLOR.WHITE,
                borderRadius: normalize(12),
                padding: normalize(15),
                marginBottom: normalize(15),
            }}
        >
            <Text
                style={{
                    fontSize: normalize(16),
                    fontWeight: 'bold',
                    color: COLOR.PRIMARY,
                    marginBottom: normalize(8),
                }}
            >
                {title}
            </Text>
            <Text
                style={{
                    fontSize: normalize(12),
                    color: COLOR.GRAY,
                    marginBottom: normalize(15),
                    lineHeight: normalize(18),
                }}
            >
                {description}
            </Text>

            {image ? (
                <View>
                    <Image
                        source={{ uri: image.uri }}
                        style={{
                            width: '100%',
                            height: normalize(200),
                            borderRadius: normalize(8),
                            marginBottom: normalize(10),
                        }}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        style={{
                            backgroundColor: COLOR.PRIMARY,
                            borderRadius: normalize(8),
                            paddingVertical: normalize(12),
                            alignItems: 'center',
                        }}
                        onPress={onPress}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon name="camera" size={normalize(16)} color={COLOR.SECONDARY} solid />
                            <Text
                                style={{
                                    fontSize: normalize(14),
                                    fontWeight: 'bold',
                                    color: COLOR.SECONDARY,
                                    marginLeft: normalize(8),
                                }}
                            >
                                Ambil Ulang Foto
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    style={{
                        borderWidth: 2,
                        borderColor: COLOR.PRIMARY,
                        borderStyle: 'dashed',
                        borderRadius: normalize(8),
                        paddingVertical: normalize(40),
                        alignItems: 'center',
                        backgroundColor: COLOR.SECONDARY,
                    }}
                    onPress={onPress}
                >
                    <Icon name={icon} size={normalize(40)} color={COLOR.PRIMARY} />
                    <Text
                        style={{
                            fontSize: normalize(14),
                            fontWeight: '600',
                            color: COLOR.PRIMARY,
                            marginTop: normalize(10),
                        }}
                    >
                        Ambil Foto
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
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
                    Verifikasi KYC
                </Text>

                <View style={{ width: normalize(40) }} />
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: normalize(20),
                    paddingBottom: normalize(100),
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Info Card */}
                <View
                    style={{
                        backgroundColor: '#E3F2FD',
                        borderRadius: normalize(12),
                        padding: normalize(15),
                        marginBottom: normalize(20),
                        borderLeftWidth: normalize(4),
                        borderLeftColor: COLOR.INFO,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        <Icon
                            name="info-circle"
                            size={normalize(16)}
                            color={COLOR.INFO}
                            solid
                            style={{ marginRight: normalize(10), marginTop: normalize(2) }}
                        />
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: normalize(14),
                                    fontWeight: 'bold',
                                    color: COLOR.PRIMARY,
                                    marginBottom: normalize(6),
                                }}
                            >
                                Panduan Verifikasi KYC
                            </Text>
                            <Text
                                style={{
                                    fontSize: normalize(12),
                                    color: COLOR.PRIMARY,
                                    lineHeight: normalize(18),
                                }}
                            >
                                • Pastikan foto KTP jelas dan tidak buram{'\n'}
                                • Foto selfie harus menunjukkan wajah dan KTP dengan jelas{'\n'}
                                • Gunakan pencahayaan yang cukup{'\n'}
                                • Data KYC akan diverifikasi dalam 1x24 jam
                            </Text>
                        </View>
                    </View>
                </View>

                {/* KTP Upload */}
                {renderUploadCard(
                    'Foto KTP',
                    'Upload foto KTP Anda yang masih berlaku. Pastikan semua informasi terlihat jelas.',
                    ktpImage,
                    () => handleTakePhoto('ktp'),
                    'id-card'
                )}

                {/* Selfie Upload */}
                {renderUploadCard(
                    'Foto Selfie dengan KTP',
                    'Ambil foto selfie sambil memegang KTP di samping wajah Anda. Pastikan wajah dan KTP terlihat jelas.',
                    selfieImage,
                    () => handleTakePhoto('selfie'),
                    'user-circle'
                )}
            </ScrollView>

            {/* Submit Button */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: COLOR.WHITE,
                    padding: normalize(20),
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5E5',
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: isSubmitting ? '#9AA6A6' : COLOR.PRIMARY,
                        borderRadius: normalize(12),
                        paddingVertical: normalize(15),
                        alignItems: 'center',
                    }}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <Text
                        style={{
                            fontSize: normalize(16),
                            fontWeight: 'bold',
                            color: COLOR.SECONDARY,
                        }}
                    >
                        {isSubmitting ? 'Mengirim...' : 'Kirim Verifikasi'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
