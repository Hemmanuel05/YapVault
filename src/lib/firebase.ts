import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-5407776230-a9a13",
  appId: "1:507986018885:web:636c15842abbd3f839192c",
  apiKey: "AIzaSyBB-Tnq3Kda3jutsBkAT-yJVpN3EPRuU3U",
  authDomain: "studio-5407776230-a9a13.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "507986018885"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
