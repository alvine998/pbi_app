import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLOR } from '../../utils/Color';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'other';
    timestamp: Date;
}

export default function Chat({ route, navigation }: { route: any; navigation: any }) {
    const { userName, userStatus } = route.params || { userName: 'Pengguna', userStatus: 'Online' };
    const insets = useSafeAreaInsets();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Halo! Saya ${userName}. Ada yang bisa saya bantu?`,
            sender: 'other',
            timestamp: new Date(Date.now() - 1000 * 60 * 2),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const sendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages([...messages, newMessage]);
        setInputText('');

        // Simulate response
        setTimeout(() => {
            const response: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Oke, terima kasih informasinya!',
                sender: 'other',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, response]);
        }, 2000);
    };

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F5F7FA', paddingTop: insets.top }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: normalize(20),
                    paddingVertical: normalize(15),
                    backgroundColor: COLOR.PRIMARY,
                    borderBottomLeftRadius: normalize(20),
                    borderBottomRightRadius: normalize(20),
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        width: normalize(40),
                        height: normalize(40),
                        borderRadius: normalize(20),
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Icon name="arrow-left" size={normalize(16)} color={COLOR.WHITE} solid />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: normalize(15) }}>
                    <View style={{ width: normalize(40), height: normalize(40), borderRadius: normalize(20), backgroundColor: COLOR.SECONDARY, justifyContent: 'center', alignItems: 'center', marginRight: normalize(12) }}>
                        <Icon name="user" size={normalize(18)} color={COLOR.PRIMARY} solid />
                    </View>
                    <View>
                        <Text style={{ fontSize: normalize(16), fontWeight: '700', color: COLOR.WHITE }}>{userName}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{
                                width: normalize(8),
                                height: normalize(8),
                                borderRadius: normalize(4),
                                backgroundColor: userStatus.includes('Online') || userStatus === 'Aktif' ? '#4ADE80' : '#9CA3AF',
                                marginRight: normalize(5)
                            }} />
                            <Text style={{ fontSize: normalize(12), color: 'rgba(255, 255, 255, 0.8)' }}>{userStatus}</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={{ padding: normalize(10) }}>
                    <Icon name="ellipsis-v" size={normalize(18)} color={COLOR.WHITE} solid />
                </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <ScrollView
                ref={scrollViewRef}
                style={{ flex: 1, paddingHorizontal: normalize(20) }}
                contentContainerStyle={{ paddingVertical: normalize(20) }}
                showsVerticalScrollIndicator={false}
            >
                {messages.map((item) => (
                    <View
                        key={item.id}
                        style={{
                            alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
                            backgroundColor: item.sender === 'user' ? COLOR.PRIMARY : COLOR.WHITE,
                            padding: normalize(12),
                            borderRadius: normalize(16),
                            borderBottomRightRadius: item.sender === 'user' ? 2 : normalize(16),
                            borderBottomLeftRadius: item.sender === 'other' ? 2 : normalize(16),
                            maxWidth: '80%',
                            marginBottom: normalize(15),
                            elevation: 1,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.1,
                            shadowRadius: 1,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: normalize(14),
                                color: item.sender === 'user' ? COLOR.WHITE : COLOR.PRIMARY,
                                lineHeight: normalize(20),
                            }}
                        >
                            {item.text}
                        </Text>
                        <Text
                            style={{
                                fontSize: normalize(10),
                                color: item.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : COLOR.GRAY,
                                alignSelf: 'flex-end',
                                marginTop: normalize(5),
                            }}
                        >
                            {formatTime(item.timestamp)}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: normalize(20),
                        paddingVertical: normalize(10),
                        backgroundColor: COLOR.WHITE,
                        borderTopWidth: 1,
                        borderTopColor: '#E5E7EB',
                        paddingBottom: Platform.OS === 'ios' ? insets.bottom + normalize(10) : normalize(10),
                    }}
                >
                    <TouchableOpacity
                        style={{
                            width: normalize(40),
                            height: normalize(40),
                            borderRadius: normalize(20),
                            backgroundColor: '#F3F4F6',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: normalize(10)
                        }}
                    >
                        <Icon name="plus" size={normalize(16)} color={COLOR.GRAY} />
                    </TouchableOpacity>

                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#F3F4F6',
                            borderRadius: normalize(20),
                            paddingHorizontal: normalize(15),
                            marginRight: normalize(10),
                            maxHeight: normalize(100),
                        }}
                    >
                        <TextInput
                            placeholder="Ketik pesan..."
                            placeholderTextColor={COLOR.GRAY}
                            multiline
                            value={inputText}
                            onChangeText={setInputText}
                            style={{
                                fontSize: normalize(14),
                                color: COLOR.PRIMARY,
                                paddingVertical: Platform.OS === 'ios' ? normalize(10) : normalize(8),
                            }}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={sendMessage}
                        disabled={inputText.trim() === ''}
                        style={{
                            width: normalize(44),
                            height: normalize(44),
                            borderRadius: normalize(22),
                            backgroundColor: inputText.trim() === '' ? '#E5E7EB' : COLOR.PRIMARY,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Icon name="paper-plane" size={normalize(18)} color={COLOR.WHITE} solid />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
