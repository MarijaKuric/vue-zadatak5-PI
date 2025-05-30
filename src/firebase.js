import { initializeApp } from "firebase/app";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARJ1SI_lSD0p9aEKacK8L1dXGxxz-a5eo",
  authDomain: "zadatak6pi.firebaseapp.com",
  projectId: "zadatak6pi",
  storageBucket: "zadatak6pi.appspot.com",
  messagingSenderId: "964701780964",
  appId: "1:964701780964:web:2a67438144ce57387ba5f1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { 
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
};