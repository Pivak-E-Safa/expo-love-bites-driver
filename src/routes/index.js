import React, { useContext, useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import navigationService from "./navigationService";
import SideBar from "../components/Sidebar/Sidebar";
import UserContext from "../context/User";
import Main from "../screens/Main/Main";
import SignIn from "../screens/SignIn/SignIn";
import RestaurantDetails from "../screens/RestaurantDetails/RestaurantDetails";
import ItemDetail from "../screens/ItemDetail/ItemDetail";
import Restaurant from "../screens/Restaurant/Restaurant";
import { setUser, getUserByEmail } from "../firebase/profile";
import AuthContext from "../context/Auth";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "478147632680-sd4uol7r2h1ipunucgug476989f1qgi8.apps.googleusercontent.com",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId:
    "478147632680-du93puo7pbkdjmdtrahhqergbu1l5plq.apps.googleusercontent.com",
});

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
      <Drawer.Screen name="ItemDetail" component={ItemDetail} />
      <Drawer.Screen
        name="Restaurant"
        component={Restaurant}
        options={{ header: () => null }}
      />
    </Drawer.Navigator>
  );
}

function AppNavigator() {
  const { isLoggedIn } = useContext(UserContext);
  const { email, setIdAsync, setTokenAsync, setEmailAsync } =
    useContext(AuthContext);
  const { profile, setProfile } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      if (isLoggedIn && email && !profile) {
        const existingUser = await getUserByEmail(email);
        setProfile(existingUser);
      }
    };
    fetchUser();
  }, [isLoggedIn]);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log(JSON.stringify(response?.data?.user, null, 2));
      if (response?.type === "success") {
        const user = response?.data?.user;
        if (user) {
          const idToken = response?.data?.idToken;
          if (idToken) {
            const firebaseCredential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, firebaseCredential);
          }
          const existingUser = await getUserByEmail(user.email);
          const data = {
            phone: "",
            email: user.email,
            phoneIsVerified: false,
            name: user.name,
            photo: user.photo,
            id: user.id,
          };
          if (existingUser === null) {
            await setUser(data);
            setProfile({...data, phoneIsVerified: false});
          } else {
            setProfile({...data, phoneIsVerified: existingUser?.phoneIsVerified});
          }
          await setEmailAsync(user.email);
          await setIdAsync(user.id);
          await setTokenAsync(idToken);
        } else {
          console.log("User is not authenticated");
        }
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      console.log("error");
      console.log(error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
          // some other error happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="SignIn">
          {(props) => <SignIn {...props} promptAsync={signIn} />}
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
  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={(ref) => {
          navigationService.setGlobalRef(ref);
        }}
      >
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
