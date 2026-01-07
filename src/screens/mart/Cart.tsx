import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    FlatList,
} from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';

interface CartProps {
    navigation: any;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
}

export default function Cart({ navigation }: CartProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            name: 'Smartphone Samsung Galaxy A54',
            price: 4500000,
            image: 'https://via.placeholder.com/100x100/4A90E2/FFFFFF?text=Samsung',
            quantity: 1,
            stock: 50,
        },
        {
            id: 2,
            name: 'Laptop ASUS VivoBook',
            price: 7500000,
            image: 'https://via.placeholder.com/100x100/FF6B35/FFFFFF?text=ASUS',
            quantity: 1,
            stock: 30,
        },
        {
            id: 3,
            name: 'Headphone Sony WH-1000XM5',
            price: 4200000,
            image: 'https://via.placeholder.com/100x100/2E8B57/FFFFFF?text=Sony',
            quantity: 2,
            stock: 100,
        },
    ]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const updateQuantity = (id: number, newQuantity: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.min(Math.max(1, newQuantity), item.stock) }
                    : item
            )
        );
    };

    const removeItem = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        Toast.show({
            type: 'success',
            text1: 'Item Dihapus',
            text2: 'Produk telah dihapus dari keranjang',
            position: 'top',
        });
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const shipping = 15000; // Fixed shipping cost
        return subtotal + shipping;
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Keranjang Kosong',
                text2: 'Tambahkan produk ke keranjang terlebih dahulu',
                position: 'top',
            });
            return;
        }
        navigation.navigate('Checkout', { cartItems, total: calculateTotal() });
    };

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View
            style={{
                backgroundColor: COLOR.WHITE,
                borderRadius: normalize(12),
                padding: normalize(15),
                marginBottom: normalize(12),
                flexDirection: 'row',
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
            {/* Product Image */}
            <Image
                source={{ uri: item.image }}
                style={{
                    width: normalize(80),
                    height: normalize(80),
                    borderRadius: normalize(8),
                    marginRight: normalize(12),
                }}
            />

            {/* Product Info */}
            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        fontSize: normalize(14),
                        fontWeight: 'bold',
                        color: COLOR.PRIMARY,
                        marginBottom: normalize(4),
                    }}
                    numberOfLines={2}
                >
                    {item.name}
                </Text>

                <Text
                    style={{
                        fontSize: normalize(16),
                        fontWeight: 'bold',
                        color: COLOR.PRIMARY,
                        marginBottom: normalize(8),
                    }}
                >
                    {formatPrice(item.price)}
                </Text>

                {/* Quantity Controls */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{
                                width: normalize(28),
                                height: normalize(28),
                                borderRadius: normalize(14),
                                backgroundColor: COLOR.SECONDARY,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: COLOR.PRIMARY,
                            }}
                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                            <Icon name="minus" size={normalize(12)} color={COLOR.PRIMARY} solid />
                        </TouchableOpacity>

                        <Text
                            style={{
                                fontSize: normalize(14),
                                fontWeight: 'bold',
                                color: COLOR.PRIMARY,
                                marginHorizontal: normalize(12),
                                minWidth: normalize(30),
                                textAlign: 'center',
                            }}
                        >
                            {item.quantity}
                        </Text>

                        <TouchableOpacity
                            style={{
                                width: normalize(28),
                                height: normalize(28),
                                borderRadius: normalize(14),
                                backgroundColor: COLOR.PRIMARY,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                            <Icon name="plus" size={normalize(12)} color={COLOR.SECONDARY} solid />
                        </TouchableOpacity>
                    </View>

                    {/* Delete Button */}
                    <TouchableOpacity
                        onPress={() => removeItem(item.id)}
                        style={{
                            padding: normalize(8),
                        }}
                    >
                        <Icon name="trash" size={normalize(16)} color={COLOR.DANGER} solid />
                    </TouchableOpacity>
                </View>
            </View>
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
                    Keranjang Belanja
                </Text>

                <View style={{ width: normalize(40) }} />
            </View>

            {/* Cart Items List */}
            {cartItems.length > 0 ? (
                <>
                    <FlatList
                        data={cartItems}
                        renderItem={renderCartItem}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{
                            padding: normalize(20),
                            paddingBottom: normalize(200),
                        }}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Bottom Summary */}
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: COLOR.WHITE,
                            borderTopLeftRadius: normalize(20),
                            borderTopRightRadius: normalize(20),
                            padding: normalize(20),
                            elevation: 10,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: -2,
                            },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                        }}
                    >
                        {/* Subtotal */}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: normalize(8),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: normalize(14),
                                    color: COLOR.GRAY,
                                }}
                            >
                                Subtotal ({cartItems.length} item)
                            </Text>
                            <Text
                                style={{
                                    fontSize: normalize(14),
                                    fontWeight: '600',
                                    color: COLOR.PRIMARY,
                                }}
                            >
                                {formatPrice(calculateSubtotal())}
                            </Text>
                        </View>

                        {/* Shipping */}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: normalize(12),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: normalize(14),
                                    color: COLOR.GRAY,
                                }}
                            >
                                Ongkos Kirim
                            </Text>
                            <Text
                                style={{
                                    fontSize: normalize(14),
                                    fontWeight: '600',
                                    color: COLOR.PRIMARY,
                                }}
                            >
                                {formatPrice(15000)}
                            </Text>
                        </View>

                        {/* Divider */}
                        <View
                            style={{
                                height: 1,
                                backgroundColor: '#E5E5E5',
                                marginBottom: normalize(12),
                            }}
                        />

                        {/* Total */}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: normalize(15),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: normalize(16),
                                    fontWeight: 'bold',
                                    color: COLOR.PRIMARY,
                                }}
                            >
                                Total
                            </Text>
                            <Text
                                style={{
                                    fontSize: normalize(18),
                                    fontWeight: 'bold',
                                    color: COLOR.PRIMARY,
                                }}
                            >
                                {formatPrice(calculateTotal())}
                            </Text>
                        </View>

                        {/* Checkout Button */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: COLOR.PRIMARY,
                                borderRadius: normalize(12),
                                paddingVertical: normalize(15),
                                alignItems: 'center',
                            }}
                            onPress={handleCheckout}
                        >
                            <Text
                                style={{
                                    fontSize: normalize(16),
                                    fontWeight: 'bold',
                                    color: COLOR.SECONDARY,
                                }}
                            >
                                Lanjut ke Pembayaran
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: normalize(40),
                    }}
                >
                    <Icon name="shopping-cart" size={normalize(80)} color={COLOR.GRAY} />
                    <Text
                        style={{
                            fontSize: normalize(18),
                            fontWeight: 'bold',
                            color: COLOR.PRIMARY,
                            marginTop: normalize(20),
                            marginBottom: normalize(10),
                        }}
                    >
                        Keranjang Kosong
                    </Text>
                    <Text
                        style={{
                            fontSize: normalize(14),
                            color: COLOR.GRAY,
                            textAlign: 'center',
                            marginBottom: normalize(30),
                        }}
                    >
                        Belum ada produk di keranjang Anda.{'\n'}Yuk, mulai belanja sekarang!
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: COLOR.PRIMARY,
                            borderRadius: normalize(12),
                            paddingVertical: normalize(12),
                            paddingHorizontal: normalize(30),
                        }}
                        onPress={() => navigation.goBack()}
                    >
                        <Text
                            style={{
                                fontSize: normalize(14),
                                fontWeight: 'bold',
                                color: COLOR.SECONDARY,
                            }}
                        >
                            Mulai Belanja
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
