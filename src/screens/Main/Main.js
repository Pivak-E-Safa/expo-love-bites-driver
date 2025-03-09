import React, { useContext, useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import UserContext, { UserProvider } from "../../context/User";
import { LocationContext } from '../../context/Location'
import styles from "./styles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { theme } from "../../utils/themeColors";
import { fetchRestaurantList } from "../../firebase/restaurants";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import { fontStyles } from "../../utils/fontStyles";
import { useLocation } from '../../ui/hooks'

function Main() {
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();
  const currentTheme = theme["Dark"];
  const { selectedValue, setSelectedValue } = useContext(UserContext);
  const [restaurantsData, setRestaurantsData] = useState([]);
  const gif = require("../../assets/GIF/home.gif");
  const [restaurants, setRestaurants] = useState([]);
  const { location, setLocation } = useContext(LocationContext);
  const { getCurrentLocation } = useLocation();


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

  useEffect(() => {
    const fetchLocation = async () => {
      const { error, coords } = await getCurrentLocation();
      if (error) {
        Alert.alert('Permission Denied', 'Location access is required for this app to work properly.');
      } else {
        setLocation({
          label: 'Current Location',
          latitude: coords.latitude,
          longitude: coords.longitude,
          deliveryAddress: 'Current Location',
        });
      }
    };
    fetchLocation();
  }, []);

  function onEnter() {
    navigation.navigate('RestaurantDetails', {
      id: selectedValue
    })
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
                // fontSize: 14,
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
