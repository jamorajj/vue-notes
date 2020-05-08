import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "###############################",
  authDomain: "###########################",
  databaseURL: "##########################",
  projectId: "############################",
  storageBucket: "########################",
  messagingSenderId: "####################",
  appId: "################################",
};

firebase.initializeApp(firebaseConfig);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

const notesCollection = db.collection("notes");

// Initialize Firebase
export { notesCollection, db, auth, currentUser };
