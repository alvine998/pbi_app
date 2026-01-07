import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLOR } from '../../utils/Color';

const FAQ_DATA = [
    {
        question: 'Bagaimana cara verifikasi KYC?',
        answer: 'Buka menu Profil, lalu tekan tombol "Lengkapi KYC". Anda akan diminta untuk mengunggah foto KTP dan foto diri.',
    },
    {
        question: 'Berapa lama proses verifikasi KYC?',
        answer: 'Proses verifikasi biasanya memakan waktu 1-3 hari kerja tergantung volume antrian.',
    },
    {
        question: 'Bagaimana cara menghubungi admin SOS?',
        answer: 'Anda dapat menggunakan fitur SOS di halaman utama untuk terhubung langsung dengan tim tanggap darurat melalui Live Chat atau WhatsApp.',
    },
    {
        question: 'Kenapa saya tidak bisa mengakses menu Interaction?',
        answer: 'Beberapa menu interaksi hanya tersedia untuk anggota yang sudah terverifikasi KYC. Pastikan status KYC Anda sudah aktif.',
    },
];

const CONTACT_METHODS = [
    {
        id: 'whatsapp',
        title: 'WhatsApp Support',
        subtitle: 'Respon cepat (Jam kerja)',
        icon: 'whatsapp',
        color: '#25D366',
        action: () => Linking.openURL('https://wa.me/6288293477465'),
    },
    {
        id: 'email',
        title: 'Email Support',
        subtitle: 'support@baramuda.id',
        icon: 'envelope',
        color: '#D44638',
        action: () => Linking.openURL('mailto:support@baramuda.id'),
    },
    {
        id: 'call',
        title: 'Call Center',
        subtitle: '24/7 Layanan bantuan',
        icon: 'phone-alt',
        color: '#1A73E8',
        action: () => Linking.openURL('tel:088293477465'),
    },
];

export default function Bantuan({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();
    const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
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
                <Text style={styles.headerTitle}>Pusat Bantuan</Text>
                <View style={{ width: normalize(42) }} />
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: normalize(32) + insets.bottom }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Butuh bantuan lebih lanjut?</Text>
                    <Text style={styles.sectionSubtitle}>
                        Tim dukungan kami siap membantu Anda dengan kendala teknis atau informasi layanan.
                    </Text>

                    {/* Contact Methods */}
                    <View style={styles.contactContainer}>
                        {CONTACT_METHODS.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={styles.contactCard}
                                onPress={method.action}
                                activeOpacity={0.8}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: method.color }]}>
                                    <Icon name={method.icon} size={normalize(20)} color={COLOR.WHITE} solid />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.contactTitle}>{method.title}</Text>
                                    <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
                                </View>
                                <Icon name="chevron-right" size={normalize(14)} color={COLOR.GRAY} solid />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* FAQ Section */}
                    <Text style={[styles.sectionTitle, { marginTop: normalize(30) }]}>
                        Pertanyaan Umum (FAQ)
                    </Text>

                    <View style={styles.faqContainer}>
                        {FAQ_DATA.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.faqItem}
                                onPress={() => toggleExpand(index)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.faqHeader}>
                                    <Text style={styles.faqQuestion}>{item.question}</Text>
                                    <Icon
                                        name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                                        size={normalize(14)}
                                        color={COLOR.PRIMARY}
                                        solid
                                    />
                                </View>
                                {expandedIndex === index && (
                                    <View style={styles.faqAnswerContainer}>
                                        <Text style={styles.faqAnswer}>{item.answer}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Footer Info */}
                    <View style={styles.footerInfo}>
                        <Text style={styles.versionText}>Baramuda App v1.0.4</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://baramuda.id/terms')}>
                            <Text style={styles.linkText}>Syarat & Ketentuan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://baramuda.id/privacy')}>
                            <Text style={styles.linkText}>Kebijakan Privasi</Text>
                        </TouchableOpacity>
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
    content: {
        paddingHorizontal: normalize(20),
        paddingTop: normalize(24),
    },
    sectionTitle: {
        fontSize: normalize(20),
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
    contactContainer: {
        gap: normalize(12),
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR.WHITE,
        padding: normalize(16),
        borderRadius: normalize(18),
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    iconContainer: {
        width: normalize(48),
        height: normalize(48),
        borderRadius: normalize(24),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: normalize(16),
    },
    contactTitle: {
        fontSize: normalize(16),
        fontWeight: '700',
        color: COLOR.PRIMARY,
        marginBottom: normalize(2),
    },
    contactSubtitle: {
        fontSize: normalize(12),
        color: COLOR.GRAY,
    },
    faqContainer: {
        marginTop: normalize(12),
    },
    faqItem: {
        backgroundColor: COLOR.WHITE,
        borderRadius: normalize(16),
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: normalize(12),
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: normalize(18),
    },
    faqQuestion: {
        fontSize: normalize(14),
        fontWeight: '600',
        color: COLOR.PRIMARY,
        flex: 1,
        marginRight: normalize(10),
    },
    faqAnswerContainer: {
        paddingHorizontal: normalize(18),
        paddingBottom: normalize(18),
        borderTopWidth: 1,
        borderTopColor: '#F8F8F8',
    },
    faqAnswer: {
        fontSize: normalize(13),
        color: COLOR.DARK_GRAY,
        lineHeight: normalize(19),
        marginTop: normalize(12),
    },
    footerInfo: {
        marginTop: normalize(40),
        alignItems: 'center',
        gap: normalize(12),
    },
    versionText: {
        fontSize: normalize(12),
        color: COLOR.GRAY,
        marginBottom: normalize(8),
    },
    linkText: {
        fontSize: normalize(14),
        color: COLOR.PRIMARY,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
