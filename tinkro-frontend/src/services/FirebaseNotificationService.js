/**
 * FirebaseNotificationService - Firebase-based Notification Management
 * Stores notifications in Firestore for cross-device sync
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
  serverTimestamp,
  limit 
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

class FirebaseNotificationService {
  constructor() {
    this.collectionName = 'notifications';
  }

  /**
   * Check if Firebase is available
   */
  isAvailable() {
    return !!db;
  }

  /**
   * Send notification to all users or specific user
   */
  async sendNotification(notificationData, userId = null) {
    if (!this.isAvailable()) {
      console.warn('Firebase not available');
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const notification = {
        title: notificationData.title || '',
        message: notificationData.message || '',
        type: notificationData.type || 'info', // info, success, warning, alert
        priority: notificationData.priority || 'normal', // low, normal, high, urgent
        userId: userId || 'all', // 'all' for broadcast, specific userId for targeted
        read: false,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.collectionName), notification);
      
      console.log('✅ Notification sent to Firebase:', docRef.id);
      
      // Trigger browser event for real-time update
      window.dispatchEvent(new Event('notificationsUpdated'));
      
      return {
        success: true,
        notification: {
          id: docRef.id,
          ...notification,
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get notifications for specific user
   */
  async getUserNotifications(userId, limitCount = 50) {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const notificationsRef = collection(db, this.collectionName);
      
      // Simplified query - get all notifications and filter in memory
      // This avoids Firestore index requirement for composite queries
      const q = query(
        notificationsRef,
        orderBy('createdAt', 'desc'),
        limit(100) // Get more to ensure we have enough after filtering
      );
      
      const snapshot = await getDocs(q);
      
      // Filter for user-specific and broadcast notifications in memory
      const allNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        time: this.getTimeAgo(doc.data().createdAt?.toDate?.() || new Date())
      }));

      // Filter for this user or broadcast
      const filteredNotifications = allNotifications.filter(notif => 
        notif.userId === userId || notif.userId === 'all'
      ).slice(0, limitCount);

      console.log(`📬 Loaded ${filteredNotifications.length} notifications for user ${userId}`);
      return filteredNotifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      console.error('Full error:', error);
      return [];
    }
  }

  /**
   * Get all notifications (Admin only)
   */
  async getAllNotifications() {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const notificationsRef = collection(db, this.collectionName);
      const q = query(notificationsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
      }));
    } catch (error) {
      console.error('Error getting all notifications:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    if (!this.isAvailable()) {
      return { success: false };
    }

    try {
      const notificationRef = doc(db, this.collectionName, notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp()
      });

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mark all user notifications as read
   */
  async markAllAsRead(userId) {
    if (!this.isAvailable()) {
      return { success: false };
    }

    try {
      const notifications = await this.getUserNotifications(userId);
      
      const promises = notifications
        .filter(n => !n.read)
        .map(n => this.markAsRead(n.id));
      
      await Promise.all(promises);
      
      return { success: true };
    } catch (error) {
      console.error('Error marking all as read:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId) {
    if (!this.isAvailable()) {
      return { success: false };
    }

    try {
      await deleteDoc(doc(db, this.collectionName, notificationId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get unread count for user
   */
  async getUnreadCount(userId) {
    if (!this.isAvailable()) {
      return 0;
    }

    try {
      const notifications = await this.getUserNotifications(userId);
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Get time ago string
   */
  getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  /**
   * Send welcome notification to new user
   */
  async sendWelcomeNotification(userId, userName) {
    return this.sendNotification({
      title: 'Welcome to Tinkro!',
      message: `Hi ${userName}! Thanks for joining us. Explore our amazing robotics collection and start your STEM journey today!`,
      type: 'welcome',
      priority: 'normal'
    }, userId);
  }

  /**
   * Send order notification
   */
  async sendOrderNotification(userId, orderDetails) {
    return this.sendNotification({
      title: 'Order Confirmed',
      message: `Your order #${orderDetails.orderId} has been confirmed! We'll notify you when it's shipped.`,
      type: 'success',
      priority: 'high'
    }, userId);
  }
}

// Export singleton instance
const firebaseNotificationService = new FirebaseNotificationService();
export default firebaseNotificationService;
