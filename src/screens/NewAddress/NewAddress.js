import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useLayoutEffect,
} from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import i18n from "../../../i18n";
import styles from "./styles";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { scale } from "../../utils/scaling";
import ThemeContext from "../../ui/ThemeContext/ThemeContext";
import { theme } from "../../utils/themeColors";
import { FlashMessage } from "../../ui/FlashMessage/FlashMessage";
import TextDefault from "../../components/Text/TextDefault/TextDefault";
import { alignment } from "../../utils/alignment";
import { textStyles } from "../../utils/textStyles";
import { LocationContext } from "../../context/Location";
import { mapStyle } from "../../utils/mapStyle";
import CustomMarker from "../../assets/SVG/imageComponents/CustomMarker";
import AddressText from "../../components/Address/AddressText";
import { addAddressToUser } from "../../firebase/profile";
import UserContext from "../../context/User";
import { GeoPoint } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
// import Analytics from '../../utils/analytics'

const labelValues = [
  {
    title: "Home",
    value: "Home",
  },
  {
    title: "Work",
    value: "Work",
  },
  {
    title: "Other",
    value: "Other",
  },
];

const LATITUDE = 33.7001019;
const LONGITUDE = 72.9735978;
const LATITUDE_DELTA = 0.0022;
const LONGITUDE_DELTA = 0.0021;

function NewAddress(props) {
  const addressRef = useRef();
  const mapRef = useRef(null);
  const inset = useSafeAreaInsets();
  const location = props.route.params ? props.route.params.location : null;
  const { setLocation } = useContext(LocationContext);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryDetails, setDeliveryDetails] = useState("");
  const [deliveryAddressError, setDeliveryAddressError] = useState("");
  const [deliveryDetailsError, setDeliveryDetailsError] = useState("");
  const [selectedLabel, setSelectedLabel] = useState(labelValues[0].value);
  const { profile } = useContext(UserContext);
  const [region, setRegion] = useState({
    latitude: location ? location.latitude : LATITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitude: location ? location.longitude : LONGITUDE,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const regionObj = props.route.params ? props.route.params.regionChange : null;
  const themeContext = useContext(ThemeContext);
  const currentTheme = theme[themeContext.ThemeValue];
  // useEffect(() => {
  //   async function Track() {
  //     await Analytics.track(Analytics.events.NAVIGATE_TO_NEWADDRESS)
  //   }
  //   Track()
  // }, [])
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: null,
      title: i18n.t("addAddress"),
    });
  }, [props.navigation]);

  useEffect(() => {
    if (!regionObj) return regionChange(region);
    regionChange(regionObj);
  }, [regionObj]);

  useEffect(() => {
    regionChange(region);
  }, [region]);

  // const [mutate, { loading }] = useMutation(CREATE_ADDRESS, {
  //   onCompleted,
  //   onError
  // })

  function regionChange(region) {
    Location.reverseGeocodeAsync({
      latitude: region.latitude,
      longitude: region.longitude,
    })
      .then((data) => {
        if (data.length) {
          const location = data[0];
          const deliveryAddress = Object.keys(location)
            .map((key) => location[key])
            .join(" ");
          setDeliveryAddress(deliveryAddress);
          setRegion(region);
          // addressRef.current.setValue(deliveryAddress);
        } else console.log("location not recognized");
      })
      .catch((error) => {
        console.log("Error : regionChange", error);
      });
  }

  const handleLocateMe = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        FlashMessage({ message: "Location permission denied" });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };

      // Update map region
      mapRef.current?.animateToRegion(newRegion, 1000);
      setRegion(newRegion);
    } catch (error) {
      console.log("Location error:", error);
    }
  };

  function onCompleted(data) {
    FlashMessage({
      message: "Address added",
    });
    const address = data.createAddress.addresses.find((a) => a.selected);
    const cartAddress = props.route.params?.backScreen || null;
    setLocation({
      ...address,
      latitude: parseFloat(address.location.latitude),
      longitude: parseFloat(address.location.longitude),
    });
    if (cartAddress === "Cart") {
      props.navigation.navigate("Cart");
    } else props.navigation.goBack();
  }

  function onError(error) {
    console.log(error);
    FlashMessage({
      message: `An error occured. Please try again. ${error}`,
    });
  }

  const onSubmit = (deliveryAddressGeo, coordinates) => {
    setDeliveryAddress(deliveryAddressGeo);
    // addressRef.current.setValue(deliveryAddressGeo);
    setRegion({
      ...region,
      longitude: coordinates.lng,
      latitude: coordinates.lat,
    });
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 20 : 0}
        style={styles().flex}
      >
        <View style={styles().flex}>
          <View style={styles().mapContainer}>
            <MapView
              ref={mapRef}
              style={styles().flex}
              onRegionChangeComplete={setRegion}
              showsUserLocation={true}
              myLocationEnabled={true}
              // provider={PROVIDER_GOOGLE}
              customMapStyle={
                themeContext.ThemeValue === "Dark" ? mapStyle : null
              }
              initialRegion={{
                latitude: LATITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitude: LONGITUDE,
                longitudeDelta: LONGITUDE_DELTA,
              }}
              region={region}
            ></MapView>
            <TouchableOpacity
              style={styles().locationButton}
              onPress={handleLocateMe}
            >
              <Ionicons name="locate" size={18} color="black" />
            </TouchableOpacity>
            <View
              style={{
                width: 50,
                height: 50,
                position: "absolute",
                top: "50%",
                left: "50%",
                zIndex: 1,
                translateX: -25,
                translateY: -25,
                justifyContent: "center",
                alignItems: "center",
                transform: [{ translateX: -25 }, { translateY: -25 }],
              }}
            >
              <CustomMarker
                width={40}
                height={40}
                transform={[{ translateY: -20 }]}
                translateY={-20}
              />
            </View>
          </View>

          <ScrollView
            style={styles().flex}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles(currentTheme).subContainer}>
              <View style={styles().upperContainer}>
                <View style={styles().addressContainer}>
                  <View style={{ ...alignment.MTsmall }}>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: currentTheme.fontSecondColor,
                        borderRadius: 5,
                        height: 45,
                        padding: 10,
                        color: currentTheme.fontMainColor,
                      }}
                      placeholder={i18n.t("fullDeliveryAddress")}
                      placeholderTextColor={currentTheme.fontSecondColor}
                      value={deliveryAddress}
                      onChangeText={setDeliveryAddress}
                      // label={i18n.t('fullDeliveryAddress')}
                      //   labelFontSize={scale(8)}
                      //   fontSize={scale(10)}
                      //   lineWidth={StyleSheet.hairlineWidth}
                      //   activeLineWidth={StyleSheet.hairlineWidth}
                      //   maxLength={100}
                      //   textColor={currentTheme.fontMainColor}
                      //   baseColor={currentTheme.fontSecondColor}
                      //   errorColor={currentTheme.textErrorColor}
                      //   tintColor={
                      //     !deliveryAddressError
                      //       ? currentTheme.fontMainColor
                      //       : 'red'
                      //   }
                      //   labelTextStyle={{
                      //     ...textStyles.Normal,
                      //     paddingTop: scale(1)
                      //   }}

                      onBlur={() =>
                        setDeliveryAddressError(
                          !deliveryAddress.trim().length
                            ? "Delivery address is required"
                            : null
                        )
                      }
                    />
                  </View>
                  <View style={{ ...alignment.MTsmall }}></View>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: currentTheme.fontSecondColor,
                      borderRadius: 5,
                      padding: 10,
                      height: 45,
                      color: currentTheme.fontMainColor,
                    }}
                    placeholder={i18n.t("deliveryDetails")}
                    placeholderTextColor={currentTheme.fontSecondColor}
                    value={deliveryDetails}
                    onChangeText={setDeliveryDetails}
                    onBlur={() =>
                      setDeliveryDetailsError(
                        !deliveryDetails.trim().length
                          ? "Delivery details is required"
                          : null
                      )
                    }
                  />
                </View>
                <View style={styles().labelButtonContainer}>
                  <View style={styles().labelTitleContainer}>
                    <TextDefault
                      textColor={currentTheme.fontMainColor}
                      B700
                      bolder
                    >
                      Label as
                    </TextDefault>
                  </View>
                  <View style={styles().buttonInline}>
                    {labelValues.map((label, index) => (
                      <TouchableOpacity
                        activeOpacity={0.5}
                        key={index}
                        style={
                          selectedLabel === label.value
                            ? styles(currentTheme).activeLabel
                            : styles(currentTheme).labelButton
                        }
                        onPress={() => {
                          setSelectedLabel(label.value);
                        }}
                      >
                        <TextDefault
                          style={
                            selectedLabel === label.value && {
                              ...textStyles.Bolder,
                            }
                          }
                          textColor={
                            selectedLabel === label.value
                              ? currentTheme.tagColor
                              : currentTheme.fontSecondColor
                          }
                          small
                          center
                        >
                          {label.title}
                        </TextDefault>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <TouchableOpacity
                // disabled={loading}
                onPress={() => {
                  const deliveryAddressError = !deliveryAddress.trim().length
                    ? "Delivery address is required"
                    : null;
                  const deliveryDetailsError = !deliveryDetails.trim().length
                    ? "Delivery details is required"
                    : null;

                  setDeliveryAddressError(deliveryAddressError);
                  setDeliveryDetailsError(deliveryDetailsError);

                  if (
                    deliveryAddressError === null &&
                    deliveryDetailsError === null
                  ) {
                    const addressData = {
                      label: selectedLabel,
                      deliveryAddress: deliveryAddress.trim(),
                      details: deliveryDetails.trim(),
                      // location: [location.latitude, location.longitude],
                      location: new GeoPoint(region.latitude, region.longitude),
                    };
                    addAddressToUser(profile.email, addressData);
                    // mutate({
                    //   variables: {
                    //     addressInput: {
                    //       latitude: `${region.latitude}`,
                    //       longitude: `${region.longitude}`,
                    //       deliveryAddress: deliveryAddress.trim(),
                    //       details: deliveryDetails.trim(),
                    //       label: selectedLabel,
                    //     },
                    //   },
                    // });
                  }
                }}
                activeOpacity={0.5}
                style={styles(currentTheme).saveBtnContainer}
              >
                <TextDefault textColor={currentTheme.buttonText} H4 bold>
                  {i18n.t("saveContBtn")}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          paddingBottom: inset.bottom,
          backgroundColor: currentTheme.themeBackground,
        }}
      />
    </>
  );
}

export default NewAddress;
