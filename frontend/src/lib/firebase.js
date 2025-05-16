// src/lib/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVovKcSyozJkOx-o2nOyve0prXhKcy0ts",
  authDomain: "railvision-6aca9.firebaseapp.com",
  projectId: "railvision-6aca9",
  storageBucket: "railvision-6aca9.firebasestorage.app",
  messagingSenderId: "176399305787",
  appId: "1:176399305787:web:2c5159691ff44cb9f4601e",
  measurementId: "G-V8TRXP6LDB"
};

const app = initializeApp(firebaseConfig);

// ⚠️ C’est ça qu’on va utiliser pour se connecter avec Google :
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();