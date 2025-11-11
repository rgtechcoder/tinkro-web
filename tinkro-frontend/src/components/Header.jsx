import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Menu, X, User, LogOut, Package, Heart, MapPin, Settings, HelpCircle, Bell, CreditCard, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import firebaseAuthService from '../services/FirebaseAuthService';
import firebaseNotificationService from '../services/FirebaseNotificationService';
import firebaseWishlistService from '../services/FirebaseWishlistService';
const Header = ({
  currentPage,
  navigateToPage,
  cartItemsCount,
  setIsCartOpen,
  user: propUser
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(propUser);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-render

  useEffect(() => {
    // Use prop user if available, otherwise check auth service
    if (propUser) {
      setUser(propUser);
    } else {
      const currentUser = firebaseAuthService.getCurrentUser();
      setUser(currentUser);
    }
  }, [propUser, currentPage]);

  // Update wishlist count when user changes or on page change
  useEffect(() => {
    const loadWishlistCount = async () => {
      if (user) {
        const userId = user.uid || user.id;
        try {
          // Try Firebase first
          const userWishlist = await firebaseWishlistService.getUserWishlist(userId);
          console.log('📊 Header loaded wishlist from Firebase:', userWishlist.length, 'items');
          setWishlistCount(Array.isArray(userWishlist) ? userWishlist.length : 0);
        } catch (error) {
          console.error('❌ Error loading wishlist in Header:', error);
          // Fallback to localStorage
          const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`) || '[]');
          console.log('📊 Header loaded wishlist from localStorage:', localWishlist.length, 'items');
          setWishlistCount(Array.isArray(localWishlist) ? localWishlist.length : 0);
        }
      } else {
        setWishlistCount(0);
      }
    };
    
    loadWishlistCount();
  }, [user, currentPage]);

  // Listen for wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = async (event) => {
      console.log('✅ Header received wishlistUpdated event');
      if (user) {
        const userId = user.uid || user.id;
        try {
          // Load from Firebase
          const userWishlist = await firebaseWishlistService.getUserWishlist(userId);
          console.log('📊 Updating wishlist count to:', userWishlist.length);
          setWishlistCount(Array.isArray(userWishlist) ? userWishlist.length : 0);
          setUpdateTrigger(prev => prev + 1); // Force component update
        } catch (error) {
          console.error('❌ Error updating wishlist count:', error);
          // Fallback to localStorage
          const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`) || '[]');
          setWishlistCount(Array.isArray(localWishlist) ? localWishlist.length : 0);
          setUpdateTrigger(prev => prev + 1);
        }
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, [user]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log('✅ Header received profile update event');
      const updatedUser = event.detail;
      setUser(updatedUser);
      setUpdateTrigger(prev => prev + 1); // Force dropdown re-render
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('userProfileUpdated', handleProfileUpdate);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is inside header
      const header = event.target.closest('header');
      if (!header && (showUserMenu || showNotifications)) {
        setShowUserMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showNotifications]);

  const handleLogout = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Close all dropdowns immediately
    setShowUserMenu(false);
    setShowNotifications(false);
    setIsMobileMenuOpen(false);
    
    try {
      await firebaseAuthService.logout();
      setUser(null);
      navigateToPage('home');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get notifications from Firebase
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Load notifications from Firebase if user is logged in
    const loadNotifications = async () => {
      if (user && firebaseNotificationService.isAvailable()) {
        try {
          console.log('🔔 Loading notifications for user:', user.uid || user.id);
          const userNotifs = await firebaseNotificationService.getUserNotifications(user.uid || user.id);
          console.log('📬 Loaded notifications:', userNotifs.length, userNotifs);
          setNotifications(userNotifs);
        } catch (error) {
          console.error('❌ Error loading notifications from Firebase:', error);
          // Fallback to localStorage
          const localNotifs = JSON.parse(localStorage.getItem('tinkro_user_notifications') || '[]');
          setNotifications(localNotifs);
        }
      } else if (user) {
        console.log('⚠️ Firebase not available, using localStorage');
        // Fallback to localStorage for non-logged in users
        const localNotifs = JSON.parse(localStorage.getItem('tinkro_user_notifications') || '[]');
        setNotifications(localNotifs);
      }
    };

    loadNotifications();

    // Reload notifications when page changes or when admin sends new notifications
    const handleNotificationUpdate = () => {
      console.log('🔔 Notification update event received - reloading notifications');
      loadNotifications();
    };

    // Listen for notification updates
    window.addEventListener('notificationsUpdated', handleNotificationUpdate);
    
    // Poll for new notifications every 30 seconds when user is logged in
    let pollInterval;
    if (user) {
      pollInterval = setInterval(() => {
        console.log('🔄 Polling for new notifications...');
        loadNotifications();
      }, 30000); // 30 seconds
    }

    return () => {
      window.removeEventListener('notificationsUpdated', handleNotificationUpdate);
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [user, currentPage]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const userId = user.uid || user.id;
      const unreadNotifs = notifications.filter(n => !n.read);
      
      // Mark all as read in Firebase
      for (const notif of unreadNotifs) {
        await firebaseNotificationService.markAsRead(notif.id);
      }
      
      // Update local state
      const updatedNotifs = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifs);
      
      console.log('✅ All notifications marked as read');
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const navItems = [{
    id: 'home',
    label: 'Home'
  }, {
    id: 'products',
    label: 'Products'
  }, {
    id: 'about',
    label: 'About Us'
  }, {
    id: 'blog',
    label: 'Blog'
  }, {
    id: 'contact',
    label: 'Contact'
  }];
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Optimized for speed */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform" 
            onClick={() => navigateToPage('home')}
          >
            <img 
              src="https://horizons-cdn.hostinger.com/e7c9821b-6b7a-44e2-b895-23441ddb63a1/d68cad29faeccc76733f807b9ad82502.png" 
              alt="Tinkro Logo" 
              className="h-10 w-auto" 
            />
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => <button 
              key={item.id} 
              onClick={() => navigateToPage(item.id)}
              className={`text-sm font-medium transition-colors hover:scale-105 ${
                currentPage === item.id 
                  ? 'text-blue-600 font-semibold' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {item.label}
            </button>)}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Notifications Button */}
            {user && (
              <button 
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Notification bell clicked!');
                  setShowNotifications(!showNotifications);
                }}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Cart Button */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>}
            </Button>

            {/* User Authentication */}
            {user ? (
              <div className="relative hidden md:block">
                <button 
                  className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={async (e) => {
                    e.stopPropagation();
                    console.log('User menu clicked!');
                    setShowUserMenu(!showUserMenu);
                    
                    // Reload wishlist count when opening menu
                    if (!showUserMenu && user) {
                      const userId = user.uid || user.id;
                      try {
                        const userWishlist = await firebaseWishlistService.getUserWishlist(userId);
                        console.log('🔄 Refreshed wishlist count on menu open:', userWishlist.length);
                        setWishlistCount(Array.isArray(userWishlist) ? userWishlist.length : 0);
                        setUpdateTrigger(prev => prev + 1);
                      } catch (error) {
                        console.error('❌ Error refreshing wishlist:', error);
                      }
                    }
                  }}
                >
                  {user.photoURL || user.avatar || user.profilePicture ? (
                    <div 
                      className="rounded-full overflow-hidden border-2 border-orange-200"
                      style={{ width: '32px', height: '32px', flexShrink: 0 }}
                    >
                      <img 
                        src={user.photoURL || user.avatar || user.profilePicture} 
                        alt="Profile" 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          display: 'block'
                        }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm"
                      style={{ width: '32px', height: '32px', flexShrink: 0 }}
                    >
                      {user.displayName?.charAt(0) || user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-700">
                      {user.displayName || user.name || 'User'}
                    </span>
                    <span className="text-xs text-gray-500">My Account</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                
                {showUserMenu && (
                  <motion.div
                    key={`user-menu-${updateTrigger}`}
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                  >
                    {/* User Info Header with Profile Picture */}
                    <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-3">
                      {user.photoURL || user.profilePicture ? (
                        <div 
                          className="rounded-full overflow-hidden border-2 border-gray-200"
                          style={{ width: '40px', height: '40px', flexShrink: 0 }}
                        >
                          <img 
                            src={user.photoURL || user.profilePicture} 
                            alt="Profile" 
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              display: 'block'
                            }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="rounded-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm"
                          style={{ width: '40px', height: '40px', flexShrink: 0 }}
                        >
                          {user.displayName?.charAt(0) || user.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <p className="font-medium text-gray-800 truncate flex-1">
                        {user.displayName || user.name || 'User'}
                      </p>
                    </div>

                    {/* Menu Items - Compact */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigateToPage('user-dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          navigateToPage('user-dashboard');
                          setShowUserMenu(false);
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('setDashboardTab', { detail: 'orders' }));
                          }, 100);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <Package className="h-4 w-4" />
                        <span>Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          navigateToPage('user-dashboard');
                          setShowUserMenu(false);
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('setDashboardTab', { detail: 'wishlist' }));
                          }, 100);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        <span key={`wishlist-count-${wishlistCount}-${updateTrigger}`}>Wishlist ({wishlistCount})</span>
                      </button>

                      <button
                        onClick={() => {
                          navigateToPage('user-dashboard');
                          setShowUserMenu(false);
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('setDashboardTab', { detail: 'support' }));
                          }, 100);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span>Help & Support</span>
                      </button>

                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={(e) => handleLogout(e)}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="hidden md:flex"
                onClick={() => navigateToPage('auth')}
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="md:hidden mt-4 pb-4 space-y-2"
          >
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => {
                  navigateToPage(item.id);
                  setIsMobileMenuOpen(false);
                }} 
                className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === item.id 
                    ? 'bg-blue-50 text-blue-600 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile Auth Buttons */}
            <hr className="my-2" />
            {user ? (
              <>
                <button
                  onClick={() => {
                    navigateToPage('user-dashboard');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  {user.displayName || user.name || 'Dashboard'}
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      navigateToPage('admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={(e) => handleLogout(e)}
                  className="block w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigateToPage('auth');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Login / Sign Up
              </button>
            )}
          </motion.nav>
        )}

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="absolute top-full right-4 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <h3 className="font-bold">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'info' ? 'bg-blue-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 p-3">
                <button 
                  onClick={markAllAsRead}
                  className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;