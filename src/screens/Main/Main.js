import React, { useContext, useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import AuthContext from "../../context/Auth";
import UserContext, { UserProvider } from "../../context/User";
import styles from "./styles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { theme } from "../../utils/themeColors";
import { fetchRestaurantList } from "../../firebase/restaurants";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import { fontStyles } from "../../utils/fontStyles";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../../../firebaseConfig";
import { setUser, getUserByEmail } from "../../firebase/profile";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";

function Main() {
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();
  const currentTheme = theme["Dark"];
  const { selectedValue, setSelectedValue } = useContext(UserContext);
  const [restaurantsData, setRestaurantsData] = useState([]);
  const { email, token, setIdAsync, setTokenAsync, setEmailAsync } =
    useContext(AuthContext);
  const { setProfile } = useContext(UserContext);
  const gif = require("../../assets/GIF/home.gif");
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "58997111212-97ape976m5m5jvceqctue81b7k16gi4h.apps.googleusercontent.com",
    androidClientId:
      "58997111212-21obk57428qjt1vh1jcml6uen4qq0uno.apps.googleusercontent.com",
  });

  const [restaurants, setRestaurants] = useState([]);

  const error = null;
  const mutationLoading = false;

  // useFocusEffect(() => {
  //   if (Platform.OS === 'android') {
  //     StatusBar.setBackgroundColor(currentTheme.menuBar)
  //   }
  //   StatusBar.setBarStyle('dark-content')
  // })

  const getRestaurants = async () => {
    try {
      const restaurantsList = await fetchRestaurantList();
      setRestaurants(restaurantsList);
      setRestaurantsData(
        restaurantsList.map((restaurant) => ({
          id: restaurant.id,
          area: restaurant.area,
        }))
      );
      setSelectedValue(restaurantsList[0].id);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
    // handle rest of the scenarios as well
  }, [response]);

  React.useEffect(() => {
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
          navigation.navigate("DrawerNavigator", {
            screen: "RestaurantDetails",
            params: { id: selectedValue },
          });
        } else {
          console.log("User is not authenticated");
        }
      } catch (error) {
        console.log("Error is", error);
      }
    });
    return () => unsub();
  }, []);

  function onEnter() {
    if (token && email) {
      navigation.navigate("DrawerNavigator", {
        screen: "RestaurantDetails",
        params: { id: selectedValue },
      });
    } else {
      navigation.navigate("AuthNavigator", {
        screen: "SignIn",
        params: { promptAsync },
      });
    }
  }

  if (loading)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
      </View>
    );

  return (
    <>
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles().flex}>
        <View style={[styles().flex, styles(currentTheme).screenBackground]}>
          <Image source={gif} style={{ width: "100%", height: "100%" }} />
          <View style={styles().dropdownContainer}>
            <Dropdown
              style={styles().dropdown}
              data={restaurantsData}
              labelField="area"
              valueField="id"
              placeholder="Select City"
              placeholderStyle={styles().placeholder}
              selectedTextStyle={styles().text}
              activeColor={"rgb(255, 140, 0, 0.9)"}
              iconColor={"rgba(255, 255, 255, 10)"}
              iconStyle={{}}
              dropdownStyle={styles.dropdownContent}
              maxHeight={150}
              value={selectedValue}
              itemContainerStyle={{
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
              itemTextStyle={{
                color: "white",
                fontSize: 14,
                alignItems: "center",
                textAlign: "center",
                fontFamily: fontStyles.FredokaBold,
              }}
              containerStyle={{
                backgroundColor: "rgba(255, 140, 0, 0.9)",
                borderWidth: 0,
                borderRadius: 8,
              }}
              onChange={(item) => setSelectedValue(item.id)}
              showArrow={false}
            />
          </View>
          <TouchableOpacity
            style={styles().fingerPrintButton}
            onPress={onEnter}
          >
            <Ionicons
              name="finger-print"
              size={70}
              color="#000"
              style={styles().fingerPrint}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

export default Main;
