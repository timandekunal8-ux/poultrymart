
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
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// =====================================
// CUSTOMER FIREBASE AUTHENTICATION
// =====================================

async function getCustomerUID() {
  if (auth.currentUser) {
    return auth.currentUser.uid;
  }

  return new Promise((resolve, reject) => {
    let unsubscribe = null;

    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (unsubscribe) unsubscribe();

      try {
        if (!user) {
          const result = await signInAnonymously(auth);
          user = result.user;
        }

        window.firebaseCustomerUid = user.uid;

        console.log("Customer Firebase UID:", user.uid);

        resolve(user.uid);

      } catch (error) {
        console.error("Firebase authentication error:", error);
        reject(error);
      }
    });
  });
}

window.firebaseCustomerReady = getCustomerUID();

// =====================================
// SAVE CUSTOMER ORDER TO FIRESTORE
// =====================================

window.saveOrderToFirebase = async function(order) {
  try {
    const uid = await window.firebaseCustomerReady;

    const orderData = {
      ...order,
      customerUid: uid,
      createdAt: serverTimestamp()
    };

    await setDoc(
      doc(db, "orders", String(order.id)),
      orderData
    );

    console.log("Order successfully saved:", order.id);

    return true;

  } catch (error) {
    console.error("Firebase order saving failed:", error);
    throw error;
  }
};

// =====================================
// GET CUSTOMER ORDERS
// =====================================

window.getCustomerOrdersFromFirebase = async function() {
  try {
    const uid = await window.firebaseCustomerReady;

    const ordersQuery = query(
      collection(db, "orders"),
      where("customerUid", "==", uid)
    );

    const snapshot = await getDocs(ordersQuery);

    const orders = snapshot.docs.map(item => ({
      ...item.data(),
      id: item.id
    }));

    orders.sort((a, b) => Number(b.id) - Number(a.id));

    return orders;

  } catch (error) {
    console.error("Firebase order loading failed:", error);
    throw error;
  }
};

console.log("PoultryMart Firebase Orders Loaded");
