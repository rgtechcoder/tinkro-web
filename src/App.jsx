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
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

function App() {
  // OLD: const [currentPage, setCurrentPage] = useState('home');
  // NEW: Check URL hash for admin access
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash === 'admin' ? 'admin' : 'home';
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

  // NEW: Listen for URL hash changes for admin access
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setCurrentPage('admin');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'products':
        return <Products addToCart={addToCart} />;
      case 'about':
        return <About />;
      case 'blog':
        return <Blog />;
      case 'contact':
        return <Contact />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  // Admin panel should be full-screen without main website layout
  if (currentPage === 'admin') {
    return (
      <>
        <Helmet>
          <title>Tinkro Admin Dashboard - Order Management</title>
          <meta name="description" content="Tinkro Admin Dashboard for managing orders, products, and analytics." />
        </Helmet>
        <AdminDashboard />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Tinkro - Robotics Kits for Students | Learn, Build, Innovate</title>
        <meta name="description" content="Tinkro offers innovative robotics kits for school students from class 6 and above. Make robotics fun and easy with our educational STEM kits." />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-white">
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          cartItemsCount={cartItems.length}
          setIsCartOpen={setIsCartOpen}
        />
        <main className="flex-grow">
          {renderPage()}
        </main>
        <Footer setCurrentPage={setCurrentPage} />
        <Cart
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
          cartItems={cartItems}
          updateQuantity={updateCartQuantity}
          removeItem={removeFromCart}
          totalPrice={getTotalPrice()}
        />
        <Toaster />
      </div>
    </>
  );
}

export default App;