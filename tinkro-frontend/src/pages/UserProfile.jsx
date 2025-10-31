import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes,
  FaHeart, FaShoppingBag, FaCog, FaSignOutAlt, FaCamera, FaEye, FaArrowLeft
} from 'react-icons/fa';
import authService from '../services/AuthService';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const currentUser = authService.getCurrentUser();
    const userProfile = authService.getUserProfile();
    
    if (currentUser) {
      setUser(currentUser);
      setProfile(userProfile);
      setEditData(userProfile || {});
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/auth';
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData(profile || {});
    }
    setMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Handle nested objects like address.city
      const [parent, child] = name.split('.');
      setEditData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    const success = authService.updateUserProfile(editData);
    
    if (success) {
      setProfile(editData);
      setIsEditing(false);
      setMessage('Profile updated successfully! ✅');
    } else {
      setMessage('Profile update failed! Please try again. ❌');
    }
    
    setIsLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = async () => {
    const result = await authService.logout();
    if (result.success) {
      window.location.href = '/';
    }
  };

  const handleProfilePicture = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData(prev => ({
          ...prev,
          photoURL: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const orderHistory = authService.getOrderHistory();
  const wishlist = authService.getWishlist();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Back Button */}
      <motion.button
        onClick={() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = '/';
          }
        }}
        className="fixed top-6 left-6 z-50 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-all duration-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        </svg>
      </motion.button>

      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {(editData.photoURL || user.photoURL) ? (
                    <img 
                      src={editData.photoURL || user.photoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-blue-600 text-2xl" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                    <FaCamera className="text-xs" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleProfilePicture}
                    />
                  </label>
                )}
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {profile?.displayName || user.displayName || 'User'}
                </h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-blue-600">
                  {user.loginMethod} se login • {user.role}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <motion.button
                    onClick={handleSaveProfile}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                  >
                    <FaSave />
                    {isLoading ? 'Saving...' : 'Save'}
                  </motion.button>
                  <motion.button
                    onClick={handleEditToggle}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTimes />
                    Cancel
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={handleEditToggle}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEdit />
                  Edit Profile
                </motion.button>
              )}
              
              <motion.button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt />
                Logout
              </motion.button>
            </div>
          </div>

          {/* Success/Error Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                className={`mt-4 p-3 rounded-lg ${
                  message.includes('✅') 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            {[
              { key: 'profile', label: 'Profile Info', icon: FaUser },
              { key: 'orders', label: 'Order History', icon: FaShoppingBag },
              { key: 'wishlist', label: 'Wishlist', icon: FaHeart },
              { key: 'settings', label: 'Settings', icon: FaCog }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                whileHover={{ backgroundColor: activeTab === tab.key ? undefined : '#f8fafc' }}
              >
                <tab.icon className="inline mr-2" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="displayName"
                      value={editData.displayName || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Your full name"
                    />
                  ) : (
                    <p className="py-2 text-gray-800">{profile?.displayName || user.displayName || 'Not provided'}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <p className="py-2 text-gray-800 flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" />
                    {user.email}
                    {user.emailVerified && <span className="text-green-500 text-xs">✓ Verified</span>}
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={editData.phoneNumber || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 9876543210"
                    />
                  ) : (
                    <p className="py-2 text-gray-800 flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      {profile?.phoneNumber || user.phoneNumber || 'Not provided'}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editData.bio || ''}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about yourself"
                    />
                  ) : (
                    <p className="py-2 text-gray-800">{profile?.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>

              {/* Address Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt />
                  Address Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.street"
                        value={editData.address?.street || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Street address"
                      />
                    ) : (
                      <p className="py-2 text-gray-800">{profile?.address?.street || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.city"
                        value={editData.address?.city || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="City"
                      />
                    ) : (
                      <p className="py-2 text-gray-800">{profile?.address?.city || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.state"
                        value={editData.address?.state || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="State"
                      />
                    ) : (
                      <p className="py-2 text-gray-800">{profile?.address?.state || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.zipCode"
                        value={editData.address?.zipCode || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="ZIP Code"
                      />
                    ) : (
                      <p className="py-2 text-gray-800">{profile?.address?.zipCode || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order History</h2>
              
              {orderHistory.length > 0 ? (
                <div className="space-y-4">
                  {orderHistory.map((order) => (
                    <motion.div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                          <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{order.total}</p>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status || 'Processing'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaShoppingBag className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>No orders yet!</p>
                  <motion.a
                    href="/products"
                    className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    Start Shopping
                  </motion.a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Wishlist</h2>
              
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((productId) => (
                    <motion.div
                      key={productId}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      whileHover={{ scale: 1.02 }}
                    >
                      <p className="text-center text-gray-600">Product ID: {productId}</p>
                      {/* Here you can fetch and display actual product details */}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaHeart className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>Your wishlist is empty!</p>
                  <motion.a
                    href="/products"
                    className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    Explore Products
                  </motion.a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profile?.preferences?.newsletter !== false}
                        onChange={(e) => {
                          authService.updateUserProfile({
                            preferences: {
                              ...profile?.preferences,
                              newsletter: e.target.checked
                            }
                          });
                          setProfile(authService.getUserProfile());
                        }}
                        className="mr-3"
                      />
                      Newsletter subscription
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profile?.preferences?.notifications !== false}
                        onChange={(e) => {
                          authService.updateUserProfile({
                            preferences: {
                              ...profile?.preferences,
                              notifications: e.target.checked
                            }
                          });
                          setProfile(authService.getUserProfile());
                        }}
                        className="mr-3"
                      />
                      Push notifications
                    </label>
                  </div>
                </div>

                {/* Account Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p><strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleDateString()}</p>
                    <p><strong>Login Method:</strong> {user.loginMethod}</p>
                    <p><strong>User Role:</strong> {user.role}</p>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                  <motion.button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout from All Devices
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;