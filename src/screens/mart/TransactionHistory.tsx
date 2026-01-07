import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
} from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface TransactionHistoryProps {
    navigation: any;
}

interface Transaction {
    id: string;
    orderNumber: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    items: number;
    total: number;
}

export default function TransactionHistory({ navigation }: TransactionHistoryProps) {
    const [selectedFilter, setSelectedFilter] = useState<string>('all');

    const transactions: Transaction[] = [
        {
            id: '1',
            orderNumber: 'ORD-2024-001',
            date: '2024-01-07',
            status: 'delivered',
            items: 3,
            total: 16215000,
        },
        {
            id: '2',
            orderNumber: 'ORD-2024-002',
            date: '2024-01-06',
            status: 'shipped',
            items: 1,
            total: 4515000,
        },
        {
            id: '3',
            orderNumber: 'ORD-2024-003',
            date: '2024-01-05',
            status: 'processing',
            items: 2,
            total: 12015000,
        },
        {
            id: '4',
            orderNumber: 'ORD-2024-004',
            date: '2024-01-04',
            status: 'pending',
            items: 1,
            total: 7515000,
        },
        {
            id: '5',
            orderNumber: 'ORD-2024-005',
            date: '2024-01-03',
            status: 'cancelled',
            items: 2,
            total: 8715000,
        },
    ];

    const filters = [
        { id: 'all', label: 'Semua' },
        { id: 'pending', label: 'Menunggu' },
        { id: 'processing', label: 'Diproses' },
        { id: 'shipped', label: 'Dikirim' },
        { id: 'delivered', label: 'Selesai' },
        { id: 'cancelled', label: 'Dibatalkan' },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return '#FFA500';
            case 'processing':
                return '#1E90FF';
            case 'shipped':
                return '#9370DB';
            case 'delivered':
                return COLOR.SUCCESS;
            case 'cancelled':
                return COLOR.DANGER;
            default:
                return COLOR.GRAY;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Menunggu Pembayaran';
            case 'processing':
                return 'Sedang Diproses';
            case 'shipped':
                return 'Dalam Pengiriman';
            case 'delivered':
                return 'Pesanan Selesai';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return 'clock';
            case 'processing':
                return 'cog';
            case 'shipped':
                return 'truck';
            case 'delivered':
                return 'check-circle';
            case 'cancelled':
                return 'times-circle';
            default:
                return 'question-circle';
        }
    };

    const filteredTransactions = selectedFilter === 'all'
        ? transactions
        : transactions.filter(t => t.status === selectedFilter);

    const renderTransaction = ({ item }: { item: Transaction }) => (
        <TouchableOpacity
            style={{
                backgroundColor: COLOR.WHITE,
                borderRadius: normalize(12),
                padding: normalize(15),
                marginBottom: normalize(12),
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1,
                },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            }}
            onPress={() => {
                // Navigate to transaction detail if needed
            }}
        >
            {/* Order Number and Date */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: normalize(10),
                }}
            >
                <View>
                    <Text
                        style={{
                            fontSize: normalize(14),
                            fontWeight: 'bold',
                            color: COLOR.PRIMARY,
                            marginBottom: normalize(4),
                        }}
                    >
                        {item.orderNumber}
                    </Text>
                    <Text
                        style={{
                            fontSize: normalize(12),
                            color: COLOR.GRAY,
                        }}
                    >
                        {formatDate(item.date)}
                    </Text>
                </View>

                {/* Status Badge */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: getStatusColor(item.status) + '20',
                        paddingHorizontal: normalize(10),
                        paddingVertical: normalize(6),
                        borderRadius: normalize(12),
                    }}
                >
                    <Icon
                        name={getStatusIcon(item.status)}
                        size={normalize(12)}
                        color={getStatusColor(item.status)}
                        solid
                    />
                    <Text
                        style={{
                            fontSize: normalize(11),
                            fontWeight: '600',
                            color: getStatusColor(item.status),
                            marginLeft: normalize(5),
                        }}
                    >
                        {getStatusLabel(item.status)}
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View
                style={{
                    height: 1,
                    backgroundColor: '#F0F0F0',
                    marginBottom: normalize(10),
                }}
            />

            {/* Items and Total */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="box" size={normalize(14)} color={COLOR.GRAY} solid />
                    <Text
                        style={{
                            fontSize: normalize(12),
                            color: COLOR.GRAY,
                            marginLeft: normalize(6),
                        }}
                    >
                        {item.items} item
                    </Text>
                </View>

                <View>
                    <Text
                        style={{
                            fontSize: normalize(12),
                            color: COLOR.GRAY,
                            marginBottom: normalize(2),
                        }}
                    >
                        Total Belanja
                    </Text>
                    <Text
                        style={{
                            fontSize: normalize(16),
                            fontWeight: 'bold',
                            color: COLOR.PRIMARY,
                            textAlign: 'right',
                        }}
                    >
                        {formatPrice(item.total)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
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
                    Riwayat Transaksi
                </Text>

                <View style={{ width: normalize(40) }} />
            </View>

            {/* Filter Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: normalize(20),
                    paddingVertical: normalize(15),
                }}
            >
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter.id}
                        style={{
                            paddingHorizontal: normalize(16),
                            paddingVertical: normalize(0),
                            borderRadius: normalize(10),
                            backgroundColor: selectedFilter === filter.id ? COLOR.PRIMARY : COLOR.WHITE,
                            marginRight: normalize(10),
                            borderWidth: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: selectedFilter === filter.id ? COLOR.PRIMARY : '#E5E5E5',
                        }}
                        onPress={() => setSelectedFilter(filter.id)}
                    >
                        <Text
                            style={{
                                fontSize: normalize(13),
                                fontWeight: selectedFilter === filter.id ? 'bold' : 'normal',
                                color: selectedFilter === filter.id ? COLOR.SECONDARY : COLOR.GRAY,
                            }}
                        >
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Transaction List */}
            {filteredTransactions.length > 0 ? (
                <FlatList
                    data={filteredTransactions}
                    renderItem={renderTransaction}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{
                        paddingHorizontal: normalize(20),
                        paddingBottom: normalize(20),
                    }}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: normalize(40),
                    }}
                >
                    <Icon name="receipt" size={normalize(80)} color={COLOR.GRAY} />
                    <Text
                        style={{
                            fontSize: normalize(18),
                            fontWeight: 'bold',
                            color: COLOR.PRIMARY,
                            marginTop: normalize(20),
                            marginBottom: normalize(10),
                        }}
                    >
                        Tidak Ada Transaksi
                    </Text>
                    <Text
                        style={{
                            fontSize: normalize(14),
                            color: COLOR.GRAY,
                            textAlign: 'center',
                        }}
                    >
                        Belum ada transaksi dengan status ini
                    </Text>
                </View>
            )}
        </View>
    );
}
