import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    TextInput,
    FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';

const NEWS_CATEGORIES = ['Semua', 'Update', 'Keamanan', 'Kegiatan', 'Tips'];

const newsData = [
    {
        id: 1,
        title: 'Update Fitur Terbaru PBI App',
        description: 'Kami telah menambahkan fitur-fitur menarik untuk meningkatkan pengalaman pengguna.',
        content: 'Kami sangat excited untuk mengumumkan update terbaru dari PBI App yang akan meningkatkan pengalaman pengguna secara signifikan. Fitur-fitur baru meliputi sistem notifikasi cerdas, antarmuka pengguna yang diperbarui, dan keamanan data yang ditingkatkan.',
        image: 'https://images.unsplash.com/photo-1573163231162-73573d99e2b0?q=80&w=2069&auto=format&fit=crop',
        time: '2 jam yang lalu',
        category: 'Update',
        icon: 'newspaper',
        bgColor: '#667eea'
    },
    {
        id: 2,
        title: 'Keamanan Data Terjamin',
        description: 'Sistem keamanan terbaru telah diimplementasikan untuk melindungi data pengguna.',
        content: 'Privasi dan keamanan data Anda adalah prioritas utama kami. Kami baru saja meningkatkan infrastruktur keamanan kami dengan enkripsi tingkat lanjut dan protokol autentikasi multi-faktor.',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop',
        time: '5 jam yang lalu',
        category: 'Keamanan',
        icon: 'shield-alt',
        bgColor: '#4ECDC4'
    },
    {
        id: 3,
        title: 'Tips Menjadi Relawan Aktif',
        description: 'Pelajari cara memaksimalkan peran Anda sebagai relawan di komunitas PBI.',
        content: 'Menjadi relawan bukan hanya tentang memberi waktu, tapi juga tentang dedikasi dan strategi yang tepat untuk memberikan dampak maksimal.',
        image: 'https://images.unsplash.com/photo-1559027615-cd2673675250?q=80&w=2070&auto=format&fit=crop',
        time: '1 hari yang lalu',
        category: 'Tips',
        icon: 'lightbulb',
        bgColor: '#f6ad55'
    },
    {
        id: 4,
        title: 'Kegiatan Sosial Akhir Pekan',
        description: 'Bergabunglah dengan program bakti sosial kami di Jakarta Timur.',
        content: 'Minggu ini kita akan mengadakan pembagian paket sembako dan edukasi kesehatan untuk warga sekitar.',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop',
        time: '2 hari yang lalu',
        category: 'Kegiatan',
        icon: 'users',
        bgColor: '#fc8181'
    },
];

export default function NewsList({ navigation }: { navigation: any }) {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    const filteredNews = newsData.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const renderNewsCard = ({ item }: { item: typeof newsData[0] }) => (
        <TouchableOpacity
            style={styles.newsCard}
            onPress={() => navigation.navigate('NewsDetail', {
                newsId: item.id,
                newsTitle: item.title,
                newsContent: item.content,
                newsImage: item.image
            })}
            activeOpacity={0.9}
        >
            <View style={[styles.cardImageContainer, { backgroundColor: item.bgColor }]}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardImageOverlay} />
                <Icon name={item.icon} size={normalize(30)} color={COLOR.WHITE} solid style={styles.cardIcon} />
                <View style={styles.cardBadge}>
                    <Text style={styles.cardBadgeText}>{item.category.toUpperCase()}</Text>
                </View>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.cardTime}>{item.time}</Text>
                    <Icon name="arrow-right" size={normalize(12)} color={COLOR.PRIMARY} solid />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-left" size={normalize(18)} color={COLOR.SECONDARY} solid />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Berita Terbaru</Text>
                <View style={{ width: normalize(42) }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Icon name="search" size={normalize(16)} color={COLOR.GRAY} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari berita..."
                        placeholderTextColor={COLOR.GRAY}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
                    {NEWS_CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryChip,
                                selectedCategory === cat && styles.categoryChipActive
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === cat && styles.categoryTextActive
                            ]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredNews}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderNewsCard}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="newspaper" size={normalize(60)} color={COLOR.GRAY} solid />
                        <Text style={styles.emptyText}>Tidak ada berita ditemukan.</Text>
                    </View>
                }
            />
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
    searchContainer: {
        paddingHorizontal: normalize(20),
        paddingTop: normalize(20),
        backgroundColor: COLOR.WHITE,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        borderRadius: normalize(12),
        paddingHorizontal: normalize(15),
        height: normalize(48),
    },
    searchIcon: {
        marginRight: normalize(10),
    },
    searchInput: {
        flex: 1,
        fontSize: normalize(14),
        color: COLOR.PRIMARY,
        padding: 0,
    },
    categoriesContainer: {
        paddingVertical: normalize(15),
        backgroundColor: COLOR.WHITE,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: normalize(10),
    },
    categoriesContent: {
        paddingHorizontal: normalize(20),
    },
    categoryChip: {
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(8),
        borderRadius: normalize(20),
        backgroundColor: '#F0F2F5',
        marginRight: normalize(10),
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryChipActive: {
        backgroundColor: COLOR.PRIMARY,
        borderColor: COLOR.PRIMARY,
    },
    categoryText: {
        fontSize: normalize(13),
        fontWeight: '600',
        color: COLOR.GRAY,
    },
    categoryTextActive: {
        color: COLOR.WHITE,
    },
    listContent: {
        padding: normalize(20),
    },
    newsCard: {
        backgroundColor: COLOR.WHITE,
        borderRadius: normalize(16),
        marginBottom: normalize(20),
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    cardImageContainer: {
        height: normalize(160),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cardImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.6,
    },
    cardImageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    cardIcon: {
        zIndex: 1,
    },
    cardBadge: {
        position: 'absolute',
        top: normalize(12),
        right: normalize(12),
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: normalize(8),
        paddingVertical: normalize(4),
        borderRadius: normalize(12),
    },
    cardBadgeText: {
        fontSize: normalize(10),
        fontWeight: '600',
        color: COLOR.WHITE,
    },
    cardContent: {
        padding: normalize(16),
    },
    cardTitle: {
        fontSize: normalize(17),
        fontWeight: 'bold',
        color: COLOR.PRIMARY,
        marginBottom: normalize(8),
        lineHeight: normalize(24),
    },
    cardDescription: {
        fontSize: normalize(13),
        color: COLOR.GRAY,
        lineHeight: normalize(20),
        marginBottom: normalize(12),
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTime: {
        fontSize: normalize(11),
        color: COLOR.GRAY,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: normalize(60),
    },
    emptyText: {
        fontSize: normalize(14),
        color: COLOR.GRAY,
        marginTop: normalize(16),
    },
});
