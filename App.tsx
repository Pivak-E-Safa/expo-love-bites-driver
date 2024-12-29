import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import Main from "./src/screens/Main/Main";
import i18n from "./i18n";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";
import AppContainer from "./src/routes";
import { AuthProvider } from "./src/context/Auth";
import { UserProvider } from "./src/context/User";
import { theme as Theme } from "./src/utils/themeColors";
import ThemeReducer from './src/ui/ThemeReducer/ThemeReducer'
import ThemeContext from './src/ui/ThemeContext/ThemeContext'
import { LocationContext } from './src/context/Location'
import { ConfigurationProvider } from './src/context/Configuration'
import { OrdersProvider } from './src/context/Orders'
import FlashMessage from 'react-native-flash-message'
import { MessageComponent } from './src/components/FlashMessage/MessageComponent'

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);
  const [theme, themeSetter] = React.useReducer(ThemeReducer, 'Dark');
  const [location, setLocation] = React.useState(null);


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
    await i18n.initAsync();
    await Font.loadAsync({
      FredokaLight: require("./src/assets/font/Fredoka/Fredoka-Light.ttf"),
      FredokaRegular: require("./src/assets/font/Fredoka/Fredoka-Regular.ttf"),
      FredokaBold: require("./src/assets/font/Fredoka/Fredoka-Bold.ttf"),
    });
    // await permissionForPushNotificationsAsync()
    // await getActiveLocation()
    // BackHandler.addEventListener('hardwareBackPress', exitAlert)

    setAppIsReady(true);
  }

  if (appIsReady) {
    return (
      <ThemeContext.Provider
        value={{ ThemeValue: theme, dispatch: themeSetter }}>
        {/* <StatusBar
          backgroundColor={Theme[theme].menuBar}
          barStyle={theme === 'Dark' ? 'light-content' : 'dark-content'}
        /> */}
        <LocationContext.Provider value={{ location, setLocation }}>
          <ConfigurationProvider>
            <AuthProvider>
              <UserProvider>
                <OrdersProvider>
                  <AppContainer />
                </OrdersProvider>
              </UserProvider>
            </AuthProvider>
          </ConfigurationProvider>
        </LocationContext.Provider>
        <FlashMessage MessageComponent={MessageComponent} />
      </ThemeContext.Provider>
    );
  } else {
    return null;
  }

  // return userInfo ? <Text>Rest of the application</Text> : <Main></Main>;
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
});

//       {/* <SignInScreen promptAsync={promptAsync}></SignInScreen> */}

// SignOut = await signOut(auth); export from from firebase/auth and firebaseConfig, also set await AsyncStorage.setItem('@user', JSON.stringify(user)); to null
