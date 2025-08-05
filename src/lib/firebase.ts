// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoEh_sH-XzLicFC0hD0WWV1GVrWMYZT3k",
  authDomain: "usic-website.firebaseapp.com",
  projectId: "usic-website",
  storageBucket: "usic-website.firebasestorage.app",
  messagingSenderId: "1032596561441",
  appId: "1:1032596561441:web:0a92466b0cfae464890d60",
  measurementId: "G-N9139GYSV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app; 