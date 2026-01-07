import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import normalize from 'react-native-normalize';
import { COLOR } from '../../utils/Color';

const DISCUSSION_TOPICS = [
  {
    id: 't-1',
    title: 'Strategi meningkatkan loyalitas member baru',
    author: 'Hesti W',
    replies: 42,
    lastActivity: '15 menit lalu',
    tags: ['Program Member', 'Kampanye'],
  },
  {
    id: 't-2',
    title: 'Kolaborasi UMKM Ramadan 2025',
    author: 'Riza P',
    replies: 31,
    lastActivity: '1 jam lalu',
    tags: ['UMKM', 'Event'],
  },
  {
    id: 't-3',
    title: 'Tips onboarding relawan lapangan',
    author: 'Dewi M',
    replies: 18,
    lastActivity: '3 jam lalu',
    tags: ['Relawan', 'SOP'],
  },
];

const TRENDING_TAGS = ['Pendanaan', 'Kampanye', 'Event Hybrid', 'Digitalisasi', 'Relawan'];

export default function ForumDiskusi({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleCreateDiscussion = () => {
    navigation.navigate('CreateDiscussion');
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLOR.WHITE, paddingTop: insets.top }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: normalize(32) + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingHorizontal: normalize(20),
            paddingTop: normalize(28),
            paddingBottom: normalize(24),
            backgroundColor: COLOR.SECONDARY,
            borderBottomLeftRadius: normalize(24),
            borderBottomRightRadius: normalize(24),
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: normalize(42),
              height: normalize(42),
              borderRadius: normalize(21),
              backgroundColor: COLOR.PRIMARY,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: normalize(20),
            }}
          >
            <Icon name="arrow-left" size={normalize(16)} color={COLOR.SECONDARY} solid />
          </TouchableOpacity>

          <Text style={{ fontSize: normalize(24), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(6) }}>
            Forum Diskusi
          </Text>
          <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, lineHeight: normalize(20) }}>
            Ruang diskusi hangat untuk berbagi ide, mencari solusi, dan terhubung dengan relawan serta penggerak PBI.
          </Text>
        </View>

        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLOR.WHITE,
              borderRadius: normalize(16),
              borderWidth: 1,
              borderColor: COLOR.SECONDARY,
              paddingHorizontal: normalize(16),
              paddingVertical: normalize(8),
            }}
          >
            <Icon name="search" size={normalize(16)} color={COLOR.PRIMARY} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Cari topik atau kata kunci"
              placeholderTextColor={COLOR.GRAY}
              style={{ flex: 1, marginLeft: normalize(12), color: COLOR.PRIMARY, fontSize: normalize(14) }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="times-circle" size={normalize(16)} color={COLOR.GRAY} solid />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ marginTop: normalize(16) }}>
            <Text style={{ fontSize: normalize(14), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(10) }}>
              Tag Populer
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {TRENDING_TAGS.map((tag) => (
                <View
                  key={tag}
                  style={{
                    backgroundColor: COLOR.PRIMARY,
                    paddingHorizontal: normalize(16),
                    paddingVertical: normalize(8),
                    borderRadius: normalize(20),
                    marginRight: normalize(10),
                  }}
                >
                  <Text style={{ color: COLOR.SECONDARY, fontSize: normalize(12), fontWeight: '700' }}>#{tag}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCreateDiscussion}
            style={{
              marginTop: normalize(18),
              backgroundColor: COLOR.PRIMARY,
              borderRadius: normalize(18),
              paddingVertical: normalize(14),
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Icon name="plus-circle" size={normalize(16)} color={COLOR.SECONDARY} solid style={{ marginRight: normalize(10) }} />
            <Text style={{ color: COLOR.SECONDARY, fontWeight: '700', fontSize: normalize(14) }}>Mulai Diskusi Baru</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(14) }}>
            Diskusi Hangat
          </Text>

          {DISCUSSION_TOPICS.map((topic) => (
            <View
              key={topic.id}
              style={{
                backgroundColor: COLOR.WHITE,
                borderRadius: normalize(18),
                borderWidth: 1,
                borderColor: COLOR.SECONDARY,
                padding: normalize(16),
                marginBottom: normalize(14),
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: normalize(14), color: COLOR.GRAY }}>{topic.author}</Text>
                <Text style={{ fontSize: normalize(12), color: COLOR.GRAY }}>{topic.lastActivity}</Text>
              </View>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontWeight: '700',
                  color: COLOR.PRIMARY,
                  marginTop: normalize(8),
                  marginBottom: normalize(8),
                }}
              >
                {topic.title}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: normalize(10) }}>
                {topic.tags.map((tag) => (
                  <View
                    key={`${topic.id}-${tag}`}
                    style={{
                      backgroundColor: COLOR.SECONDARY,
                      paddingHorizontal: normalize(10),
                      paddingVertical: normalize(4),
                      borderRadius: normalize(12),
                      marginRight: normalize(8),
                      marginBottom: normalize(6),
                    }}
                  >
                    <Text style={{ fontSize: normalize(11), color: COLOR.PRIMARY }}>#{tag}</Text>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="comment-dots" size={normalize(12)} color={COLOR.PRIMARY} solid />
                <Text style={{ marginLeft: normalize(6), color: COLOR.PRIMARY, fontSize: normalize(12) }}>
                  {topic.replies} jawaban
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.85}
                style={{
                  marginTop: normalize(12),
                  backgroundColor: COLOR.PRIMARY,
                  paddingVertical: normalize(10),
                  borderRadius: normalize(14),
                  alignItems: 'center',
                }}
                onPress={() =>
                  navigation.navigate('DiscussionDetail', {
                    discussionId: topic.id,
                  })
                }
              >
                <Text style={{ color: COLOR.SECONDARY, fontWeight: '700' }}>Lihat Detail Diskusi</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


