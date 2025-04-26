import React, { useContext, useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import navigationService from "./navigationService";
import Login from "../screens/Login/Login";
import Dashboard from "../screens/Dashboard/Dashboard";
import AuthContext from "../context/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";
import OrderList from "../screens/Orders/OrderList";
import OrderDetail from "../screens/Orders/OrderDetail";

GoogleSignin.configure({
  webClientId:
    "478147632680-sd4uol7r2h1ipunucgug476989f1qgi8.apps.googleusercontent.com",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId:
    "478147632680-du93puo7pbkdjmdtrahhqergbu1l5plq.apps.googleusercontent.com",
});

const NavigationStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const SideDrawer = createDrawerNavigator();
const Location = createNativeStackNavigator();

function AppContainer() {
  const [initializing, setInitializing] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return null; // Or a loading screen
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationService.navigationRef}>
        <NavigationStack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!user ? (
            <NavigationStack.Screen name="Login" component={Login} />
          ) : (
            <>
              <NavigationStack.Screen name="Dashboard" component={Dashboard} />
              <NavigationStack.Screen 
                name="NewOrders" 
                component={OrderList}
                initialParams={{ type: 'new' }}
              />
              <NavigationStack.Screen 
                name="InProgressOrders" 
                component={OrderList}
                initialParams={{ type: 'inProgress' }}
              />
              <NavigationStack.Screen 
                name="DeliveredOrders" 
                component={OrderList}
                initialParams={{ type: 'delivered' }}
              />
              <NavigationStack.Screen 
                name="OrderDetail" 
                component={OrderDetail}
                options={{
                  headerShown: false,
                }}
              />
            </>
          )}
        </NavigationStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default AppContainer;
