import React, { useState, useRef } from "react";
import { View, Image, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const ImageSlider = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const { width } = Dimensions.get("window");

  const renderItem = ({ item }) => {
    return (
      <View>
        <Image
          source={
            typeof item === "string" && item.startsWith("http")
              ? { uri: item }
              : item
          }
          style={{
            width: width,
            height: 180,
            right: 10,
            borderRadius: 10,
            flexGrow: 1,
            zIndex: -1,
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        autoplayDelay={500}
        data={images}
        scrollAnimationDuration={2000}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ImageSlider;
