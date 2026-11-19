
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUrqzpaMRahxJpqrQ8nDzykbsExLi-usk",
  authDomain: "poultry-mart-4129a.firebaseapp.com",
  projectId: "poultry-mart-4129a",
  storageBucket: "poultry-mart-4129a.firebasestorage.app",
  messagingSenderId: "116532205429",
  appId: "1:116532205429:web:ef8bc227778c176179e53c",
  measurementId: "G-GBS4ZMZZHZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
