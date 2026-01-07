import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';

interface MediaProps {
  navigation: any;
}

interface SocialMedia {
  id: number;
  name: string;
  icon: string;
  color: string;
  url?: string;
  description: string;
}

export default function Media({ navigation }: MediaProps) {
  const socialMediaPlatforms: SocialMedia[] = [
    {
      id: 1,
      name: 'Facebook',
      icon: 'facebook-f',
      color: '#1877F2',
      url: 'https://facebook.com/pbi',
      description: 'Ikuti kami di Facebook untuk update terbaru dan konten eksklusif',
    },
    {
      id: 2,
      name: 'Instagram',
      icon: 'instagram',
      color: '#E4405F',
      url: 'https://instagram.com/pbi',
      description: 'Lihat foto dan video menarik dari komunitas PBI',
    },
    {
      id: 3,
      name: 'TikTok',
      icon: 'play-circle',
      color: '#000000',
      url: 'https://tiktok.com/@pbi',
      description: 'Video kreatif dan konten hiburan dari PBI',
    },
    {
      id: 4,
      name: 'YouTube',
      icon: 'youtube',
      color: '#FF0000',
      url: 'https://youtube.com/channel/pbi',
      description: 'Tutorial, review produk, dan konten video edukatif',
    },
    {
      id: 5,
      name: 'X (Twitter)',
      icon: 'twitter',
      color: '#1DA1F2',
      url: 'https://twitter.com/pbi',
      description: 'Update real-time dan berita terbaru dari PBI',
    },
  ];

  const handleSocialMediaPress = async (platform: SocialMedia) => {
    if (platform.url) {
      try {
        const supported = await Linking.canOpenURL(platform.url);
        if (supported) {
          await Linking.openURL(platform.url);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Tidak dapat membuka aplikasi',
            text2: `Aplikasi ${platform.name} tidak tersedia di perangkat ini`,
            position: 'top',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Terjadi kesalahan saat membuka aplikasi',
          position: 'top',
        });
      }
    } else {
      Toast.show({
        type: 'info',
        text1: platform.name,
        text2: `Fitur ${platform.name} akan segera hadir`,
        position: 'top',
      });
    }
  };

  const renderSocialMediaCard = ({ item }: { item: SocialMedia }) => (
    <TouchableOpacity
      style={{
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
      onPress={() => handleSocialMediaPress(item)}
      activeOpacity={0.9}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: normalize(20),
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: normalize(60),
            height: normalize(60),
            borderRadius: normalize(30),
            backgroundColor: item.color,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: normalize(15),
          }}
        >
          <Icon
            name={item.icon as any}
            size={normalize(28)}
            color={COLOR.WHITE}
            solid
          />
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: normalize(16),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
              marginBottom: normalize(4),
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: normalize(12),
              color: COLOR.GRAY,
              lineHeight: normalize(16),
            }}
          >
            {item.description}
          </Text>
        </View>

        {/* Arrow */}
        <Icon
          name="chevron-right"
          size={normalize(16)}
          color={COLOR.GRAY}
          solid
        />
      </View>
    </TouchableOpacity>
  );

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
          Media Sosial
        </Text>

        <View style={{ width: normalize(40) }} />
      </View>

      {/* Header Info */}
      <View
        style={{
          padding: normalize(20),
          alignItems: 'center',
        }}
      >
        <Icon
          name="share-alt"
          size={normalize(40)}
          color={COLOR.PRIMARY}
          solid
          style={{ marginBottom: normalize(10) }}
        />
        <Text
          style={{
            fontSize: normalize(16),
            fontWeight: 'bold',
            color: COLOR.PRIMARY,
            textAlign: 'center',
            marginBottom: normalize(8),
          }}
        >
          Ikuti Kami di Media Sosial
        </Text>
        <Text
          style={{
            fontSize: normalize(12),
            color: COLOR.GRAY,
            textAlign: 'center',
            lineHeight: normalize(18),
          }}
        >
          Dapatkan update terbaru, konten eksklusif, dan berinteraksi dengan komunitas PBI
        </Text>
      </View>

      {/* Social Media List */}
      <View style={{ paddingHorizontal: normalize(20) }}>
        {socialMediaPlatforms.map((platform) => (
          <View key={platform.id}>
            {renderSocialMediaCard({ item: platform })}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View
        style={{
          padding: normalize(20),
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: normalize(12),
            color: COLOR.GRAY,
            textAlign: 'center',
          }}
        >
          PBI App - Terhubung dengan dunia digital
        </Text>
      </View>
    </ScrollView>
  );
}
