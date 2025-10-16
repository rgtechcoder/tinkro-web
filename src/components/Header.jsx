import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import authService from '../services/AuthService';
const Header = ({
  currentPage,
  setCurrentPage,
  cartItemsCount,
  setIsCartOpen
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Check for logged in user
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, [currentPage]); // Re-check when page changes

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setShowUserMenu(false);
    setCurrentPage('home');
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
  return <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* OLD: Simple onClick for home */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setCurrentPage('home')}
            // NEW: Double-click for admin access
            onDoubleClick={() => setCurrentPage('admin')}
            title="Double-click for Admin Access"
          >
            <img 
              src="https://horizons-cdn.hostinger.com/e7c9821b-6b7a-44e2-b895-23441ddb63a1/d68cad29faeccc76733f807b9ad82502.png" 
              alt="Tinkro Logo" 
              className="h-10 w-auto" 
            />
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`text-sm font-medium transition-colors ${currentPage === item.id ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                {item.label}
              </button>)}
          </nav>

          <div className="flex items-center space-x-4">
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
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="text-sm">{user.displayName || 'User'}</span>
                </Button>
                
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <button
                      onClick={() => {
                        setCurrentPage('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setCurrentPage('admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Admin Dashboard
                      </button>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                className="hidden md:flex"
                onClick={() => setCurrentPage('auth')}
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
                  setCurrentPage(item.id);
                  setIsMobileMenuOpen(false);
                }} 
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentPage === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
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
                    setCurrentPage('profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  {user.displayName || 'Profile'}
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      setCurrentPage('admin');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setCurrentPage('auth');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Login / Sign Up
              </button>
            )}
          </motion.nav>
        )}
      </div>
    </header>;
};
export default Header;