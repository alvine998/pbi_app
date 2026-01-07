import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, Dimensions, Share, Alert } from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface NewsDetailProps {
  navigation: any;
  route: any;
}

export default function NewsDetail({ navigation, route }: NewsDetailProps) {
  const { width } = Dimensions.get('window');
  const params = route.params || {};

  // Sample detailed news content with enhanced data, preferring route params
  const sampleNewsData = {
    id: params.newsId || 1,
    title: params.newsTitle || 'Update Fitur Terbaru PBI App',
    image: params.newsImage || 'https://images.unsplash.com/photo-1573163231162-73573d99e2b0?q=80&w=2069&auto=format&fit=crop',
    content: params.newsContent || `
      Kami sangat excited untuk mengumumkan update terbaru dari PBI App yang akan meningkatkan pengalaman pengguna secara signifikan.
      
      Fitur-fitur baru yang telah kami tambahkan meliputi sistem notifikasi yang lebih cerdas, antarmuka pengguna yang diperbaharui, dan keamanan data yang ditingkatkan.
    `,
    author: 'Tim PBI',
    authorAvatar: 'https://ui-avatars.com/api/?name=Tim+PBI&background=0D1B2A&color=fff',
    date: params.newsTime || '15 Oktober 2024',
    readTime: '5 menit baca',
    category: params.newsCategory || 'Update',
    views: 1250,
    likes: 89,
    shares: 23
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${sampleNewsData.title}\n\n${sampleNewsData.content}\n\nBaca selengkapnya di PBI App!`,
        title: sampleNewsData.title,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.WHITE }}>
      <StatusBar backgroundColor={COLOR.PRIMARY} barStyle="light-content" />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image with Gradient Overlay */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: sampleNewsData.image }}
            style={{
              width: '100%',
              height: normalize(280),
              resizeMode: 'cover',
            }}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}
          />

          {/* Header with Back Button */}
          <View
            style={{
              position: 'absolute',
              top: normalize(50),
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: normalize(20),
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: normalize(44),
                height: normalize(44),
                borderRadius: normalize(22),
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon
                name="arrow-left"
                size={normalize(18)}
                color={COLOR.WHITE}
                solid
              />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={handleShare}
                style={{
                  width: normalize(44),
                  height: normalize(44),
                  borderRadius: normalize(22),
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name="share-alt"
                  size={normalize(18)}
                  color={COLOR.WHITE}
                  solid
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Badge */}
          <View
            style={{
              position: 'absolute',
              top: normalize(100),
              left: normalize(20),
              backgroundColor: COLOR.PRIMARY,
              paddingHorizontal: normalize(12),
              paddingVertical: normalize(6),
              borderRadius: normalize(20),
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Text
              style={{
                fontSize: normalize(12),
                fontWeight: '600',
                color: COLOR.WHITE,
              }}
            >
              {sampleNewsData.category}
            </Text>
          </View>
        </View>

        {/* Content Card */}
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderTopLeftRadius: normalize(24),
            borderTopRightRadius: normalize(24),
            marginTop: normalize(-24),
            paddingTop: normalize(24),
            paddingHorizontal: normalize(20),
            paddingBottom: normalize(30),
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Author Info */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: normalize(20),
            }}
          >
            <Image
              source={{ uri: sampleNewsData.authorAvatar }}
              style={{
                width: normalize(48),
                height: normalize(48),
                borderRadius: normalize(24),
                marginRight: normalize(12),
              }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontWeight: '600',
                  color: COLOR.PRIMARY,
                  marginBottom: normalize(4),
                }}
              >
                {sampleNewsData.author}
              </Text>
              <Text
                style={{
                  fontSize: normalize(13),
                  color: COLOR.GRAY,
                }}
              >
                {sampleNewsData.date} • {sampleNewsData.readTime}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F8F9FA',
                paddingHorizontal: normalize(12),
                paddingVertical: normalize(6),
                borderRadius: normalize(20),
              }}
            >
              <Icon
                name="eye"
                size={normalize(12)}
                color={COLOR.GRAY}
                solid
                style={{ marginRight: normalize(4) }}
              />
              <Text
                style={{
                  fontSize: normalize(12),
                  color: COLOR.GRAY,
                }}
              >
                {sampleNewsData.views}
              </Text>
            </View>
          </View>

          {/* News Title */}
          <Text
            style={{
              fontSize: normalize(28),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
              marginBottom: normalize(20),
              lineHeight: normalize(36),
            }}
          >
            {sampleNewsData.title}
          </Text>

          {/* News Content */}
          <Text
            style={{
              fontSize: normalize(16),
              color: '#2C3E50',
              lineHeight: normalize(28),
              textAlign: 'justify',
              marginBottom: normalize(30),
            }}
          >
            {sampleNewsData.content}
          </Text>

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: normalize(20),
              borderTopWidth: 1,
              borderTopColor: '#F0F0F0',
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFF5F5',
                paddingHorizontal: normalize(20),
                paddingVertical: normalize(12),
                borderRadius: normalize(25),
                borderWidth: 1,
                borderColor: '#FED7D7',
              }}
            >
              <Icon
                name="heart"
                size={normalize(16)}
                color="#E53E3E"
                solid
                style={{ marginRight: normalize(8) }}
              />
              <Text
                style={{
                  fontSize: normalize(14),
                  fontWeight: '600',
                  color: '#E53E3E',
                }}
              >
                {sampleNewsData.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShare}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F0F9FF',
                paddingHorizontal: normalize(32),
                paddingVertical: normalize(12),
                borderRadius: normalize(25),
                borderWidth: 1,
                borderColor: '#BEE3F8',
              }}
            >
              <Icon
                name="share-alt"
                size={normalize(16)}
                color="#3182CE"
                solid
                style={{ marginRight: normalize(8) }}
              />
              <Text
                style={{
                  fontSize: normalize(14),
                  fontWeight: '600',
                  color: '#3182CE',
                }}
              >
                Bagikan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
