// Safe Firebase Configuration with Real Credentials


// Fresh Firebase config with error handling
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};
console.log('FIREBASE CONFIG:', firebaseConfig);

let app = null;
let db = null;
let auth = null;

console.log('FIREBASE CONFIG:', firebaseConfig);
try {
	app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
	db = getFirestore(app);
	auth = getAuth(app);
	console.log('✅ Firebase initialized');
} catch (error) {
	console.error('❌ Firebase init error:', error);
	db = null;
	auth = null;
}

export { db, auth };
export default app;