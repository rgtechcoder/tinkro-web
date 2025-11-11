import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaFacebook, FaPhone, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import firebaseAuthService from '../services/FirebaseAuthService';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPhoneLogin, setShowPhoneLogin] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [countdown, setCountdown] = useState(0);
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    phoneNumber: '',
    otp: ''
  });

  const recaptchaRef = useRef(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      transition: { duration: 0.3 }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -100 : 100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const inputVariants = {
    focus: { 
      scale: 1.02,
      boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)"
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Validate form
  const validateForm = () => {
    if (!isLogin && !showPhoneLogin) {
      if (!formData.displayName.trim()) {
        setError('Please enter your name!');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match!');
        return false;
      }
    }
    
    if (!showPhoneLogin) {
      if (!formData.email.includes('@')) {
        setError('Please enter a valid email address!');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long!');
        return false;
      }
    } else {
      if (!formData.phoneNumber.match(/^[6-9]\d{9}$/)) {
        setError('Please enter a valid 10-digit mobile number!');
        return false;
      }
    }
    
    return true;
  };

  // Handle Email/Password Authentication
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await firebaseAuthService.loginWithEmail(formData.email, formData.password);
      } else {
        result = await firebaseAuthService.registerWithEmail(
          formData.email, 
          formData.password, 
          formData.displayName
        );
      }

      console.log('Auth result:', result);

      if (result && result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          if (onAuthSuccess) {
            onAuthSuccess(result.user);
          }
        }, 1500);
      } else {
        setError(result?.message || 'Authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Something went wrong! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await firebaseAuthService.signInWithGoogle();
      console.log('Google login result:', result);
      
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          if (onAuthSuccess) {
            onAuthSuccess(result.user);
          }
        }, 1500);
      } else {
        setError(result.error || 'Google sign-in failed');
        console.error('Google login error:', result.error);
      }
    } catch (error) {
      console.error('Google sign-in exception:', error);
      setError(error.message || 'Google sign-in failed! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Facebook Login
  const handleFacebookLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await firebaseAuthService.signInWithFacebook();
      console.log('Facebook login result:', result);
      
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          if (onAuthSuccess) {
            onAuthSuccess(result.user);
          }
        }, 1500);
      } else {
        setError(result.error || 'Facebook sign-in failed');
        console.error('Facebook login error:', result.error);
      }
    } catch (error) {
      console.error('Facebook sign-in exception:', error);
      setError(error.message || 'Facebook sign-in failed! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Phone Login
  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      // Add +91 prefix for Indian numbers
      const phoneWithCode = formData.phoneNumber.startsWith('+') 
        ? formData.phoneNumber 
        : `+91${formData.phoneNumber}`;

      const result = await firebaseAuthService.sendOTP(phoneWithCode);

      if (result.success) {
        setShowOTP(true);
        setCountdown(60);
        setSuccess('OTP sent to your phone number');
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Phone auth error:', error);
      setError('Phone authentication failed! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter 6-digit OTP!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await firebaseAuthService.verifyOTP(formData.otp, {
        phoneNumber: formData.phoneNumber,
        displayName: formData.displayName || `User_${formData.phoneNumber.slice(-4)}`
      });
      
      if (result.success) {
        setSuccess('Login successful!');
        setTimeout(() => {
          if (onAuthSuccess) {
            onAuthSuccess(result.user);
          }
        }, 1500);
      } else {
        setError(result.error || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setError('OTP verification failed! Please check and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError('Please enter your email for password reset!');
      return;
    }

    setIsLoading(true);
    const result = await authService.resetPassword(formData.email);
    
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Back Button */}
      <motion.button
        onClick={() => window.location.href = '/'}
        className="absolute top-6 left-6 z-20 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full p-3 hover:bg-white shadow-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaArrowLeft className="text-gray-600" />
      </motion.button>

      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-300 to-blue-300 rounded-full opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-30"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {/* Additional floating elements */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-20 h-20 bg-orange-400 rounded-full opacity-20"
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-blue-400 rounded-full opacity-25"
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 overflow-hidden border border-white/20"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)"
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to Tinkro
          </motion.h1>
          <motion.p 
            className="text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isLogin ? 'Sign in to continue your journey' : 'Create account to get started'}
          </motion.p>
        </div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Login/Signup */}
        {!showPhoneLogin && !showOTP && (
          <motion.div 
            className="flex bg-gray-100 rounded-lg p-1 mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                isLogin 
                  ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setIsLogin(true)}
              whileHover={{ scale: isLogin ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Login
            </motion.button>
            <motion.button
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setIsLogin(false)}
              whileHover={{ scale: !isLogin ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign Up
            </motion.button>
          </motion.div>
        )}

        {/* Phone Login Toggle */}
        {!showOTP && (
          <div className="flex justify-center mb-4">
            <motion.button
              className="text-transparent bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-sm font-medium hover:from-orange-700 hover:to-blue-700 transition-colors duration-200"
              onClick={() => setShowPhoneLogin(!showPhoneLogin)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPhoneLogin ? '📧 Login with Email' : '📱 Login with Phone'}
            </motion.button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {showOTP ? (
            // OTP Verification Form
            <motion.form
              key="otp"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onSubmit={handleOTPVerification}
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Verify OTP</h3>
                <p className="text-sm text-gray-600">
                  OTP has been sent to {formData.phoneNumber}
                </p>
              </div>

              <motion.div className="relative mb-4" variants={inputVariants}>
                <motion.input
                  type="text"
                  name="otp"
                  placeholder="6-digit OTP"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  maxLength={6}
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)" }}
                />
              </motion.div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white py-2.5 rounded-lg font-semibold hover:from-orange-600 hover:to-blue-700 disabled:opacity-50 shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(249, 115, 22, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </motion.button>

              <div className="text-center mt-4">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-600">
                    Resend OTP in {countdown} seconds
                  </p>
                ) : (
                  <motion.button
                    type="button"
                    className="text-blue-600 text-sm font-medium hover:text-blue-800"
                    onClick={handlePhoneLogin}
                    whileHover={{ scale: 1.05 }}
                  >
                    Resend OTP
                  </motion.button>
                )}
              </div>
            </motion.form>
          ) : showPhoneLogin ? (
            // Phone Login Form
            <motion.form
              key="phone"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onSubmit={handlePhoneLogin}
            >
              <motion.div className="relative mb-4" variants={inputVariants}>
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <motion.input
                  type="tel"
                  name="phoneNumber"
                  placeholder="9876543210"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)" }}
                />
              </motion.div>

              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white py-2.5 rounded-lg font-semibold hover:from-orange-600 hover:to-blue-700 disabled:opacity-50 shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(249, 115, 22, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </motion.button>

              {/* reCAPTCHA container */}
              <div id="recaptcha-container" className="mt-4"></div>
            </motion.form>
          ) : (
            // Email/Password Form
            <motion.form
              key="email"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onSubmit={handleEmailAuth}
            >
              {/* Display Name (Only for Signup) */}
              {!isLogin && (
                <motion.div 
                  className="relative mb-3"
                  variants={inputVariants}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <motion.input
                    type="text"
                    name="displayName"
                    placeholder="Your full name"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)" }}
                  />
                </motion.div>
              )}

              {/* Email */}
              <motion.div className="relative mb-3" variants={inputVariants}>
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <motion.input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)" }}
                />
              </motion.div>

              {/* Password */}
              <motion.div className="relative mb-3" variants={inputVariants}>
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <motion.input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)" }}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </motion.div>

              {/* Confirm Password (Only for Signup) */}
              {!isLogin && (
                <motion.div 
                  className="relative mb-3"
                  variants={inputVariants}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <motion.input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.1)" }}
                  />
                </motion.div>
              )}

              {/* Forgot Password (Only for Login) */}
                {isLogin && (
                  <div className="text-right mb-4">
                    <motion.button
                      type="button"
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      onClick={handlePasswordReset}
                      whileHover={{ scale: 1.05 }}
                      disabled={isLoading}
                    >
                      Forgot Password?
                    </motion.button>
                  </div>
                )}              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white py-2.5 rounded-lg font-semibold hover:from-orange-600 hover:to-blue-700 disabled:opacity-50 mb-4 shadow-lg transition-all duration-200"
                variants={buttonVariants}
                whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(249, 115, 22, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading 
                  ? (isLogin ? 'Signing in...' : 'Creating account...') 
                  : (isLogin ? 'Sign In' : 'Create Account')
                }
              </motion.button>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-2">
                <motion.button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  <FaGoogle className="text-red-500" />
                  <span className="text-sm">Continue with Google</span>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2 shadow-sm transition-all duration-200"
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  <FaFacebook className="text-blue-600" />
                  <span className="text-sm">Continue with Facebook</span>
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer */}
        {!showOTP && (
          <motion.div 
            className="text-center mt-4 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthPage;