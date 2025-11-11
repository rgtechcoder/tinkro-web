// OLD: import React, { useState } from 'react';
import React, { useState, useEffect } from 'react'; // NEW: Added useEffect for localStorage sync
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
// NEW: Added Admin Dashboard import
import AdminDashboard from '@/pages/AdminDashboard';
// NEW: Added Authentication pages
import AuthPage from './pages/AuthPage';
import UserProfile from './pages/UserProfile_Fixed';
import UserDashboard from '@/components/UserDashboard';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import ChatBot from './chatbot/ChatBot'; // NEW: Importing ChatBot component

function App() {
  // Check URL hash for page navigation including auth routes
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['admin', 'auth', 'profile', 'user-dashboard', 'products', 'about', 'blog', 'contact'];
    return validPages.includes(hash) ? hash : 'home';
  });
  
  // OLD: const [cartItems, setCartItems] = useState([]);
  // NEW: Load cart from localStorage on app startup
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

  // Function to refresh user data
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

  // Listen for URL hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validPages = ['admin', 'auth', 'profile', 'user-dashboard', 'products', 'about', 'blog', 'contact'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Secret keyboard shortcut to access admin panel (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check for Ctrl+Shift+A (or Cmd+Shift+A on Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        console.log('🔐 Secret admin access activated');
        navigateToPage('admin');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Enhanced setCurrentPage to also update URL hash
  const navigateToPage = (page) => {
    setCurrentPage(page);
    if (page !== 'home') {
      window.location.hash = page;
    } else {
      window.location.hash = '';
    }
  };

  // OPTIMIZED: Auto scroll to top when page changes
  useEffect(() => {
    // Immediate scroll with requestAnimationFrame for better performance
    const performScroll = () => {
      requestAnimationFrame(() => {
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        });
      });
    };
    
    performScroll();
  }, [currentPage]);

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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={navigateToPage} />;
      case 'products':
        return <Products addToCart={addToCart} setCurrentPage={navigateToPage} />;
      case 'about':
        return <About setCurrentPage={navigateToPage} />;
      case 'blog':
        return <Blog />;
      case 'contact':
        return <Contact />;
      case 'auth':
        return <AuthPage onAuthSuccess={(userData) => {
          // Set user and redirect to dashboard
          setUser(userData);
          navigateToPage('user-dashboard');
        }} />;
      case 'user-dashboard':
        return user ? <UserDashboard 
          user={user} 
          onLogout={() => {
            setUser(null);
            navigateToPage('home');
          }} 
          setCurrentPage={navigateToPage}
          onUserUpdate={refreshAppUser}
        /> : <AuthPage onAuthSuccess={(userData) => {
          setUser(userData);
          navigateToPage('user-dashboard');
        }} />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

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

  // Full-screen pages without main website layout
  if (currentPage === 'admin') {
    return (
      <>
        <Helmet>
          <title>{getPageTitle()}</title>
          <meta name="description" content={getPageDescription()} />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <AdminDashboard />
        <Toaster />
      </>
    );
  }

  // Authentication and Profile pages are also full-screen
  if (currentPage === 'auth' || currentPage === 'profile') {
    return (
      <>
        <Helmet>
          <title>{getPageTitle()}</title>
          <meta name="description" content={getPageDescription()} />
          {currentPage === 'auth' && <meta name="robots" content="index, follow" />}
          {currentPage === 'profile' && <meta name="robots" content="noindex, nofollow" />}
        </Helmet>
        {renderPage()}
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://tinkro.com/${currentPage === 'home' ? '' : currentPage}`} />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-white">
        <Header 
          currentPage={currentPage} 
          navigateToPage={navigateToPage}
          cartItemsCount={cartItems.length}
          setIsCartOpen={setIsCartOpen}
          user={user}
        />
        <main className="flex-grow">
          {renderPage()}
        </main>
        <ChatBot /> {/* NEW: ChatBot component added here */}
        <Footer navigateToPage={navigateToPage} />
        <Cart
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
          cartItems={cartItems}
          updateQuantity={updateCartQuantity}
          removeItem={removeFromCart}
          totalPrice={getTotalPrice()}
        />
        {/* ...existing code... */}
        <Toaster />
        <SonnerToaster position="top-right" />
      </div>
    </>
  );
}

export default App;