import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD2i06_--pnL-02fSmAlzc6cfcqi6clyDo",
  authDomain: "yummysouth-e9cef.firebaseapp.com",
  projectId: "yummysouth-e9cef",
  storageBucket: "yummysouth-e9cef.firebasestorage.app",
  messagingSenderId: "829848572988",
  appId: "1:829848572988:web:541ae68f218475300b5f39",
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
