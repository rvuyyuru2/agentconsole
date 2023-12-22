/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {AppState, SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import OzonetelView from './src/Webview';
import {
  intitonMessage,
  listenHandler,
  notificationHandler,
  registerAppWithFCM,
  requestUserPermission,
  setBackgroundMessageHandler,
  updateWebview,
} from './src/utils/notificationHelper';
setBackgroundMessageHandler();

function App() {
  const [appState, setAppState] = useState(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });
    return () => {
      subscription.remove();
    };
  }, []); // Empty dependency array means this effect runs once, similar to componentDidMount

  const [loading, setLoading] = useState(true);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: '#008dff',
  };
  useEffect(() => {
    if (appState && appState === 'active') {
      notificationHandler();
    }
  }, [appState]);
  useEffect(() => {
    listenHandler(setLoading);
    requestUserPermission();
    registerAppWithFCM();
    const sub = intitonMessage();
    return () => {
      sub();
    };
  }, []);
  if (loading) {
    return null;
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        ...backgroundStyle,
      }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <OzonetelView
        UpdateWebView={(ele: any) => {
          updateWebview(ele);
        }}
      />
    </SafeAreaView>
  );
}

export default App;
