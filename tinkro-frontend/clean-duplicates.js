// Clean Duplicate Products from Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

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

async function cleanDuplicateProducts() {
  try {
    console.log('🧹 Starting duplicate cleanup...');
    const snapshot = await getDocs(collection(db, 'products'));
    
    const products = [];
    const duplicates = [];
    const seen = new Set();
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const productKey = `${data.name}-${data.category}-${data.price}`;
      
      if (seen.has(productKey)) {
        // This is a duplicate
        duplicates.push({
          id: doc.id,
          name: data.name,
          category: data.category
        });
        console.log('🔍 Found duplicate:', data.name);
      } else {
        // This is unique
        seen.add(productKey);
        products.push({
          id: doc.id,
          name: data.name,
          category: data.category
        });
      }
    });
    
    console.log('📊 Unique products:', products.length);
    console.log('🗑️ Duplicates found:', duplicates.length);
    
    // Delete duplicates
    for (const duplicate of duplicates) {
      await deleteDoc(doc(db, 'products', duplicate.id));
      console.log('❌ Deleted duplicate:', duplicate.name);
    }
    
    console.log('✅ Cleanup completed!');
    console.log('📦 Remaining unique products:', products.length);
    
  } catch (error) {
    console.error('❌ Cleanup Error:', error);
  }
}

cleanDuplicateProducts();