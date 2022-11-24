// External Imports
import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

// Internal Imports
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./App/Styles/landing.css";

// Firebase config info
const firebaseConfig = {
  apiKey: "AIzaSyCkkO71QSbH-XS0s1PgI-IDjhT0v0LGaZ4",
  authDomain: "betting-site-c2774.firebaseapp.com",
  projectId: "betting-site-c2774",
  storageBucket: "betting-site-c2774.appspot.com",
  messagingSenderId: "847286306133",
  appId: "1:847286306133:web:8146fc0a058f5d7d0b5bdc",
  measurementId: "G-QSBWG2MN78"
};
// Initialize firebase instance
firebase.initializeApp(firebaseConfig);

// Initialize other firebase services on firebase instance
firebase.firestore();

// Emulator setup
firebase.auth().useEmulator("http://localhost:9099/");
firebase.firestore().useEmulator("localhost", 8080);
firebase.functions().useEmulator("localhost", 5001);
// firebase.pubsub().useEmulator("localhost", 5005);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
0