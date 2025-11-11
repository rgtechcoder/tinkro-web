import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut, updateProfile } from 'firebase/auth';
import { User, LogOut, Settings, ShoppingBag, Heart, Award, Edit3, Save } from 'lucide-react';
import { toast } from 'sonner';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    photoURL: '',
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    rewardPoints: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      loadUserProfile(currentUser.uid);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile({
          displayName: userData.displayName || auth.currentUser?.displayName || '',
          email: userData.email || auth.currentUser?.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          pincode: userData.pincode || '',
          photoURL: userData.photoURL || auth.currentUser?.photoURL || '',
          totalOrders: userData.totalOrders || 0,
          totalSpent: userData.totalSpent || 0,
          wishlistItems: userData.wishlistItems || 0,
          rewardPoints: userData.rewardPoints || 0
        });
      } else {
        // Create user profile if it doesn't exist
        const newProfile = {
          displayName: auth.currentUser?.displayName || '',
          email: auth.currentUser?.email || '',
          photoURL: auth.currentUser?.photoURL || '',
          createdAt: new Date(),
          totalOrders: 0,
          totalSpent: 0,
          wishlistItems: 0,
          rewardPoints: 0
        };
        await updateDoc(doc(db, 'users', userId), newProfile);
        setUserProfile(prev => ({ ...prev, ...newProfile }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user) return;
    
    setUpdateLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: userProfile.displayName,
        photoURL: userProfile.photoURL
      });

      // Update Firestore document
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: userProfile.displayName,
        phone: userProfile.phone,
        address: userProfile.address,
        city: userProfile.city,
        state: userProfile.state,
        pincode: userProfile.pincode,
        photoURL: userProfile.photoURL,
        updatedAt: new Date()
      });
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      // Update local user state to reflect changes
      setUser({...user, displayName: userProfile.displayName, photoURL: userProfile.photoURL});
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const getUserDisplayName = () => {
    if (userProfile.displayName) return userProfile.displayName;
    if (user?.displayName) return user.displayName;
    if (userProfile.email) return userProfile.email.split('@')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return nameParts[0].charAt(0) + nameParts[1].charAt(0);
    }
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access your dashboard</p>
          <a
            href="/auth"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login / Sign Up
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 p-8 rounded-lg shadow-lg mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold border-4 border-white/30 overflow-hidden">
                  {userProfile.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getUserInitials()}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              
              {/* Welcome Text */}
              <div className="text-white">
                <h1 className="text-4xl font-bold flex items-center gap-2">
                  Welcome back, {getUserDisplayName()}! 🚀
                </h1>
                <p className="text-white/80 mt-2 text-lg">
                  Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'recently'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors group"
                title="Edit Profile"
              >
                <Edit3 size={20} className="text-white group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-red-500 text-white rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center hover:bg-white/20 transition-colors">
              <ShoppingBag className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{userProfile.totalOrders}</div>
              <div className="text-white/80 text-sm">Total Orders</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center hover:bg-white/20 transition-colors">
              <div className="text-3xl font-bold text-white">₹{userProfile.totalSpent}</div>
              <div className="text-white/80 text-sm">Total Spent</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center hover:bg-white/20 transition-colors">
              <Heart className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{userProfile.wishlistItems}</div>
              <div className="text-white/80 text-sm">Wishlist Items</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center hover:bg-white/20 transition-colors">
              <Award className="w-8 h-8 text-white mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{userProfile.rewardPoints}</div>
              <div className="text-white/80 text-sm">Reward Points</div>
            </div>
          </div>
        </div>

        {/* Profile Editing Section */}
        {isEditing && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="text-blue-600" />
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={userProfile.displayName}
                  onChange={(e) => setUserProfile({...userProfile, displayName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={userProfile.address}
                  onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your complete address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={userProfile.city}
                  onChange={(e) => setUserProfile({...userProfile, city: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={userProfile.state}
                  onChange={(e) => setUserProfile({...userProfile, state: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  value={userProfile.pincode}
                  onChange={(e) => setUserProfile({...userProfile, pincode: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Pincode"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo URL</label>
                <input
                  type="url"
                  value={userProfile.photoURL}
                  onChange={(e) => setUserProfile({...userProfile, photoURL: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                disabled={updateLoading || !userProfile.displayName}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="/products"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center">
              <ShoppingBag className="w-12 h-12 text-blue-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Browse Products</h3>
                <p className="text-gray-600">Discover our latest collection</p>
              </div>
            </div>
          </a>

          <a
            href="/orders"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center">
              <Settings className="w-12 h-12 text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Order History</h3>
                <p className="text-gray-600">Track your orders</p>
              </div>
            </div>
          </a>

          <a
            href="/profile"
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500"
          >
            <div className="flex items-center">
              <User className="w-12 h-12 text-purple-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Profile Settings</h3>
                <p className="text-gray-600">Manage your account</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;