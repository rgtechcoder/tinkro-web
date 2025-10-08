import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import Cart from '@/components/Cart';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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