import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFpfWsAWcd1famu0-Q4BCcY7vZ1U9Exuk",
  authDomain: "dayflow-hrms-5f1a6.firebaseapp.com",
  projectId: "dayflow-hrms-5f1a6",
  storageBucket: "dayflow-hrms-5f1a6.firebasestorage.app",
  messagingSenderId: "75213049504",
  appId: "1:75213049504:web:0c0f87923653ac22f343c5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);