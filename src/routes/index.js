import React, { useContext } from "react";
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
    </Drawer.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main screen is always shown first */}
      <Stack.Screen name="Main" component={Main} />
      {/* Conditional navigation based on authentication */}
      {isLoggedIn ? (
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      ) : (
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
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
