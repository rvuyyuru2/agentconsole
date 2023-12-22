import React, {useEffect, useRef, useState} from 'react';
import {Dimensions} from 'react-native';
import WebView from 'react-native-webview';
import {OzonetelViewURL} from '../Constants';
import {getFCMToken} from '../utils/notificationHelper';
var INJECTED_JAVASCRIPT: any;
const OzonetelView = (props: any) => {
  const [isTokenloaded, setIstokenLoaded] = useState(false);
  const webViewRef: any = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      const fcmtoken = await getFCMToken();
      INJECTED_JAVASCRIPT = `window.localStorage.setItem("fcmtoken", '${fcmtoken}');           
        true;       
      `;
      setIstokenLoaded(true);
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (webViewRef?.current) {
      props?.UpdateWebView(webViewRef?.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webViewRef?.current]);
  if (!isTokenloaded && !INJECTED_JAVASCRIPT) {
    return null;
  }
  return (
    <WebView
      originWhitelist={['*']}
      style={{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      }}
      injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
      scalesPageToFit={true}
      automaticallyAdjustContentInsets={true}
      allowsBackForwardNavigationGestures={true}
      webviewDebuggingEnabled={true}
      ref={webViewRef}
      allowFileAccess={true}
      thirdPartyCookiesEnabled={true}
      allowUniversalAccessFromFileURLs={true}
      mediaPlaybackRequiresUserAction={false}
      mixedContentMode={'compatibility'}
      sharedCookiesEnabled
      useWebKit
      javaScriptEnabled
      domStorageEnabled
      forceDarkOn={false}
      onLoadEnd={() => {
        if (webViewRef?.current) {
          props?.UpdateWebView(webViewRef?.current);
        }
      }}
      startInLoadingState={true}
      source={{
        uri: OzonetelViewURL,
      }}
    />
  );
};

export default OzonetelView;
