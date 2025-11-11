// AuthService.js - Local Authentication Service (No Firebase)
console.log('AuthService: Loading local authentication system');

// Local Auth - No external providers needed

class AuthService {
  constructor() {
    this.currentUser = null;
    console.log('AuthService: Initialized with localStorage');
    
    // Load existing user from localStorage
    this.loadCurrentUser();
  }
  
  // Load user from localStorage
  loadCurrentUser() {
    try {
      const savedUser = localStorage.getItem('tinkro_user');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        console.log('AuthService: User loaded from localStorage:', this.currentUser);
      }
    } catch (error) {
      console.error('AuthService: Error loading user:', error);
    }
  }

  // Save user data to localStorage with enhanced info
  saveUserToLocalStorage(user) {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Tinkro User',
      photoURL: user.photoURL || null, // Don't force default avatar here
      phoneNumber: user.phoneNumber || '',
      emailVerified: user.emailVerified || false,
      createdAt: user.createdAt || (user.metadata?.creationTime || new Date().toISOString()),
      lastLogin: new Date().toISOString(),
      loginMethod: this.getLoginMethod(user),
      role: this.getUserRole(user.email),
      isLoggedIn: true,
      preferences: this.getUserPreferences(user.uid),
      loginCount: this.incrementLoginCount(user.uid)
    };
    
    localStorage.setItem('tinkro_user', JSON.stringify(userData));
    localStorage.setItem('tinkro_auth_token', user.accessToken || 'local-auth-token');
    
    // Track login analytics
    this.trackLogin(userData);
  }

  // Get user preferences
  getUserPreferences(uid) {
    const saved = localStorage.getItem(`tinkro_preferences_${uid}`);
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      language: 'en',
      notifications: true,
      newsletter: false
    };
  }

  // Track login count
  incrementLoginCount(uid) {
    const key = `tinkro_login_count_${uid}`;
    const current = parseInt(localStorage.getItem(key) || '0');
    const newCount = current + 1;
    localStorage.setItem(key, newCount.toString());
    return newCount;
  }

  // Track login for analytics
  trackLogin(userData) {
    const loginHistory = JSON.parse(localStorage.getItem('tinkro_login_history') || '[]');
    loginHistory.push({
      timestamp: new Date().toISOString(),
      method: userData.loginMethod,
      device: navigator.userAgent
    });
    
    // Keep only last 50 logins
    if (loginHistory.length > 50) {
      loginHistory.splice(0, loginHistory.length - 50);
    }
    
    localStorage.setItem('tinkro_login_history', JSON.stringify(loginHistory));
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
    console.log('SignUp attempt:', email, displayName);
    
    // Always use localStorage for demo/development - skip Firebase completely
    return this.localSignUp(email, password, displayName);
  }

  // Local signup fallback
  localSignUp(email, password, displayName) {
    try {
      console.log('LocalSignUp called with:', email, displayName);
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('tinkro_users') || '[]');
      console.log('Existing users:', existingUsers);
      
      const userExists = existingUsers.find(u => u.email === email);
      
      if (userExists) {
        console.log('User already exists:', email);
        return {
          success: false,
          error: 'auth/email-already-in-use',
          message: 'An account with this email already exists!'
        };
      }
      
      // Create new user
      const newUser = {
        uid: 'local_' + Date.now(),
        email: email,
        displayName: displayName || email.split('@')[0],
        phoneNumber: '',
        photoURL: null,
        emailVerified: false,
        createdAt: new Date().toISOString()
      };
      
      // Save user with encrypted password (basic)
      const hashedPassword = btoa(password); // Basic encoding for demo
      existingUsers.push({ ...newUser, password: hashedPassword });
      localStorage.setItem('tinkro_users', JSON.stringify(existingUsers));
      
      // Set current user
      this.currentUser = newUser;
      this.saveUserToLocalStorage(newUser);
      
      console.log('User created successfully:', newUser);
      
      return {
        success: true,
        user: newUser,
        message: 'Account created successfully! Welcome to Tinkro!'
      };
    } catch (error) {
      console.error('LocalSignUp error:', error);
      return {
        success: false,
        error: 'local-error',
        message: 'Failed to create account. Please try again.'
      };
    }
  }

  // Email & Password Login
  async signInWithEmail(email, password) {
    try {
      // For demo purposes - use localStorage if Firebase is not configured
      if (!auth || !auth.app) {
        return this.localSignIn(email, password);
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user,
        message: 'Signed in successfully!'
      };
    } catch (error) {
      // Fallback to local storage if Firebase fails
      if (error.code === 'auth/invalid-api-key' || error.code === 'auth/network-request-failed') {
        return this.localSignIn(email, password);
      }
      
      return {
        success: false,
        error: error.code,
        message: this.getErrorMessage(error.code)
      };
    }
  }

  // Local signin fallback
  localSignIn(email, password) {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('tinkro_users') || '[]');
      const hashedPassword = btoa(password);
      const user = existingUsers.find(u => u.email === email && u.password === hashedPassword);
      
      if (!user) {
        return {
          success: false,
          error: 'auth/user-not-found',
          message: 'Invalid email or password!'
        };
      }
      
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;
      
      // Set current user
      this.currentUser = userWithoutPassword;
      this.saveUserToLocalStorage(userWithoutPassword);
      
      return {
        success: true,
        user: userWithoutPassword,
        message: 'Signed in successfully!'
      };
    } catch (error) {
      return {
        success: false,
        error: 'local-error',
        message: 'Failed to sign in. Please try again.'
      };
    }
  }

  // Google Login - Disabled for local development
  async signInWithGoogle() {
    return {
      success: false,
      error: 'google-disabled',
      message: 'Google sign-in is not available in demo mode. Please use email signup.'
    };
  }

  // Facebook Login - Disabled for local development
  async signInWithFacebook() {
    return {
      success: false,
      error: 'facebook-disabled',
      message: 'Facebook sign-in is not available in demo mode. Please use email signup.'
    };
  }

  // Phone Number Login - Disabled for local development
  async signInWithPhone(phoneNumber, appVerifier) {
    return {
      success: false,
      error: 'phone-disabled',
      message: 'Phone sign-in is not available in demo mode. Please use email signup.'
    };
  }

  // Verify OTP for Phone Login - Disabled for local development
  async verifyOTP(confirmationResult, otp) {
    return {
      success: false,
      error: 'otp-disabled',
      message: 'OTP verification is not available in demo mode.'
    };
  }

  // Setup reCAPTCHA for phone auth - Disabled for local development
  setupRecaptcha(containerId) {
    console.log('reCAPTCHA disabled in demo mode');
    return null;
  }

  // Password Reset - Disabled for local development
  async resetPassword(email) {
    return {
      success: false,
      error: 'reset-disabled',
      message: 'Password reset is not available in demo mode.'
    };
  }

  // Enhanced Logout with proper cleanup
  async logout() {
    try {
      const currentUser = this.getCurrentUser();
      
      // Local logout only - no Firebase
      
      // Clear all user-related data
      localStorage.removeItem('tinkro_user');
      localStorage.removeItem('tinkro_auth_token');
      localStorage.removeItem('tinkro_cart');
      localStorage.removeItem('tinkro_wishlist');
      
      // Track logout
      if (currentUser) {
        this.trackLogout(currentUser);
      }
      
      // Clear current user
      this.currentUser = null;
      
      return {
        success: true,
        message: 'Logged out successfully! See you soon! 👋'
      };
    } catch (error) {
      return {
        success: false,
        error: error.code,
        message: 'Error occurred during logout.'
      };
    }
  }

  // Track logout for analytics
  trackLogout(userData) {
    const logoutHistory = JSON.parse(localStorage.getItem('tinkro_logout_history') || '[]');
    logoutHistory.push({
      timestamp: new Date().toISOString(),
      sessionDuration: this.calculateSessionDuration(userData.lastLogin),
      user: userData.uid
    });
    
    // Keep only last 20 logouts
    if (logoutHistory.length > 20) {
      logoutHistory.splice(0, logoutHistory.length - 20);
    }
    
    localStorage.setItem('tinkro_logout_history', JSON.stringify(logoutHistory));
  }

  // Calculate session duration
  calculateSessionDuration(loginTime) {
    const now = new Date();
    const login = new Date(loginTime);
    const duration = now - login;
    
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
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
    const user = this.getCurrentUser();
    const token = localStorage.getItem('tinkro_auth_token');
    return user !== null && token !== null && user.isLoggedIn === true;
  }

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  // Get user authentication state
  getAuthState() {
    const user = this.getCurrentUser();
    return {
      isLoggedIn: this.isLoggedIn(),
      isAdmin: this.isAdmin(),
      user: user,
      sessionDuration: user ? this.calculateSessionDuration(user.lastLogin) : null,
      loginCount: user ? user.loginCount : 0
    };
  }

  // Update user preferences
  updateUserPreferences(preferences) {
    const user = this.getCurrentUser();
    if (user) {
      const key = `tinkro_preferences_${user.uid}`;
      const existing = JSON.parse(localStorage.getItem(key) || '{}');
      const updated = { ...existing, ...preferences };
      localStorage.setItem(key, JSON.stringify(updated));
      
      // Update in main user object
      user.preferences = updated;
      localStorage.setItem('tinkro_user', JSON.stringify(user));
      
      return true;
    }
    return false;
  }

  // Get user dashboard data
  getUserDashboardData() {
    const user = this.getCurrentUser();
    if (!user) return null;
    
    return {
      profile: {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        phone: user.phoneNumber,
        verified: user.emailVerified,
        memberSince: new Date(user.createdAt).toLocaleDateString(),
        loginCount: user.loginCount
      },
      stats: {
        totalOrders: this.getUserOrderCount(user.uid),
        totalSpent: this.getUserTotalSpent(user.uid),
        wishlistItems: this.getWishlistCount(user.uid),
        loyaltyPoints: this.getLoyaltyPoints(user.uid)
      },
      recentActivity: this.getRecentActivity(user.uid)
    };
  }

  // Helper methods for dashboard data
  getUserOrderCount(uid) {
    const orders = JSON.parse(localStorage.getItem(`tinkro_orders_${uid}`) || '[]');
    return orders.length;
  }

  getUserTotalSpent(uid) {
    const orders = JSON.parse(localStorage.getItem(`tinkro_orders_${uid}`) || '[]');
    return orders.reduce((total, order) => total + (order.total || 0), 0);
  }

  getWishlistCount(uid) {
    const wishlist = JSON.parse(localStorage.getItem(`tinkro_wishlist_${uid}`) || '[]');
    return wishlist.length;
  }

  getLoyaltyPoints(uid) {
    return parseInt(localStorage.getItem(`tinkro_points_${uid}`) || '0');
  }

  getRecentActivity(uid) {
    const loginHistory = JSON.parse(localStorage.getItem('tinkro_login_history') || '[]');
    return loginHistory.slice(-5).reverse(); // Last 5 logins
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

    try {
      // Update main user data
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('tinkro_user', JSON.stringify(updatedUser));
      this.currentUser = updatedUser;

      // Update user profiles array
      const profiles = JSON.parse(localStorage.getItem('tinkro_user_profiles') || '[]');
      const profileIndex = profiles.findIndex(p => p.uid === user.uid);
      
      if (profileIndex >= 0) {
        profiles[profileIndex] = { ...profiles[profileIndex], ...updates };
      } else {
        // Create new profile if doesn't exist
        profiles.push({ uid: user.uid, ...updates });
      }
      localStorage.setItem('tinkro_user_profiles', JSON.stringify(profiles));

      // Update users list if needed
      const users = JSON.parse(localStorage.getItem('tinkro_users') || '[]');
      const userIndex = users.findIndex(u => u.uid === user.uid);
      if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('tinkro_users', JSON.stringify(users));
      }

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
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