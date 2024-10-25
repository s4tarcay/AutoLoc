import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC6hZnTJIe6KPtNizXuNaQe2tlB3pyj4ig",
  authDomain: "autoloc-8eb48.firebaseapp.com",
  projectId: "autoloc-8eb48",
  storageBucket: "autoloc-8eb48.appspot.com",
  messagingSenderId: "75863073366",
  appId: "1:75863073366:web:19439c38be01ff745091f7",
  measurementId: "G-TWG5V879CZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };