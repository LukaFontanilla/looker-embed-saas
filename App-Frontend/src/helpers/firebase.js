import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "pbl-demo-2020-281322.firebaseapp.com",
  projectId: "pbl-demo-2020-281322",
  storageBucket: "pbl-demo-2020-281322.appspot.com",
  messagingSenderId: "610722499102",
  appId: "1:610722499102:web:5b392f18fea467e7013c0f",
  measurementId: "G-HZ92RCXX22",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const loginWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const { displayName, photoURL, email, uid } = res.user;
    return { displayName, photoURL, email, uid };
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export { auth, loginWithGoogle, logout };
