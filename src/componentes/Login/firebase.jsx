import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD4Fi9FvynGf6EgoTji-oV7HGEcaV4ZHlc",
    authDomain: "dress-to-impress-4dde0.firebaseapp.com",
    projectId: "dress-to-impress-4dde0",
    storageBucket: "dress-to-impress-4dde0.appspot.com",
    messagingSenderId: "118356134379",
    appId: "1:118356134379:web:b82a1eb3c620dce65871ae"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };