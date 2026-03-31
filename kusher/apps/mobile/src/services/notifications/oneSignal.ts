import { OneSignal } from 'react-native-onesignal';
import Constants from 'expo-constants';

export const initOneSignal = () => {
  const appId = Constants?.expoConfig?.extra?.oneSignalAppId;
  
  if (!appId) {
    console.warn('OneSignal App ID not found in expo config');
    return;
  }

  // OneSignal Initialization
  OneSignal.initialize(appId);

  // Method for listening for notification clicks
  OneSignal.Notifications.addEventListener('click', (event: any) => {
    console.log("OneSignal: notification clicked:", event);
  });
};

export const loginOneSignal = (userId: string) => {
  OneSignal.login(userId);
};

export const logoutOneSignal = () => {
  OneSignal.logout();
};

export const sendTag = (key: string, value: string) => {
  OneSignal.User.addTag(key, value);
};
