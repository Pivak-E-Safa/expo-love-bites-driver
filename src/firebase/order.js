import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  getDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../../firebaseConfig";

// Place a new order
async function placeAnOrder(orderData, itemsData, addressData) {
  try {
    // Add the order
    const ordersRef = collection(firestore, "orders");
    const newOrderRef = await addDoc(ordersRef, orderData);
    console.log("Order saved successfully with ID:", newOrderRef.id);

    // Prepare a batch to add items and delivery address
    const batch = writeBatch(firestore);

    // Add items
    const itemsRef = collection(firestore, `orders/${newOrderRef.id}/items`);
    itemsData.forEach((item) => {
      const newItemRef = doc(itemsRef);
      batch.set(newItemRef, item);
    });

    // Add delivery address
    const addressRef = collection(firestore, `orders/${newOrderRef.id}/deliveryAddress`);
    const newAddressRef = doc(addressRef);
    batch.set(newAddressRef, addressData);

    // Commit the batch
    await batch.commit();
    console.log("Items and deliveryAddress saved successfully for order:", newOrderRef.id);

    return newOrderRef.id;
  } catch (error) {
    console.error("Error saving order, items, or deliveryAddress:", error);
    return null;
  }
}

// Fetch orders by user ID
async function fetchOrdersByUserId(userId) {
  try {
    const ordersRef = collection(firestore, "orders");
    const q = query(ordersRef, where("userId", "==", userId));
    const ordersSnapshot = await getDocs(q);

    const orders = [];
    for (const docSnapshot of ordersSnapshot.docs) {
      const orderData = docSnapshot.data();

      // Fetch items for the order
      const itemsRef = collection(firestore, `orders/${docSnapshot.id}/items`);
      const itemsSnapshot = await getDocs(itemsRef);
      const items = itemsSnapshot.docs.map((itemDoc) => itemDoc.data());

      // Fetch delivery address for the order
      const addressRef = collection(firestore, `orders/${docSnapshot.id}/deliveryAddress`);
      const addressSnapshot = await getDocs(addressRef);
      const address = addressSnapshot.docs.map((addressDoc) => addressDoc.data());

      // Fetch restaurant data
      const restaurantRef = doc(firestore, "restaurants", orderData.restaurantId);
      const restaurantSnapshot = await getDoc(restaurantRef);
      const restaurant = restaurantSnapshot.exists() ? restaurantSnapshot.data() : null;

      // Combine the data
      orders.push({
        id: docSnapshot.id,
        ...orderData,
        items,
        deliveryAddress: address[0],
        restaurant,
      });
    }

    return orders;
  } catch (error) {
    console.error("Error fetching orders by userId:", error);
    return null;
  }
}

// Fetch orders by restaurant ID
async function fetchOrdersByRestaurantId(restaurantId) {
  try {
    const ordersRef = collection(firestore, "orders");
    const q = query(ordersRef, where("restaurantId", "==", restaurantId));
    const ordersSnapshot = await getDocs(q);

    const orders = [];
    for (const docSnapshot of ordersSnapshot.docs) {
      const orderData = docSnapshot.data();

      // Fetch items
      const itemsRef = collection(firestore, `orders/${docSnapshot.id}/items`);
      const itemsSnapshot = await getDocs(itemsRef);
      const items = itemsSnapshot.docs.map((itemDoc) => itemDoc.data());

      // Fetch delivery address
      const addressRef = collection(firestore, `orders/${docSnapshot.id}/deliveryAddress`);
      const addressSnapshot = await getDocs(addressRef);
      const deliveryAddress = addressSnapshot.docs.map((addressDoc) => addressDoc.data());

      orders.push({
        id: docSnapshot.id,
        ...orderData,
        items,
        deliveryAddress: deliveryAddress[0], // Assuming one delivery address per order
      });
    }

    return orders;
  } catch (error) {
    console.error("Error fetching orders by restaurantId:", error);
    return null;
  }
}

// Update order status
async function updateOrderStatus(orderId, status) {
  try {
    const orderRef = doc(firestore, "orders", orderId);
    await updateDoc(orderRef, { status });
    console.log(`Order status updated successfully to '${status}' for order ID: ${orderId}`);
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
}

export {
  placeAnOrder,
  fetchOrdersByUserId,
  fetchOrdersByRestaurantId,
  updateOrderStatus,
};
