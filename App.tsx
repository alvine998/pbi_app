import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
// import CodePush from '@code-push-next/react-native-code-push';
// import { Platform, NativeModules } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';

// CodePush configuration temporarily disabled for debugging
// const getCodePushConfig = () => {
//   try {
//     if (Platform.OS === 'android') {
//       const { CodePushConfig } = NativeModules;
//       return {
//         deploymentKey: CodePushConfig?.CodePushDeploymentKey || 'eQmDhDN3g7tO4V4778OdbSj7BsaTUFUkylz',
//         serverUrl: CodePushConfig?.CodePushServerUrl || 'https://codepush.appsonair.com',
//       };
//     } else if (Platform.OS === 'ios') {
//       // For iOS, read from Info.plist
//       return {
//         deploymentKey: 'YOUR_IOS_DEPLOYMENT_KEY', // Replace with actual iOS deployment key
//         serverUrl: 'https://codepush.appsonair.com',
//       };
//     }
//   } catch (error) {
//     console.warn('CodePush config not found, using fallback values');
//   }

//   // Fallback configuration
//   return {
//     deploymentKey: 'eQmDhDN3g7tO4V4778OdbSj7BsaTUFUkylz',
//     serverUrl: 'https://codepush.appsonair.com',
//   };
// };

// let codePushOptions = {
//   checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
//   installMode: CodePush.InstallMode.IMMEDIATE,
//   mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
//   deploymentKey: getCodePushConfig().deploymentKey,
//   serverUrl: getCodePushConfig().serverUrl,
// };

// // CodePush status callback
// const codePushStatusDidChange = (syncStatus: CodePush.SyncStatus) => {
//   switch (syncStatus) {
//     case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
//       console.log('CodePush: Checking for update.');
//       break;
//     case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
//       console.log('CodePush: Downloading package.');
//       break;
//     case CodePush.SyncStatus.AWAITING_USER_ACTION:
//       console.log('CodePush: Awaiting user action.');
//       break;
//     case CodePush.SyncStatus.INSTALLING_UPDATE:
//       console.log('CodePush: Installing update.');
//       break;
//     case CodePush.SyncStatus.UP_TO_DATE:
//       console.log('CodePush: App is up to date.');
//       break;
//     case CodePush.SyncStatus.UPDATE_IGNORED:
//       console.log('CodePush: Update cancelled by user.');
//       break;
//     case CodePush.SyncStatus.UPDATE_INSTALLED:
//       console.log('CodePush: Update installed and will be applied on restart.');
//       Toast.show({
//         type: 'success',
//         text1: 'Update Installed',
//         text2: 'App will restart to apply the update.',
//         position: 'top',
//       });
//       break;
//     case CodePush.SyncStatus.UNKNOWN_ERROR:
//       console.log('CodePush: An unknown error occurred.');
//       break;
//   }
// };

// // CodePush download progress callback
// const codePushDownloadDidProgress = (progress: { receivedBytes: number; totalBytes: number }) => {
//   console.log(`CodePush: Downloaded ${progress.receivedBytes} of ${progress.totalBytes} bytes`);
// };


function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
          <Toast />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// Temporarily disable CodePush for debugging
// export default CodePush({
//   ...codePushOptions,
//   updateDialog: true,
//   installMode: CodePush.InstallMode.IMMEDIATE,
// })(App);

export default App;
