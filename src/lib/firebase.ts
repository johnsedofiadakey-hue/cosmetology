import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOL5gMZBblFTAR3td2Oy5xVWy5pCqFNBI",
  authDomain: "cosmetologysystem.firebaseapp.com",
  projectId: "cosmetologysystem",
  storageBucket: "cosmetologysystem.firebasestorage.app",
  messagingSenderId: "152762339392",
  appId: "1:152762339392:web:39333a17578efaa34d8fa5"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
