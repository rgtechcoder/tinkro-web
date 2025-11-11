import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  CreditCard, 
  Bell,
  LogOut,
  Star,
  Trophy,
  Clock,
  Phone,
  Mail,
  Shield,
  Download,
  Repeat,
  HelpCircle,
  Plus,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import authService from '../services/SimpleAuthService';

const UserDashboard = ({ user, onLogout, setCurrentPage, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const userWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
      
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
          wishlistItems: userWishlist.length,
          loyaltyPoints: 100
        }
      });
    }
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

  const refreshUserData = () => {
    if (user) {
      const userWishlist = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || '[]');
      setUserData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          wishlistItems: userWishlist.length
        }
      }));
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
    { id: 'profile', label: 'Profile Settings', icon: Settings, color: 'from-purple-500 to-indigo-600' },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard, color: 'from-blue-500 to-cyan-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-teal-500 to-green-600' },
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
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Tinkro</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <img 
                  src={userData?.photoURL || userData?.profile?.avatar || '/default-avatar.png'} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {userData?.displayName || userData?.profile?.name || userData?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userData?.loginCount || userData?.profile?.loginCount} logins
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
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome back, {userData?.displayName || userData?.profile?.name || userData?.name || 'User'}! 👋
              </h2>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your account today.
              </p>
            </div>
            {userData?.profile?.verified && (
              <div className="flex items-center bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <Shield size={16} className="text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-700">Verified Account</span>
              </div>
            )}
          </div>

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

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Trophy size={24} className="text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{userData?.stats?.loyaltyPoints || 100}</h3>
              <p className="text-gray-600 text-sm font-medium">Reward Points</p>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl p-6 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <CreditCard size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold">₹0</h3>
              <p className="text-white/80 text-sm font-medium">Total Spent</p>
            </div>
          </div>

          {/* Content Area with Working Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && <OverviewTab userData={userData} />}
                {activeTab === 'orders' && <OrdersTab />}
                {activeTab === 'wishlist' && <WishlistTab userData={userData} onWishlistUpdate={refreshUserData} />}
                {activeTab === 'addresses' && <AddressesTab />}
                {activeTab === 'profile' && <ProfileTab userData={userData} onUserUpdate={onUserUpdate} />}
                {activeTab === 'payment' && <PaymentTab />}
                {activeTab === 'notifications' && <NotificationsTab />}
                {activeTab === 'support' && <SupportTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ userData }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <Package size={24} className="mb-2" />
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <p className="text-sm opacity-90">No recent orders found</p>
      </div>
      
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
        <Heart size={24} className="mb-2" />
        <h3 className="text-lg font-semibold">Wishlist Items</h3>
        <p className="text-sm opacity-90">{userData?.stats?.wishlistItems || 0} items saved</p>
      </div>
    </div>

    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <User size={20} className="text-blue-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">Update Profile</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Package size={20} className="text-green-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">Track Orders</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Heart size={20} className="text-red-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">View Wishlist</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Settings size={20} className="text-yellow-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">Account Settings</p>
        </div>
      </div>
    </div>
  </div>
);

// Orders Tab Component  
const OrdersTab = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
    <div className="text-center py-12">
      <Package size={48} className="text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Yet</h3>
      <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
      <button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow">
        Browse Products
      </button>
    </div>
  </div>
);

// Wishlist Tab Component
const WishlistTab = ({ userData, onWishlistUpdate }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (userData) {
      const userWishlist = JSON.parse(localStorage.getItem(`wishlist_${userData.id}`) || '[]');
      setWishlistItems(userWishlist);
    }
  }, [userData]);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    if (userData) {
      localStorage.setItem(`wishlist_${userData.id}`, JSON.stringify(updatedWishlist));
      if (onWishlistUpdate) {
        onWishlistUpdate();
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Add products you like to see them here!</p>
          <button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow">
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

// Profile Tab Component
const ProfileTab = ({ userData, onUserUpdate }) => {
  const [profileData, setProfileData] = useState({
    name: userData?.displayName || userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
  });

  const handleSave = () => {
    // Save profile data
    const updatedUser = { ...userData, displayName: profileData.name, name: profileData.name };
    localStorage.setItem('tinkro_current_user', JSON.stringify(updatedUser));
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
    alert('Profile updated successfully!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Settings</h2>
      
      <div className="max-w-md">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Payment Tab Component
const PaymentTab = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Methods</h2>
    <div className="text-center py-12">
      <CreditCard size={48} className="text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">No payment methods added</h3>
      <p className="text-gray-500 mb-6">Add a payment method for faster checkout!</p>
      <button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow">
        Add Payment Method
      </button>
    </div>
  </div>
);

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

// Support Tab Component
const SupportTab = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Help & Support</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="border border-gray-200 rounded-lg p-6">
        <Mail size={24} className="text-blue-600 mb-4" />
        <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
        <p className="text-gray-600 mb-4">Get help via email within 24 hours</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          Send Email
        </button>
      </div>
      
      <div className="border border-gray-200 rounded-lg p-6">
        <Phone size={24} className="text-green-600 mb-4" />
        <h3 className="font-semibold text-gray-800 mb-2">Phone Support</h3>
        <p className="text-gray-600 mb-4">Call us for immediate assistance</p>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          Call Now
        </button>
      </div>
    </div>

    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium text-gray-800 mb-2">How to track my order?</h4>
          <p className="text-gray-600 text-sm">You can track your order from the Orders section in your dashboard.</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium text-gray-800 mb-2">How to return a product?</h4>
          <p className="text-gray-600 text-sm">Contact our support team within 7 days of delivery for returns.</p>
        </div>
        <div className="bg-white p-4 rounded border">
          <h4 className="font-medium text-gray-800 mb-2">Payment issues?</h4>
          <p className="text-gray-600 text-sm">If you face any payment issues, please contact our support team immediately.</p>
        </div>
      </div>
    </div>
  </div>
);

export default UserDashboard;