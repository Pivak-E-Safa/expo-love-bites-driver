import React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import TextDefault from "../../components/Text/TextDefault/TextDefault";
import Spinner from "../../components/Spinner/Spinner";
import { theme } from "../../utils/themeColors";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { scale } from "../../utils/scaling";
import { alignment } from "../../utils/alignment";
import { textStyles } from "../../utils/textStyles";
const { height } = Dimensions.get("window");
import { SocialIcon } from "react-native-elements";

const SignIn = ({ route }) => {
  const { promptAsync } = route.params;
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
      <SocialIcon
        style={{
          padding: 20,
          borderRadius: 10,
          width: "70%",
          backgroundColor: "#FF8C00",
        }}
        title="Sign In With Google"
        button
        type="google"
        onPress={() => {
          promptAsync();
        }}
      />
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
