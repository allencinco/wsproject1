import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDYmMFl53xNTH3wdiI-37JuqzmYhYZuPoI",
  authDomain: "library-management-syste-a60fc.firebaseapp.com",
  projectId: "library-management-syste-a60fc",
  storageBucket: "library-management-syste-a60fc.appspot.com",
  messagingSenderId: "369449554103",
  appId: "1:369449554103:web:116b7ea20e52f8a99cbd32",
  measurementId: "G-JM16HV1XZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
