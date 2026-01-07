import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface AboutUsProps {
  navigation: any;
}

export default function AboutUs({ navigation }: AboutUsProps) {
  const companyInfo = {
    name: 'PBI',
    tagline: 'Kreatif untuk Indonesia',
    founded: '2024',
    description: `PBI adalah sebuah organisasi sosial masyarakat yang aktif di Indonesia, terutama dalam mendukung kampanye politik dan sosialisasi program-program dari Presiden Prabowo Subianto dalam mengawal asta cita.

Organisasi ini beranggotakan para relawan yang sebelumnya menyatakan dukungannya kepada Prabowo Subianto sebagai calon presiden dan Gibran Rakabuming Raka sebagai calon wakil presiden.

Dengan demikian, PBI berfungsi sebagai rumah stabilitas pemuda dan pemudi Indonesia yang berusaha meningkatkan kualitas hidup masyarakat melalui dukungan kuat terhadap visi dan misi Prabowo-Gibran.`,
    mission:
      'Mendukung dan mensosialisasikan program-program Presiden Prabowo Subianto dalam mengawal asta cita untuk kemajuan Indonesia.',
    vision:
      'Menjadi organisasi relawan terdepan yang menghubungkan pemuda Indonesia dengan visi kepemimpinan Prabowo-Gibran untuk masa depan bangsa yang lebih baik.',
    values: [
      {
        title: 'Dedikasi',
        description:
          'Setia dan berkomitmen penuh dalam mendukung visi dan misi Prabowo-Gibran untuk Indonesia yang lebih baik.',
        icon: 'heart' as any,
      },
      {
        title: 'Solidaritas',
        description:
          'Membangun kekuatan bersama melalui persatuan dan kesatuan dalam memperjuangkan cita-cita bangsa.',
        icon: 'users' as any,
      },
      {
        title: 'Inovasi',
        description:
          'Menggunakan cara-cara kreatif dan modern dalam mensosialisasikan program-program pemerintah.',
        icon: 'lightbulb' as any,
      },
      {
        title: 'Integritas',
        description:
          'Bekerja dengan jujur, transparan, dan bertanggung jawab dalam setiap kegiatan organisasi.',
        icon: 'shield-alt',
      },
    ],
    services: [
      'Kampanye Politik & Sosialisasi Program',
      'Pengorganisasian Relawan',
      'Kegiatan Sosial Masyarakat',
      'Pendidikan Politik untuk Pemuda',
      'Monitoring Program Asta Cita',
      'Pengembangan Kepemimpinan Muda',
    ],
    contact: {
      email: 'info@pbi.com',
      phone: '+62 21 1234 5678',
      address: 'Jl. Politik No. 08, Jakarta Pusat, Indonesia',
      website: 'www.pbi.com',
    },
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
          Tentang Kami
        </Text>

        <View style={{ width: normalize(40) }} />
      </View>

      {/* Logo Section */}
      <View
        style={{
          alignItems: 'center',
          paddingVertical: normalize(30),
          backgroundColor: COLOR.PRIMARY,
          margin: normalize(20),
          borderRadius: normalize(20),
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
          source={require('../../assets/images/logo2.png')}
          style={{
            width: normalize(120),
            height: normalize(120),
            borderRadius: normalize(40),
          }}
        />
        <Text
          style={{
            fontSize: normalize(24),
            fontWeight: 'bold',
            color: COLOR.SECONDARY,
            marginBottom: normalize(8),
          }}
        >
          {companyInfo.name}
        </Text>
        <Text
          style={{
            fontSize: normalize(14),
            color: COLOR.GRAY,
            textAlign: 'center',
            paddingHorizontal: normalize(20),
          }}
        >
          {companyInfo.tagline}
        </Text>
      </View>

      {/* Company Description */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          marginBottom: normalize(20),
        }}
      >
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(15),
            padding: normalize(20),
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
          <Text
            style={{
              fontSize: normalize(16),
              fontWeight: 'bold',
              color: COLOR.PRIMARY,
              marginBottom: normalize(15),
            }}
          >
            Tentang PBI
          </Text>
          <Text
            style={{
              fontSize: normalize(14),
              color: COLOR.DARK_GRAY,
              lineHeight: normalize(22),
              textAlign: 'justify',
              marginBottom: normalize(15),
            }}
          >
            {companyInfo.description}
          </Text>

          <View style={{ marginBottom: normalize(15) }}>
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
                marginBottom: normalize(8),
              }}
            >
              Visi:
            </Text>
            <Text
              style={{
                fontSize: normalize(14),
                color: COLOR.DARK_GRAY,
                lineHeight: normalize(20),
              }}
            >
              {companyInfo.vision}
            </Text>
          </View>

          <View>
            <Text
              style={{
                fontSize: normalize(14),
                fontWeight: 'bold',
                color: COLOR.PRIMARY,
                marginBottom: normalize(8),
              }}
            >
              Misi:
            </Text>
            <Text
              style={{
                fontSize: normalize(14),
                color: COLOR.DARK_GRAY,
                lineHeight: normalize(20),
              }}
            >
              {companyInfo.mission}
            </Text>
          </View>
        </View>
      </View>

      {/* Company Values */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          marginBottom: normalize(20),
        }}
      >
        <Text
          style={{
            fontSize: normalize(18),
            fontWeight: 'bold',
            color: COLOR.PRIMARY,
            marginBottom: normalize(15),
            textAlign: 'center',
          }}
        >
          Nilai-Nilai Kami
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {companyInfo.values.map((value, index) => (
            <View
              key={index}
              style={{
                width: '48%',
                backgroundColor: COLOR.WHITE,
                borderRadius: normalize(15),
                padding: normalize(15),
                marginBottom: normalize(15),
                alignItems: 'center',
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
              <View
                style={{
                  width: normalize(50),
                  height: normalize(50),
                  borderRadius: normalize(25),
                  backgroundColor: COLOR.PRIMARY,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: normalize(10),
                }}
              >
                <Icon
                  name={value.icon}
                  size={normalize(20)}
                  color={COLOR.SECONDARY}
                  solid
                />
              </View>
              <Text
                style={{
                  fontSize: normalize(14),
                  fontWeight: 'bold',
                  color: COLOR.PRIMARY,
                  textAlign: 'center',
                  marginBottom: normalize(8),
                }}
              >
                {value.title}
              </Text>
              <Text
                style={{
                  fontSize: normalize(10),
                  color: COLOR.GRAY,
                  textAlign: 'center',
                  lineHeight: normalize(14),
                }}
              >
                {value.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Services */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          marginBottom: normalize(20),
        }}
      >
        <Text
          style={{
            fontSize: normalize(18),
            fontWeight: 'bold',
            color: COLOR.PRIMARY,
            marginBottom: normalize(15),
            textAlign: 'center',
          }}
        >
          Layanan Kami
        </Text>

        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(15),
            padding: normalize(20),
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
          {companyInfo.services.map((service, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom:
                  index === companyInfo.services.length - 1 ? 0 : normalize(12),
              }}
            >
              <View
                style={{
                  width: normalize(8),
                  height: normalize(8),
                  borderRadius: normalize(4),
                  backgroundColor: COLOR.PRIMARY,
                  marginRight: normalize(12),
                }}
              />
              <Text
                style={{
                  fontSize: normalize(14),
                  color: COLOR.DARK_GRAY,
                  flex: 1,
                }}
              >
                {service}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Contact Information */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          marginBottom: normalize(20),
        }}
      >
        <Text
          style={{
            fontSize: normalize(18),
            fontWeight: 'bold',
            color: COLOR.PRIMARY,
            marginBottom: normalize(15),
            textAlign: 'center',
          }}
        >
          Hubungi Kami
        </Text>

        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(15),
            padding: normalize(20),
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: normalize(12),
            }}
          >
            <Icon
              name="envelope"
              size={normalize(16)}
              color={COLOR.PRIMARY}
              solid
              style={{ marginRight: normalize(12) }}
            />
            <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY }}>
              {companyInfo.contact.email}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: normalize(12),
            }}
          >
            <Icon
              name="phone"
              size={normalize(16)}
              color={COLOR.PRIMARY}
              solid
              style={{ marginRight: normalize(12) }}
            />
            <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY }}>
              {companyInfo.contact.phone}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: normalize(12),
            }}
          >
            <Icon
              name="map-marker-alt"
              size={normalize(16)}
              color={COLOR.PRIMARY}
              solid
              style={{ marginRight: normalize(12), marginTop: normalize(2) }}
            />
            <Text
              style={{
                fontSize: normalize(14),
                color: COLOR.DARK_GRAY,
                flex: 1,
              }}
            >
              {companyInfo.contact.address}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name="globe-asia"
              size={normalize(16)}
              color={COLOR.PRIMARY}
              solid
              style={{ marginRight: normalize(12) }}
            />
            <Text style={{ fontSize: normalize(14), color: COLOR.DARK_GRAY }}>
              {companyInfo.contact.website}
            </Text>
          </View>
        </View>
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
          © 2025 PBI - Indonesia. Bersama untuk Asta Cita
        </Text>
      </View>
    </ScrollView>
  );
}
