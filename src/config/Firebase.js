// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKbxHcmFS6lEHL9QOQ1PvZCeZ-86by13s",
  authDomain: "wetterappcool.firebaseapp.com",
  projectId: "wetterappcool",
  storageBucket: "wetterappcool.appspot.com",
  messagingSenderId: "573801486915",
  appId: "1:573801486915:web:035338a3642ff7426912f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export { firebaseConfig }