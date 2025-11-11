/**
 * FirebaseWishlistService - Firebase-based Wishlist Management
 * Stores user wishlists in Firestore for cross-device sync
 */

import { 
  collection, 
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

class FirebaseWishlistService {
  constructor() {
    this.collectionName = 'wishlists';
  }

  /**
   * Check if Firebase is available
   */
  isAvailable() {
    return !!db;
  }

  /**
   * Get user's wishlist
   */
  async getUserWishlist(userId) {
    if (!this.isAvailable()) {
      // Fallback to localStorage
      const localWishlist = localStorage.getItem(`wishlist_${userId}`);
      return localWishlist ? JSON.parse(localWishlist) : [];
    }

    try {
      const wishlistRef = doc(db, this.collectionName, userId);
      const wishlistDoc = await getDoc(wishlistRef);
      
      if (wishlistDoc.exists()) {
        const data = wishlistDoc.data();
        return data.items || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error getting wishlist:', error);
      return [];
    }
  }

  /**
   * Add product to wishlist
   */
  async addToWishlist(userId, product) {
    if (!this.isAvailable()) {
      // Fallback to localStorage
      const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`) || '[]');
      if (!localWishlist.find(item => item.id === product.id)) {
        localWishlist.push(product);
        localStorage.setItem(`wishlist_${userId}`, JSON.stringify(localWishlist));
      }
      return { success: true, wishlist: localWishlist };
    }

    try {
      const wishlistRef = doc(db, this.collectionName, userId);
      const wishlistDoc = await getDoc(wishlistRef);
      
      if (wishlistDoc.exists()) {
        // Update existing wishlist
        const currentItems = wishlistDoc.data().items || [];
        
        // Check if product already exists
        if (currentItems.find(item => item.id === product.id)) {
          return { success: true, message: 'Product already in wishlist', wishlist: currentItems };
        }
        
        await updateDoc(wishlistRef, {
          items: arrayUnion(product),
          updatedAt: serverTimestamp()
        });
      } else {
        // Create new wishlist
        await setDoc(wishlistRef, {
          userId,
          items: [product],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      const updatedWishlist = await this.getUserWishlist(userId);
      console.log('✅ Product added to wishlist in Firebase');
      
      return { success: true, wishlist: updatedWishlist };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(userId, productId) {
    if (!this.isAvailable()) {
      // Fallback to localStorage
      const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`) || '[]');
      const updatedWishlist = localWishlist.filter(item => item.id !== productId);
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(updatedWishlist));
      return { success: true, wishlist: updatedWishlist };
    }

    try {
      const wishlistRef = doc(db, this.collectionName, userId);
      const wishlistDoc = await getDoc(wishlistRef);
      
      if (wishlistDoc.exists()) {
        const currentItems = wishlistDoc.data().items || [];
        const productToRemove = currentItems.find(item => item.id === productId);
        
        if (productToRemove) {
          await updateDoc(wishlistRef, {
            items: arrayRemove(productToRemove),
            updatedAt: serverTimestamp()
          });
        }
      }
      
      const updatedWishlist = await this.getUserWishlist(userId);
      console.log('✅ Product removed from wishlist in Firebase');
      
      return { success: true, wishlist: updatedWishlist };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Toggle product in wishlist (add if not exists, remove if exists)
   */
  async toggleWishlist(userId, product) {
    const wishlist = await this.getUserWishlist(userId);
    const exists = wishlist.find(item => item.id === product.id);
    
    if (exists) {
      return this.removeFromWishlist(userId, product.id);
    } else {
      return this.addToWishlist(userId, product);
    }
  }

  /**
   * Check if product is in wishlist
   */
  async isInWishlist(userId, productId) {
    const wishlist = await this.getUserWishlist(userId);
    return wishlist.some(item => item.id === productId);
  }

  /**
   * Get wishlist count
   */
  async getWishlistCount(userId) {
    const wishlist = await this.getUserWishlist(userId);
    return wishlist.length;
  }

  /**
   * Clear entire wishlist
   */
  async clearWishlist(userId) {
    if (!this.isAvailable()) {
      localStorage.removeItem(`wishlist_${userId}`);
      return { success: true, wishlist: [] };
    }

    try {
      const wishlistRef = doc(db, this.collectionName, userId);
      await updateDoc(wishlistRef, {
        items: [],
        updatedAt: serverTimestamp()
      });
      
      console.log('✅ Wishlist cleared in Firebase');
      return { success: true, wishlist: [] };
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
const firebaseWishlistService = new FirebaseWishlistService();
export default firebaseWishlistService;
