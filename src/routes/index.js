import React, { useContext, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import navigationService from "./navigationService";
import SideBar from "../components/Sidebar/Sidebar";
import UserContext from "../context/User";
import Main from "../screens/Main/Main";
import SignIn from "../screens/SignIn/SignIn";
import RestaurantDetails from "../screens/RestaurantDetails/RestaurantDetails";
import Restaurant from "../screens/Restaurant/Restaurant";
import { auth } from "../../firebaseConfig";
import { setUser, getUserByEmail } from "../firebase/profile";
import AuthContext from "../context/Auth";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SideBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Main" component={Main} />
      <Drawer.Screen name="RestaurantDetails" component={RestaurantDetails} />
      <Drawer.Screen
        name="Restaurant"
        component={Restaurant}
        options={{ header: () => null }}
      />
    </Drawer.Navigator>
  );
}

function AppNavigator({ promptAsync }) {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="SignIn">
          {(props) => <SignIn {...props} promptAsync={promptAsync} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function AppContainer() {
  const { isLoggedIn } = useContext(UserContext);
   const { email, token, setIdAsync, setTokenAsync, setEmailAsync } =
      useContext(AuthContext);
    const { setProfile } = useContext(UserContext);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "58997111212-97ape976m5m5jvceqctue81b7k16gi4h.apps.googleusercontent.com",
    androidClientId:
      "58997111212-21obk57428qjt1vh1jcml6uen4qq0uno.apps.googleusercontent.com",
      webClientId: "58997111212-ocgshpeqo35lc8lfe9g2n8o50615bpp0.apps.googleusercontent.com"
  });


  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          await setEmailAsync(user.email);
          await setIdAsync(user.uid);
          await setTokenAsync(user.stsTokenManager.accessToken);
          const existingUser = await getUserByEmail(user.email);
          if (existingUser === null) {
            const data = {
              phone: "",
              email: user.email,
              phoneIsVerified: false,
              name: user.displayName,
            };
            await setUser(data);
            setProfile(data);
          } else {
            setProfile(existingUser);
          }
        } else {
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.log("Error is", error);
      }
    });

    return () => unsub();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={(ref) => {
          navigationService.setGlobalRef(ref);
        }}
      >
        <AppNavigator promptAsync={promptAsync} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
