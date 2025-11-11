// Debug Firebase Products - Direct Test
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfSJeKJG4n_KSWzz656xpL7HXLR9WnBvw",
  authDomain: "tinkro-web-database.firebaseapp.com",
  projectId: "tinkro-web-database",
  storageBucket: "tinkro-web-database.appspot.com",
  messagingSenderId: "959260509327",
  appId: "1:959260509327:web:7579531e4f1fefa6905cfa",
  measurementId: "G-C2D1WJ5LMH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugProducts() {
  try {
    console.log('🔥 Starting Firebase debug...');
    const snapshot = await getDocs(collection(db, 'products'));
    
    console.log('📊 Total documents:', snapshot.size);
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log('🔍 Product:', {
        id: doc.id,
        name: data.name,
        status: data.status,
        category: data.category
      });
    });
    
  } catch (error) {
    console.error('❌ Firebase Error:', error);
  }
}

debugProducts();