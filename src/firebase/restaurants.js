import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import restaurants from "../data/restaurants";

// Fetch restaurant list
async function fetchRestaurantList() {
  try {
    // Return local data
    return restaurants;

    // Uncomment the following section to fetch from Firestore

    // const restaurantsRef = collection(firestore, "restaurants");
    // const restaurantsSnapshot = await getDocs(restaurantsRef);
    // const restaurantsList = restaurantsSnapshot.docs.map((docSnapshot) => ({
    //   id: docSnapshot.id,
    //   ...docSnapshot.data(),
    // }));

    // for (const restaurant of restaurantsList) {
    //   // Fetch categories
    //   const categoriesRef = collection(firestore, `restaurants/${restaurant.id}/categories`);
    //   const categoriesSnapshot = await getDocs(categoriesRef);
    //   restaurant.categories = categoriesSnapshot.docs.map((docSnapshot) => ({
    //     id: docSnapshot.id,
    //     ...docSnapshot.data(),
    //   }));

    //   // Fetch opening times
    //   const openingTimesRef = collection(firestore, `restaurants/${restaurant.id}/openingTimes`);
    //   const openingTimesSnapshot = await getDocs(openingTimesRef);
    //   restaurant.openingTimes = openingTimesSnapshot.docs.map((docSnapshot) => ({
    //     id: docSnapshot.id,
    //     ...docSnapshot.data(),
    //   }));

    //   // Fetch times for each opening time
    //   for (const openingTime of restaurant.openingTimes) {
    //     const timesRef = collection(
    //       firestore,
    //       `restaurants/${restaurant.id}/openingTimes/${openingTime.id}/times`
    //     );
    //     const timesSnapshot = await getDocs(timesRef);
    //     openingTime.times = timesSnapshot.docs.map((docSnapshot) => ({
    //       id: docSnapshot.id,
    //       ...docSnapshot.data(),
    //     }));
    //   }
    // }

    // return restaurantsList;
  } catch (error) {
    console.error("Error fetching restaurant list:", error);
    throw error;
  }
}

// Fetch restaurant details by ID
async function fetchRestaurantDetails(restaurantId) {
  try {
    // Return local data
    return restaurants.find((restaurant) => restaurant.id === restaurantId);

    // Uncomment the following section to fetch from Firestore

    // const restaurantRef = doc(firestore, "restaurants", restaurantId);
    // const restaurantSnapshot = await getDoc(restaurantRef);

    // if (!restaurantSnapshot.exists()) {
    //   throw new Error(`Restaurant with ID ${restaurantId} not found`);
    // }

    // const restaurant = {
    //   id: restaurantId,
    //   ...restaurantSnapshot.data(),
    // };

    // // Fetch categories
    // const categoriesRef = collection(firestore, `restaurants/${restaurantId}/categories`);
    // const categoriesSnapshot = await getDocs(categoriesRef);
    // restaurant.categories = categoriesSnapshot.docs.map((docSnapshot) => ({
    //   id: docSnapshot.id,
    //   ...docSnapshot.data(),
    // }));

    // // Fetch foods, addons, and variations for each category
    // for (const category of restaurant.categories) {
    //   const foodsRef = collection(firestore, `restaurants/${restaurantId}/categories/${category.id}/foods`);
    //   const foodsSnapshot = await getDocs(foodsRef);
    //   category.foods = foodsSnapshot.docs.map((docSnapshot) => ({
    //     id: docSnapshot.id,
    //     ...docSnapshot.data(),
    //   }));

    //   const addonsRef = collection(firestore, `restaurants/${restaurantId}/categories/${category.id}/addons`);
    //   const addonsSnapshot = await getDocs(addonsRef);
    //   category.addons = addonsSnapshot.docs.map((docSnapshot) => ({
    //     id: docSnapshot.id,
    //     ...docSnapshot.data(),
    //   }));

    //   // Fetch variations for each food item
    //   for (const food of category.foods) {
    //     const variationsRef = collection(
    //       firestore,
    //       `restaurants/${restaurantId}/categories/${category.id}/foods/${food.id}/variations`
    //     );
    //     const variationsSnapshot = await getDocs(variationsRef);
    //     food.variations = variationsSnapshot.docs.map((docSnapshot) => ({
    //       id: docSnapshot.id,
    //       ...docSnapshot.data(),
    //     }));
    //   }
    // }

    // return restaurant;
  } catch (error) {
    console.error("Error fetching the restaurant details:", error);
    throw error;
  }
}

export { fetchRestaurantList, fetchRestaurantDetails };
