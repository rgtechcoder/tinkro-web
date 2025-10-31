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
  HelpCircle
} from 'lucide-react';
import authService from '../services/SimpleAuthService';

const UserDashboard = ({ user, onLogout, setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // User data already passed as prop, no need to fetch
    if (user) {
      setUserData({
        ...user,
        joinedDate: user.createdAt || new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 100,
        membershipLevel: 'Silver'
      });
    }
  }, [user]);

  const handleLogout = async () => {
    const result = authService.logout();
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-blue-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <img 
                    src={userData?.profile?.avatar || '/default-avatar.png'} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-white/50"
                  />
                </div>
                <div className="text-white">
                  <h1 className="text-3xl font-bold">Welcome back, {userData?.profile?.name || 'User'}! 🚀</h1>
                  <p className="text-white/80 mt-1">
                    Member since {userData?.profile?.memberSince} • {userData?.profile?.loginCount} logins
                  </p>
                  {userData?.profile?.verified && (
                    <div className="flex items-center mt-2 text-green-300">
                      <Shield size={16} className="mr-1" />
                      <span className="text-sm">Verified Account</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center space-x-2 border border-white/30"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 -mt-8">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <Package size={32} className="mb-2" />
              <h3 className="text-2xl font-bold">{userData?.stats?.totalOrders || 0}</h3>
              <p className="text-green-100">Total Orders</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <CreditCard size={32} className="mb-2" />
              <h3 className="text-2xl font-bold">₹{userData?.stats?.totalSpent || 0}</h3>
              <p className="text-blue-100">Total Spent</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white">
              <Heart size={32} className="mb-2" />
              <h3 className="text-2xl font-bold">{userData?.stats?.wishlistItems || 0}</h3>
              <p className="text-red-100">Wishlist Items</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-6 text-white">
              <Trophy size={32} className="mb-2" />
              <h3 className="text-2xl font-bold">{userData?.stats?.loyaltyPoints || 0}</h3>
              <p className="text-yellow-100">Reward Points</p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Account Menu</h2>
              <nav className="space-y-3">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8">
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
                  {activeTab === 'wishlist' && <WishlistTab />}
                  {activeTab === 'addresses' && <AddressesTab />}
                  {activeTab === 'profile' && <ProfileTab userData={userData} />}
                  {activeTab === 'payment' && <PaymentTab />}
                  {activeTab === 'notifications' && <NotificationsTab />}
                  {activeTab === 'support' && <SupportTab />}
                </motion.div>
              </AnimatePresence>
            </div>
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
    
    {/* Quick Actions */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
        <Package size={24} className="mb-2" />
        <h3 className="font-bold">Track Orders</h3>
        <p className="text-sm text-white/80">View order status & tracking</p>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
        <Repeat size={24} className="mb-2" />
        <h3 className="font-bold">Reorder</h3>
        <p className="text-sm text-white/80">Buy your favorites again</p>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
        <Download size={24} className="mb-2" />
        <h3 className="font-bold">Download Invoices</h3>
        <p className="text-sm text-white/80">Get purchase receipts</p>
      </div>
    </div>

    {/* Recent Activity */}
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activity</h3>
      <div className="space-y-3">
        {userData?.recentActivity?.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Clock size={16} className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">
                Logged in via {activity.method} • {new Date(activity.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        )) || <p className="text-gray-500">No recent activity</p>}
      </div>
    </div>
  </div>
);

// Orders Tab Component
const OrdersTab = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>
    <div className="text-center py-12">
      <Package size={64} className="text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
      <p className="text-gray-500 mb-6">When you place orders, they'll appear here</p>
      <button className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow">
        Start Shopping
      </button>
    </div>
  </div>
);

// Wishlist Tab Component
const WishlistTab = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">My Wishlist</h2>
    <div className="text-center py-12">
      <Heart size={64} className="text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">Your Wishlist is Empty</h3>
      <p className="text-gray-500 mb-6">Save items you love for later</p>
      <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow">
        Browse Products
      </button>
    </div>
  </div>
);

// Addresses Tab Component
const AddressesTab = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Saved Addresses</h2>
    <div className="text-center py-12">
      <MapPin size={64} className="text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Addresses Saved</h3>
      <p className="text-gray-500 mb-6">Add addresses for faster checkout</p>
      <button className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow">
        Add Address
      </button>
    </div>
  </div>
);

// Profile Tab Component
const ProfileTab = ({ userData }) => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Profile Settings</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input 
            type="text" 
            defaultValue={userData?.profile?.name} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            defaultValue={userData?.profile?.email} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input 
            type="tel" 
            defaultValue={userData?.profile?.phone} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          <div className="flex items-center space-x-4">
            <img 
              src={userData?.profile?.avatar || '/default-avatar.png'} 
              alt="Profile" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
              Change Photo
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferences</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="rounded" />
              <span className="ml-2 text-sm text-gray-600">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded" />
              <span className="ml-2 text-sm text-gray-600">SMS notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded" />
              <span className="ml-2 text-sm text-gray-600">Newsletter subscription</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-8">
      <button className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow">
        Save Changes
      </button>
    </div>
  </div>
);

// Payment Tab Component
const PaymentTab = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Methods</h2>
    <div className="text-center py-12">
      <CreditCard size={64} className="text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Payment Methods</h3>
      <p className="text-gray-500 mb-6">Add payment methods for faster checkout</p>
      <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow">
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
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800">Email Notifications</h3>
        <p className="text-gray-600 text-sm mb-3">Receive updates about your orders and account</p>
        <label className="flex items-center">
          <input type="checkbox" className="rounded" defaultChecked />
          <span className="ml-2 text-sm text-gray-600">Order updates</span>
        </label>
      </div>
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-gray-800">Marketing Communications</h3>
        <p className="text-gray-600 text-sm mb-3">Get notified about new products and offers</p>
        <label className="flex items-center">
          <input type="checkbox" className="rounded" />
          <span className="ml-2 text-sm text-gray-600">Promotional emails</span>
        </label>
      </div>
    </div>
  </div>
);

// Support Tab Component
const SupportTab = () => (
  <div>
    <h2 className="text-2xl font-bold mb-6 text-gray-800">Help & Support</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <HelpCircle size={20} className="mr-2" />
            FAQ
          </h3>
          <p className="text-gray-600 text-sm">Find answers to common questions</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <Mail size={20} className="mr-2" />
            Contact Us
          </h3>
          <p className="text-gray-600 text-sm">Get in touch with our support team</p>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <Phone size={20} className="mr-2" />
            Call Support
          </h3>
          <p className="text-gray-600 text-sm">Speak directly with our team</p>
        </div>
      </div>
      <div className="bg-gradient-to-br from-orange-50 to-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Contact</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Email:</strong> support@tinkro.com</p>
          <p><strong>Phone:</strong> +91 12345 67890</p>
          <p><strong>Hours:</strong> Mon-Fri 9AM-6PM</p>
        </div>
      </div>
    </div>
  </div>
);

export default UserDashboard;