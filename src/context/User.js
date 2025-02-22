import React, { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "uuid";
import { LocationContext } from "./Location";
import AuthContext from "./Auth";
// import Analytics from '../utils/analytics'
import { getUserByEmail } from "../firebase/profile";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const UserContext = React.createContext({});

export const UserProvider = (props) => {
  const { token, setToken } = useContext(AuthContext);
  const { email, setEmail } = useContext(AuthContext);
  const { id, setId } = useContext(AuthContext);
  const { location, setLocation } = useContext(LocationContext);
  const [cart, setCart] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [selectedValue, setSelectedValue] = useState("1");
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState(null);

  useEffect(() => {
    let isSubscribed = true;
    (async () => {
      const restaurant = await AsyncStorage.getItem("restaurant");
      const cart = await AsyncStorage.getItem("cartItems");
      isSubscribed && setRestaurant(restaurant || null);
      isSubscribed && setCart(cart ? JSON.parse(cart) : []);
    })();
    return () => {
      isSubscribed = false;
    };
  }, []);

  useEffect(() => {
    if (token && email) {
      fetchProfile();
    }
  }, [token, email]);

  const fetchProfile = async () => {
    // setLoadingProfile(true)
    // try {
    //   console.log('INSIDE THE USER CONTEXT111');
    //   console.log('email')
    //   console.log(email)
    //   const userInfo = await getUserByEmail(email);
    //   setProfile(userInfo)
    //   console.log('INSIDE THE USER CONTEXT');
    //   onCompleted({ profile: userInfo })
    // } catch (error) {
    //   setErrorProfile(error)
    //   onError(error)
    // } finally {
    //   setLoadingProfile(false)
    // }
  };

  function onError(error) {
    console.log("error context user", error.message);
  }

  async function onCompleted(data) {
    const { id: userId, name, email, phone } = data.profile;
    // await Analytics.identify(
    //   {
    //     userId,
    //     name,
    //     email,
    //     phone,
    //   },
    //   userId
    // )
    // await Analytics.track(Analytics.events.USER_RECONNECTED, {
    //   userId: data.profile.id
    // })
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("email");
      await AsyncStorage.removeItem("id");
      setProfile(null);
      setToken(null);
      setEmail(null);
      setId(null);
      if (location?.id) {
        setLocation({
          label: "Selected Location",
          latitude: location.latitude,
          longitude: location.longitude,
          deliveryAddress: location.deliveryAddress,
        });
      }
      await signOut(auth);
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.log("error on logout", error);
    }
  };

  const clearCart = async () => {
    setCart([]);
    setRestaurant(null);
    await AsyncStorage.removeItem("cartItems");
    await AsyncStorage.removeItem("restaurant");
  };

  const addQuantity = async (key, quantity = 1) => {
    const cartIndex = cart.findIndex((c) => c.key === key);
    cart[cartIndex].quantity += quantity;
    setCart([...cart]);
    await AsyncStorage.setItem("cartItems", JSON.stringify([...cart]));
  };

  const deleteItem = async (key) => {
    const cartIndex = cart.findIndex((c) => c.key === key);
    if (cartIndex > -1) {
      cart.splice(cartIndex, 1);
      const items = [...cart.filter((c) => c.quantity > 0)];
      setCart(items);
      if (items.length === 0) setRestaurant(null);
      await AsyncStorage.setItem("cartItems", JSON.stringify(items));
    }
  };

  const removeQuantity = async (key) => {
    const cartIndex = cart.findIndex((c) => c.key === key);
    cart[cartIndex].quantity -= 1;
    const items = [...cart.filter((c) => c.quantity > 0)];
    setCart(items);
    if (items.length === 0) setRestaurant(null);
    await AsyncStorage.setItem("cartItems", JSON.stringify(items));
  };

  const checkItemCart = (itemId) => {
    const filteredItems = cart.filter((c) => c.id === itemId);
    if (filteredItems.length === 0) {
      return {
        exist: false,
        quantity: 0,
      };
    }
    const totalQuantity = filteredItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    return {
      exist: true,
      quantity: totalQuantity,
      key: filteredItems[0].key,
    };
  };

  const numberOfCartItems = () => {
    return cart
      .map((c) => c.quantity)
      .reduce(function (a, b) {
        return a + b;
      }, 0);
  };

  const addCartItem = async (
    food,
    variation,
    quantity = 1,
    addons = [],
    clearFlag,
    specialInstructions = ""
  ) => {
    const cartItems = clearFlag ? [] : cart;
    cartItems.push({
      key: uuid.v4(),
      ...food,
      quantity: quantity,
      variation: variation,
      addons,
      specialInstructions,
    });

    await AsyncStorage.setItem("cartItems", JSON.stringify([...cartItems]));
    setCart([...cartItems]);
  };

  const updateCart = async (cart) => {
    setCart(cart);
    await AsyncStorage.setItem("cartItems", JSON.stringify(cart));
  };

  const setCartRestaurant = async (id) => {
    setRestaurant(id);
    await AsyncStorage.setItem("restaurant", id);
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn: token,
        loadingProfile,
        errorProfile,
        profile,
        logout,
        cart,
        cartCount: numberOfCartItems(),
        clearCart,
        updateCart,
        addQuantity,
        removeQuantity,
        addCartItem,
        checkItemCart,
        deleteItem,
        restaurant,
        setCartRestaurant,
        refetchProfile: fetchProfile,
        setProfile,
        selectedValue,
        setSelectedValue,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
export const UserConsumer = UserContext.Consumer;
export default UserContext;
