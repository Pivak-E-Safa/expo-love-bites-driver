import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import TextDefault from "../../components/Text/TextDefault/TextDefault";
import Spinner from "../../components/Spinner/Spinner";
import { theme } from "../../utils/themeColors";
import { scale } from "../../utils/scaling";
import { alignment } from "../../utils/alignment";
import { textStyles } from "../../utils/textStyles";
const { height } = Dimensions.get("window");
import Ionicons from "react-native-vector-icons/Ionicons";

const SignIn = ({ promptAsync }) => {
  const currentTheme = theme["Dark"];
  return (
    <View style={[styles().subContainer]}>
      <Image
        source={require("../../../assets/logo.png")} // Replace with your logo image
        style={styles().logo}
      />
      {/* {props.loadingIcon ? (
            <Spinner backColor="rgba(0,0,0,0.1)" spinnerColor={"#FFF"} />
          ) : ( */}

      <TouchableOpacity
        style={{
          height: 50,
          borderRadius: 10,
          width: "70%",
          backgroundColor: "#FF8C00",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
        onPress={() => {
          promptAsync();
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: "15",
          }}
        >
          <Ionicons
            name="logo-google"
            size={25}
            color="#fff"
            style={{ padding: "0", margin: "0" }}
          />
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: '16',
            }}
          >
            Sign In With Google
          </Text>
        </View>
      </TouchableOpacity>
      {/* )} */}
    </View>
  );
};

const styles = (props = null) =>
  StyleSheet.create({
    subContainer: {
      display: "flex",
      alignSelf: "center",
      width: "100%",
      paddingBottom: 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: props !== null ? props.themeBackground : "#000000",
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 20,
    },
  });

export default SignIn;
