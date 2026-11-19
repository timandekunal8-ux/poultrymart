import { auth, db } from "./firebase.js";

import {
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
  doc,
  setDoc
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
