import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Switch,
} from 'react-native';
import { COLOR } from '../../utils/Color';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationSettingsProps {
    navigation: any;
}

interface NotificationPreferences {
    pushEnabled: boolean;
    kampanye: boolean;
    rapat: boolean;
    pencapaian: boolean;
    program: boolean;
    sistem: boolean;
}

const STORAGE_KEY = '@pbi_notification_preferences';

export default function NotificationSettings({ navigation }: NotificationSettingsProps) {
    const [preferences, setPreferences] = useState<NotificationPreferences>({
        pushEnabled: true,
        kampanye: true,
        rapat: true,
        pencapaian: true,
        program: true,
        sistem: true,
    });

    const [isLoading, setIsLoading] = useState(true);

    // Load preferences from AsyncStorage on mount
    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setPreferences(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Error loading notification preferences:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const savePreferences = async (newPreferences: NotificationPreferences) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPreferences));
            Toast.show({
                type: 'success',
                text1: 'Pengaturan Disimpan',
                text2: 'Preferensi notifikasi Anda telah diperbarui',
                position: 'top',
            });
        } catch (error) {
            console.error('Error saving notification preferences:', error);
            Toast.show({
                type: 'error',
                text1: 'Gagal Menyimpan',
                text2: 'Terjadi kesalahan saat menyimpan pengaturan',
                position: 'top',
            });
        }
    };

    const handleToggleMaster = (value: boolean) => {
        const newPreferences: NotificationPreferences = {
            pushEnabled: value,
            kampanye: value,
            rapat: value,
            pencapaian: value,
            program: value,
            sistem: value,
        };
        setPreferences(newPreferences);
        savePreferences(newPreferences);
    };

    const handleToggleCategory = (category: keyof NotificationPreferences, value: boolean) => {
        const newPreferences = { ...preferences, [category]: value };
        setPreferences(newPreferences);
        savePreferences(newPreferences);
    };

    const renderToggleItem = (
        title: string,
        description: string,
        iconName: string,
        iconColor: string,
        value: boolean,
        onToggle: (value: boolean) => void,
        disabled: boolean = false
    ) => (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: normalize(15),
                borderBottomWidth: 1,
                borderBottomColor: '#F0F0F0',
                opacity: disabled ? 0.5 : 1,
            }}
        >
            <View
                style={{
                    width: normalize(40),
                    height: normalize(40),
                    backgroundColor: iconColor,
                    borderRadius: normalize(20),
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: normalize(15),
                }}
            >
                <Icon
                    name={iconName}
                    size={normalize(18)}
                    color={COLOR.WHITE}
                    solid
                />
            </View>
            <View style={{ flex: 1, marginRight: normalize(10) }}>
                <Text
                    style={{
                        fontSize: normalize(15),
                        fontWeight: '600',
                        color: COLOR.PRIMARY,
                        marginBottom: normalize(4),
                    }}
                >
                    {title}
                </Text>
                <Text
                    style={{
                        fontSize: normalize(12),
                        color: COLOR.GRAY,
                        lineHeight: normalize(16),
                    }}
                >
                    {description}
                </Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#D1D5DB', true: COLOR.PRIMARY }}
                thumbColor={value ? COLOR.WHITE : '#F3F4F6'}
                disabled={disabled}
            />
        </View>
    );

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
                <Icon name="spinner" size={normalize(40)} color={COLOR.PRIMARY} solid />
                <Text style={{ marginTop: normalize(15), fontSize: normalize(14), color: COLOR.GRAY }}>
                    Memuat pengaturan...
                </Text>
            </View>
        );
    }

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
                    Pengaturan Notifikasi
                </Text>

                <View style={{ width: normalize(40) }} />
            </View>

            {/* Info Card */}
            <View
                style={{
                    margin: normalize(20),
                    padding: normalize(15),
                    backgroundColor: '#E3F2FD',
                    borderRadius: normalize(12),
                    borderLeftWidth: normalize(4),
                    borderLeftColor: COLOR.INFO,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Icon
                        name="info-circle"
                        size={normalize(16)}
                        color={COLOR.INFO}
                        solid
                        style={{ marginRight: normalize(10), marginTop: normalize(2) }}
                    />
                    <Text
                        style={{
                            flex: 1,
                            fontSize: normalize(12),
                            color: COLOR.PRIMARY,
                            lineHeight: normalize(18),
                        }}
                    >
                        Kelola preferensi notifikasi Anda untuk tetap mendapatkan informasi yang relevan tentang kegiatan PBI.
                    </Text>
                </View>
            </View>

            {/* Master Toggle */}
            <View
                style={{
                    backgroundColor: COLOR.WHITE,
                    marginHorizontal: normalize(20),
                    marginBottom: normalize(20),
                    borderRadius: normalize(16),
                    padding: normalize(20),
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
                        paddingBottom: normalize(15),
                        borderBottomWidth: 2,
                        borderBottomColor: COLOR.PRIMARY,
                    }}
                >
                    <View
                        style={{
                            width: normalize(50),
                            height: normalize(50),
                            backgroundColor: COLOR.PRIMARY,
                            borderRadius: normalize(25),
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: normalize(15),
                        }}
                    >
                        <Icon
                            name="bell"
                            size={normalize(22)}
                            color={COLOR.WHITE}
                            solid
                        />
                    </View>
                    <View style={{ flex: 1, marginRight: normalize(10) }}>
                        <Text
                            style={{
                                fontSize: normalize(16),
                                fontWeight: 'bold',
                                color: COLOR.PRIMARY,
                                marginBottom: normalize(4),
                            }}
                        >
                            Push Notifications
                        </Text>
                        <Text
                            style={{
                                fontSize: normalize(12),
                                color: COLOR.GRAY,
                            }}
                        >
                            {preferences.pushEnabled ? 'Aktif' : 'Nonaktif'}
                        </Text>
                    </View>
                    <Switch
                        value={preferences.pushEnabled}
                        onValueChange={handleToggleMaster}
                        trackColor={{ false: '#D1D5DB', true: COLOR.PRIMARY }}
                        thumbColor={preferences.pushEnabled ? COLOR.WHITE : '#F3F4F6'}
                    />
                </View>

                <View style={{ marginTop: normalize(10) }}>
                    <Text
                        style={{
                            fontSize: normalize(12),
                            color: COLOR.GRAY,
                            lineHeight: normalize(18),
                        }}
                    >
                        {preferences.pushEnabled
                            ? 'Anda akan menerima notifikasi push untuk kategori yang diaktifkan di bawah ini.'
                            : 'Semua notifikasi push dinonaktifkan. Aktifkan untuk menerima pembaruan penting.'}
                    </Text>
                </View>
            </View>

            {/* Footer Info */}
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
                        lineHeight: normalize(18),
                    }}
                >
                    Pengaturan ini hanya berlaku untuk aplikasi PBI App.{'\n'}
                    Untuk mengubah pengaturan notifikasi sistem, buka Pengaturan perangkat Anda.
                </Text>
            </View>
        </ScrollView>
    );
}
