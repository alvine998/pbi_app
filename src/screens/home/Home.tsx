import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  RefreshControl,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import { requireAuth, requireKyc } from '../../utils/authGuard';
import { useAuth } from '../../hooks/useAuth';
import { useIsFocused } from '@react-navigation/native';
import api from '../../services/api';

interface HomeProps {
  navigation: any;
}

export default function Home({ navigation }: HomeProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { width } = Dimensions.get('window');
  const slideWidth = width - normalize(40); // Account for container margins
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const {
    isAuthenticated,
    user,
    isLoading: authLoading,
    hasCompletedKyc,
    refreshAuth,
  } = useAuth();
  const isFocused = useIsFocused();

  // Additional padding for Samsung devices and devices with gesture navigation
  const getBottomPadding = () => {
    if (Platform.OS === 'android') {
      // For Android devices, especially Samsung Galaxy Z Fold
      return Math.max(insets.bottom, normalize(16));
    }
    return insets.bottom;
  };

  // Handle protected feature (requires login)
  const handleProtectedFeature = async (
    featureName: string,
    onGranted?: () => void,
    requiresKyc: boolean = false,
  ) => {
    if (requiresKyc) {
      await requireKyc(
        navigation,
        () => {
          if (onGranted) {
            onGranted();
          } else {
            Toast.show({
              type: 'success',
              text1: 'Akses Diberikan',
              text2: `Mengakses ${featureName}...`,
              position: 'top',
            });
          }
        },
        `Fitur ${featureName} memerlukan login terlebih dahulu`,
        `Fitur ${featureName} hanya tersedia untuk anggota yang sudah menyelesaikan verifikasi KYC (KTP).`,
      );
      return;
    }

    await requireAuth(
      navigation,
      () => {
        if (onGranted) {
          onGranted();
        } else {
          Toast.show({
            type: 'success',
            text1: 'Akses Diberikan',
            text2: `Mengakses ${featureName}...`,
            position: 'top',
          });
        }
      },
      `Fitur ${featureName} memerlukan login terlebih dahulu`,
    );
  };

  const carouselData = [
    {
      id: 1,
      icon: 'star' as const,
      title: 'Selamat Datang di PBI!',
      description: 'Nikmati pengalaman terbaik dengan fitur-fitur terbaru kami',
      color: COLOR.PRIMARY,
    },
    {
      id: 2,
      icon: 'rocket' as const,
      title: 'Fitur Baru Tersedia!',
      description: 'Temukan kemudahan dalam mengelola data Anda',
      color: '#FF6B35',
    },
    {
      id: 3,
      icon: 'shield-alt' as const,
      title: 'Keamanan Terjamin',
      description: 'Data Anda aman dengan sistem keamanan terdepan',
      color: '#2E8B57',
    },
  ];

  const [news, setNews] = React.useState<any[]>([]);
  const [isNewsLoading, setIsNewsLoading] = React.useState(true);

  React.useEffect(() => {
    if (isFocused && news.length === 0) {
      fetchLatestNews();
    }
  }, [isFocused, news.length]);

  const fetchLatestNews = async () => {
    setIsNewsLoading(true);
    try {
      const response = await api.get('/news', {
        params: {
          limit: 3,
          page: 1,
          status: 'Published'
        }
      });
      if (response.data && response.data.items) {
        setNews(response.data.items);
      }
    } catch (error) {
      console.error('Error fetching latest news:', error);
    } finally {
      setIsNewsLoading(false);
    }
  };

  // Auto-advance carousel
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselData.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Animate slide changes
  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: -currentSlide * slideWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentSlide]);

  const handleSlidePress = (index: number) => {
    setCurrentSlide(index);
  };

  const handleLogout = () => {
    Toast.show({
      type: 'info',
      text1: 'Logout Berhasil',
      text2: 'Sampai jumpa lagi!',
      position: 'top',
    });
    // Navigate back to Prelogin screen
    navigation.reset({
      index: 0,
      routes: [{ name: 'Prelogin' }],
    });
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Toast.show({
        type: 'info',
        text1: 'Pencarian',
        text2: `Mencari: ${searchQuery}`,
        position: 'top',
      });
      // Add your search logic here
    }
  };


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    // Simulate refreshing data
    setTimeout(() => {
      // Reset carousel to first slide
      setCurrentSlide(0);
      // Reset animation value
      slideAnim.setValue(0);

      Toast.show({
        type: 'success',
        text1: 'Data Diperbarui',
        text2: 'Konten telah diperbarui dengan data terbaru',
        position: 'top',
      });

      setRefreshing(false);
    }, 2000); // Simulate 2 second refresh time
  }, [slideAnim]);

  // Get user name from auth or use guest
  const displayName = isAuthenticated && user ? user.name : 'Tamu';
  const currentUser = {
    name: displayName,
    email: isAuthenticated && user ? user.email : '',
    joinDate:
      isAuthenticated && user
        ? new Date(user.createdAt).toLocaleDateString('id-ID', {
          month: 'long',
          year: 'numeric',
        })
        : '',
  };

  const renderRestrictionBadge = (needsAuth: boolean, needsKyc: boolean) => {
    if (!needsAuth && !needsKyc) {
      return null;
    }

    const iconName = needsAuth ? 'lock' : 'id-card';
    const backgroundColor = needsAuth ? COLOR.PRIMARY : '#1A73E8';
    const label = needsAuth ? 'Login' : 'KYC';

    return (
      <View
        style={{
          position: 'absolute',
          top: -2,
          right: -2,
          backgroundColor,
          borderRadius: normalize(10),
          minWidth: normalize(22),
          height: normalize(22),
          paddingHorizontal: normalize(6),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: normalize(4),
        }}
      >
        <Icon name={iconName} size={normalize(10)} color={COLOR.WHITE} solid />
        <Text
          style={{
            color: COLOR.WHITE,
            fontSize: normalize(9),
            fontWeight: '700',
          }}
        >
          {label}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
      {/* Sticky Header */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          paddingHorizontal: normalize(20),
          paddingTop: normalize(50),
          paddingBottom: normalize(20),
          backgroundColor: COLOR.WHITE,
        }}
      >
        {/* Header Row - Search Bar and User Icon */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Left - Search Bar */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLOR.WHITE,
              borderRadius: normalize(25),
              paddingHorizontal: normalize(15),
              paddingVertical: normalize(8),
              marginRight: normalize(15),
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Icon
              name="search"
              size={normalize(20)}
              color={COLOR.GRAY}
              solid
              style={{ marginRight: normalize(10) }}
            />
            <TextInput
              style={{
                flex: 1,
                fontSize: normalize(16),
                color: COLOR.PRIMARY,
                paddingVertical: normalize(10),
              }}
              placeholder="Cari produk atau layanan..."
              placeholderTextColor={COLOR.GRAY}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={{ marginLeft: normalize(10) }}
              >
                <Icon
                  name="times"
                  size={normalize(16)}
                  color={COLOR.GRAY}
                  solid
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Right - User Icon */}
          <TouchableOpacity
            onPress={handleProfilePress}
            style={{
              width: normalize(50),
              height: normalize(50),
              borderRadius: normalize(50),
              backgroundColor: COLOR.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon
              name="user"
              size={normalize(20)}
              color={COLOR.SECONDARY}
              solid
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: COLOR.WHITE,
          zIndex: 1,
        }}
        contentContainerStyle={{
          paddingTop: normalize(120), // Account for sticky header height
          paddingBottom: normalize(70) + getBottomPadding() + normalize(20), // Account for bottom tabs + safe area
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLOR.PRIMARY]}
            tintColor={COLOR.PRIMARY}
            title="Menarik untuk memperbarui..."
            titleColor={COLOR.PRIMARY}
            progressViewOffset={normalize(120)}
          />
        }
      >
        {/* Welcome Section */}
        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingVertical: normalize(20),
            backgroundColor: COLOR.WHITE,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: normalize(15),
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: normalize(18),
                  fontWeight: 'bold',
                  color: COLOR.PRIMARY,
                  marginBottom: normalize(4),
                }}
              >
                Halo, {currentUser.name}! 👋
              </Text>
              <Text
                style={{
                  fontSize: normalize(14),
                  color: COLOR.GRAY,
                }}
              >
                Apa yang ingin Anda lakukan hari ini?
              </Text>
            </View>
            {!isAuthenticated ? (
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={{
                  backgroundColor: COLOR.PRIMARY,
                  paddingHorizontal: normalize(20),
                  paddingVertical: normalize(12),
                  borderRadius: normalize(25),
                  shadowColor: COLOR.PRIMARY,
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: normalize(14),
                    fontWeight: 'bold',
                    color: COLOR.WHITE,
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            ) : (
              !hasCompletedKyc && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')}
                  style={{
                    backgroundColor: COLOR.PRIMARY,
                    paddingHorizontal: normalize(20),
                    paddingVertical: normalize(12),
                    borderRadius: normalize(25),
                    shadowColor: COLOR.PRIMARY,
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: normalize(14),
                      fontWeight: 'bold',
                      color: COLOR.WHITE,
                    }}
                  >
                    Lengkapi KYC
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {/* Carousel Banner */}

        {/* Services Section */}
        <View
          style={{
            paddingHorizontal: normalize(20),
            marginBottom: normalize(25),
          }}
        >
          <Text
            style={{
              fontSize: normalize(20),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
              marginBottom: normalize(20),
            }}
          >
            Layanan Kami
          </Text>

          <View
            style={{
              backgroundColor: COLOR.WHITE,
              borderRadius: normalize(20),
              padding: normalize(20),
              // shadowColor: '#000',
              // shadowOffset: {
              //   width: 0,
              //   height: 4,
              // },
              // shadowOpacity: 0.1,
              // shadowRadius: 12,
              // elevation: 1,
              borderWidth: 1,
              borderColor: COLOR.SECONDARY,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              {/* Mart */}
              <TouchableOpacity
                style={{
                  width: '22%',
                  alignItems: 'center',
                  marginBottom: normalize(20),
                }}
                onPress={() => navigation.navigate('Mart')}
              >
                <View
                  style={{
                    width: normalize(60),
                    height: normalize(60),
                    backgroundColor: '#FF6B35',
                    borderRadius: normalize(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: normalize(8),
                    shadowColor: '#FF6B35',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Icon
                    name="shopping-cart"
                    size={normalize(24)}
                    color={COLOR.WHITE}
                    solid
                  />
                </View>
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '600',
                    color: COLOR.PRIMARY,
                    textAlign: 'center',
                  }}
                >
                  Mart
                </Text>
              </TouchableOpacity>

              {/* Event - Protected Feature (Requires Login) */}
              <TouchableOpacity
                style={{
                  width: '22%',
                  alignItems: 'center',
                  marginBottom: normalize(20),
                }}
                onPress={() =>
                  handleProtectedFeature(
                    'Event',
                    () => navigation.navigate('Event'),
                  )
                }
              >
                <View
                  style={{
                    width: normalize(60),
                    height: normalize(60),
                    backgroundColor: '#4ECDC4',
                    borderRadius: normalize(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: normalize(8),
                    shadowColor: '#4ECDC4',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                    position: 'relative',
                  }}
                >
                  <Icon
                    name="calendar-alt"
                    size={normalize(24)}
                    color={COLOR.WHITE}
                    solid
                  />
                  {renderRestrictionBadge(!isAuthenticated, false)}
                </View>
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '600',
                    color: COLOR.PRIMARY,
                    textAlign: 'center',
                  }}
                >
                  Event
                </Text>
              </TouchableOpacity>

              {/* Near Member */}
              <TouchableOpacity
                style={{
                  width: '22%',
                  alignItems: 'center',
                  marginBottom: normalize(20),
                }}
                onPress={() =>
                  handleProtectedFeature(
                    'Near Member',
                    () => navigation.navigate('NearMember'),
                    true,
                  )
                }
              >
                <View
                  style={{
                    width: normalize(60),
                    height: normalize(60),
                    backgroundColor: '#45B7D1',
                    borderRadius: normalize(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: normalize(8),
                    shadowColor: '#45B7D1',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                    position: 'relative',
                  }}
                >
                  <Icon
                    name="users"
                    size={normalize(24)}
                    color={COLOR.WHITE}
                    solid
                  />
                  {renderRestrictionBadge(!isAuthenticated, !hasCompletedKyc)}
                </View>
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '600',
                    color: COLOR.PRIMARY,
                    textAlign: 'center',
                  }}
                >
                  Near Member
                </Text>
              </TouchableOpacity>

              {/* Aspirasiku */}
              <TouchableOpacity
                style={{
                  width: '22%',
                  alignItems: 'center',
                  marginBottom: normalize(20),
                }}
                onPress={() =>
                  handleProtectedFeature('Aspirasiku', () =>
                    navigation.navigate('Aspirasiku'),
                    false,
                  )
                }
              >
                <View
                  style={{
                    width: normalize(60),
                    height: normalize(60),
                    backgroundColor: '#FFD93D',
                    borderRadius: normalize(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: normalize(8),
                    shadowColor: '#FFD93D',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                    position: 'relative',
                  }}
                >
                  <Icon
                    name="lightbulb"
                    size={normalize(24)}
                    color={COLOR.WHITE}
                    solid
                  />
                </View>
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '600',
                    color: COLOR.PRIMARY,
                    textAlign: 'center',
                  }}
                >
                  Aspirasiku
                </Text>
              </TouchableOpacity>

              {/* Media */}
              <TouchableOpacity
                style={{
                  width: '22%',
                  alignItems: 'center',
                  marginBottom: normalize(20),
                }}
                onPress={() => navigation.navigate('Media')}
              >
                <View
                  style={{
                    width: normalize(60),
                    height: normalize(60),
                    backgroundColor: '#FECA57',
                    borderRadius: normalize(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: normalize(8),
                    shadowColor: '#FECA57',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Icon
                    name="play-circle"
                    size={normalize(24)}
                    color={COLOR.WHITE}
                    solid
                  />
                </View>
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '600',
                    color: COLOR.PRIMARY,
                    textAlign: 'center',
                  }}
                >
                  Media
                </Text>
              </TouchableOpacity>

              {/* About Us */}
              <TouchableOpacity
                style={{
                  width: '22%',
                  alignItems: 'center',
                  marginBottom: normalize(20),
                }}
                onPress={() => navigation.navigate('AboutUs')}
              >
                <View
                  style={{
                    width: normalize(60),
                    height: normalize(60),
                    backgroundColor: '#A8E6CF',
                    borderRadius: normalize(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: normalize(8),
                    shadowColor: '#A8E6CF',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Icon
                    name="info-circle"
                    size={normalize(24)}
                    color={COLOR.WHITE}
                    solid
                  />
                </View>
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '600',
                    color: COLOR.PRIMARY,
                    textAlign: 'center',
                  }}
                >
                  About Us
                </Text>
              </TouchableOpacity>

              {/* Interaction */}
              <TouchableOpacity
                style={{
                  width: '22%',
                  alignItems: 'center',
                  marginBottom: normalize(20),
                }}
                onPress={() =>
                  handleProtectedFeature(
                    'Interaction',
                    () => navigation.navigate('InteractionMenu'),
                    true,
                  )
                }
              >
                <View
                  style={{
                    width: normalize(60),
                    height: normalize(60),
                    backgroundColor: '#DDA0DD',
                    borderRadius: normalize(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: normalize(8),
                    shadowColor: '#DDA0DD',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                    position: 'relative',
                  }}
                >
                  <Icon
                    name="comments"
                    size={normalize(24)}
                    color={COLOR.WHITE}
                    solid
                  />
                  {renderRestrictionBadge(!isAuthenticated, !hasCompletedKyc)}
                </View>
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '600',
                    color: COLOR.PRIMARY,
                    textAlign: 'center',
                  }}
                >
                  Interaction
                </Text>
              </TouchableOpacity>

              {/* SOS */}
              <TouchableOpacity
                style={{
                  width: '22%',
                  alignItems: 'center',
                  marginBottom: normalize(20),
                }}
                onPress={() =>
                  handleProtectedFeature(
                    'SOS',
                    () => navigation.navigate('SOS'),
                  )
                }
              >
                <View
                  style={{
                    width: normalize(60),
                    height: normalize(60),
                    backgroundColor: '#FF6B6B',
                    borderRadius: normalize(30),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: normalize(8),
                    shadowColor: '#FF6B6B',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                    position: 'relative',
                  }}
                >
                  <Icon
                    name="exclamation-triangle"
                    size={normalize(24)}
                    color={COLOR.WHITE}
                    solid
                  />
                  {renderRestrictionBadge(!isAuthenticated, false)}
                </View>
                <Text
                  style={{
                    fontSize: normalize(12),
                    fontWeight: '600',
                    color: COLOR.PRIMARY,
                    textAlign: 'center',
                  }}
                >
                  SOS
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* News Section */}
        <View
          style={{
            paddingHorizontal: normalize(20),
            marginBottom: normalize(30),
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: normalize(20),
            }}
          >
            <Text
              style={{
                fontSize: normalize(20),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
              }}
            >
              Berita Terbaru
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('NewsList')}>
              <Text
                style={{
                  fontSize: normalize(14),
                  fontWeight: '600',
                  color: COLOR.PRIMARY,
                }}
              >
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>

          {isNewsLoading ? (
            <View style={{ alignItems: 'center', paddingVertical: normalize(20) }}>
              <Text style={{ color: COLOR.GRAY }}>Memuat berita...</Text>
            </View>
          ) : (
            news.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  backgroundColor: COLOR.WHITE,
                  borderRadius: normalize(16),
                  marginBottom: normalize(16),
                  overflow: 'hidden',
                  elevation: 8,
                }}
                onPress={() => navigation.navigate('NewsDetail', {
                  newsId: item.id,
                  newsTitle: item.title,
                  newsContent: item.content,
                  newsImage: item.image,
                  newsTime: new Date(item.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }),
                  newsCategory: item.category
                })}
                activeOpacity={0.9}
              >
                <View
                  style={{
                    height: normalize(140),
                    backgroundColor: COLOR.SECONDARY,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  {item.image ? (
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    />
                  ) : (
                    <Icon
                      name="newspaper"
                      size={normalize(40)}
                      color={COLOR.PRIMARY}
                      solid
                      style={{ zIndex: 1 }}
                    />
                  )}
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.2)',
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      top: normalize(12),
                      right: normalize(12),
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      paddingHorizontal: normalize(8),
                      paddingVertical: normalize(4),
                      borderRadius: normalize(12),
                    }}
                  >
                    <Text
                      style={{
                        fontSize: normalize(10),
                        fontWeight: '600',
                        color: COLOR.WHITE,
                      }}
                    >
                      {(item.category || 'Berita').toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    padding: normalize(16),
                  }}
                >
                  <Text
                    style={{
                      fontSize: normalize(16),
                      fontWeight: 'bold',
                      color: COLOR.PRIMARY,
                      marginBottom: normalize(8),
                      lineHeight: normalize(22),
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: normalize(13),
                      color: COLOR.GRAY,
                      lineHeight: normalize(18),
                      marginBottom: normalize(12),
                    }}
                    numberOfLines={2}
                  >
                    {item.content ? item.content.replace(/<[^>]*>?/gm, '').substring(0, 100) : ''}...
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: normalize(11),
                        color: COLOR.GRAY,
                      }}
                    >
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </Text>
                    <Icon
                      name="arrow-right"
                      size={normalize(12)}
                      color={COLOR.PRIMARY}
                      solid
                    />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
