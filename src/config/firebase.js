// Safe Firebase Configuration with Real Credentials
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Real Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBfSJeKJG4n_KSWzz656xpL7HXLR9WnBvw",
  authDomain: "tinkro-web-database.firebaseapp.com",
  projectId: "tinkro-web-database",
  storageBucket: "tinkro-web-database.firebasestorage.app",
  messagingSenderId: "959260509327",
  appId: "1:959260509327:web:7579531e4f1fefa6905cfa",
  measurementId: "G-C2D1WJ5LMH"
};

// Safe initialization with error handling
let app = null;
let db = null;
let auth = null;
let isFirebaseReady = false;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  isFirebaseReady = true;
  console.log('🔥 Firebase connected successfully to Tinkro-Web-Database');
} catch (error) {
  console.error('⚠️ Firebase initialization failed, using localStorage fallback:', error);
  isFirebaseReady = false;
}

export { db, auth, isFirebaseReady };
export default app;