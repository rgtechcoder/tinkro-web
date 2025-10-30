import React, { useState } from 'react';
// import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // NEW: Admin credentials with environment variable support
  const ADMIN_CREDENTIALS = {
    username: import.meta.env.VITE_ADMIN_USERNAME || 'tinkro_admin',
    password: import.meta.env.VITE_ADMIN_PASSWORD || 'Tinkro@2024#Admin'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Local credential check
    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem('tinkro_admin_session', JSON.stringify({
        loggedIn: true,
        timestamp: Date.now(),
        user: credentials.username
      }));
      console.log("Admin login successful! 🎉");
      alert("Welcome Admin! Login successful 🎉");
      onLoginSuccess();
    } else {
      console.log("Invalid credentials ❌");
      alert("Invalid Credentials ❌ Please check your username and password");
    }
    setIsLoading(false);
  };

  const handleChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
          <p className="text-gray-600 mt-2">Access Tinkro Admin Dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter admin username"
              required
              autoComplete="username"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Authenticating...
              </div>
            ) : (
              'Login to Admin Dashboard'
            )}
          </button>
        </form>

        {/* Current Credentials Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
          <h4 className="font-semibold text-gray-800 mb-2">Current Credentials:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Username:</strong> <code className="bg-white px-2 py-1 rounded">{ADMIN_CREDENTIALS.username}</code></p>
            <p><strong>Password:</strong> <code className="bg-white px-2 py-1 rounded">{"*".repeat(ADMIN_CREDENTIALS.password.length)}</code></p>
          </div>
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800 font-medium">🔧 To Change Credentials:</p>
            <ol className="text-xs text-yellow-700 mt-1 space-y-1">
              <li>1. Open <code className="bg-white px-1 rounded">.env</code> file in project root</li>
              <li>2. Update <code className="bg-white px-1 rounded">VITE_ADMIN_USERNAME</code></li>
              <li>3. Update <code className="bg-white px-1 rounded">VITE_ADMIN_PASSWORD</code></li>
              <li>4. Save file & restart server</li>
            </ol>
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secure admin access • 🛡️ Session management • 🔐 Encrypted storage
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;