import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8LCx_Jf18q3_IGlMtRNMEKv5E5h9FSe8",
  authDomain: "esproductionz-5289a.firebaseapp.com",
  projectId: "esproductionz-5289a",
  storageBucket: "esproductionz-5289a.appspot.com",
  messagingSenderId: "1011836749379",
  appId: "1:1011836749379:web:4ef4e245dbcb85a9e436f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);