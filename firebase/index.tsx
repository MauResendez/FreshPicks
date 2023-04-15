// import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyB5igDjWoF0t9ilsj_iROcFW-9qwrdWvcQ",
//   authDomain: "fresh-picks-215e9.firebaseapp.com",
//   projectId: "fresh-picks-215e9",
//   storageBucket: "fresh-picks-215e9.appspot.com",
//   messagingSenderId: "90405109083",
//   appId: "1:90405109083:web:adc4641abed5fd41daee7e",
//   measurementId: "G-S5TXEZDMC2"
// };

const firebaseConfig = {
  apiKey: "AIzaSyD3km-g9k7LHQD96RRbJN84iYqJLYumVu0",
  authDomain: "cfsifreshpicks.firebaseapp.com",
  projectId: "cfsifreshpicks",
  storageBucket: "cfsifreshpicks.appspot.com",
  messagingSenderId: "1011220940974",
  appId: "1:1011220940974:web:ca22b3c99f68866a62c53f",
  measurementId: "G-4287FXQ4ZB",
  databaseURL: "cfsifreshpicks.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const RecaptchaVerifier = auth.RecaptchaVerifier;

export { RecaptchaVerifier, analytics, app, auth, db, firebaseConfig, storage };

