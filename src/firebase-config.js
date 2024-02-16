// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRBa2QxsTRNNBqmHDNTPv2Qm1LBMI7Swk",
  authDomain: "radpair-216f9.firebaseapp.com",
  projectId: "radpair-216f9",
  storageBucket: "radpair-216f9.appspot.com",
  messagingSenderId: "961758453641",
  appId: "1:961758453641:web:c45894e1eb9bcb7f82cb58",
  measurementId: "G-BWWNBZNDS5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);