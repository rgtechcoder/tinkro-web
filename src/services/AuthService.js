// AuthService.js - Complete Authentication Service with Multiple Login Options
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

// Firebase Configuration - Replace with your config
const firebaseConfig = {
  // Yaha tumhara Firebase config dalenge
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

class AuthService {
  constructor() {
    this.currentUser = null;
    this.recaptchaVerifier = null;
    
    // Listen to auth state changes
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      if (user) {
        // Save user data to localStorage for offline access
        this.saveUserToLocalStorage(user);
      } else {
        localStorage.removeItem('tinkro_user');
      }
    });
  }

  // Save user data to localStorage
  saveUserToLocalStorage(user) {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified,
      createdAt: user.metadata.creationTime,
      lastLogin: user.metadata.lastSignInTime,
      loginMethod: this.getLoginMethod(user),
      role: this.getUserRole(user.email) // Admin/User based on email
    };
    
    localStorage.setItem('tinkro_user', JSON.stringify(userData));
  }

  // Get user role based on email
  getUserRole(email) {
    const adminEmails = [
      'admin@tinkro.com',
      'rgtechcoder@gmail.com',
      // Add your admin emails here
    ];
    
    return adminEmails.includes(email) ? 'admin' : 'user';
  }

  // Determine login method
  getLoginMethod(user) {
    if (user.providerData.length > 0) {
      const providerId = user.providerData[0].providerId;
      switch (providerId) {
        case 'google.com': return 'Google';
        case 'facebook.com': return 'Facebook';
        case 'phone': return 'Phone';
        case 'password': return 'Email';
        default: return 'Unknown';
      }
    }
    return 'Email';
  }

  // Email & Password Signup
  async signUpWithEmail(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }

      // Create user profile in localStorage
      this.createUserProfile(userCredential.user, {
        signupMethod: 'email',
        displayName: displayName
      });

      return {
        success: true,
        user: userCredential.user,
        message: 'Account created successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Email & Password Login
  async signInWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user,
        message: 'Signed in successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Google Login
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create user profile if first time
      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
        this.createUserProfile(result.user, { signupMethod: 'google' });
      }

      return {
        success: true,
        user: result.user,
        message: 'Signed in with Google successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Facebook Login
  async signInWithFacebook() {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      
      // Create user profile if first time
      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
        this.createUserProfile(result.user, { signupMethod: 'facebook' });
      }

      return {
        success: true,
        user: result.user,
        message: 'Signed in with Facebook successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Phone Number Login
  async signInWithPhone(phoneNumber, appVerifier) {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return {
        success: true,
        confirmationResult: confirmationResult,
        message: 'OTP sent successfully! Please verify.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Verify OTP for Phone Login
  async verifyOTP(confirmationResult, otp) {
    try {
      const userCredential = await confirmationResult.confirm(otp);
      
      // Create user profile if first time
      if (userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime) {
        this.createUserProfile(userCredential.user, { signupMethod: 'phone' });
      }

      return {
        success: true,
        user: userCredential.user,
        message: 'Phone number verified successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Setup reCAPTCHA for phone auth
  setupRecaptcha(containerId) {
    this.recaptchaVerifier = new RecaptchaVerifier(containerId, {
      size: 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA solved');
      }
    }, auth);
    
    return this.recaptchaVerifier;
  }

  // Password Reset
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('tinkro_user');
      localStorage.removeItem('tinkro_cart');
      return {
        success: true,
        message: 'Logged out successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: 'Error occurred during logout.'
      };
    }
  }

  // Get Current User
  getCurrentUser() {
    const storedUser = localStorage.getItem('tinkro_user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return this.currentUser;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  // Create User Profile in localStorage
  createUserProfile(user, additionalData = {}) {
    const existingProfiles = JSON.parse(localStorage.getItem('tinkro_user_profiles') || '[]');
    
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      phoneNumber: user.phoneNumber || '',
      createdAt: new Date().toISOString(),
      bio: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      },
      preferences: {
        newsletter: true,
        notifications: true,
        theme: 'light'
      },
      orderHistory: [],
      wishlist: [],
      ...additionalData
    };

    // Check if profile already exists
    const existingIndex = existingProfiles.findIndex(p => p.uid === user.uid);
    if (existingIndex >= 0) {
      existingProfiles[existingIndex] = { ...existingProfiles[existingIndex], ...userProfile };
    } else {
      existingProfiles.push(userProfile);
    }

    localStorage.setItem('tinkro_user_profiles', JSON.stringify(existingProfiles));
  }

  // Get User Profile
  getUserProfile(uid = null) {
    const targetUid = uid || this.getCurrentUser()?.uid;
    if (!targetUid) return null;

    const profiles = JSON.parse(localStorage.getItem('tinkro_user_profiles') || '[]');
    return profiles.find(p => p.uid === targetUid) || null;
  }

  // Update User Profile
  updateUserProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) return false;

    const profiles = JSON.parse(localStorage.getItem('tinkro_user_profiles') || '[]');
    const profileIndex = profiles.findIndex(p => p.uid === user.uid);
    
    if (profileIndex >= 0) {
      profiles[profileIndex] = { ...profiles[profileIndex], ...updates };
      localStorage.setItem('tinkro_user_profiles', JSON.stringify(profiles));
      return true;
    }
    return false;
  }

  // Error Messages in English
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already registered!',
      'auth/weak-password': 'Password is too weak! Please use a stronger password.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password! Please try again.',
      'auth/invalid-email': 'Invalid email format.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many attempts! Please wait before trying again.',
      'auth/network-request-failed': 'Network error! Please check your internet connection.',
      'auth/popup-closed-by-user': 'Login popup was closed! Please try again.',
      'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
      'auth/invalid-phone-number': 'Invalid phone number format.',
      'auth/invalid-verification-code': 'Invalid OTP! Please check and try again.',
      'auth/code-expired': 'OTP has expired! Please request a new one.'
    };

    return errorMessages[errorCode] || 'Something went wrong! Please try again.';
  }

  // Add to Order History
  addToOrderHistory(orderData) {
    const user = this.getCurrentUser();
    if (!user) return false;

    const profiles = JSON.parse(localStorage.getItem('tinkro_user_profiles') || '[]');
    const profileIndex = profiles.findIndex(p => p.uid === user.uid);
    
    if (profileIndex >= 0) {
      if (!profiles[profileIndex].orderHistory) {
        profiles[profileIndex].orderHistory = [];
      }
      
      profiles[profileIndex].orderHistory.unshift({
        id: Date.now(),
        ...orderData,
        createdAt: new Date().toISOString()
      });
      
      localStorage.setItem('tinkro_user_profiles', JSON.stringify(profiles));
      return true;
    }
    return false;
  }

  // Get Order History
  getOrderHistory() {
    const profile = this.getUserProfile();
    return profile?.orderHistory || [];
  }

  // Add to Wishlist
  addToWishlist(productId) {
    const user = this.getCurrentUser();
    if (!user) return false;

    const profiles = JSON.parse(localStorage.getItem('tinkro_user_profiles') || '[]');
    const profileIndex = profiles.findIndex(p => p.uid === user.uid);
    
    if (profileIndex >= 0) {
      if (!profiles[profileIndex].wishlist) {
        profiles[profileIndex].wishlist = [];
      }
      
      if (!profiles[profileIndex].wishlist.includes(productId)) {
        profiles[profileIndex].wishlist.push(productId);
        localStorage.setItem('tinkro_user_profiles', JSON.stringify(profiles));
      }
      return true;
    }
    return false;
  }

  // Remove from Wishlist
  removeFromWishlist(productId) {
    const user = this.getCurrentUser();
    if (!user) return false;

    const profiles = JSON.parse(localStorage.getItem('tinkro_user_profiles') || '[]');
    const profileIndex = profiles.findIndex(p => p.uid === user.uid);
    
    if (profileIndex >= 0 && profiles[profileIndex].wishlist) {
      profiles[profileIndex].wishlist = profiles[profileIndex].wishlist.filter(id => id !== productId);
      localStorage.setItem('tinkro_user_profiles', JSON.stringify(profiles));
      return true;
    }
    return false;
  }

  // Get Wishlist
  getWishlist() {
    const profile = this.getUserProfile();
    return profile?.wishlist || [];
  }
}

// Create and export a single instance
const authService = new AuthService();
export default authService;