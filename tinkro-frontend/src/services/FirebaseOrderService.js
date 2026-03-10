// FirebaseOrderService.js
// Service to save and fetch orders from Firestore

import { db } from '../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';

const ORDERS_COLLECTION = 'orders';

const FirebaseOrderService = {
  // Save a new order to Firestore
  async createOrder(order) {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), order);
    return { ...order, id: docRef.id };
  },

  // Fetch all orders (latest first)
  async getAllOrders() {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  ,

  // Update order status
  async updateOrderStatus(orderId, newStatus) {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
    return true;
  }
};

export default FirebaseOrderService;
