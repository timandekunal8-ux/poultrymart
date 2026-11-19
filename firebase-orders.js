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

signInAnonymously(auth)
  .then((result) => {
    window.firebaseCustomerUid = result.user.uid;
    console.log("Firebase customer connected");
  })
  .catch((error) => {
    console.error("Firebase login error:", error);
  });

// Save customer order to Firestore
window.saveOrderToFirebase = async function(order) {
  const uid = window.firebaseCustomerUid;

  if (!uid) {
    throw new Error("Firebase is still connecting. Please try again.");
  }

  await setDoc(doc(db, "orders", String(order.id)), {
    ...order,
    customerUid: uid
  });

  console.log("Order saved to Firebase");
};
// Get customer's latest orders from Firebase
window.getCustomerOrdersFromFirebase = async function() {
  const uid = window.firebaseCustomerUid;

  if (!uid) {
    throw new Error("Customer is not connected to Firebase.");
  }

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
