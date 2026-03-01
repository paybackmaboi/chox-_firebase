import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAon3TETyAhZihJOiymmOBh7CRdlygLwKY",
  authDomain: "chox-7c239.firebaseapp.com",
  projectId: "chox-7c239",
  storageBucket: "chox-7c239.firebasestorage.app",
  messagingSenderId: "769367247104",
  appId: "1:769367247104:web:719022e3ff83280bc4cbe5",
  measurementId: "G-G26TG7LBHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };