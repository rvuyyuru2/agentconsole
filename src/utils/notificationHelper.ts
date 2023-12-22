import messaging from '@react-native-firebase/messaging';
import {GetString, SetKey} from './storage';
import {Alert, PermissionsAndroid} from 'react-native';
var webview: any;
export function updateWebview(ref: any) {
  webview = ref;
}
function getInjectableJSMessage(message: any) {
  return `
    (function() {   
      window.document.dispatchEvent(new MessageEvent('pushNotification', {
        data: ${JSON.stringify(message)},
        origin:"Mobile_Platform"
      }));
    })();  
  `;
}
export async function messagehandler(remoteMessage: any) {
  console.log(remoteMessage);
}

const handeleRoute = async (obj: any) => {
  let intervel = setInterval(() => {
    if (webview?.postMessage) {
      webview?.injectJavaScript(getInjectableJSMessage(obj));
      clearInterval(intervel);
    }
  }, 5);
};
// // Register background handler
export function setBackgroundMessageHandler() {
  messaging().setBackgroundMessageHandler((remoteMessage: any) =>
    messagehandler(remoteMessage),
  );
}

export function intitonMessage() {
  return messaging().onMessage((remoteMessage: any) => {
    // messagehandler(remoteMessage);
    handeleRoute(remoteMessage?.data);
  });
}
export function listenHandler(setLoading: any) {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open
  messaging().onNotificationOpenedApp(remoteMessage => {
    handeleRoute(remoteMessage?.data);
  });
  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        handeleRoute(remoteMessage?.data);
      }
      setLoading(false);
    });
}

// export async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//   return !!enabled;
// }

export async function requestUserPermission() {
  try {
    // Request permission for Firebase Cloud Messaging
    await messaging().requestPermission();
    // Check if the permission is granted or provisional
    // const enabled =
    //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    let notificationPermission: any = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    // Check if the notification permission is already granted
    if (notificationPermission === PermissionsAndroid.RESULTS.GRANTED) {
      return true; // Permission granted
    }

    // If not granted, request permission using PermissionsAndroid
    notificationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    // Check if the user granted the notification permission
    if (notificationPermission === PermissionsAndroid.RESULTS.GRANTED) {
      return true; // Permission granted
    } else {
      // Permission denied again, handle this as needed (e.g., show a message to the user)
      console.log('Notification permission denied again');
      showRetryPermissionAlert();
      return false;
    }

    // return true; // FCM permission is granted or provisional
  } catch (error) {
    // Handle errors, such as the user denying permission explicitly
    console.error('Error requesting permission:', error);
    return false;
  }
}

const showRetryPermissionAlert = () => {
  Alert.alert(
    'Permission Denied',
    'Please enable notifications to receive updates.',
    [
      {
        text: 'Retry',
        onPress: async () => {
          // Retry the permission request
          await requestUserPermission();
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
  );
};
export async function registerAppWithFCM() {
  await messaging().registerDeviceForRemoteMessages();
}

export async function getFCMToken() {
  const fcmtoken = GetString('fcmtoken');
  if (fcmtoken) {
    return fcmtoken;
  }
  const token = await messaging().getToken();
  await SetKey('fcmtoken', token);
  return token;
}
