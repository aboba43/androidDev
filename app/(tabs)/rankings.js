import React from 'react';
import { StyleSheet, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function RankingsScreen() {
  const [loading, setLoading] = React.useState(true);

  const customCSS = `
    var style = document.createElement('style');
    style.innerHTML = \`
      header, .header, nav, #header, .navbar, footer, #footer, .footer, .site-header, .site-footer { display: none !important; }
      .patreon, .donate, iframe { display: none !important; }
      body { background-color: #f5f7fa !important; font-family: -apple-system, Roboto, sans-serif !important; }
      .container { padding-top: 0 !important; margin-top: 0 !important; }
    \`;
    document.head.appendChild(style);
    true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
      <WebView 
        source={{ uri: 'https://www.openpowerlifting.org/rankings/by-total' }} 
        style={styles.webview}
        onLoad={() => setLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        injectedJavaScript={customCSS}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    zIndex: 1,
  }
});
