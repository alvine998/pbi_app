import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLOR } from '../../utils/Color';
import Toast from 'react-native-toast-message';

const INITIAL_HISTORY = [
    {
        id: '1',
        type: 'laporan',
        title: 'Lampu Jalan Mati',
        content: 'Lampu jalan di blok A3 mati sudah 3 hari, mohon diperbaiki.',
        date: '2 jam lalu',
        status: 'pending',
    },
    {
        id: '2',
        type: 'aspirasi',
        title: 'Pelatihan UMKM Digital',
        content: 'Sangat disarankan ada pelatihan digital marketing untuk UMKM minggu depan.',
        date: '1 hari lalu',
        status: 'processed',
    },
    {
        id: '3',
        type: 'inspirasi',
        title: 'Kisah Sukses Relawan',
        content: 'Saya ingin berbagi cerita bagaimana program relawan mengubah cara pandang saya.',
        date: '3 hari lalu',
        status: 'completed',
    },
];

const STATUS_CONFIG = {
    pending: { label: 'Menunggu', color: '#FFA500', icon: 'clock' },
    processed: { label: 'Diproses', color: '#1A73E8', icon: 'spinner' },
    completed: { label: 'Selesai', color: '#4ECDC4', icon: 'check-circle' },
};

export default function AspirasiHistory({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();
    const [history, setHistory] = useState(INITIAL_HISTORY);

    const handleDelete = (id: string, title: string) => {
        Alert.alert(
            'Hapus Aspirasi',
            `Apakah Anda yakin ingin menghapus "${title}"?`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => {
                        setHistory(prev => prev.filter(item => item.id !== id));
                        Toast.show({
                            type: 'success',
                            text1: 'Berhasil Dihapus',
                            text2: 'Aspirasi telah dihapus dari riwayat.',
                            position: 'top',
                        });
                    }
                }
            ]
        );
    };

    const renderHistoryItem = ({ item }: { item: any }) => {
        const status = (STATUS_CONFIG as any)[item.status];
        const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
        const canDelete = item.status === 'pending';

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={[styles.typeBadge, { backgroundColor: COLOR.SECONDARY }]}>
                        <Text style={styles.typeText}>{typeLabel}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <View style={[styles.statusBadge, { backgroundColor: status.color + '15' }]}>
                            <Icon name={status.icon} size={normalize(10)} color={status.color} solid style={{ marginRight: normalize(4) }} />
                            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                        </View>
                        {canDelete && (
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id, item.title)}
                                style={styles.deleteIconButton}
                            >
                                <Icon name="trash-alt" size={normalize(14)} color="#FF6B6B" solid />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardContent} numberOfLines={2}>{item.content}</Text>

                    <View style={styles.cardFooter}>
                        <Text style={styles.dateText}>{item.date}</Text>
                        <Icon name="chevron-right" size={normalize(12)} color={COLOR.GRAY} solid />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA', paddingTop: insets.top }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-left" size={normalize(18)} color={COLOR.SECONDARY} solid />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Riwayat Aspirasi</Text>
                <View style={{ width: normalize(42) }} />
            </View>

            <FlatList
                data={history}
                keyExtractor={(item) => item.id}
                renderItem={renderHistoryItem}
                contentContainerStyle={{ padding: normalize(20), paddingBottom: insets.bottom + normalize(20) }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="history" size={normalize(60)} color={COLOR.GRAY} solid />
                        <Text style={styles.emptyText}>Belum ada riwayat aspirasi.</Text>
                    </View>
                }
            />
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
    card: {
        backgroundColor: COLOR.WHITE,
        borderRadius: normalize(16),
        padding: normalize(16),
        marginBottom: normalize(16),
        borderWidth: 1,
        borderColor: '#F0F0F0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(12),
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteIconButton: {
        padding: normalize(8),
        marginLeft: normalize(8),
    },
    typeBadge: {
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(4),
        borderRadius: normalize(8),
    },
    typeText: {
        fontSize: normalize(10),
        fontWeight: '700',
        color: COLOR.PRIMARY,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(4),
        borderRadius: normalize(20),
    },
    statusText: {
        fontSize: normalize(10),
        fontWeight: '700',
    },
    cardTitle: {
        fontSize: normalize(16),
        fontWeight: '700',
        color: COLOR.PRIMARY,
        marginBottom: normalize(8),
    },
    cardContent: {
        fontSize: normalize(13),
        color: COLOR.GRAY,
        lineHeight: normalize(18),
        marginBottom: normalize(12),
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: normalize(12),
        borderTopWidth: 1,
        borderTopColor: '#F8F8F8',
    },
    dateText: {
        fontSize: normalize(11),
        color: COLOR.GRAY,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: normalize(100),
    },
    emptyText: {
        fontSize: normalize(14),
        color: COLOR.GRAY,
        marginTop: normalize(16),
    },
});
