import { StyleSheet } from 'react-native'
import { Dimensions } from "react-native";
import { scale } from '../../utils/scaling'
import { alignment } from "../../utils/alignment";
import { textStyles } from "../../utils/textStyles";
const { height } = Dimensions.get("window");

const styles = (props = null) =>
  StyleSheet.create({
    mainContainer: {
      width: "100%",
      height: height * 0.07,
      backgroundColor: "#b71c1c",
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      ...alignment.PRlarge,
    },
    marginLeft5: {
      ...alignment.MLsmall,
    },
    marginLeft10: {
      ...alignment.MLmedium,
    },
    textStyle: {
      ...textStyles.Bold,
      ...textStyles.Normal,
      color: "#FFF",
    },
    flex: {
      flex: 1,
      backgroundColor: props !== null ? props.themeBackground : "#000000",
    },
    mainContainer: {
      alignItems: "center",
      backgroundColor: props !== null ? props.iconColorPink : "#000000",
    },
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
    whiteColor: {
      backgroundColor: props !== null ? props.buttonText : "transparent",
    },
    crossIcon: {
      width: scale(14),
      height: scale(14),
      ...alignment.MTlarge,
      ...alignment.MLlarge,
    },
    marginTop3: {
      ...alignment.MTxSmall,
    },
    marginTop5: {
      ...alignment.MTsmall,
    },
    marginTop10: {
      ...alignment.MTmedium,
    },
    alignItemsCenter: {
      alignItems: "center",
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 30,
    },
  });

export default styles;
