import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  Image,
  Dimensions,
  SectionList,
} from "react-native";
import Animated, {
  interpolate,
  useSharedValue,
  Easing,
  withTiming,
  runOnJS,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
// import {
//   Placeholder,
//   PlaceholderMedia,
//   PlaceholderLine,
//   Fade
// } from 'rn-placeholder'
import ImageHeader from "../../components/Restaurant/ImageHeader";
import TextDefault from "../../components/Text/TextDefault/TextDefault";
import ConfigurationContext from "../../context/Configuration";
import UserContext from "../../context/User";
import ThemeContext from "../../ui/ThemeContext/ThemeContext";
import { scale } from "../../utils/scaling";
import { theme } from "../../utils/themeColors";
import styles from "./styles";
import { alignment } from "../../utils/alignment";
import i18n from "../../../i18n";
// import Analytics from '../../utils/analytics'
const { height } = Dimensions.get("screen");
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);
const TOP_BAR_HEIGHT = height * 0.05;
const HEADER_MAX_HEIGHT = height * 0.5;
const HEADER_MIN_HEIGHT = height * 0.07 + TOP_BAR_HEIGHT;
const SCROLL_RANGE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const HALF_HEADER_SCROLL = HEADER_MAX_HEIGHT - TOP_BAR_HEIGHT;

const config = (to) => ({
  duration: 250,
  toValue: to,
  easing: Easing.inOut(Easing.ease),
});

function Restaurant(props) {
  const scrollRef = useRef(null);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const inset = useSafeAreaInsets();
  const animation = useSharedValue(0);
  const circle = useSharedValue(0);
  const themeContext = useContext(ThemeContext);
  const currentTheme = theme[themeContext.ThemeValue];

  const configuration = useContext(ConfigurationContext);
  const [selectedLabel, selectedLabelSetter] = useState(0);
  const data = props.route.params.data;
  const [loading, setLoading] = useState(false);
  const [buttonClicked, buttonClickedSetter] = useState(false);
  const scrollY = useSharedValue(0);
  const {
    restaurant: restaurantCart,
    cartCount,
    clearCart,
    checkItemCart,
  } = useContext(UserContext);
  const restaurantId = props.route.params.id;

  useFocusEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(currentTheme.menuBar);
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === "Dark" ? "light-content" : "dark-content"
    );
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // useEffect(() => {
  //   async function Track() {
  //     await Analytics.track(Analytics.events.NAVIGATE_TO_RESTAURANTS)
  //   }
  //   Track()
  // }, [])
  useEffect(() => {
    if (
      data &&
      data.restaurant &&
      (!data.restaurant.isAvailable || !isOpen())
    ) {
      Alert.alert(
        "",
        "Restaurant Closed at the moment",
        [
          {
            text: "Go back to restaurants",
            onPress: () => {
              navigation.goBack();
            },
            style: "cancel",
          },
          {
            text: "See Menu",
            onPress: () => console.log("see menu"),
          },
        ],
        { cancelable: false }
      );
    }
  }, []);

  const isOpen = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return (
      hours >= Number(data.restaurant.openingTimes.startTime[0]) &&
      minutes >= Number(data.restaurant.openingTimes.startTime[1]) &&
      hours <= Number(data.restaurant.openingTimes.endTime[0]) &&
      minutes <= Number(data.restaurant.openingTimes.endTime[1])
    );
  };
  const onPressItem = async (food) => {
    if (!data.restaurant.isAvailable || !isOpen()) {
      Alert.alert(
        "",
        "Restaurant Closed at the moment",
        [
          {
            text: "Go back to restaurants",
            onPress: () => {
              navigation.goBack();
            },
            style: "cancel",
          },
          {
            text: "See Menu",
            onPress: () => console.log("see menu"),
          },
        ],
        { cancelable: false }
      );
      return;
    }
    if (!restaurantCart || restaurant.id === restaurantCart) {
      await addToCart(food, restaurant.id !== restaurantCart);
    } else if (restaurant.id !== restaurantCart) {
      Alert.alert(
        "",
        "By leaving this restaurant page, the items you`ve added to cart will be cleared",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              await addToCart(food, true);
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const addToCart = async (food, clearFlag) => {
    if (clearFlag) await clearCart();
    navigation.navigate("ItemDetail", {
      food,
      restaurant: restaurantId,
    });
  };

  const scrollToSection = (index) => {
    if (scrollRef.current != null) {
      scrollRef.current.scrollToLocation({
        animated: true,
        sectionIndex: index,
        itemIndex: 0,
        viewOffset: -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT),
        viewPosition: 0,
      });
    }
  };

  function changeIndex(index) {
    if (selectedLabel !== index) {
      selectedLabelSetter(index);
      buttonClickedSetter(true);
      scrollToSection(index);
      scrollToNavbar(index);
    }
  }
  function scrollToNavbar(value) {
    if (flatListRef.current != null) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: value,
        viewPosition: 0.5,
      });
    }
  }

  function onViewableItemsChanged({ viewableItems }) {
    if (viewableItems.length === 0) return;
    if (
      selectedLabel !== viewableItems[0].section.index &&
      buttonClicked === false
    ) {
      selectedLabelSetter(viewableItems[0].section.index);
      scrollToNavbar(viewableItems[0].section.index);
    }
  }

  const scrollToLocationJS = (
    sectionIndex,
    itemIndex,
    viewOffset,
    viewPosition
  ) => {
    if (scrollRef.current) {
      scrollRef.current.scrollToLocation({
        animated: false,
        sectionIndex,
        itemIndex,
        viewOffset,
        viewPosition,
      });
    }
  };

  const onScrollEndSnapToEdge = (event) => {
    console.log("INSIDE onScrollEndSnapToEdge");
    const y = event.nativeEvent.contentOffset.y;
    if (y > 0 && y < HALF_HEADER_SCROLL / 2) {
      animation.value = withTiming(0, config(0), () => {
        runOnJS(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollToLocation({
              animated: false,
              sectionIndex: 0,
              itemIndex: 0,
              viewOffset: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
              viewPosition: 0,
            });
          }
        });
      });
    } else if (HALF_HEADER_SCROLL / 2 <= y && y < HALF_HEADER_SCROLL) {
      animation.value = withTiming(SCROLL_RANGE, config(SCROLL_RANGE), () => {
        runOnJS(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollToLocation({
              animated: false,
              sectionIndex: 0,
              itemIndex: 0,
              viewOffset: -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT),
              viewPosition: 0,
            });
          }
        });
      });
    }
    buttonClickedSetter(false);
  };

  // Important
  const headerHeight = interpolate(
    animation.value,
    [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    "clamp"
  );

  const opacity = interpolate(
    animation.value,
    [0, height * 0.05, SCROLL_RANGE / 2],
    [1, 0.8, 0],
    "clamp"
  );

  const iconColor = currentTheme.iconColorPink;

  const iconBackColor = currentTheme.themeBackgroundIcons;
  const iconRadius = scale(15);
  const iconSize = scale(20);
  const iconTouchHeight = scale(30);
  const iconTouchWidth = scale(30);
  const headerTextFlex = `${interpolate(
    animation.value,
    [0, 80, SCROLL_RANGE],
    [-10, -10, 0],
    "clamp"
  )}%`;

  // if (loading) {
  //   return (
  //     <Animated.View
  //       style={[
  //         styles().flex,
  //         {
  //           marginTop: inset.top,
  //           paddingBottom: inset.bottom,
  //           paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
  //           backgroundColor: currentTheme.headerMenuBackground
  //         }
  //       ]}>
  //       <ImageHeader
  //         iconColor={iconColor}
  //         iconSize={iconSize}
  //         height={headerHeight}
  //         opacity={opacity}
  //         iconBackColor={iconBackColor}
  //         iconRadius={iconRadius}
  //         iconTouchWidth={iconTouchWidth}
  //         iconTouchHeight={iconTouchHeight}
  //         headerTextFlex={headerTextFlex}
  //         restaurantName={propsData.name}
  //         restaurantImage={propsData.image}
  //         restaurant={null}
  //         topaBarData={[]}
  //         loading={loading}
  //       />

  //       <View
  //         style={[
  //           styles().navbarContainer,
  //           styles().flex,
  //           {
  //             paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - TOP_BAR_HEIGHT
  //           }
  //         ]}>
  //         {Array.from(Array(10), (_, i) => (
  //           <Placeholder
  //             key={i}
  //             Animation={props => (
  //               <Fade
  //                 {...props}
  //                 style={{ backgroundColor: '#B8B8B8' }}
  //                 duration={600}
  //               />
  //             )}
  //             Left={PlaceholderMedia}
  //             style={{
  //               padding: 12
  //             }}>
  //             <PlaceholderLine width={80} />
  //             <PlaceholderLine width={80} />
  //           </Placeholder>
  //         ))}
  //       </View>
  //     </Animated.View>
  //   )
  // }
  // if (error) return <TextError text={JSON.stringify(error)} />
  const restaurant = data.restaurant;
  const allDeals = restaurant?.categories?.filter((cat) => cat.foods.length);
  const deals = allDeals?.map((c, index) => ({
    ...c,
    data: c.foods,
    index,
  }));

  return (
    <SafeAreaView style={styles().flex}>
      {data.restaurant && (
        <Animated.View style={styles().flex}>
          <ImageHeader
            ref={flatListRef}
            iconColor={iconColor}
            iconSize={iconSize}
            height={headerHeight}
            opacity={opacity}
            iconBackColor={iconBackColor}
            iconRadius={iconRadius}
            iconTouchWidth={iconTouchWidth}
            iconTouchHeight={iconTouchHeight}
            headerTextFlex={headerTextFlex}
            restaurantName={data.restaurant.name}
            restaurantImage={data.restaurant.image}
            restaurant={data.restaurant}
            topaBarData={deals}
            changeIndex={changeIndex}
            selectedLabel={selectedLabel}
          />
          <AnimatedSectionList
            ref={scrollRef}
            sections={deals}
            style={{
              flexGrow: 1,
              zIndex: -1,
              paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
              marginTop: HEADER_MIN_HEIGHT,
            }}
            // Important
            contentContainerStyle={{
              paddingBottom: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
            }}
            scrollEventThrottle={1}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            // refreshing={networkStatus === 4}
            // onRefresh={() => networkStatus === 7 && refetch()}
            onViewableItemsChanged={onViewableItemsChanged}
            // onScrollEndDrag={event => {
            //   onScrollEndSnapToEdge(event)
            // }}
            onMomentumScrollEnd={(event) => {
              onScrollEndSnapToEdge(event);
            }}
            // Important
            onScroll={onScroll}
            keyExtractor={(item, index) => item + index}
            ItemSeparatorComponent={() => (
              <Animated.View style={styles(currentTheme).listSeperator} />
            )}
            SectionSeparatorComponent={(props) => {
              if (!props.leadingItem) return null;
              return <Animated.View style={styles(currentTheme).sectionSeparator} />;
            }}
            renderSectionHeader={({ section: { title } }) => {
              return (
                <TextDefault
                  style={styles(currentTheme).sectionHeaderText}
                  textColor={currentTheme.fontMainColor}
                  bolder
                  B700
                  H4
                >
                  {title}
                </TextDefault>
              );
            }}
            renderItem={({ item, index, section }) => {
              if (index % 2 === 0) {
                const nextItem = section.data[index + 1];

                return (
                  <Animated.View style={styles(currentTheme).rowContainer}>
                    <TouchableOpacity
                      style={[
                        styles(currentTheme).dealSection,
                        styles(currentTheme).column,
                      ]}
                      activeOpacity={0.7}
                      onPress={() =>
                        onPressItem({ ...item, addons: section.addons })
                      }
                    >
                      <Animated.View style={styles().deal}>
                        {item.image && (
                          <Image
                            style={{
                              width: "100%",
                              aspectRatio: 1,
                              borderRadius: 10,
                            }}
                            source={{ uri: item.image }}
                          />
                        )}
                        <Animated.View>
                          <TextDefault
                            textColor={currentTheme.fontMainColor}
                            style={{ ...alignment.MBxSmall, paddingTop: 10 }}
                            numberOfLines={1}
                            bolder
                          >
                            {item.title}
                          </TextDefault>
                          <Animated.View style={styles().dealPrice}>
                            <TextDefault
                              numberOfLines={1}
                              textColor={currentTheme.fontMainColor}
                              style={styles().priceText}
                              small
                            >
                              {configuration.currencySymbol}{" "}
                              {parseFloat(item.variations[0].price)}
                            </TextDefault>
                            {item.variations[0].discounted > 0 && (
                              <TextDefault
                                numberOfLines={1}
                                textColor={currentTheme.fontSecondColor}
                                style={styles().priceText}
                                small
                                lineOver
                              >
                                {configuration.currencySymbol}{" "}
                                {item.variations[0].price +
                                  item.variations[0].discounted}
                              </TextDefault>
                            )}
                          </Animated.View>
                        </Animated.View>
                      </Animated.View>
                    </TouchableOpacity>
                    {nextItem && (
                      <TouchableOpacity
                        style={[
                          styles(currentTheme).dealSection,
                          styles(currentTheme).column,
                        ]}
                        activeOpacity={0.7}
                        onPress={() =>
                          onPressItem({ ...nextItem, addons: section.addons })
                        }
                      >
                        <Animated.View style={styles().deal}>
                          {nextItem.image && (
                            <Image
                              style={{
                                width: "100%",
                                aspectRatio: 1,
                                borderRadius: 10,
                              }}
                              source={{ uri: nextItem.image }}
                            />
                          )}
                          <Animated.View>
                            <TextDefault
                              textColor={currentTheme.fontMainColor}
                              style={{ ...alignment.MBxSmall, paddingTop: 10 }}
                              numberOfLines={1}
                              bolder
                            >
                              {nextItem.title}
                            </TextDefault>
                            <Animated.View style={styles().dealPrice}>
                              <TextDefault
                                numberOfLines={1}
                                textColor={currentTheme.fontMainColor}
                                style={styles().priceText}
                                small
                              >
                                {configuration.currencySymbol}{" "}
                                {parseFloat(nextItem.variations[0].price)}
                              </TextDefault>
                              {nextItem.variations[0].discounted > 0 && (
                                <TextDefault
                                  numberOfLines={1}
                                  textColor={currentTheme.fontSecondColor}
                                  style={styles().priceText}
                                  small
                                  lineOver
                                >
                                  {configuration.currencySymbol}{" "}
                                  {nextItem.variations[0].price +
                                    nextItem.variations[0].discounted}
                                </TextDefault>
                              )}
                            </Animated.View>
                          </Animated.View>
                        </Animated.View>
                      </TouchableOpacity>
                    )}
                  </Animated.View>
                );
              }
              return null;
            }}
          />
          {cartCount > 0 && (
            <Animated.View 
            style={styles(currentTheme).buttonContainer}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles(currentTheme).button}
                onPress={() => navigation.navigate("Cart")}
              >
                <Animated.View style={styles().buttontLeft}>
                  <Animated.View
                    style={[
                      styles(currentTheme).buttonLeftCircle,
                      {
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: currentTheme.themeBackgroundIcons,
                      },
                    ]}
                  >
                    <Animated.Text
                      style={[
                        styles(currentTheme).buttonTextLeft,
                        // { fontSize: 12 },
                      ]}
                    >
                      {cartCount}
                    </Animated.Text>
                  </Animated.View>
                </Animated.View>
                <TextDefault
                  textColor={currentTheme.buttonTextPink}
                  uppercase
                  center
                  bolder
                  small
                >
                  {i18n.t("viewCart")}
                </TextDefault>
                <Animated.View style={styles().buttonTextRight} />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

export default Restaurant;
