import { auth, db } from "./firebase.js";

import {
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
// Connect customer anonymously to Firebase
window.firebaseCustomerUid = null;
window.firebaseCustomerUid = null;

window.firebaseCustomerReady = (async function() {
  try {
    let user = auth.currentUser;

    if (!user) {
      const result = await signInAnonymously(auth);
      user = result.user;
    }

    window.firebaseCustomerUid = user.uid;
    console.log("Customer Firebase UID:", user.uid);

    return user.uid;

  } catch (error) {
    console.error("Firebase login error:", error);
    throw error;
  }
})();
window.saveOrderToFirebase = async function(order) {
  try {
    const uid = await window.firebaseCustomerReady;

    await setDoc(doc(db, "orders", String(order.id)), {
      ...order,
      customerUid: uid
    });

    console.log("Order saved to Firebase");

  } catch (error) {
    console.error("Firebase order saving failed:", error);
    throw error;
  }
};
// Save customer order to Firestore

// Get customer's latest orders from Firebase

window.getCustomerOrdersFromFirebase = async function() {
  const uid = await window.firebaseCustomerReady;

  const ordersQuery = query(
    collection(db, "orders"),
    where("customerUid", "==", uid)
  );

  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map(item => ({
    ...item.data(),
    id: item.id
  }));
};
