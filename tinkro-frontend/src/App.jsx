// OLD: import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import AdminDashboard from '@/pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import UserProfile from './pages/UserProfile_Fixed';
import UserDashboard from '@/components/UserDashboard';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import ChatBot from './chatbot/ChatBot';
import ProductDetails from '@/pages/ProductDetails';
import Checkout from '@/pages/Checkout';

function App() {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('tinkro-cart-items');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('tinkro_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });
  const refreshAppUser = () => {
    try {
      const savedUser = localStorage.getItem('tinkro_current_user');
      const updatedUser = savedUser ? JSON.parse(savedUser) : null;
      setUser(updatedUser);
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // NEW: Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      // Check if localStorage is available (some browsers may block it)
      if (typeof Storage !== 'undefined') {
        localStorage.setItem('tinkro-cart-items', JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]); // Runs whenever cartItems state changes


  // Add global keyboard shortcut: Ctrl+Shift+A to open /admin
  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.location.pathname = '/admin';
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Routing is now handled by react-router-dom

  // Get dynamic page title
  const getPageTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'Tinkro - Robotics Kits for Students | Learn, Build, Innovate';
      case 'products':
        return 'Robotics Kits & Products | Tinkro Education';
      case 'about':
        return 'About Us - Our Mission | Tinkro Education';
      case 'blog':
        return 'Robotics Blog & Learning Resources | Tinkro';
      case 'contact':
        return 'Contact Us - Get Support | Tinkro Education';
      case 'auth':
        return 'Login / Sign Up - Tinkro Account';
      case 'profile':
        return 'My Profile & Orders | Tinkro Account';
      case 'admin':
        return 'Admin Dashboard - Tinkro Management';
      default:
        return 'Tinkro - Robotics Kits for Students | Learn, Build, Innovate';
    }
  };

  // Get page description
  const getPageDescription = () => {
    switch (currentPage) {
      case 'home':
        return 'Discover innovative robotics kits for students. Make learning fun with our educational STEM projects and programming kits.';
      case 'products':
        return 'Browse our collection of robotics kits, sensors, and educational components for students and educators.';
      case 'about':
        return 'Learn about Tinkro\'s mission to make robotics education accessible and fun for students worldwide.';
      case 'blog':
        return 'Read latest robotics tutorials, project ideas, and educational content to enhance your STEM learning journey.';
      case 'contact':
        return 'Get in touch with Tinkro team for support, partnerships, or any questions about our robotics kits.';
      case 'auth':
        return 'Sign in to your Tinkro account to access exclusive content, track orders, and manage your learning progress.';
      case 'profile':
        return 'Manage your Tinkro account, view order history, track learning progress, and update your preferences.';
      case 'admin':
        return 'Tinkro admin dashboard for managing products, orders, content, and system analytics.';
      default:
        return 'Tinkro offers innovative robotics kits for school students. Make robotics fun and easy with our educational STEM kits.';
    }
  };

  return (
    <Router>
      <Helmet>
        <title>Tinkro - Robotics Kits for Students | Learn, Build, Innovate</title>
        <meta name="description" content="Discover innovative robotics kits for students. Make learning fun with our educational STEM projects and programming kits." />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-white">
        <Header 
          cartItemsCount={cartItems.length}
          setIsCartOpen={setIsCartOpen}
          user={user}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products addToCart={addToCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<AuthPage onAuthSuccess={(userData) => { setUser(userData); }} />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/user-dashboard" element={user ? <UserDashboard user={user} onLogout={() => setUser(null)} onUserUpdate={refreshAppUser} /> : <AuthPage onAuthSuccess={(userData) => setUser(userData)} />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/checkout/:productId" element={<Checkout />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <ChatBot />
        <Footer />
        <Cart
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
          cartItems={cartItems}
          updateQuantity={updateCartQuantity}
          removeItem={removeFromCart}
          totalPrice={getTotalPrice()}
          currentUserEmail={user && user.email ? user.email : ''}
        />
        <Toaster />
        <SonnerToaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;