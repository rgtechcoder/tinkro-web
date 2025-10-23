import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseReady } from '../config/firebase.js';

class FirestoreService {
  constructor() {
    console.log('🔥 FirestoreService initialized:', isFirebaseReady ? 'Connected to Tinkro-Web-Database' : 'Using localStorage fallback');
  }

  isAvailable() {
    return isFirebaseReady && db !== null;
  }

  // Products
  async getAllProducts() {
    try {
      const snapshot = await getDocs(query(collection(db, 'products'), orderBy('order', 'asc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  async addProduct(product) {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { ...product, id: docRef.id };
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  async updateProduct(id, updateData) {
    try {
      await updateDoc(doc(db, 'products', id), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await deleteDoc(doc(db, 'products', id));
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // Blogs
  async getAllBlogs() {
    try {
      const snapshot = await getDocs(query(collection(db, 'blogs'), orderBy('createdAt', 'desc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting blogs:', error);
      return [];
    }
  }

  async addBlog(blog) {
    try {
      const docRef = await addDoc(collection(db, 'blogs'), {
        ...blog,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { ...blog, id: docRef.id };
    } catch (error) {
      console.error('Error adding blog:', error);
      throw error;
    }
  }

  async updateBlog(id, updateData) {
    try {
      await updateDoc(doc(db, 'blogs', id), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  async deleteBlog(id) {
    try {
      await deleteDoc(doc(db, 'blogs', id));
      return true;
    } catch (error) {
      console.error('Error deleting blog:', error);
      return false;
    }
  }

  // Contact Queries
  async getAllContactQueries() {
    try {
      const snapshot = await getDocs(query(collection(db, 'contactQueries'), orderBy('createdAt', 'desc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting contact queries:', error);
      return [];
    }
  }

  async addContactQuery(queryData) {
    try {
      const docRef = await addDoc(collection(db, 'contactQueries'), {
        ...queryData,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      return { ...queryData, id: docRef.id };
    } catch (error) {
      console.error('Error adding contact query:', error);
      throw error;
    }
  }

  async updateContactQuery(id, updateData) {
    try {
      await updateDoc(doc(db, 'contactQueries', id), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating contact query:', error);
      throw error;
    }
  }

  async deleteContactQuery(id) {
    try {
      await deleteDoc(doc(db, 'contactQueries', id));
      return true;
    } catch (error) {
      console.error('Error deleting contact query:', error);
      return false;
    }
  }

  // Orders
  async getAllOrders() {
    try {
      const snapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  async addOrder(order) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { ...order, id: docRef.id };
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  }

  async updateOrder(id, updateData) {
    try {
      await updateDoc(doc(db, 'orders', id), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async deleteOrder(id) {
    try {
      await deleteDoc(doc(db, 'orders', id));
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  }

  // Users
  async getAllUsers() {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async addUser(user) {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { ...user, id: docRef.id };
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  async updateUser(id, updateData) {
    try {
      await updateDoc(doc(db, 'users', id), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      await deleteDoc(doc(db, 'users', id));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}

const firestoreService = new FirestoreService();
export default firestoreService;
