import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface InteraksiProps {
  navigation: any;
}

export default function Interaksi({ navigation }: InteraksiProps) {
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: COLOR.WHITE,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          paddingTop: normalize(50),
          paddingBottom: normalize(20),
          backgroundColor: COLOR.SECONDARY,
          borderBottomLeftRadius: normalize(20),
          borderBottomRightRadius: normalize(20),
        }}
      >
        <Text
          style={{
            fontSize: normalize(24),
            fontWeight: 'bold',
            color: COLOR.PRIMARY,
            textAlign: 'center',
          }}
        >
          Interaksi
        </Text>
        <Text
          style={{
            fontSize: normalize(14),
            color: COLOR.GRAY,
            textAlign: 'center',
            marginTop: normalize(8),
          }}
        >
          Berinteraksi dengan komunitas PBI
        </Text>
      </View>

      {/* Content */}
      <View
        style={{
          paddingHorizontal: normalize(20),
          paddingVertical: normalize(30),
        }}
      >
        <Text
          style={{
            fontSize: normalize(18),
            fontWeight: 'bold',
            color: COLOR.PRIMARY,
            marginBottom: normalize(20),
          }}
        >
          Fitur Interaksi
        </Text>

        {/* Feature Cards */}
        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(16),
            padding: normalize(20),
            marginBottom: normalize(16),
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: normalize(12),
            }}
          >
            <View
              style={{
                width: normalize(50),
                height: normalize(50),
                backgroundColor: '#4ECDC4',
                borderRadius: normalize(25),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(15),
              }}
            >
              <Icon
                name="comments"
                size={normalize(24)}
                color={COLOR.WHITE}
                solid
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontWeight: 'bold',
                  color: COLOR.PRIMARY,
                }}
              >
                Forum Diskusi
              </Text>
              <Text
                style={{
                  fontSize: normalize(13),
                  color: COLOR.GRAY,
                }}
              >
                Diskusikan topik menarik dengan komunitas
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(16),
            padding: normalize(20),
            marginBottom: normalize(16),
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: normalize(12),
            }}
          >
            <View
              style={{
                width: normalize(50),
                height: normalize(50),
                backgroundColor: '#FECA57',
                borderRadius: normalize(25),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(15),
              }}
            >
              <Icon
                name="users"
                size={normalize(24)}
                color={COLOR.WHITE}
                solid
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontWeight: 'bold',
                  color: COLOR.PRIMARY,
                }}
              >
                Grup Komunitas
              </Text>
              <Text
                style={{
                  fontSize: normalize(13),
                  color: COLOR.GRAY,
                }}
              >
                Bergabung dengan grup sesuai minat Anda
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(16),
            padding: normalize(20),
            marginBottom: normalize(16),
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: normalize(12),
            }}
          >
            <View
              style={{
                width: normalize(50),
                height: normalize(50),
                backgroundColor: '#96CEB4',
                borderRadius: normalize(25),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(15),
              }}
            >
              <Icon
                name="calendar-alt"
                size={normalize(24)}
                color={COLOR.WHITE}
                solid
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontWeight: 'bold',
                  color: COLOR.PRIMARY,
                }}
              >
                Event & Meetup
              </Text>
              <Text
                style={{
                  fontSize: normalize(13),
                  color: COLOR.GRAY,
                }}
              >
                Ikuti event dan meetup komunitas
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: COLOR.WHITE,
            borderRadius: normalize(16),
            padding: normalize(20),
            marginBottom: normalize(16),
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: normalize(12),
            }}
          >
            <View
              style={{
                width: normalize(50),
                height: normalize(50),
                backgroundColor: '#DDA0DD',
                borderRadius: normalize(25),
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: normalize(15),
              }}
            >
              <Icon
                name="heart"
                size={normalize(24)}
                color={COLOR.WHITE}
                solid
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: normalize(16),
                  fontWeight: 'bold',
                  color: COLOR.PRIMARY,
                }}
              >
                Polling & Survey
              </Text>
              <Text
                style={{
                  fontSize: normalize(13),
                  color: COLOR.GRAY,
                }}
              >
                Berikan pendapat melalui polling dan survey
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
