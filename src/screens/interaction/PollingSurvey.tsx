import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome5';
import normalize from 'react-native-normalize';
import { COLOR } from '../../utils/Color';
import { requireKyc } from '../../utils/authGuard';

interface PollOption {
  id: string;
  label: string;
  percentage: number;
}

interface PollItem {
  id: string;
  question: string;
  description: string;
  totalVotes: number;
  options: PollOption[];
  deadline: string;
}

const POLL_DATA: PollItem[] = [
  {
    id: 'poll-1',
    question: 'Program prioritas komunitas di kuartal 2?',
    description: 'Pilih agenda yang paling berdampak untuk komunitas PBI.',
    totalVotes: 187,
    deadline: '24 Maret 2025',
    options: [
      { id: 'opt-1', label: 'Pendampingan UMKM Digital', percentage: 48 },
      { id: 'opt-2', label: 'Pelatihan Relawan Lapangan', percentage: 32 },
      { id: 'opt-3', label: 'Ekspansi Near Member', percentage: 20 },
    ],
  },
  {
    id: 'poll-2',
    question: 'Format forum diskusi favorit kamu?',
    description: 'Kami ingin memastikan forum berlangsung nyaman bagi semua anggota.',
    totalVotes: 92,
    deadline: '30 Maret 2025',
    options: [
      { id: 'opt-4', label: 'Live Zoom', percentage: 37 },
      { id: 'opt-5', label: 'Thread Forum Asinkron', percentage: 41 },
      { id: 'opt-6', label: 'Voice Chat Telegram', percentage: 22 },
    ],
  },
];

export default function PollingSurvey({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const [selectedOptions, setSelectedOptions] = React.useState<Record<string, string>>({});

  const handleVote = (pollId: string, optionId: string) => {
    requireKyc(navigation, () => {
      setSelectedOptions((prev) => ({ ...prev, [pollId]: optionId }));
    });
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
            Polling & Survey
          </Text>
          <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY, lineHeight: normalize(20) }}>
            Suara Anda berarti. Ikut serta pada polling untuk menentukan arah komunitas secara kolaboratif.
          </Text>
        </View>

        <View style={{ paddingHorizontal: normalize(20), paddingTop: normalize(24) }}>
          <View
            style={{
              backgroundColor: COLOR.PRIMARY,
              borderRadius: normalize(18),
              padding: normalize(18),
              marginBottom: normalize(20),
            }}
          >
            <Text style={{ color: COLOR.SECONDARY, fontWeight: '700', fontSize: normalize(15), marginBottom: normalize(8) }}>
              Tips ikutan polling
            </Text>
            <Text style={{ color: '#f8d1c6', fontSize: normalize(12), lineHeight: normalize(18) }}>
              - Pilih opsi paling relevan dengan kebutuhan komunitas Anda.{'\n'}
              - Polling ditutup otomatis sesuai tenggat.{'\n'}
              - Hasil akhir akan diumumkan via notifikasi aplikasi.
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: normalize(20) }}>
          {POLL_DATA.map((poll) => (
            <View
              key={poll.id}
              style={{
                backgroundColor: COLOR.WHITE,
                borderRadius: normalize(18),
                borderWidth: 1,
                borderColor: COLOR.SECONDARY,
                padding: normalize(18),
                marginBottom: normalize(18),
              }}
            >
              <Text style={{ fontSize: normalize(14), color: COLOR.GRAY, marginBottom: normalize(6) }}>
                Sampai {poll.deadline}
              </Text>
              <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.PRIMARY, marginBottom: normalize(8) }}>
                {poll.question}
              </Text>
              <Text style={{ fontSize: normalize(13), color: COLOR.DARK_GRAY, marginBottom: normalize(14), lineHeight: normalize(20) }}>
                {poll.description}
              </Text>

              {poll.options.map((option) => {
                const selected = selectedOptions[poll.id] === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => handleVote(poll.id, option.id)}
                    activeOpacity={0.85}
                    style={{
                      borderWidth: 1.5,
                      borderColor: selected ? COLOR.PRIMARY : COLOR.SECONDARY,
                      backgroundColor: selected ? COLOR.PRIMARY : COLOR.WHITE,
                      borderRadius: normalize(16),
                      paddingVertical: normalize(14),
                      paddingHorizontal: normalize(16),
                      marginBottom: normalize(12),
                    }}
                  >
                    <Text style={{ color: selected ? COLOR.SECONDARY : COLOR.PRIMARY, fontWeight: '700', fontSize: normalize(14) }}>
                      {option.label}
                    </Text>
                    <View
                      style={{
                        marginTop: normalize(10),
                        height: normalize(8),
                        borderRadius: normalize(4),
                        backgroundColor: '#f4d7c9',
                        overflow: 'hidden',
                      }}
                    >
                      <View
                        style={{
                          width: `${option.percentage}%`,
                          backgroundColor: selected ? COLOR.SECONDARY : COLOR.PRIMARY,
                          height: '100%',
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        marginTop: normalize(6),
                        color: selected ? COLOR.SECONDARY : COLOR.PRIMARY,
                        fontSize: normalize(12),
                        fontWeight: '700',
                      }}
                    >
                      {option.percentage}% suara
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <View
                style={{
                  marginTop: normalize(8),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: COLOR.GRAY, fontSize: normalize(12) }}>{poll.totalVotes} responden</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Icon name="share" size={normalize(12)} color={COLOR.PRIMARY} solid />
                  <Text style={{ marginLeft: normalize(6), color: COLOR.PRIMARY, fontSize: normalize(12), fontWeight: '700' }}>
                    Bagikan hasil
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


