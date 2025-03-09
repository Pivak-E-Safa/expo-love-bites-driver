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
import About from "../screens/About";
import ItemDetail from "../screens/ItemDetail/ItemDetail";
import Restaurant from "../screens/Restaurant/Restaurant";
import EditAddress from "../screens/EditAddress/EditAddress";
import CartAddress from "../screens/CartAddress/CartAddress";
import MyOrders from "../screens/MyOrders/MyOrders";
import Cart from "../screens/Cart/Cart";
import Profile from "../screens/Profile/Profile";
import Addresses from "../screens/Addresses/Addresses";
import NewAddress from "../screens/NewAddress/NewAddress";
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

const NavigationStack = createStackNavigator();
const MainStack = createStackNavigator();
const SideDrawer = createDrawerNavigator();
const Location = createStackNavigator();

function Drawer() {
  return (
    <SideDrawer.Navigator drawerContent={(props) => <SideBar {...props} />}>
      <SideDrawer.Screen
        options={{ headerShown: false }}
        name="NoDrawer"
        component={NoDrawer}
      />
      <SideDrawer.Screen
        options={{ headerShown: false }}
        name="MyOrders"
        component={MyOrders}
      />
      <NavigationStack.Screen name="Profile" component={Profile} />
      <NavigationStack.Screen name="Addresses" component={Addresses} />
      <NavigationStack.Screen name="NewAddress" component={NewAddress} />
      <NavigationStack.Screen name="EditAddress" component={EditAddress} />
      <NavigationStack.Screen name="CartAddress" component={CartAddress} />
    </SideDrawer.Navigator>
  );
}

function NoDrawer() {
  // const themeContext = useContext(ThemeContext);
  // const currentTheme = theme[themeContext.ThemeValue];
  return (
    <NavigationStack.Navigator screenOptions={{ headerShown: false }}>
      <NavigationStack.Screen
        name="Main"
        component={Main}
        options={{ header: () => null }}
      />
      <NavigationStack.Screen
        name="Restaurant"
        component={Restaurant}
        options={{ header: () => null }}
      />
      <NavigationStack.Screen
        name="RestaurantDetails"
        component={RestaurantDetails}
        options={{ header: () => null }}
      />
      {
        <NavigationStack.Screen
          name="ItemDetail"
          component={ItemDetail}
          options={{ header: () => null }}
        />
      }
      <NavigationStack.Screen name="Cart" component={Cart} />
      <NavigationStack.Screen name="NewAddress" component={NewAddress} />
      <NavigationStack.Screen name="EditAddress" component={EditAddress} />
      <NavigationStack.Screen name="CartAddress" component={CartAddress} />
      <NavigationStack.Screen name="MyOrders" component={MyOrders} />
      <NavigationStack.Screen name="Profile" component={Profile} />
      <NavigationStack.Screen name="Addresses" component={Addresses} />
      <NavigationStack.Screen
        name="About"
        component={About}
        options={{ header: () => null }}
      />
      <NavigationStack.Screen name="SignIn" component={SignIn} />
    </NavigationStack.Navigator>
  );
}

function AppContainer() {
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
            uuid: user.id,
          };
          if (existingUser === null) {
            await setUser(data);
            setProfile({ ...data, phoneIsVerified: false });
          } else {
            setProfile({
              ...data,
              phoneIsVerified: existingUser?.phoneIsVerified,
            });
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
    <SafeAreaProvider>
      <NavigationContainer
        ref={(ref) => {
          navigationService.setGlobalRef(ref);
        }}
      >
        <MainStack.Navigator
          initialRouteName={isLoggedIn ? "Drawer" : "SignIn"}
        >
          {isLoggedIn ? (
            <MainStack.Screen
              name="Drawer"
              component={Drawer}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <MainStack.Screen name="SignIn" options={{ headerShown: false }}>
                {(props) => <SignIn {...props} promptAsync={signIn} />}
              </MainStack.Screen>
            </>
          )}
        </MainStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default AppContainer;
