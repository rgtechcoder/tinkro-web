/**
 * FirebaseContactService - Firebase-based Contact Form Management
 * Stores contact queries in Firestore for admin access
 */

import { 
  collection, 
  doc,
  addDoc, 
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

class FirebaseContactService {
  constructor() {
    this.collectionName = 'contact_queries';
  }

  /**
   * Check if Firebase is available
   */
  isAvailable() {
    return !!db;
  }

  /**
   * Add new contact query
   */
  async addQuery(queryData) {
    if (!this.isAvailable()) {
      console.warn('Firebase not available, query not saved');
      return {
        success: true, // Return success for UX even if not saved
        query: { ...queryData, id: Date.now() }
      };
    }

    try {
      const newQuery = {
        name: queryData.name || '',
        email: queryData.email || '',
        phone: queryData.phone || '',
        message: queryData.message || '',
        status: 'new',
        priority: 'normal',
        createdAt: serverTimestamp(),
        read: false
      };

      const docRef = await addDoc(collection(db, this.collectionName), newQuery);
      
      console.log('✅ Contact query saved to Firebase:', docRef.id);
      
      return {
        success: true,
        query: {
          id: docRef.id,
          ...newQuery,
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error saving contact query:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get all contact queries (Admin only)
   */
  async getAllQueries() {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const queriesRef = collection(db, this.collectionName);
      const q = query(queriesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const queries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
      }));

      console.log(`✅ Loaded ${queries.length} contact queries from Firebase`);
      return queries;
    } catch (error) {
      console.error('Error getting contact queries:', error);
      return [];
    }
  }

  /**
   * Get queries by status
   */
  async getQueriesByStatus(status) {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const queriesRef = collection(db, this.collectionName);
      const q = query(
        queriesRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
      }));
    } catch (error) {
      console.error('Error getting queries by status:', error);
      return [];
    }
  }

  /**
   * Update query status
   */
  async updateQueryStatus(queryId, status, priority = null) {
    if (!this.isAvailable()) {
      throw new Error('Firebase not available');
    }

    try {
      const queryRef = doc(db, this.collectionName, queryId);
      const updates = {
        status,
        read: true,
        updatedAt: serverTimestamp()
      };

      if (priority) {
        updates.priority = priority;
      }

      await updateDoc(queryRef, updates);
      
      console.log('✅ Query updated in Firebase:', queryId);
      
      return {
        success: true,
        message: 'Query updated successfully'
      };
    } catch (error) {
      console.error('Error updating query:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete query
   */
  async deleteQuery(queryId) {
    if (!this.isAvailable()) {
      throw new Error('Firebase not available');
    }

    try {
      await deleteDoc(doc(db, this.collectionName, queryId));
      
      console.log('✅ Query deleted from Firebase:', queryId);
      
      return {
        success: true,
        message: 'Query deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting query:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Mark query as read
   */
  async markAsRead(queryId) {
    return this.updateQueryStatus(queryId, 'read');
  }

  /**
   * Get unread count
   */
  async getUnreadCount() {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      const queriesRef = collection(db, this.collectionName);
      const q = query(queriesRef, where('read', '==', false));
      const snapshot = await getDocs(q);
      
      return snapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}

// Export singleton instance
const firebaseContactService = new FirebaseContactService();
export default firebaseContactService;
