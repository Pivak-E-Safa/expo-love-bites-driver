import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import AppContainer from "./src/routes";
import { AuthProvider } from "./src/context/Auth";
import "react-native-get-random-values";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
      loadAppData();
    })();

    return () => {
      // BackHandler.removeEventListener('hardwareBackPress', exitAlert)
    };
  }, []);

  React.useEffect(() => {
    if (!appIsReady) return;
    (async () => {
      await SplashScreen.hideAsync();
    })();
  }, [appIsReady]);

  async function loadAppData() {
    await Font.loadAsync({
      FredokaLight: require("./src/assets/font/Fredoka/Fredoka-Light.ttf"),
      FredokaRegular: require("./src/assets/font/Fredoka/Fredoka-Regular.ttf"),
      FredokaBold: require("./src/assets/font/Fredoka/Fredoka-Bold.ttf"),
    });

    setAppIsReady(true);
  }

  if (appIsReady) {
    return (
      <AuthProvider>
        <AppContainer />
      </AuthProvider>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {},
});
