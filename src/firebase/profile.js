import { firestore } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

// Function to fetch user by email
async function getUserByEmail(email) {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    let userData = null;
    querySnapshot.forEach((docSnapshot) => {
      userData = { id: docSnapshot.id, ...docSnapshot.data() };
    });

    if (userData) {
      const addressesRef = collection(firestore, `users/${userData.id}/addresses`);
      const addressesSnapshot = await getDocs(addressesRef);

      let addresses = [];
      addressesSnapshot.forEach((docSnapshot) => {
        addresses.push({ id: docSnapshot.id, ...docSnapshot.data() });
      });

      userData.addresses = addresses;
    }

    return userData;
  } catch (error) {
    console.error("Error fetching user by email: ", error);
    return null;
  }
}

// Function to update user profile by email
async function updateUserProfileByEmail(email, updatedProfileData, updatePhoneIsVerified) {
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    let userDocId = null;
    querySnapshot.forEach((docSnapshot) => {
      userDocId = docSnapshot.id;
    });

    if (userDocId) {
      const userDocRef = doc(firestore, "users", userDocId);

      const updateData = {
        name: updatedProfileData.name,
        phone: updatedProfileData.phone,
      };
      if (updatePhoneIsVerified) {
        updateData.phoneIsVerified = updatedProfileData.phoneIsVerified;
      }

      await updateDoc(userDocRef, updateData);

      console.log("User profile updated successfully for email:", email);

      // Fetch the updated user document
      const updatedUserSnapshot = await getDoc(userDocRef);
      const updatedUserData = { id: updatedUserSnapshot.id, ...updatedUserSnapshot.data() };

      console.log("Updated User Profile:", JSON.stringify(updatedUserData, null, 2));
      return updatedUserData;
    } else {
      console.log("User document ID not found.");
      return null;
    }
  } catch (error) {
    console.error("Error updating user profile by email:", error);
    return null;
  }
}

// Function to add a new user
async function setUser(userData) {
  try {
    const userRef = collection(firestore, "users");
    const newUserRef = await addDoc(userRef, userData);
    console.log("User profile set successfully for user ID:", newUserRef.id);
    return userData;
  } catch (error) {
    console.error("Error setting user profile:", error);
    return null;
  }
}

export { getUserByEmail, updateUserProfileByEmail, setUser };
