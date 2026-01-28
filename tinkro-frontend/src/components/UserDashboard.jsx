import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RewardService from '../services/RewardService';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  CreditCard, 
  Bell,
  HelpCircle,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  ShoppingCart,
  Eye,
  Star,
  Camera,
  Trophy,
  Clock,
  Phone,
  Mail,
  Shield,
  Download,
  Repeat,
  Edit,
  X,
  MessageCircle
} from 'lucide-react';
import authService from '../services/SimpleAuthService';
import firebaseWishlistService from '../services/FirebaseWishlistService';

const UserDashboard = ({ user, onLogout, setCurrentPage, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user) {
        const userId = user.uid || user.id;
        
        try {
          // Load wishlist from Firebase
          const userWishlist = await firebaseWishlistService.getUserWishlist(userId);
          console.log('📊 Dashboard loaded wishlist from Firebase:', userWishlist.length, 'items');
          
          setUserData({
            ...user,
            joinedDate: user.createdAt || new Date().toISOString(),
            totalOrders: 0,
            totalSpent: 0,
            loyaltyPoints: 100,
            membershipLevel: 'Silver',
            stats: {
              totalOrders: 0,
              totalSpent: 0,
              wishlistItems: Array.isArray(userWishlist) ? userWishlist.length : 0,
              loyaltyPoints: 100
            }
          });
        } catch (error) {
          console.error('❌ Error loading dashboard data:', error);
          // Fallback to localStorage
          const localWishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`) || '[]');
          console.log('📊 Dashboard fallback to localStorage:', localWishlist.length, 'items');
          
          setUserData({
            ...user,
            joinedDate: user.createdAt || new Date().toISOString(),
            totalOrders: 0,
            totalSpent: 0,
            loyaltyPoints: 100,
            membershipLevel: 'Silver',
            stats: {
              totalOrders: 0,
              totalSpent: 0,
              wishlistItems: Array.isArray(localWishlist) ? localWishlist.length : 0,
              loyaltyPoints: 100
            }
          });
        }
      }
    };
    
    loadDashboardData();
  }, [user]);

  // Listen for dashboard tab changes from header dropdown
  useEffect(() => {
    const handleTabChange = (event) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('setDashboardTab', handleTabChange);
    return () => {
      window.removeEventListener('setDashboardTab', handleTabChange);
    };
  }, []);

  // Listen for wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = async () => {
      await refreshUserData();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [user]);

  const refreshUserData = async (updatedUser = null) => {
    if (user) {
      const userId = user.uid || user.id;
      
      try {
        // Load from Firebase
        const userWishlist = await firebaseWishlistService.getUserWishlist(userId);
        console.log('🔄 Dashboard refreshed wishlist from Firebase:', userWishlist.length, 'items');
        const currentUser = updatedUser || JSON.parse(localStorage.getItem('tinkro_current_user') || '{}');
        
        setUserData(prev => ({
          ...prev,
          ...currentUser, // Update all user data from localStorage or provided updatedUser
          stats: {
            ...prev.stats,
            wishlistItems: Array.isArray(userWishlist) ? userWishlist.length : 0
          }
        }));
      } catch (error) {
        console.error('❌ Error refreshing dashboard data:', error);
        // Fallback to localStorage
        const userWishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`) || '[]');
        const currentUser = updatedUser || JSON.parse(localStorage.getItem('tinkro_current_user') || '{}');
        
        setUserData(prev => ({
          ...prev,
          ...currentUser,
          stats: {
            ...prev.stats,
            wishlistItems: Array.isArray(userWishlist) ? userWishlist.length : 0
          }
        }));
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    if (onLogout) {
      onLogout();
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: User, color: 'from-blue-500 to-purple-600' },
    { id: 'orders', label: 'My Orders', icon: Package, color: 'from-green-500 to-emerald-600' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, color: 'from-red-500 to-pink-600' },
    { id: 'addresses', label: 'Addresses', icon: MapPin, color: 'from-yellow-500 to-orange-600' },
    { id: 'rewards', label: 'Reward Points', icon: Trophy, color: 'from-yellow-500 to-orange-600' },
    { id: 'coupons', label: 'Coupons & Offers', icon: CreditCard, color: 'from-green-500 to-teal-600' },
    { id: 'profile', label: 'Profile Settings', icon: Settings, color: 'from-purple-500 to-indigo-600' },
    { id: 'support', label: 'Help & Support', icon: HelpCircle, color: 'from-gray-500 to-slate-600' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-white/90 backdrop-blur-sm shadow-xl h-full overflow-y-auto border-r border-gray-200">
          <div className="p-4">
            {/* User Info */}
            <div className="bg-gradient-to-r from-orange-100 to-blue-100 rounded-xl p-4 mb-4 border border-orange-200">
              <div className="flex items-center space-x-4">
                <div 
                  className="rounded-full overflow-hidden border-2 border-white shadow-sm"
                  style={{ width: '64px', height: '64px', flexShrink: 0 }}
                >
                  {(userData?.photoURL || userData?.profilePicture || userData?.profile?.avatar) ? (
                    <img 
                      src={userData?.photoURL || userData?.profilePicture || userData?.profile?.avatar} 
                      alt="Profile" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-orange-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      {userData?.displayName?.charAt(0) || userData?.profile?.name?.charAt(0) || userData?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-xl">
                    {userData?.displayName || userData?.profile?.name || userData?.name || 'User'}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 h-full overflow-y-auto bg-gradient-to-b from-transparent to-white/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Welcome back, {userData?.displayName || userData?.profile?.name || userData?.name || 'User'}!
              </h2>
              <p className="text-gray-600 mt-1">
                Manage your account, orders and explore our services.
              </p>
            </div>
            {userData?.profile?.verified && (
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <Shield size={16} className="text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">Verified Account</span>
              </div>
            )}
          </div>

          {/* Content Area with Working Tabs */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && <OverviewTab userData={userData} setActiveTab={setActiveTab} />}
                {activeTab === 'orders' && <OrdersTab setCurrentPage={setCurrentPage} />}
                {activeTab === 'wishlist' && <WishlistTab userData={userData} onWishlistUpdate={refreshUserData} setCurrentPage={setCurrentPage} />}
                {activeTab === 'addresses' && <AddressesTab />}
                {activeTab === 'rewards' && <RewardsTab userData={userData} onUserUpdate={refreshUserData} />}
                {activeTab === 'coupons' && <CouponsTab userData={userData} onUserUpdate={refreshUserData} />}
                {activeTab === 'profile' && <ProfileTab userData={userData} onUserUpdate={refreshUserData} showSuccessToast={showSuccessToast} />}
                {activeTab === 'support' && <SupportTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Custom Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up">
            <div className="w-5 h-5 bg-white text-green-500 rounded-full flex items-center justify-center">
              ✓
            </div>
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ userData, setActiveTab }) => {
  const currentPoints = RewardService.getUserRewardPoints();
  const couponsAvailable = Math.floor(currentPoints / 200);
  const progressToNextCoupon = (currentPoints % 200) / 200 * 100;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <button 
          onClick={() => setActiveTab('orders')}
          className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Package size={24} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{userData?.stats?.totalOrders || 0}</h3>
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
            </div>
            <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('wishlist')}
          className="group bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-red-300 transition-all duration-300 text-left"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <Heart size={24} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{userData?.stats?.wishlistItems || 0}</h3>
              <p className="text-gray-600 text-sm font-medium">Wishlist Items</p>
            </div>
            <div className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('rewards')}
          className="group bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl p-6 shadow-sm border border-yellow-200 hover:shadow-lg transition-all duration-300 text-left"
        >
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
            <Trophy size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{currentPoints}</h3>
          <p className="text-gray-600 text-sm font-medium">Reward Points</p>
          <div className="mt-2">
            <div className="bg-yellow-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressToNextCoupon}%` }}
              ></div>
            </div>
            <p className="text-xs text-orange-600 mt-1">
              {200 - (currentPoints % 200)} points to next coupon
            </p>
          </div>
        </button>

        <button 
          onClick={() => setActiveTab('coupons')}
          className="group bg-gradient-to-r from-green-500 to-teal-500 rounded-xl p-6 text-white hover:shadow-lg transition-all duration-300 text-left"
        >
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
            <CreditCard size={24} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold">{couponsAvailable}</h3>
          <p className="text-white/80 text-sm font-medium">Available Coupons</p>
          <p className="text-xs text-green-100 mt-1">Each worth ₹100 off</p>
        </button>
      </div>
    </div>
  );
};

// Orders Tab Component (fetches and displays user orders)
const OrdersTab = ({ setCurrentPage }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem('tinkro_current_user') || '{}');

  useEffect(() => {
    // Try to load orders from localStorage (or OrderManager if available)
    let allOrders = [];
    try {
      // If you have an OrderManager service, use it here instead
      allOrders = JSON.parse(localStorage.getItem('tinkro_orders') || '[]');
    } catch (e) {
      allOrders = [];
    }
    // Debug: Log all orders and user email
    console.log('[OrdersTab] All Orders:', allOrders);
    console.log('[OrdersTab] Current user email:', userData.email);
    console.log('[OrdersTab] All order emails:', allOrders.map(o => o.email));
    // Filter orders by current user's email
    const filtered = allOrders.filter(
      (order) => order.email && userData.email && order.email === userData.email
    );
    console.log('[OrdersTab] Filtered Orders:', filtered);
    setOrders(filtered);
    setLoading(false);
  }, [userData.email]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
          <button 
            onClick={() => setCurrentPage('products')} 
            className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id || order.orderId} className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package size={20} className="text-blue-500" />
                  <span className="font-bold text-gray-800">Order #{order.orderId || order.id}</span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status || 'pending'}</span>
              </div>
              <div className="text-gray-700 mb-2">
                <span className="font-medium">Placed on:</span> {order.date ? new Date(order.date).toLocaleString() : 'N/A'}
              </div>
              <div className="mb-2">
                <span className="font-medium">Total:</span> ₹{order.total || order.amount || 0}
              </div>
              {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium">Items:</span>
                  <ul className="list-disc ml-6 text-gray-600">
                    {order.items.map((item, idx) => (
                      <li key={idx}>{item.name} x {item.quantity || 1}</li>
                    ))}
                  </ul>
                </div>
              )}
              {order.paymentId && (
                <div className="text-xs text-gray-500 mt-2">Payment ID: {order.paymentId}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Wishlist Tab Component
const WishlistTab = ({ userData, onWishlistUpdate, setCurrentPage }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (userData) {
        const userId = userData.uid || userData.id;
        try {
          // Try to load from Firebase first
          const firebaseWishlistService = (await import('../services/FirebaseWishlistService')).default;
          const wishlist = await firebaseWishlistService.getUserWishlist(userId);
          setWishlistItems(Array.isArray(wishlist) ? wishlist : []);
          console.log('✅ Loaded wishlist from Firebase:', wishlist.length);
        } catch (error) {
          console.error('❌ Error loading wishlist from Firebase:', error);
          // Fallback to localStorage
          const userWishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`) || '[]');
          setWishlistItems(Array.isArray(userWishlist) ? userWishlist : []);
        }
        setLoading(false);
      }
    };
    loadWishlist();
  }, [userData]);

  const removeFromWishlist = async (productId) => {
    if (!userData) return;
    
    const userId = userData.uid || userData.id;
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    
    // Update localStorage as backup
    localStorage.setItem(`wishlist_${userId}`, JSON.stringify(updatedWishlist));
    
    // Update Firebase
    try {
      const firebaseWishlistService = (await import('../services/FirebaseWishlistService')).default;
      // Find the item to remove and toggle it in Firebase
      const itemToRemove = wishlistItems.find(item => item.id === productId);
      if (itemToRemove) {
        await firebaseWishlistService.toggleWishlist(userId, itemToRemove);
      }
    } catch (error) {
      console.error('❌ Error removing from Firebase wishlist:', error);
    }
    
    // Dispatch event to update header
    window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
      detail: { count: updatedWishlist.length } 
    }));
    
    if (onWishlistUpdate) {
      onWishlistUpdate();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist</h2>
      
      {!Array.isArray(wishlistItems) || wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Add products you like to see them here!</p>
          <button 
            onClick={() => setCurrentPage('products')} 
            className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-lg font-bold text-orange-600 mb-3">₹{item.price}</p>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Addresses Tab Component
const AddressesTab = () => {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    type: 'home'
  });

  useEffect(() => {
    const savedAddresses = JSON.parse(localStorage.getItem('user_addresses') || '[]');
    setAddresses(savedAddresses);
  }, []);

  const handleAddAddress = () => {
    if (newAddress.name && newAddress.phone && newAddress.address && newAddress.city) {
      const updatedAddresses = [...addresses, { ...newAddress, id: Date.now() }];
      setAddresses(updatedAddresses);
      localStorage.setItem('user_addresses', JSON.stringify(updatedAddresses));
      setNewAddress({
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        type: 'home'
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteAddress = (id) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    localStorage.setItem('user_addresses', JSON.stringify(updatedAddresses));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-shadow flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={newAddress.name}
              onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={newAddress.phone}
              onChange={(e) => setNewAddress(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Complete Address"
              value={newAddress.address}
              onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 md:col-span-2"
            />
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <input
              type="text"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) => setNewAddress(prev => ({ ...prev, pincode: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <select
              value={newAddress.type}
              onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddAddress}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Save Address
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{address.name}</h3>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm capitalize">
                {address.type}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{address.phone}</p>
            <p className="text-gray-600 mb-4">
              {address.address}, {address.city}, {address.state} - {address.pincode}
            </p>
            <button
              onClick={() => handleDeleteAddress(address.id)}
              className="text-red-500 hover:text-red-700 flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        ))}
      </div>

      {addresses.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No addresses saved</h3>
          <p className="text-gray-500">Add your first address to make checkout faster!</p>
        </div>
      )}
    </div>
  );
};

// Profile Picture Editor Component
const ProfilePictureEditor = ({ userData, onUserUpdate, onClose }) => {
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [crop, setCrop] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageScale, setImageScale] = useState(1);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        // Set initial crop position to center-top area for better face selection
        setCrop({ x: 75, y: 20, width: 200, height: 200 });
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = imageRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - crop.x,
      y: e.clientY - rect.top - crop.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging && imageRef.current) {
      e.preventDefault();
      const rect = imageRef.current.getBoundingClientRect();
      
      // Calculate proper bounds based on actual rendered image size
      const maxX = Math.max(0, rect.width - crop.width);
      const maxY = Math.max(0, rect.height - crop.height);
      
      const newX = Math.max(0, Math.min(e.clientX - rect.left - dragStart.x, maxX));
      const newY = Math.max(0, Math.min(e.clientY - rect.top - dragStart.y, maxY));
      
      setCrop(prev => ({ ...prev, x: newX, y: newY }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners to document for better drag experience
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, crop.width, crop.height]);

  const cropImage = () => {
    if (image && imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;
      
      canvas.width = crop.width;
      canvas.height = crop.height;
      
      const scaleX = img.naturalWidth / img.offsetWidth;
      const scaleY = img.naturalHeight / img.offsetHeight;
      
      ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      
      const croppedDataURL = canvas.toDataURL();
      setCroppedImage(croppedDataURL);
    }
  };

  const saveProfilePicture = async () => {
    if (croppedImage) {
      try {
        const updatedUser = { ...userData, profilePicture: croppedImage, photoURL: croppedImage };
        
        // Save to localStorage
        localStorage.setItem('tinkro_current_user', JSON.stringify(updatedUser));
        
        // Update Firebase if user has uid
        if (updatedUser.uid) {
          try {
            const { doc, updateDoc } = await import('firebase/firestore');
            const { db } = await import('../config/firebase.js');
            
            await updateDoc(doc(db, 'users', updatedUser.uid), {
              profilePicture: croppedImage,
              photoURL: croppedImage,
              updatedAt: new Date().toISOString()
            });
            console.log('✅ Profile picture updated in Firebase');
          } catch (error) {
            console.error('❌ Error updating profile picture in Firebase:', error);
          }
        }
        
        // Dispatch event to update Header
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
          detail: updatedUser 
        }));
        
        // Update parent component
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
        
        onClose();
      } catch (error) {
        console.error('❌ Error saving profile picture:', error);
        alert('Failed to save profile picture. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-bold mb-4">Edit Profile Picture</h3>
        
        {!image ? (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4"
              id="profile-upload"
            />
            <label
              htmlFor="profile-upload"
              className="block w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-orange-500"
            >
              <Camera size={48} className="mx-auto mb-2 text-gray-400" />
              <span className="text-gray-500">Click to upload image</span>
            </label>
          </div>
        ) : (
          <div>
            <div className="relative mb-4 select-none bg-gray-100 rounded-lg overflow-hidden">
              <img
                ref={imageRef}
                src={image}
                alt="Profile"
                className="w-full h-80 object-contain rounded-lg"
                style={{ userSelect: 'none' }}
                draggable={false}
                onLoad={() => {
                  // Reset crop position when image loads to ensure it's within bounds
                  if (imageRef.current) {
                    const rect = imageRef.current.getBoundingClientRect();
                    setCrop(prev => ({
                      ...prev,
                      x: Math.min(prev.x, Math.max(0, rect.width - prev.width)),
                      y: Math.min(prev.y, Math.max(0, rect.height - prev.height))
                    }));
                  }
                }}
              />
              <div
                className="absolute border-2 border-orange-500 bg-orange-400 bg-opacity-20 cursor-move shadow-lg"
                style={{
                  left: `${crop.x}px`,
                  top: `${crop.y}px`,
                  width: `${crop.width}px`,
                  height: `${crop.height}px`,
                  transform: 'translate3d(0,0,0)', // Hardware acceleration for smoother movement
                }}
                onMouseDown={handleMouseDown}
              >
                <div className="w-full h-full border border-white/50 rounded-sm">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                    Drag to move
                  </div>
                  {/* Corner handles for better visual feedback */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border border-white"></div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Size: {crop.width}x{crop.height}px
              </label>
              <input
                type="range"
                min="100"
                max="280"
                step="10"
                value={crop.width}
                onChange={(e) => {
                  const size = parseInt(e.target.value);
                  
                  setCrop(prev => {
                    if (!imageRef.current) return prev;
                    
                    const rect = imageRef.current.getBoundingClientRect();
                    const maxWidth = rect.width;
                    const maxHeight = rect.height;
                    
                    // Ensure crop doesn't exceed image bounds
                    const newX = Math.max(0, Math.min(prev.x, maxWidth - size));
                    const newY = Math.max(0, Math.min(prev.y, maxHeight - size));
                    
                    return { 
                      ...prev, 
                      width: size, 
                      height: size,
                      x: newX,
                      y: newY
                    };
                  });
                  setCroppedImage(null);
                }}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                📌 <strong>Tip:</strong> Drag the orange square to position your crop area, then use the slider to adjust size.
              </p>
            </div>
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={cropImage}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Preview Crop
              </button>
              <button
                onClick={() => setImage(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Change Image
              </button>
            </div>
            
            {croppedImage && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img src={croppedImage} alt="Cropped" className="w-24 h-24 rounded-full mx-auto" />
              </div>
            )}
          </div>
        )}
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
          {croppedImage && (
            <button
              onClick={saveProfilePicture}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Save Picture
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({ userData, onUserUpdate, showSuccessToast }) => {
  const [profileData, setProfileData] = useState({
    name: userData?.displayName || userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
  });
  const [showPictureEditor, setShowPictureEditor] = useState(false);

  const handleSave = async () => {
    try {
      const updatedUser = { 
        ...userData, 
        displayName: profileData.name, 
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone 
      };
      
      // Save to localStorage
      localStorage.setItem('tinkro_current_user', JSON.stringify(updatedUser));
      
      // Update Firebase if user has uid
      if (updatedUser.uid) {
        try {
          const { doc, updateDoc } = await import('firebase/firestore');
          const { db } = await import('../config/firebase.js');
          
          await updateDoc(doc(db, 'users', updatedUser.uid), {
            displayName: profileData.name,
            phone: profileData.phone,
            updatedAt: new Date().toISOString()
          });
          console.log('✅ Profile updated in Firebase');
        } catch (error) {
          console.error('❌ Error updating Firebase:', error);
        }
      }
      
      // Dispatch event to update Header and parent component
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
        detail: updatedUser 
      }));
      
      // Update parent component user state
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      
      // Show success message
      showSuccessToast('Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error in handleSave:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Settings</h2>
      
      <div className="max-w-2xl">
        {/* Profile Picture Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Profile Picture</label>
          <div className="flex items-center gap-6">
            <div className="relative" style={{ width: '96px', height: '96px' }}>
              <div className="absolute inset-0 rounded-full bg-gray-200 overflow-hidden">
                {(userData?.profilePicture || userData?.photoURL) ? (
                  <img 
                    src={userData.profilePicture || userData.photoURL} 
                    alt="Profile" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={40} className="text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setShowPictureEditor(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Camera size={18} />
                {(userData?.profilePicture || userData?.photoURL) ? 'Change Picture' : 'Upload Picture'}
              </button>
              <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Profile Picture Editor Modal */}
      {showPictureEditor && (
        <ProfilePictureEditor
          userData={userData}
          onUserUpdate={onUserUpdate}
          onClose={() => setShowPictureEditor(false)}
        />
      )}
    </div>
  );
};

// Rewards Tab Component (for Reward Points only)
const RewardsTab = ({ userData, onUserUpdate }) => {
  const [rewardHistory, setRewardHistory] = useState([]);

  useEffect(() => {
    setRewardHistory(RewardService.getRewardHistory());
  }, [userData]);

  const currentPoints = userData?.rewardPoints || 0;
  const canGenerateCoupon = currentPoints >= 200;
  const progress = (currentPoints % 200) / 200 * 100;

  const handleGenerateCoupon = () => {
    const result = RewardService.generateCoupon();
    if (result.success) {
      // Add to reward history
      RewardService.addRewardHistory({
        type: 'coupon_generated',
        points: -200,
        description: `Generated coupon: ${result.coupon.code}`,
        couponCode: result.coupon.code
      });

      // Update user data
      const updatedUser = JSON.parse(localStorage.getItem('tinkro_current_user'));
      if (onUserUpdate) onUserUpdate(updatedUser);

      alert(`Coupon Generated! Code: ${result.coupon.code}\nCheck your Coupons & Offers section to use it!`);
    } else {
      alert(result.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🏆 Reward Points</h2>
      
      {/* Current Points Status */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-6">
              <Trophy size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800">{currentPoints}</h3>
              <p className="text-orange-600 font-medium">Total Reward Points</p>
              <p className="text-gray-600 text-sm">Earn 20 points for every completed order</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to next ₹100 coupon</span>
            <span>{200 - (currentPoints % 200)} points needed</span>
          </div>
          <div className="bg-yellow-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {canGenerateCoupon ? (
          <button
            onClick={handleGenerateCoupon}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            🎟️ Generate ₹100 Coupon (200 points)
          </button>
        ) : (
          <div className="text-gray-600 bg-gray-100 px-6 py-4 rounded-lg">
            <p className="font-medium">Keep shopping to earn more points!</p>
            <p className="text-sm">You need {200 - currentPoints} more points to generate your next coupon.</p>
          </div>
        )}
      </div>

      {/* How to Earn Points */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">💡 How to Earn Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
              <Package size={16} />
            </div>
            <span><strong>20 points</strong> for every completed order</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
              <Trophy size={16} />
            </div>
            <span><strong>200 points</strong> = ₹100 coupon</span>
          </div>
        </div>
      </div>

      {/* Reward History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Points History</h3>
        
        {rewardHistory.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reward activity yet</p>
            <p className="text-sm text-gray-500">Your points history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {rewardHistory.slice().reverse().map((entry, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    entry.points > 0 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {entry.points > 0 ? '+' : '-'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{entry.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`font-bold ${
                  entry.points > 0 ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {entry.points > 0 ? '+' : ''}{entry.points} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Payment Tab Component
const PaymentTab = ({ userData, onUserUpdate }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Methods</h2>
      
      {/* Payment Methods */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Saved Payment Methods</h3>
        
        <div className="text-center py-8">
          <CreditCard size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No saved payment methods</p>
          <p className="text-sm text-gray-500 mb-4">Add your payment methods for faster checkout</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            Add Payment Method
          </button>
        </div>
      </div>

      {/* Payment Security */}
      <div className="bg-green-50 rounded-xl border border-green-200 p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield size={24} className="text-green-600 mr-3" />
          <h3 className="text-lg font-bold text-gray-800">Payment Security</h3>
        </div>
        <div className="space-y-2 text-gray-600">
          <p>• All payments are processed securely through Razorpay</p>
          <p>• We never store your card details on our servers</p>
          <p>• 256-bit SSL encryption protects your payment information</p>
          <p>• UPI, cards, wallets, and net banking supported</p>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Payment History</h3>
        
        <div className="text-center py-8">
          <Clock size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No payment history</p>
          <p className="text-sm text-gray-500">Your payment history will appear here</p>
        </div>
      </div>
    </div>
  );
};

// Coupons Tab Component (Coupons Only)
const CouponsTab = ({ userData, onUserUpdate }) => {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    // Load user coupons and add welcome50 if new user
    let userCoupons = RewardService.getUserCoupons();
    
    // Check if user is new and doesn't have welcome50 coupon
    const specialCoupons = JSON.parse(localStorage.getItem('tinkro_user_coupons') || '[]');
    const hasWelcomeCoupon = specialCoupons.some(coupon => coupon.code === 'welcome50');
    
    if (!hasWelcomeCoupon && userData) {
      // Add welcome50 coupon for new users
      const welcome50 = {
        id: 'welcome50',
        code: 'welcome50',
        discount: 50,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        isUsed: false,
        type: 'welcome',
        description: '🎉 Welcome to Tinkro! Get ₹50 off on your first order'
      };
      
      // Save to localStorage
      const existingCoupons = JSON.parse(localStorage.getItem('tinkro_user_coupons') || '[]');
      existingCoupons.push(welcome50);
      localStorage.setItem('tinkro_user_coupons', JSON.stringify(existingCoupons));
    }
    
    // Reload all coupons
    setAvailableCoupons(RewardService.getUserCoupons());
  }, [userData]);

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(''), 2000); // Reset after 2 seconds
    }).catch(() => {
      // Fallback for older browsers
      alert(`Coupon code: ${code}`);
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">🎟️ Coupons & Offers</h2>
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6 mb-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">🎁 Your Available Coupons</h3>
          <p className="text-gray-600">Use these codes during checkout to save money on your orders!</p>
        </div>
      </div>

      {/* Available Coupons */}
      <div className="space-y-4 mb-6">
        {availableCoupons.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <CreditCard size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Coupons Available</h3>
            <p className="text-gray-500 mb-4">Earn reward points or check back for special offers!</p>
            <div className="bg-blue-100 rounded-lg p-4 inline-block">
              <p className="text-blue-800 font-medium">💡 Tip: Earn 200 reward points to get a ₹100 coupon!</p>
            </div>
          </div>
        ) : (
          availableCoupons.map((coupon) => (
            <div key={coupon.id || coupon.code} className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
              coupon.isUsed 
                ? 'border-gray-300 bg-gray-50' 
                : coupon.type === 'welcome' 
                  ? 'border-pink-300 bg-gradient-to-r from-pink-50 to-purple-50' 
                  : 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50'
            }`}>
              {/* Coupon Design */}
              <div className="flex items-center p-6">
                <div className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center mr-6 ${
                  coupon.type === 'welcome' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                } text-white`}>
                  <span className="text-xl font-bold">₹{coupon.discount}</span>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-2xl font-bold text-gray-800">{coupon.code}</h4>
                    {coupon.type === 'welcome' && (
                      <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        🎉 WELCOME OFFER
                      </span>
                    )}
                    {coupon.isUsed && (
                      <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        USED
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 font-medium mb-2">
                    {coupon.description || `Get ₹${coupon.discount} off on your order`}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      {coupon.type === 'welcome' ? '🎁 Welcome Offer' : '🏆 Reward Coupon'}
                    </span>
                    <span>
                      ⏰ Expires: {new Date(coupon.expiryDate || coupon.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  {!coupon.isUsed && (
                    <button
                      onClick={() => copyCouponCode(coupon.code)}
                      className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 ${
                        copiedCode === coupon.code 
                          ? 'bg-green-500 text-white' 
                          : coupon.type === 'welcome'
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
                            : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                      }`}
                    >
                      {copiedCode === coupon.code ? '✅ Copied!' : '📋 Copy Code'}
                    </button>
                  )}
                  {coupon.isUsed && (
                    <div className="text-gray-500 text-center">
                      <p className="font-medium">✅ Used</p>
                      <p className="text-xs">Thank you!</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                {coupon.type === 'welcome' ? (
                  <div className="text-8xl">🎁</div>
                ) : (
                  <div className="text-8xl">🏆</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* How to Use */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">📋 How to Use Your Coupons</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs font-bold">1</span>
            </div>
            <span>Click "Copy Code" button on any available coupon</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs font-bold">2</span>
            </div>
            <span>Add products to your cart and go to checkout</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs font-bold">3</span>
            </div>
            <span>Paste the code in "Promo Code" or "Coupon" field</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs font-bold">4</span>
            </div>
            <span>Your discount will be applied automatically! 🎉</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notifications Tab Component
const NotificationsTab = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h2>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-800">Order Updates</h3>
          <p className="text-sm text-gray-500">Get notified about your order status</p>
        </div>
        <input type="checkbox" defaultChecked className="w-5 h-5 text-orange-500" />
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-800">Promotional Emails</h3>
          <p className="text-sm text-gray-500">Receive offers and discounts</p>
        </div>
        <input type="checkbox" className="w-5 h-5 text-orange-500" />
      </div>
      
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium text-gray-800">SMS Notifications</h3>
          <p className="text-sm text-gray-500">Get SMS updates on mobile</p>
        </div>
        <input type="checkbox" className="w-5 h-5 text-orange-500" />
      </div>
    </div>
  </div>
);

// Expandable FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
    >
      <h4 className="font-medium text-gray-800 pr-4">{question}</h4>
      <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
        <Plus size={20} className="text-gray-500" />
      </div>
    </button>
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="px-4 pb-4 pt-0">
        <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
      </div>
    </motion.div>
  </div>
);

// FAQ Section Component
const FAQSection = ({ title, questions, titleColor, icon }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="mb-6">
      <h5 className={`font-medium mb-4 text-lg ${titleColor}`}>{icon} {title}</h5>
      <div className="space-y-3">
        {questions.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openItems[index]}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>
    </div>
  );
};

// Support Tab Component
const SupportTab = () => {
  const faqData = {
    productSetup: {
      title: "Product Use & Setup",
      titleColor: "text-orange-600",
      icon: "⚙",
      questions: [
        {
          question: "Does the kit need a laptop or computer?",
          answer: "Some advanced kits (like Coding or Arduino) may need a laptop, but our basic and electronics kits work without one."
        },
        {
          question: "How much time does it take to build a project?",
          answer: "Each project takes around 30 minutes to 2 hours, depending on the child's age and the kit type."
        },
        {
          question: "Are the kits reusable?",
          answer: "Yes. All components are reusable so kids can build multiple projects from one kit."
        },
        {
          question: "Do I need any extra tools or materials?",
          answer: "No extra tools needed. Everything required is included in the box."
        }
      ]
    },
    childSafety: {
      title: "Child Learning & Safety",
      titleColor: "text-blue-600",
      icon: "🧒",
      questions: [
        {
          question: "Is it safe for children?",
          answer: "Yes, our kits are made from child-safe, durable materials and tested for quality."
        },
        {
          question: "Can parents help while building?",
          answer: "Of course. These kits are great for parent-child bonding and joint learning."
        },
        {
          question: "Will my child need prior knowledge of robotics?",
          answer: "No prior knowledge required. Each kit starts from the basics with step-by-step guidance."
        }
      ]
    },
    shipping: {
      title: "Shipping & Returns",
      titleColor: "text-green-600",
      icon: "📦",
      questions: [
        {
          question: "How long does delivery take?",
          answer: "Usually 3–7 working days across India, depending on your location."
        },
        {
          question: "What if a part is missing or damaged?",
          answer: "You can contact our support team, and we'll replace or resend the missing part quickly."
        },
        {
          question: "Do you offer returns or refunds?",
          answer: "Yes, we have a 7-day return policy for unused kits in original packaging."
        }
      ]
    },
    workshops: {
      title: "Workshops & Programs",
      titleColor: "text-purple-600",
      icon: "🏫",
      questions: [
        {
          question: "Do you organize workshops for schools?",
          answer: "Yes. We conduct robotics and STEM workshops for schools and learning centers."
        },
        {
          question: "Can we get a demo before purchase?",
          answer: "Yes, schools can request a free online demo session before ordering."
        }
      ]
    },
    general: {
      title: "General Questions",
      titleColor: "text-gray-600",
      icon: "💬",
      questions: [
        {
          question: "What if my kit stops working?",
          answer: "You can message us, and our technical support team will help troubleshoot or replace components if needed."
        },
        {
          question: "Do you offer certification?",
          answer: "Yes. Students completing our kits or workshops receive a Tinkro Robotics Certificate of Learning."
        },
        {
          question: "Is Tinkro available internationally?",
          answer: "Currently, we deliver across India, with international shipping coming soon."
        }
      ]
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Help & Support</h2>
      
      {/* Support Options - Single Row */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-2xl p-8 mb-8 border border-gray-100 shadow-lg">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">🚀 Get Instant Support</h3>
          <p className="text-gray-600">Choose your preferred way to connect with our expert team</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Email Support */}
          <a 
            href="mailto:hello@tinkro.in"
            className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3 min-w-[200px] justify-center"
          >
            <Mail size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <div className="text-left">
              <div className="font-bold">📧 Email Support</div>
              <div className="text-xs text-blue-100">Reply within 24 hours</div>
            </div>
          </a>
          
          {/* Phone Support */}
          <a 
            href="tel:9644525429"
            className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3 min-w-[200px] justify-center"
          >
            <Phone size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <div className="text-left">
              <div className="font-bold">📞 Call Support</div>
              <div className="text-xs text-green-100">Immediate assistance</div>
            </div>
          </a>
          
          {/* WhatsApp Support */}
          <a 
            href="https://wa.me/919644525429?text=Hi%20Tinkro%2C%20I%20need%20help%20with%20my%20account"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3 min-w-[200px] justify-center"
          >
            <MessageCircle size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <div className="text-left">
              <div className="font-bold">💬 WhatsApp</div>
              <div className="text-xs text-green-100">Chat instantly</div>
            </div>
          </a>
        </div>
        
        {/* Quick Stats */}
        <div className="flex justify-center gap-8 mt-6 text-center">
          <div className="text-gray-600">
            <div className="font-bold text-blue-600">24/7</div>
            <div className="text-xs">Available</div>
          </div>
          <div className="text-gray-600">
            <div className="font-bold text-green-600">{"< 1hr"}</div>
            <div className="text-xs">Response</div>
          </div>
          <div className="text-gray-600">
            <div className="font-bold text-purple-600">100%</div>
            <div className="text-xs">Satisfaction</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-6 text-xl">Frequently Asked Questions</h3>
        <div className="space-y-6">
          <FAQSection {...faqData.productSetup} />
          <FAQSection {...faqData.childSafety} />
          <FAQSection {...faqData.shipping} />
          <FAQSection {...faqData.workshops} />
          <FAQSection {...faqData.general} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;