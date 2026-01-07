import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLOR } from '../../utils/Color';
import Toast from 'react-native-toast-message';
import { launchImageLibrary, Asset } from 'react-native-image-picker';

const TYPES = [
    { id: 'laporan', label: 'Laporan', icon: 'exclamation-circle', color: '#FF6B6B' },
    { id: 'aspirasi', label: 'Aspirasi', icon: 'bullhorn', color: '#4ECDC4' },
    { id: 'inspirasi', label: 'Inspirasi', icon: 'lightbulb', color: '#FFD93D' },
];

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes

export default function Aspirasiku({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();
    const [selectedType, setSelectedType] = React.useState('aspirasi');
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [attachment, setAttachment] = React.useState<Asset | null>(null);

    const handlePickImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
                selectionLimit: 1,
            });

            if (result.didCancel) return;

            if (result.assets && result.assets.length > 0) {
                const file = result.assets[0];

                // Check file size
                if (file.fileSize && file.fileSize > MAX_FILE_SIZE) {
                    Alert.alert(
                        'Ukuran File Terlalu Besar',
                        'Maksimal ukuran foto adalah 1 MB. Silakan pilih foto lain.',
                        [{ text: 'OK' }]
                    );
                    return;
                }

                setAttachment(file);
                Toast.show({
                    type: 'success',
                    text1: 'Foto Terpilih',
                    text2: 'Foto berhasil dilampirkan.',
                    position: 'top',
                });
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Toast.show({
                type: 'error',
                text1: 'Gagal Memilih Foto',
                text2: 'Terjadi kesalahan saat memilih foto.',
                position: 'top',
            });
        }
    };

    const handleRemoveAttachment = () => {
        setAttachment(null);
    };

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Data Belum Lengkap',
                text2: 'Mohon isi judul dan konten aspirasi Anda.',
                position: 'top',
            });
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert(
                'Berhasil Dikirim',
                'Terima kasih! Aspirasi Anda telah kami terima dan akan segera ditinjau oleh tim PBI.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }, 1500);
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLOR.WHITE, paddingTop: insets.top }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-left" size={normalize(18)} color={COLOR.SECONDARY} solid />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Aspirasiku</Text>
                <TouchableOpacity
                    style={styles.historyButton}
                    onPress={() => navigation.navigate('AspirasiHistory')}
                >
                    <Icon name="history" size={normalize(18)} color={COLOR.PRIMARY} solid />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: normalize(32) + insets.bottom }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Sampaikan Suara Anda</Text>
                    <Text style={styles.sectionSubtitle}>
                        Bantu kami membangun komunitas yang lebih baik dengan memberikan laporan, aspirasi, atau inspirasi Anda.
                    </Text>

                    {/* Type Selector */}
                    <Text style={styles.inputLabel}>Pilih Jenis</Text>
                    <View style={styles.typeContainer}>
                        {TYPES.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.typeCard,
                                    selectedType === type.id && { borderColor: type.color, backgroundColor: type.color + '10' }
                                ]}
                                onPress={() => setSelectedType(type.id)}
                            >
                                <View style={[styles.typeIcon, { backgroundColor: selectedType === type.id ? type.color : '#F0F0F0' }]}>
                                    <Icon name={type.icon} size={normalize(16)} color={selectedType === type.id ? COLOR.WHITE : COLOR.GRAY} solid />
                                </View>
                                <Text style={[styles.typeLabel, selectedType === type.id && { color: type.color, fontWeight: '700' }]}>
                                    {type.label}
                                </Text>
                                {selectedType === type.id && (
                                    <View style={[styles.checkBadge, { backgroundColor: type.color }]}>
                                        <Icon name="check" size={normalize(8)} color={COLOR.WHITE} solid />
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>Judul</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Masukan judul singkat..."
                            placeholderTextColor={COLOR.GRAY}
                            value={title}
                            onChangeText={setTitle}
                        />

                        <Text style={styles.inputLabel}>Isi Aspirasi / Laporan</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ceritakan secara detail di sini..."
                            placeholderTextColor={COLOR.GRAY}
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                        />

                        {attachment ? (
                            <View style={styles.previewContainer}>
                                <Image source={{ uri: attachment.uri }} style={styles.previewImage} />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={handleRemoveAttachment}
                                >
                                    <Icon name="times" size={normalize(12)} color={COLOR.WHITE} solid />
                                </TouchableOpacity>
                                <View style={styles.fileInfo}>
                                    <Text style={styles.fileName} numberOfLines={1}>{attachment.fileName}</Text>
                                    <Text style={styles.fileSize}>
                                        {attachment.fileSize ? (attachment.fileSize / (1024 * 1024)).toFixed(2) : 0} MB
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.attachmentButton}
                                onPress={handlePickImage}
                            >
                                <Icon name="camera" size={normalize(16)} color={COLOR.PRIMARY} solid style={{ marginRight: normalize(10) }} />
                                <Text style={styles.attachmentText}>Lampirkan Foto (Max 1MB)</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.submitButton, isSubmitting && { opacity: 0.7 }]}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.submitButtonText}>
                                {isSubmitting ? 'Mengirim...' : 'Kirim Sekarang'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Info Card */}
                    <View style={styles.infoCard}>
                        <Icon name="info-circle" size={normalize(16)} color={COLOR.PRIMARY} solid style={{ marginTop: normalize(2) }} />
                        <Text style={styles.infoText}>
                            Setiap masukan yang Anda berikan akan ditinjau secara manual oleh tim admin PBI. Kami sangat menghargai feedback yang konstruktif.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(15),
        backgroundColor: COLOR.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        width: normalize(42),
        height: normalize(42),
        borderRadius: normalize(21),
        backgroundColor: COLOR.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: normalize(18),
        fontWeight: '700',
        color: COLOR.PRIMARY,
    },
    historyButton: {
        width: normalize(42),
        height: normalize(42),
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: normalize(20),
        paddingTop: normalize(24),
    },
    sectionTitle: {
        fontSize: normalize(22),
        fontWeight: '700',
        color: COLOR.PRIMARY,
        marginBottom: normalize(8),
    },
    sectionSubtitle: {
        fontSize: normalize(14),
        color: COLOR.GRAY,
        lineHeight: normalize(20),
        marginBottom: normalize(24),
    },
    typeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(20),
    },
    typeCard: {
        width: '31%',
        backgroundColor: COLOR.WHITE,
        borderRadius: normalize(16),
        borderWidth: 1.5,
        borderColor: '#F0F0F0',
        padding: normalize(12),
        alignItems: 'center',
        position: 'relative',
    },
    typeIcon: {
        width: normalize(40),
        height: normalize(40),
        borderRadius: normalize(20),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: normalize(8),
    },
    typeLabel: {
        fontSize: normalize(11),
        color: COLOR.GRAY,
        fontWeight: '600',
    },
    checkBadge: {
        position: 'absolute',
        top: normalize(8),
        right: normalize(8),
        width: normalize(14),
        height: normalize(14),
        borderRadius: normalize(7),
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        marginTop: normalize(10),
    },
    inputLabel: {
        fontSize: normalize(14),
        fontWeight: '700',
        color: COLOR.PRIMARY,
        marginBottom: normalize(8),
    },
    input: {
        backgroundColor: '#F9F9F9',
        borderRadius: normalize(12),
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(14),
        fontSize: normalize(14),
        color: COLOR.PRIMARY,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: normalize(18),
    },
    textArea: {
        height: normalize(120),
    },
    attachmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR.SECONDARY,
        padding: normalize(14),
        borderRadius: normalize(12),
        marginBottom: normalize(24),
    },
    attachmentText: {
        fontSize: normalize(14),
        color: COLOR.PRIMARY,
        fontWeight: '600',
    },
    previewContainer: {
        marginBottom: normalize(24),
        borderRadius: normalize(12),
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        backgroundColor: '#F9F9F9',
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: normalize(150),
        resizeMode: 'cover',
    },
    removeButton: {
        position: 'absolute',
        top: normalize(10),
        right: normalize(10),
        backgroundColor: 'rgba(255, 107, 107, 0.9)',
        width: normalize(24),
        height: normalize(24),
        borderRadius: normalize(12),
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    fileInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: normalize(10),
        backgroundColor: COLOR.WHITE,
    },
    fileName: {
        flex: 1,
        fontSize: normalize(12),
        color: COLOR.PRIMARY,
        marginRight: normalize(10),
    },
    fileSize: {
        fontSize: normalize(11),
        color: COLOR.GRAY,
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: COLOR.PRIMARY,
        paddingVertical: normalize(16),
        borderRadius: normalize(16),
        alignItems: 'center',
        shadowColor: COLOR.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonText: {
        color: COLOR.WHITE,
        fontSize: normalize(16),
        fontWeight: '700',
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#F8F8F8',
        padding: normalize(16),
        borderRadius: normalize(16),
        marginTop: normalize(30),
        gap: normalize(12),
    },
    infoText: {
        flex: 1,
        fontSize: normalize(12),
        color: COLOR.GRAY,
        lineHeight: normalize(18),
    },
});
