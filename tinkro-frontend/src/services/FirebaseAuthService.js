/**
 * FirebaseAuthService.js
 * Complete Firebase Authentication with Email/Password and Phone OTP
 * Syncs user data to Firestore for admin access
 */

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';

class FirebaseAuthService {
  constructor() {
    this.currentUser = null;
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
    
    // Listen to auth state changes
    if (auth) {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = await this.getUserData(user.uid);
          this.currentUser = userData;
          localStorage.setItem('tinkro_current_user', JSON.stringify(userData));
        } else {
          this.currentUser = null;
          localStorage.removeItem('tinkro_current_user');
        }
      });
    }
  }

  /**
   * Check if Firebase is available
   */
  isAvailable() {
    return !!(auth && db);
  }

  /**
   * Initialize reCAPTCHA for phone authentication
   */
  initRecaptcha(buttonId = 'recaptcha-container') {
    if (!auth) {
      console.error('Firebase Auth not initialized');
      return false;
    }

    try {
      // Clear existing verifier
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
      }

      this.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
        'size': 'invisible',
        'callback': (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          this.recaptchaVerifier = null;
        }
      });

      return true;
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      return false;
    }
  }

  /**
   * Send OTP to phone number
   */
  async sendOTP(phoneNumber) {
    if (!this.isAvailable()) {
      throw new Error('Firebase not available');
    }

    try {
      // Format phone number (add +91 if not present)
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+91${phoneNumber}`;

      console.log('Sending OTP to:', formattedPhone);

      // Initialize reCAPTCHA if not already done
      if (!this.recaptchaVerifier) {
        this.initRecaptcha('recaptcha-container');
      }

      // Send verification code
      this.confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        this.recaptchaVerifier
      );

      console.log('OTP sent successfully');
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // Clear recaptcha on error
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }

      return { 
        success: false, 
        error: error.message || 'Failed to send OTP' 
      };
    }
  }

  /**
   * Verify OTP and complete phone login
   */
  async verifyOTP(otp, userData = {}) {
    if (!this.confirmationResult) {
      return { success: false, error: 'No OTP request found. Please request OTP first.' };
    }

    try {
      // Verify the OTP
      const result = await this.confirmationResult.confirm(otp);
      const user = result.user;

      console.log('OTP verified, user logged in:', user.uid);

      // Check if user exists in Firestore
      let userDoc = await this.getUserData(user.uid);

      if (!userDoc) {
        // New user - create profile
        userDoc = {
          id: user.uid,
          uid: user.uid,
          phone: user.phoneNumber,
          displayName: userData.name || 'User',
          email: userData.email || '',
          profilePicture: user.photoURL || null,
          createdAt: new Date().toISOString(),
          loginMethod: 'phone',
          rewardPoints: 0,
          isActive: true,
          lastLogin: new Date().toISOString()
        };

        // Save to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          ...userDoc,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });

        console.log('New user created in Firestore');
      } else {
        // Existing user - update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp()
        });
        userDoc.lastLogin = new Date().toISOString();
      }

      this.currentUser = userDoc;
      localStorage.setItem('tinkro_current_user', JSON.stringify(userDoc));

      return { success: true, user: userDoc };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { 
        success: false, 
        error: error.message || 'Invalid OTP' 
      };
    }
  }

  /**
   * Register with Email and Password
   */
  async registerWithEmail(email, password, displayName) {
    if (!this.isAvailable()) {
      throw new Error('Firebase not available');
    }

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName });

      // Create user document in Firestore
      const userData = {
        id: user.uid,
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        name: displayName,
        phone: '',
        profilePicture: null,
        createdAt: new Date().toISOString(),
        loginMethod: 'email',
        rewardPoints: 0,
        isActive: true,
        lastLogin: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      this.currentUser = userData;
      localStorage.setItem('tinkro_current_user', JSON.stringify(userData));

      console.log('User registered successfully:', user.uid);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  /**
   * Login with Email and Password
   */
  async loginWithEmail(email, password) {
    if (!this.isAvailable()) {
      throw new Error('Firebase not available');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      let userData = await this.getUserData(user.uid);

      if (!userData) {
        // Create user doc if doesn't exist (edge case)
        userData = {
          id: user.uid,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'User',
          name: user.displayName || 'User',
          phone: '',
          profilePicture: user.photoURL,
          createdAt: new Date().toISOString(),
          loginMethod: 'email',
          rewardPoints: 0,
          isActive: true,
          lastLogin: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', user.uid), {
          ...userData,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } else {
        // Update last login
        await updateDoc(doc(db, 'users', user.uid), {
          lastLogin: serverTimestamp()
        });
        userData.lastLogin = new Date().toISOString();
      }

      this.currentUser = userData;
      localStorage.setItem('tinkro_current_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: this.getErrorMessage(error.code) 
      };
    }
  }

  /**
   * Get user data from Firestore
   */
  async getUserData(uid) {
    if (!db) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          id: uid,
          uid: uid,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          lastLogin: data.lastLogin?.toDate?.()?.toISOString() || data.lastLogin
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      if (auth) {
        await signOut(auth);
      }
      this.currentUser = null;
      localStorage.removeItem('tinkro_current_user');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('tinkro_current_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    
    return null;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(updates) {
    const user = auth?.currentUser;
    if (!user || !db) return { success: false };

    try {
      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Update current user object
      const updatedUser = { ...this.currentUser, ...updates };
      this.currentUser = updatedUser;
      localStorage.setItem('tinkro_current_user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all users (Admin only)
   */
  async getAllUsers() {
    if (!db) return [];

    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        lastLogin: doc.data().lastLogin?.toDate?.()?.toISOString() || doc.data().lastLogin
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle() {
    if (!this.isAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user to Firestore
      await this.saveUserToFirestore(user);

      const userData = await this.getUserData(user.uid);
      
      return {
        success: true,
        message: 'Google sign-in successful!',
        user: userData
      };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return {
        success: false,
        error: error.message || 'Google sign-in failed'
      };
    }
  }

  /**
   * Sign in with Facebook
   */
  async signInWithFacebook() {
    if (!this.isAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user to Firestore
      await this.saveUserToFirestore(user);

      const userData = await this.getUserData(user.uid);
      
      return {
        success: true,
        message: 'Facebook sign-in successful!',
        user: userData
      };
    } catch (error) {
      console.error('Facebook sign-in error:', error);
      return {
        success: false,
        error: error.message || 'Facebook sign-in failed'
      };
    }
  }

  /**
   * Get friendly error messages
   */
  getErrorMessage(errorCode) {
    const errors = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/user-not-found': 'No user found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/invalid-verification-code': 'Invalid OTP. Please try again',
      'auth/code-expired': 'OTP has expired. Please request a new one'
    };

    return errors[errorCode] || 'An error occurred. Please try again';
  }
}

// Export singleton instance
const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService;
