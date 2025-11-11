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

          {/* Content Area - For now showing placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings size={24} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Modern Dashboard</h3>
              <p className="text-gray-600 mb-6">Professional admin-style dashboard is now active!</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <User size={20} className="text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-blue-800">Profile</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <Package size={20} className="text-green-600 mb-2" />
                  <p className="text-sm font-medium text-green-800">Orders</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <Heart size={20} className="text-red-600 mb-2" />
                  <p className="text-sm font-medium text-red-800">Wishlist</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <Settings size={20} className="text-yellow-600 mb-2" />
                  <p className="text-sm font-medium text-yellow-800">Settings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;