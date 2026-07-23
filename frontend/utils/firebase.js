// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "novaai-4b6ee.firebaseapp.com",
  projectId: "novaai-4b6ee",
  storageBucket: "novaai-4b6ee.firebasestorage.app",
  messagingSenderId: "40670148098",
  appId: "1:40670148098:web:1dad8338fa49022c17591b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =getAuth(app)
export const googleProvider=new GoogleAuthProvider()
 