import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import Prelogin from '../screens/prelogin/Prelogin';
import Login from '../screens/login/Login';
import Register from '../screens/register/Register';
import ForgotPassword from '../screens/forgot-password/ForgotPassword';
import NewsDetail from '../screens/home/NewsDetail';
import ProductDetail from '../screens/mart/ProductDetail';
import Media from '../screens/media/Media';
import AboutUs from '../screens/about_us/AboutUs';
import Profile from '../screens/profile/Profile';
import Notification from '../screens/notification/Notification';
import NotificationDetail from '../screens/notification/NotificationDetail';
import Event from '../screens/event/Event';
import PPOB from '../screens/ppob/PPOB';
import Pulsa from '../screens/ppob/Pulsa';
import PaketData from '../screens/ppob/PaketData';
import ListrikPrabayar from '../screens/ppob/ListrikPrabayar';
import ListrikPascabayar from '../screens/ppob/ListrikPascabayar';
import AirPDAM from '../screens/ppob/AirPDAM';
import Internet from '../screens/ppob/Internet';
import TagihanBPJS from '../screens/ppob/TagihanBPJS';
import TagihanAngsuran from '../screens/ppob/TagihanAngsuran';
import TopupEmoney from '../screens/ppob/TopupEmoney';
import PajakDaerah from '../screens/ppob/PajakDaerah';
import NearMember from '../screens/near_member/NearMember';
import InteractionMenu from '../screens/interaction/InteractionMenu';
import ForumDiskusi from '../screens/interaction/ForumDiskusi';
import PollingSurvey from '../screens/interaction/PollingSurvey';
import Volunteer from '../screens/interaction/Volunteer';
import CreateDiscussion from '../screens/interaction/CreateDiscussion';
import DiscussionDetail from '../screens/interaction/DiscussionDetail';
import SOS from '../screens/sos/SOS';
import NotificationSettings from '../screens/notification/NotificationSettings';
import Cart from '../screens/mart/Cart';
import Checkout from '../screens/mart/Checkout';
import TransactionHistory from '../screens/mart/TransactionHistory';
import KYCVerification from '../screens/profile/KYCVerification';
import SOSLiveChat from '../screens/sos/SOSLiveChat';
import Chat from '../screens/chat/Chat';

// Import Bottom Tab Navigator
import BottomTabNavigator from './BottomTabNavigator';

// Define navigation types
export type RootStackParamList = {
  Prelogin: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainApp: undefined;
  NewsDetail: { newsId?: number; newsTitle?: string; newsContent?: string; newsImage?: string };
  ProductDetail: { productId?: number; productName?: string; productPrice?: number; productImage?: string };
  Media: undefined;
  AboutUs: undefined;
  Profile: undefined;
  Notification: undefined;
  NotificationDetail: { notificationId?: number; title?: string; content?: string };
  Event: undefined;
  PPOB: undefined;
  Pulsa: undefined;
  PaketData: undefined;
  ListrikPrabayar: undefined;
  ListrikPascabayar: undefined;
  AirPDAM: undefined;
  Internet: undefined;
  TagihanBPJS: undefined;
  TagihanAngsuran: undefined;
  TopupEmoney: undefined;
  PajakDaerah: undefined;
  NearMember: undefined;
  InteractionMenu: undefined;
  SOS: undefined;
  ForumDiskusi: undefined;
  PollingSurvey: undefined;
  Volunteer: undefined;
  CreateDiscussion: undefined;
  DiscussionDetail: { discussionId?: string };
  NotificationSettings: undefined;
  Cart: undefined;
  Checkout: { cartItems?: any[]; total?: number };
  TransactionHistory: undefined;
  KYCVerification: undefined;
  SOSLiveChat: undefined;
  Chat: { userName: string; userStatus: string };
};

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Prelogin"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Prelogin" component={Prelogin} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        <Stack.Screen name="NewsDetail" component={NewsDetail} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="Media" component={Media} />
        <Stack.Screen name="AboutUs" component={AboutUs} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="NotificationDetail" component={NotificationDetail} />
        <Stack.Screen name="Event" component={Event} />
        <Stack.Screen name="PPOB" component={PPOB} />
        <Stack.Screen name="Pulsa" component={Pulsa} />
        <Stack.Screen name="PaketData" component={PaketData} />
        <Stack.Screen name="ListrikPrabayar" component={ListrikPrabayar} />
        <Stack.Screen name="ListrikPascabayar" component={ListrikPascabayar} />
        <Stack.Screen name="AirPDAM" component={AirPDAM} />
        <Stack.Screen name="Internet" component={Internet} />
        <Stack.Screen name="TagihanBPJS" component={TagihanBPJS} />
        <Stack.Screen name="TagihanAngsuran" component={TagihanAngsuran} />
        <Stack.Screen name="TopupEmoney" component={TopupEmoney} />
        <Stack.Screen name="PajakDaerah" component={PajakDaerah} />
        <Stack.Screen name="NearMember" component={NearMember} />
        <Stack.Screen name="InteractionMenu" component={InteractionMenu} />
        <Stack.Screen name="SOS" component={SOS} />
        <Stack.Screen name="ForumDiskusi" component={ForumDiskusi} />
        <Stack.Screen name="PollingSurvey" component={PollingSurvey} />
        <Stack.Screen name="Volunteer" component={Volunteer} />
        <Stack.Screen name="CreateDiscussion" component={CreateDiscussion} />
        <Stack.Screen name="DiscussionDetail" component={DiscussionDetail} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
        <Stack.Screen name="KYCVerification" component={KYCVerification} />
        <Stack.Screen name="SOSLiveChat" component={SOSLiveChat} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
