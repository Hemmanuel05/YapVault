import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-5407776230-a9a13",
  appId: "1:507986018885:web:636c15842abbd3f839192c",
  apiKey: "AIzaSyBB-Tnq3Kda3jutsBkAT-yJVpN3EPRuU3U",
  authDomain: "studio-5407776230-a9a13.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "507986018885"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const getFirebaseAuth = (): Auth => getAuth(app);
const getFirebaseDb = (): Firestore => getFirestore(app);

export { app, getFirebaseAuth, getFirebaseDb };
