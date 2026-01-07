import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLOR } from '../../utils/Color';
import Toast from 'react-native-toast-message';
import { requireKyc } from '../../utils/authGuard';

interface DiscussionDetailProps {
  navigation: any;
  route: { params?: { discussionId?: string } };
}

const SAMPLE_DISCUSSIONS: Record<string, any> = {
  't-1': {
    title: 'Strategi meningkatkan loyalitas member baru',
    author: 'Hesti W',
    time: 'Diposting 2 jam lalu',
    category: 'Program Member',
    body:
      'Kami ingin menyusun rangkaian onboarding 14 hari untuk member baru. Apa saja konten yang paling efektif menurut pengalaman kalian? ' +
      'Apakah ada yang pernah mencoba welcome challenge dengan hadiah kecil? Mohon masukannya.',
    tags: ['Program Member', 'Retention'],
    comments: [
      {
        id: 'c-1',
        user: 'Agus P',
        time: '30 menit lalu',
        content: 'Kami berhasil meningkatkan engagement dengan menghadirkan sesi live zoom bersama founder di hari ke-7.',
      },
      {
        id: 'c-2',
        user: 'Maya N',
        time: '12 menit lalu',
        content: 'Gamification works! Poin kecil tiap kali mereka menyelesaikan modul onboarding.',
      },
    ],
  },
  't-2': {
    title: 'Kolaborasi UMKM Ramadan 2025',
    author: 'Riza P',
    time: 'Diposting kemarin',
    category: 'UMKM',
    body:
      'Tim kami sedang menyusun katalog digital bersama 25 UMKM binaan. Apa tools yang kalian pakai untuk photoshoot produk kolektif?',
    tags: ['UMKM', 'Ramadan'],
    comments: [
      {
        id: 'c-3',
        user: 'Lina P',
        time: '3 jam lalu',
        content: 'Bisa pakai studio portable yang disewakan harian di daerah kalian, lebih efisien.',
      },
    ],
  },
};

export default function DiscussionDetail({ navigation, route }: DiscussionDetailProps) {
  const insets = useSafeAreaInsets();
  const discussionId = route?.params?.discussionId || 't-1';
  const discussion = SAMPLE_DISCUSSIONS[discussionId] || SAMPLE_DISCUSSIONS['t-1'];
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');

  const handleSubmitComment = () => {
    if (commentText.trim().length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Komentar terlalu pendek',
        text2: 'Tulis minimal 10 karakter sebelum mengirim.',
        position: 'top',
      });
      return;
    }
    Toast.show({
      type: 'success',
      text1: 'Komentar terkirim',
      text2: 'Moderator akan meninjau komentar Anda.',
      position: 'top',
    });
    setCommentText('');
    setModalVisible(false);
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
            Detail Diskusi
          </Text>
          <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, lineHeight: normalize(20) }}>
            Ikuti percakapan komunitas dan tambahkan perspektif Anda.
          </Text>
        </View>

        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <View
            style={{
              backgroundColor: COLOR.WHITE,
              borderRadius: normalize(18),
              borderWidth: 1,
              borderColor: COLOR.SECONDARY,
              padding: normalize(18),
            }}
          >
            <Text style={{ fontSize: normalize(12), color: COLOR.GRAY, marginBottom: normalize(6) }}>{discussion.time}</Text>
            <Text style={{ fontSize: normalize(18), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(8) }}>
              {discussion.title}
            </Text>
            <Text style={{ fontSize: normalize(14), color: COLOR.PRIMARY, marginBottom: normalize(6) }}>Oleh {discussion.author}</Text>
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: COLOR.PRIMARY,
                paddingHorizontal: normalize(16),
                paddingVertical: normalize(8),
                borderRadius: normalize(16),
                marginBottom: normalize(12),
              }}
            >
              <Text style={{ color: COLOR.SECONDARY, fontSize: normalize(12), fontWeight: '700' }}>{discussion.category}</Text>
            </View>
            <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, lineHeight: normalize(22) }}>{discussion.body}</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: normalize(16) }}>
              {discussion.tags.map((tag: string) => (
                <View
                  key={tag}
                  style={{
                    backgroundColor: COLOR.SECONDARY,
                    paddingHorizontal: normalize(12),
                    paddingVertical: normalize(6),
                    borderRadius: normalize(14),
                    marginRight: normalize(8),
                    marginBottom: normalize(8),
                  }}
                >
                  <Text style={{ color: COLOR.PRIMARY, fontSize: normalize(12), fontWeight: '600' }}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(14) }}>
            Balasan Komunitas
          </Text>

          {discussion.comments.map((comment: any) => (
            <View
              key={comment.id}
              style={{
                backgroundColor: COLOR.WHITE,
                borderRadius: normalize(18),
                borderWidth: 1,
                borderColor: COLOR.SECONDARY,
                padding: normalize(16),
                marginBottom: normalize(12),
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(6) }}>
                <Text style={{ fontSize: normalize(14), fontWeight: '700', color: COLOR.PRIMARY }}>{comment.user}</Text>
                <Text style={{ fontSize: normalize(12), color: COLOR.GRAY }}>{comment.time}</Text>
              </View>
              <Text style={{ fontSize: normalize(13), color: COLOR.PRIMARY, lineHeight: normalize(20) }}>{comment.content}</Text>
              <View style={{ flexDirection: 'row', marginTop: normalize(10) }}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginRight: normalize(16) }}>
                  <Icon name="heart" size={normalize(12)} color={COLOR.PRIMARY} solid />
                  <Text style={{ marginLeft: normalize(6), color: COLOR.PRIMARY, fontSize: normalize(12) }}>Suka</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="reply" size={normalize(12)} color={COLOR.PRIMARY} solid />
                  <Text style={{ marginLeft: normalize(6), color: COLOR.PRIMARY, fontSize: normalize(12) }}>Balas</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              marginTop: normalize(10),
              backgroundColor: COLOR.PRIMARY,
              paddingVertical: normalize(14),
              borderRadius: normalize(18),
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            onPress={() => requireKyc(navigation, () => setModalVisible(true))}
          >
            <Icon name="pen" size={normalize(14)} color={COLOR.SECONDARY} solid style={{ marginRight: normalize(8) }} />
            <Text style={{ color: COLOR.SECONDARY, fontWeight: '700' }}>Tambah Komentar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={{ flex: 1, justifyContent: 'flex-end' }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: COLOR.WHITE,
                    borderTopLeftRadius: normalize(24),
                    borderTopRightRadius: normalize(24),
                    padding: normalize(20),
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: normalize(18), fontWeight: '700', color: COLOR.PRIMARY }}>Tambah Komentar</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Icon name="times" size={normalize(18)} color={COLOR.PRIMARY} />
                    </TouchableOpacity>
                  </View>
                  <Text style={{ fontSize: normalize(12), color: COLOR.GRAY, marginTop: normalize(4) }}>
                    Komentar Anda akan ditinjau oleh moderator sebelum ditampilkan.
                  </Text>

                  <View
                    style={{
                      marginTop: normalize(16),
                      borderWidth: 1.5,
                      borderColor: COLOR.SECONDARY,
                      borderRadius: normalize(18),
                      padding: normalize(14),
                      minHeight: normalize(150),
                    }}
                  >
                    <TextInput
                      placeholder="Bagikan insight atau dukungan Anda..."
                      placeholderTextColor={COLOR.GRAY}
                      value={commentText}
                      onChangeText={setCommentText}
                      style={{ fontSize: normalize(14), color: COLOR.PRIMARY }}
                      multiline
                    />
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={{
                      marginTop: normalize(18),
                      backgroundColor: COLOR.PRIMARY,
                      paddingVertical: normalize(14),
                      borderRadius: normalize(18),
                      alignItems: 'center',
                    }}
                    onPress={handleSubmitComment}
                  >
                    <Text style={{ color: COLOR.SECONDARY, fontWeight: '700', fontSize: normalize(14) }}>Kirim Komentar</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}


