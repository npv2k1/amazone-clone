import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyCF7D2uLQ4IhwJwhKlaz5_ceQRoxakA1Pk",
  authDomain: "e-af8ad.firebaseapp.com",
  projectId: "e-af8ad",
  storageBucket: "e-af8ad.appspot.com",
  messagingSenderId: "1096808918852",
  appId: "1:1096808918852:web:2c8a4dd198ee862d1ef111",
  measurementId: "G-R6MB0FTGCV",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = app.firestore();
export default db;