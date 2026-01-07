import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import { COLOR } from '../../utils/Color';

const CATEGORIES = ['Program Member', 'UMKM', 'Relawan', 'Teknologi', 'Event', 'Kebijakan'];

export default function CreateDiscussion({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();

  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState<string | null>(null);
  const [content, setContent] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const canSubmit = title.trim().length >= 8 && category && content.trim().length >= 20;

  const handleSubmit = () => {
    if (!canSubmit) {
      Toast.show({
        type: 'error',
        text1: 'Form belum lengkap',
        text2: 'Lengkapi judul, kategori, dan isi diskusi minimal 20 karakter.',
        position: 'top',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Toast.show({
        type: 'success',
        text1: 'Diskusi dibuat',
        text2: 'Moderator akan meninjau sebelum ditayangkan.',
        position: 'top',
      });
      navigation.goBack();
    }, 1200);
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
            Buat Diskusi Baru
          </Text>
          <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, lineHeight: normalize(20) }}>
            Sampaikan ide dan pertanyaan Anda kepada komunitas PBI.
          </Text>
        </View>
        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <Text style={{ fontSize: normalize(14), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(10) }}>
            Judul Diskusi
          </Text>
          <View
            style={{
              borderWidth: 1.5,
              borderColor: COLOR.SECONDARY,
              borderRadius: normalize(16),
              paddingHorizontal: normalize(16),
              paddingVertical: normalize(12),
              marginBottom: normalize(18),
            }}
          >
            <TextInput
              placeholder="Contoh: Strategi onboarding member baru"
              placeholderTextColor={COLOR.GRAY}
              value={title}
              onChangeText={setTitle}
              style={{ fontSize: normalize(14), color: COLOR.PRIMARY }}
            />
          </View>

          <Text style={{ fontSize: normalize(14), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(10) }}>
            Kategori
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: normalize(18) }}>
            {CATEGORIES.map((item) => {
              const selected = category === item;
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.85}
                  onPress={() => setCategory(item)}
                  style={{
                    paddingHorizontal: normalize(16),
                    paddingVertical: normalize(10),
                    borderRadius: normalize(20),
                    borderWidth: 1.5,
                    borderColor: selected ? COLOR.PRIMARY : COLOR.SECONDARY,
                    backgroundColor: selected ? COLOR.PRIMARY : COLOR.WHITE,
                    marginRight: normalize(12),
                  }}
                >
                  <Text style={{ color: selected ? COLOR.SECONDARY : COLOR.PRIMARY, fontWeight: '700', fontSize: normalize(12) }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={{ fontSize: normalize(14), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(10) }}>
            Isi Diskusi
          </Text>
          <View
            style={{
              borderWidth: 1.5,
              borderColor: COLOR.SECONDARY,
              borderRadius: normalize(16),
              paddingHorizontal: normalize(16),
              paddingVertical: normalize(12),
              marginBottom: normalize(18),
              minHeight: normalize(150),
            }}
          >
            <TextInput
              placeholder="Tuliskan latar belakang, masalah, atau ide yang ingin dibahas..."
              placeholderTextColor={COLOR.GRAY}
              value={content}
              onChangeText={setContent}
              style={{ fontSize: normalize(14), color: COLOR.PRIMARY }}
              multiline
            />
          </View>

          <Text style={{ fontSize: normalize(14), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(10) }}>
            Tag (opsional)
          </Text>
          <View
            style={{
              borderWidth: 1.5,
              borderColor: COLOR.SECONDARY,
              borderRadius: normalize(16),
              paddingHorizontal: normalize(16),
              paddingVertical: normalize(12),
            }}
          >
            <TextInput
              placeholder="Pisahkan dengan koma, contoh: onboarding, member, growth"
              placeholderTextColor={COLOR.GRAY}
              value={tags}
              onChangeText={setTags}
              style={{ fontSize: normalize(14), color: COLOR.PRIMARY }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            style={{
              marginTop: normalize(24),
              backgroundColor: canSubmit ? COLOR.PRIMARY : COLOR.GRAY,
              paddingVertical: normalize(16),
              borderRadius: normalize(20),
              alignItems: 'center',
            }}
          >
            <Text style={{ color: COLOR.SECONDARY, fontWeight: '700', fontSize: normalize(15) }}>
              {isSubmitting ? 'Mengirim...' : 'Kirim ke Moderator'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}


