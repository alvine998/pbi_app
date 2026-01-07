import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';

interface CheckoutProps {
    navigation: any;
    route: any;
}

export default function Checkout({ navigation, route }: CheckoutProps) {
    const { cartItems = [], total = 0 } = route.params || {};

    const [selectedPayment, setSelectedPayment] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');

    const paymentMethods = [
        { id: 'transfer', name: 'Transfer Bank', icon: 'university' },
        { id: 'ewallet', name: 'E-Wallet', icon: 'wallet' },
        { id: 'cod', name: 'Bayar di Tempat (COD)', icon: 'money-bill-wave' },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handlePlaceOrder = () => {
        if (!name || !phone || !address) {
            Toast.show({
                type: 'error',
                text1: 'Data Tidak Lengkap',
                text2: 'Mohon lengkapi semua data pengiriman',
                position: 'top',
            });
            return;
        }

        if (!selectedPayment) {
            Toast.show({
                type: 'error',
                text1: 'Pilih Metode Pembayaran',
                text2: 'Silakan pilih metode pembayaran terlebih dahulu',
                position: 'top',
            });
            return;
        }

        Toast.show({
            type: 'success',
            text1: 'Pesanan Berhasil',
            text2: 'Pesanan Anda sedang diproses',
            position: 'top',
        });

        // Navigate to transaction history
        setTimeout(() => {
            navigation.navigate('TransactionHistory');
        }, 1500);
    };

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
                    Checkout
                </Text>

                <View style={{ width: normalize(40) }} />
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: normalize(20),
                    paddingBottom: normalize(120),
                }}
                showsVerticalScrollIndicator={false}
            >
                {/* Shipping Address Section */}
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
                            marginBottom: normalize(15),
                        }}
                    >
                        Alamat Pengiriman
                    </Text>

                    {/* Name Input */}
                    <View style={{ marginBottom: normalize(12) }}>
                        <Text
                            style={{
                                fontSize: normalize(12),
                                color: COLOR.GRAY,
                                marginBottom: normalize(6),
                            }}
                        >
                            Nama Penerima
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#E5E5E5',
                                borderRadius: normalize(8),
                                padding: normalize(12),
                                fontSize: normalize(14),
                                color: COLOR.PRIMARY,
                            }}
                            placeholder="Masukkan nama penerima"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* Phone Input */}
                    <View style={{ marginBottom: normalize(12) }}>
                        <Text
                            style={{
                                fontSize: normalize(12),
                                color: COLOR.GRAY,
                                marginBottom: normalize(6),
                            }}
                        >
                            Nomor Telepon
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#E5E5E5',
                                borderRadius: normalize(8),
                                padding: normalize(12),
                                fontSize: normalize(14),
                                color: COLOR.PRIMARY,
                            }}
                            placeholder="08xx xxxx xxxx"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    {/* Address Input */}
                    <View>
                        <Text
                            style={{
                                fontSize: normalize(12),
                                color: COLOR.GRAY,
                                marginBottom: normalize(6),
                            }}
                        >
                            Alamat Lengkap
                        </Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#E5E5E5',
                                borderRadius: normalize(8),
                                padding: normalize(12),
                                fontSize: normalize(14),
                                color: COLOR.PRIMARY,
                                height: normalize(80),
                                textAlignVertical: 'top',
                            }}
                            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Provinsi"
                            value={address}
                            onChangeText={setAddress}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                {/* Payment Method Section */}
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
                            marginBottom: normalize(15),
                        }}
                    >
                        Metode Pembayaran
                    </Text>

                    {paymentMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: normalize(12),
                                borderWidth: 2,
                                borderColor: selectedPayment === method.id ? COLOR.PRIMARY : '#E5E5E5',
                                borderRadius: normalize(8),
                                marginBottom: normalize(10),
                                backgroundColor: selectedPayment === method.id ? COLOR.SECONDARY : COLOR.WHITE,
                            }}
                            onPress={() => setSelectedPayment(method.id)}
                        >
                            <View
                                style={{
                                    width: normalize(40),
                                    height: normalize(40),
                                    borderRadius: normalize(20),
                                    backgroundColor: selectedPayment === method.id ? COLOR.PRIMARY : '#F0F0F0',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: normalize(12),
                                }}
                            >
                                <Icon
                                    name={method.icon}
                                    size={normalize(16)}
                                    color={selectedPayment === method.id ? COLOR.SECONDARY : COLOR.GRAY}
                                    solid
                                />
                            </View>
                            <Text
                                style={{
                                    fontSize: normalize(14),
                                    fontWeight: selectedPayment === method.id ? 'bold' : 'normal',
                                    color: COLOR.PRIMARY,
                                    flex: 1,
                                }}
                            >
                                {method.name}
                            </Text>
                            {selectedPayment === method.id && (
                                <Icon name="check-circle" size={normalize(20)} color={COLOR.PRIMARY} solid />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Order Notes */}
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
                            marginBottom: normalize(10),
                        }}
                    >
                        Catatan Pesanan (Opsional)
                    </Text>
                    <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: '#E5E5E5',
                            borderRadius: normalize(8),
                            padding: normalize(12),
                            fontSize: normalize(14),
                            color: COLOR.PRIMARY,
                            height: normalize(60),
                            textAlignVertical: 'top',
                        }}
                        placeholder="Tambahkan catatan untuk penjual..."
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Order Summary */}
                <View
                    style={{
                        backgroundColor: COLOR.WHITE,
                        borderRadius: normalize(12),
                        padding: normalize(15),
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
                        Ringkasan Pesanan
                    </Text>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: normalize(8),
                        }}
                    >
                        <Text style={{ fontSize: normalize(14), color: COLOR.GRAY }}>
                            Subtotal
                        </Text>
                        <Text style={{ fontSize: normalize(14), fontWeight: '600', color: COLOR.PRIMARY }}>
                            {formatPrice(total - 15000)}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: normalize(12),
                        }}
                    >
                        <Text style={{ fontSize: normalize(14), color: COLOR.GRAY }}>
                            Ongkos Kirim
                        </Text>
                        <Text style={{ fontSize: normalize(14), fontWeight: '600', color: COLOR.PRIMARY }}>
                            {formatPrice(15000)}
                        </Text>
                    </View>

                    <View
                        style={{
                            height: 1,
                            backgroundColor: '#E5E5E5',
                            marginBottom: normalize(12),
                        }}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={{ fontSize: normalize(16), fontWeight: 'bold', color: COLOR.PRIMARY }}>
                            Total Pembayaran
                        </Text>
                        <Text style={{ fontSize: normalize(18), fontWeight: 'bold', color: COLOR.PRIMARY }}>
                            {formatPrice(total)}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Button */}
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
                        backgroundColor: COLOR.PRIMARY,
                        borderRadius: normalize(12),
                        paddingVertical: normalize(15),
                        alignItems: 'center',
                    }}
                    onPress={handlePlaceOrder}
                >
                    <Text
                        style={{
                            fontSize: normalize(16),
                            fontWeight: 'bold',
                            color: COLOR.SECONDARY,
                        }}
                    >
                        Buat Pesanan
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
