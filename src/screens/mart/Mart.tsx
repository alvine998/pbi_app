import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
  Modal
} from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface MartProps {
  navigation: any;
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
}

export default function Mart({ navigation }: MartProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState('Terbaru');

  // Sample product data
  const products: Product[] = [
    {
      id: 1,
      name: 'Smartphone Samsung Galaxy A54',
      price: 4500000,
      originalPrice: 5000000,
      image: 'https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=Samsung',
      sold: 125,
      category: 'Elektronik',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Laptop ASUS VivoBook 14',
      price: 8500000,
      image: 'https://via.placeholder.com/200x200/8B5CF6/FFFFFF?text=ASUS',
      sold: 89,
      category: 'Elektronik',
      rating: 4.7
    },
    {
      id: 3,
      name: 'Kemeja Formal Pria',
      price: 299000,
      originalPrice: 399000,
      image: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=Shirt',
      sold: 234,
      category: 'Fashion',
      rating: 4.3
    },
    {
      id: 4,
      name: 'Sepatu Sneakers Nike Air Max',
      price: 1500000,
      originalPrice: 1800000,
      image: 'https://via.placeholder.com/200x200/EF4444/FFFFFF?text=Nike',
      sold: 67,
      category: 'Fashion',
      rating: 4.6
    },
    {
      id: 5,
      name: 'Kamera Mirrorless Canon EOS M50',
      price: 7500000,
      image: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=Canon',
      sold: 45,
      category: 'Elektronik',
      rating: 4.8
    },
    {
      id: 6,
      name: 'Tas Ransel Backpack',
      price: 450000,
      image: 'https://via.placeholder.com/200x200/6366F1/FFFFFF?text=Bag',
      sold: 156,
      category: 'Fashion',
      rating: 4.2
    }
  ];

  const categories = ['Semua', 'Elektronik', 'Fashion', 'Makanan', 'Kesehatan'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Harga Terendah':
        return a.price - b.price;
      case 'Harga Tertinggi':
        return b.price - a.price;
      case 'Terlaris':
        return b.sold - a.sold;
      case 'Rating Tertinggi':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={{
        width: '48%',
        backgroundColor: COLOR.WHITE,
        borderRadius: normalize(15),
        marginBottom: normalize(15),
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
      activeOpacity={0.9}
    >
      {/* Product Image */}
      <View
        style={{
          height: normalize(120),
          backgroundColor: '#F3F4F6',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{
            width: '80%',
            height: '80%',
            resizeMode: 'contain',
          }}
        />
        {item.originalPrice && (
          <View
            style={{
              position: 'absolute',
              top: normalize(8),
              right: normalize(8),
              backgroundColor: COLOR.DANGER,
              paddingHorizontal: normalize(6),
              paddingVertical: normalize(2),
              borderRadius: normalize(10),
            }}
          >
            <Text
              style={{
                fontSize: normalize(10),
                color: COLOR.WHITE,
                fontWeight: 'bold',
              }}
            >
              Promo
            </Text>
          </View>
        )}
      </View>

      {/* Product Info */}
      <View
        style={{
          padding: normalize(12),
        }}
      >
        <Text
          style={{
            fontSize: normalize(12),
            fontWeight: 'bold',
            color: COLOR.PRIMARY,
            marginBottom: normalize(4),
            height: normalize(32),
          }}
          numberOfLines={2}
        >
          {item.name}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(4) }}>
          <Text
            style={{
              fontSize: normalize(14),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
            }}
          >
            {formatPrice(item.price)}
          </Text>
          {item.originalPrice && (
            <Text
              style={{
                fontSize: normalize(10),
                color: COLOR.GRAY,
                textDecorationLine: 'line-through',
                marginLeft: normalize(4),
              }}
            >
              {formatPrice(item.originalPrice)}
            </Text>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="shopping-cart" size={normalize(10)} color={COLOR.GRAY} solid />
            <Text
              style={{
                fontSize: normalize(10),
                color: COLOR.GRAY,
                marginLeft: normalize(4),
              }}
            >
              Terjual {item.sold}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="star" size={normalize(10)} color="#FFD700" />
            <Text
              style={{
                fontSize: normalize(10),
                color: COLOR.GRAY,
                marginLeft: normalize(2),
              }}
            >
              {item.rating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={{
        paddingHorizontal: normalize(16),
        paddingVertical: normalize(8),
        marginRight: normalize(10),
        borderRadius: normalize(20),
        backgroundColor: selectedCategory === item ? COLOR.PRIMARY : '#F3F4F6',
      }}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={{
          fontSize: normalize(12),
          color: selectedCategory === item ? COLOR.SECONDARY : COLOR.GRAY,
          fontWeight: selectedCategory === item ? 'bold' : 'normal',
        }}
      >
        {item}
      </Text>
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
          Mart
        </Text>

        <View style={{ width: normalize(40) }} />
      </View>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          margin: normalize(20),
          paddingHorizontal: normalize(15),
          paddingVertical: normalize(12),
          backgroundColor: COLOR.WHITE,
          borderRadius: normalize(25),
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
        <Icon name="search" size={normalize(16)} color={COLOR.GRAY} solid />
        <TextInput
          style={{
            flex: 1,
            marginLeft: normalize(10),
            fontSize: normalize(14),
            color: COLOR.PRIMARY,
          }}
          placeholder="Cari produk..."
          placeholderTextColor={COLOR.GRAY}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Icon name="filter" size={normalize(16)} color={COLOR.PRIMARY} solid />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View
        style={{
          marginBottom: normalize(20),
        }}
      >
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: normalize(20),
          }}
        />
      </View>

      {/* Products Grid */}
      <FlatList
        data={sortedProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: normalize(20),
          paddingBottom: normalize(100),
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: normalize(50),
            }}
          >
            <Icon name="search" size={normalize(50)} color={COLOR.GRAY} solid />
            <Text
              style={{
                fontSize: normalize(16),
                color: COLOR.GRAY,
                marginTop: normalize(15),
                textAlign: 'center',
              }}
            >
              Produk tidak ditemukan
            </Text>
            <Text
              style={{
                fontSize: normalize(12),
                color: COLOR.GRAY,
                textAlign: 'center',
                marginTop: normalize(5),
              }}
            >
              Coba ubah kata kunci atau filter pencarian
            </Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: COLOR.WHITE,
              borderTopLeftRadius: normalize(20),
              borderTopRightRadius: normalize(20),
              padding: normalize(20),
            }}
          >
            <Text
              style={{
                fontSize: normalize(18),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
                marginBottom: normalize(20),
                textAlign: 'center',
              }}
            >
              Filter & Urutkan
            </Text>

            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
                marginBottom: normalize(10),
              }}
            >
              Urutkan Berdasarkan:
            </Text>

            {['Terbaru', 'Harga Terendah', 'Harga Tertinggi', 'Terlaris', 'Rating Tertinggi'].map((option) => (
              <TouchableOpacity
                key={option}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: normalize(10),
                  paddingHorizontal: normalize(15),
                  marginBottom: normalize(5),
                  borderRadius: normalize(10),
                  backgroundColor: sortBy === option ? '#E3F2FD' : 'transparent',
                }}
                onPress={() => {
                  setSortBy(option);
                  setShowFilterModal(false);
                }}
              >
                <Icon
                  name={sortBy === option ? 'check-circle' : 'circle'}
                  size={normalize(16)}
                  color={sortBy === option ? COLOR.PRIMARY : COLOR.GRAY}
                  style={{ marginRight: normalize(10) }}
                />
                <Text
                  style={{
                    fontSize: normalize(14),
                    color: sortBy === option ? COLOR.PRIMARY : COLOR.GRAY,
                  }}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={{
                marginTop: normalize(20),
                padding: normalize(15),
                backgroundColor: COLOR.PRIMARY,
                borderRadius: normalize(10),
                alignItems: 'center',
              }}
              onPress={() => setShowFilterModal(false)}
            >
              <Text
                style={{
                  fontSize: normalize(16),
                  fontWeight: 'bold',
                  color: COLOR.SECONDARY,
                }}
              >
                Terapkan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
