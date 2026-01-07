import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
} from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';

interface ProductDetailProps {
  navigation: any;
  route: any;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  sold: number;
  category: string;
  rating: number;
  description?: string;
  stock?: number;
}

export default function ProductDetail({ navigation, route }: ProductDetailProps) {
  const { product } = route.params || {};
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Default product data if none provided
  const defaultProduct: Product = {
    id: 1,
    name: 'Smartphone Samsung Galaxy A54',
    price: 4500000,
    originalPrice: 5000000,
    image: 'https://via.placeholder.com/400x400/4A90E2/FFFFFF?text=Samsung',
    sold: 125,
    category: 'Elektronik',
    rating: 4.5,
    description: 'Smartphone terbaru dari Samsung dengan kamera berkualitas tinggi, prosesor yang powerful, dan baterai tahan lama. Dilengkapi dengan layar AMOLED 6.4 inch dan fitur fast charging.',
    stock: 50,
  };

  const currentProduct = product || defaultProduct;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    Toast.show({
      type: 'success',
      text1: 'Berhasil Ditambahkan',
      text2: `${currentProduct.name} telah ditambahkan ke keranjang`,
      position: 'top',
    });

    // Navigate to cart after a short delay
    setTimeout(() => {
      navigation.navigate('Cart');
    }, 1000);
  };

  const handleBuyNow = () => {
    // Create cart item from current product
    const cartItems = [
      {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.image,
        quantity: quantity,
        stock: currentProduct.stock || 99,
      },
    ];

    const subtotal = currentProduct.price * quantity;
    const shipping = 15000;
    const total = subtotal + shipping;

    Toast.show({
      type: 'info',
      text1: 'Beli Sekarang',
      text2: 'Mengalihkan ke halaman checkout...',
      position: 'top',
    });

    // Navigate to checkout with product data
    setTimeout(() => {
      navigation.navigate('Checkout', { cartItems, total });
    }, 500);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="star" size={normalize(14)} color="#FFD700" solid />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="star-half-alt" size={normalize(14)} color="#FFD700" solid />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="star" size={normalize(14)} color="#E5E5E5" />
      );
    }

    return stars;
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
          Detail Produk
        </Text>

        <TouchableOpacity
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
            name="heart"
            size={normalize(16)}
            color={COLOR.SECONDARY}
            solid
          />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <View
        style={{
          margin: normalize(20),
          borderRadius: normalize(15),
          overflow: 'hidden',
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
        <Image
          source={{ uri: currentProduct.image }}
          style={{
            width: '100%',
            height: normalize(250),
            resizeMode: 'cover',
          }}
        />
        {currentProduct.originalPrice && (
          <View
            style={{
              position: 'absolute',
              top: normalize(15),
              left: normalize(15),
              backgroundColor: COLOR.DANGER,
              paddingHorizontal: normalize(8),
              paddingVertical: normalize(4),
              borderRadius: normalize(12),
            }}
          >
            <Text
              style={{
                fontSize: normalize(12),
                color: COLOR.WHITE,
                fontWeight: 'bold',
              }}
            >
              {Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View style={{ paddingHorizontal: normalize(20) }}>
        {/* Title and Price */}
        <View style={{ marginBottom: normalize(15) }}>
          <Text
            style={{
              fontSize: normalize(20),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
              marginBottom: normalize(8),
            }}
          >
            {currentProduct.name}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(10) }}>
            <Text
              style={{
                fontSize: normalize(20),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
                marginRight: normalize(10),
              }}
            >
              {formatPrice(currentProduct.price)}
            </Text>
            {currentProduct.originalPrice && (
              <Text
                style={{
                  fontSize: normalize(14),
                  color: COLOR.GRAY,
                  textDecorationLine: 'line-through',
                }}
              >
                {formatPrice(currentProduct.originalPrice)}
              </Text>
            )}
          </View>

          {/* Rating and Sold */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(10) }}>
            <View style={{ flexDirection: 'row', marginRight: normalize(15) }}>
              {renderStars(currentProduct.rating)}
              <Text
                style={{
                  fontSize: normalize(12),
                  color: COLOR.GRAY,
                  marginLeft: normalize(5),
                }}
              >
                {currentProduct.rating} ({currentProduct.sold} terjual)
              </Text>
            </View>
          </View>

          {/* Stock Info */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="box" size={normalize(14)} color={COLOR.SUCCESS} solid />
            <Text
              style={{
                fontSize: normalize(12),
                color: COLOR.SUCCESS,
                marginLeft: normalize(5),
              }}
            >
              Stok tersedia ({currentProduct.stock} unit)
            </Text>
          </View>
        </View>

        {/* Product Options */}
        {currentProduct.category === 'Fashion' && (
          <View style={{ marginBottom: normalize(20) }}>
            {/* Size Selection */}
            <Text
              style={{
                fontSize: normalize(16),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
                marginBottom: normalize(10),
              }}
            >
              Pilih Ukuran:
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: normalize(15) }}>
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={{
                    width: normalize(40),
                    height: normalize(40),
                    borderRadius: normalize(20),
                    borderWidth: 2,
                    borderColor: selectedSize === size ? COLOR.PRIMARY : COLOR.GRAY,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: normalize(10),
                    backgroundColor: selectedSize === size ? COLOR.PRIMARY : 'transparent',
                  }}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={{
                      fontSize: normalize(14),
                      fontWeight: 'bold',
                      color: selectedSize === size ? COLOR.SECONDARY : COLOR.GRAY,
                    }}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Color Selection */}
            <Text
              style={{
                fontSize: normalize(16),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
                marginBottom: normalize(10),
              }}
            >
              Pilih Warna:
            </Text>
            <View style={{ flexDirection: 'row' }}>
              {['#000000', '#FFFFFF', '#FF0000', '#0000FF', '#00FF00'].map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: normalize(40),
                    height: normalize(40),
                    borderRadius: normalize(20),
                    backgroundColor: color,
                    marginRight: normalize(10),
                    borderWidth: selectedColor === color ? 3 : 2,
                    borderColor: selectedColor === color ? COLOR.PRIMARY : COLOR.GRAY,
                  }}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Quantity Selector */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: normalize(20),
            padding: normalize(15),
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(10),
          }}
        >
          <Text
            style={{
              fontSize: normalize(16),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
            }}
          >
            Jumlah:
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                width: normalize(35),
                height: normalize(35),
                borderRadius: normalize(17.5),
                backgroundColor: COLOR.PRIMARY,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Icon name="minus" size={normalize(14)} color={COLOR.SECONDARY} solid />
            </TouchableOpacity>
            <TextInput
              style={{
                width: normalize(50),
                height: normalize(35),
                textAlign: 'center',
                fontSize: normalize(16),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
                marginHorizontal: normalize(15),
                borderWidth: 1,
                borderColor: COLOR.GRAY,
                borderRadius: normalize(5),
              }}
              value={quantity.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || 1;
                setQuantity(Math.min(currentProduct.stock || 99, Math.max(1, num)));
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={{
                width: normalize(35),
                height: normalize(35),
                borderRadius: normalize(17.5),
                backgroundColor: COLOR.PRIMARY,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setQuantity(Math.min(currentProduct.stock || 99, quantity + 1))}
            >
              <Icon name="plus" size={normalize(14)} color={COLOR.SECONDARY} solid />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: 'row',
            marginBottom: normalize(30),
            gap: normalize(10),
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: COLOR.WHITE,
              borderWidth: 2,
              borderColor: COLOR.PRIMARY,
              borderRadius: normalize(10),
              paddingVertical: normalize(15),
              paddingHorizontal: normalize(10),
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
            onPress={handleAddToCart}
          >
            <Icon name="shopping-cart" size={normalize(16)} color={COLOR.PRIMARY} solid />
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
                marginLeft: normalize(8),
              }}
            >
              Keranjang
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: COLOR.PRIMARY,
              borderRadius: normalize(10),
              paddingVertical: normalize(15),
              paddingHorizontal: normalize(10),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handleBuyNow}
          >
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: 'bold',
                color: COLOR.SECONDARY,
              }}
            >
              Beli Sekarang
            </Text>
          </TouchableOpacity>
        </View>

        {/* Product Description */}
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(15),
            padding: normalize(20),
            marginBottom: normalize(20),
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
            Deskripsi Produk
          </Text>
          <Text
            style={{
              fontSize: normalize(14),
              color: COLOR.DARK_GRAY,
              lineHeight: normalize(22),
              textAlign: 'justify',
            }}
          >
            {currentProduct.description}
          </Text>
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: normalize(50) }} />
    </ScrollView>
  );
}
