import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Original products fallback
  const originalProducts = [
    {
      id: 1,
      name: 'Beginner Robotics Kit',
      price: 2499,
      description: 'Perfect starter kit for class 6-8 students. Includes motors, sensors, and easy-to-follow guide.',
      image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=500&q=80',
      category: 'Arduino Kits',
      stock: 50,
      status: 'published',
      featured: true
    },
    {
      id: 2,
      name: 'Advanced Robotics Kit', 
      price: 4999,
      description: 'For class 9-12 students. Advanced sensors, programmable microcontroller, and complex projects.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
      category: 'Advanced Kits',
      stock: 30,
      status: 'published',
      featured: true
    },
    {
      id: 3,
      name: 'School Bulk Pack (10 Kits)',
      price: 22999,
      description: 'Special bulk pricing for schools. Includes 10 beginner kits with teacher training materials.',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80',
      category: 'Bulk Packs',
      stock: 15,
      status: 'published', 
      featured: false
    },
    {
      id: 4,
      name: 'AI Programming Kit',
      price: 6999,
      description: 'Learn AI and machine learning with hands-on robotics projects. Includes Python programming guide.',
      image: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=500&q=80',
      category: 'AI Kits',
      stock: 25,
      status: 'published',
      featured: true
    },
    {
      id: 5,
      name: 'Sensor Expansion Pack',
      price: 1499,
      description: 'Additional sensors and modules to expand your existing robotics projects.',
      image: 'https://images.unsplash.com/photo-1559163499-413811fb2344?w=500&q=80',
      category: 'Accessories',
      stock: 40,
      status: 'published',
      featured: false
    },
    {
      id: 6,
      name: 'Competition Robotics Kit',
      price: 8999,
      description: 'Professional-grade kit for robotics competitions. Includes premium components and tools.',
      image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=500&q=80',
      category: 'Competition Kits',
      stock: 20,
      status: 'published',
      featured: true
    }
  ];

  // FIXED: Proper Firebase real-time listener
  useEffect(() => {
    console.log('🔄 Starting Firebase real-time listener...');
    setIsLoading(true);
    
    let unsubscriber = null;
    
    const initFirebase = async () => {
      try {
        const { db } = await import('../config/firebase.js');
        const { collection, onSnapshot } = await import('firebase/firestore');
        
        if (!db) {
          throw new Error('Firebase not available');
        }
        
        console.log('📡 Firebase connected, setting up listener...');
        
        unsubscriber = onSnapshot(collection(db, 'products'), (snapshot) => {
          console.log('🔄 Real-time update! Size:', snapshot.size);
          
          const firebaseProducts = [];
          snapshot.forEach((doc) => {
            firebaseProducts.push({ id: doc.id, ...doc.data() });
          });
          
          const published = firebaseProducts.filter(p => p.status === 'published');
          setProducts(published);
          
          const cats = [...new Set(published.map(p => p.category))];
          setCategories(['All', ...cats]);
          setIsLoading(false);
          
          console.log('✅ Products updated:', published.length);
        });
        
      } catch (error) {
        console.error('❌ Firebase error:', error);
        
        // Use fallback products
        const fallback = originalProducts.filter(p => p.status === 'published');
        setProducts(fallback);
        setCategories(['All', ...new Set(fallback.map(p => p.category))]);
        setIsLoading(false);
        console.log('📦 Using fallback products:', fallback.length);
      }
    };
    
    initFirebase();
    
    // Proper cleanup function
    return () => {
      console.log('🔌 Cleaning up Firebase listener');
      if (typeof unsubscriber === 'function') {
        unsubscriber();
      }
    };
  }, []);
  
  // Optimized filtering with useMemo
  const filteredProducts = useMemo(() => {
    return selectedCategory === 'All' 
      ? products 
      : products.filter(product => product.category === selectedCategory);
  }, [products, selectedCategory]);

  // Optimized pagination with useMemo
  const { totalPages, visibleProducts } = useMemo(() => {
    const productsPerPage = 3;
    const pages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = currentPage * productsPerPage;
    const visible = filteredProducts.slice(startIndex, startIndex + productsPerPage);
    
    return {
      totalPages: pages,
      visibleProducts: visible
    };
  }, [filteredProducts, currentPage]);

  // Auto-slide functionality
  useEffect(() => {
    if (totalPages <= 1) return;
    
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentPage(prev => (prev + 1) % totalPages);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [totalPages, isHovered]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart && addToCart(product);
      toast({
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <Helmet>
        <title>Products - Tinkro Robotics Kits</title>
        <meta name="description" content="Explore our range of robotics kits for students and schools. Perfect for STEM education and hands-on learning." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Our Products
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover our comprehensive range of robotics kits designed to inspire and educate the next generation of innovators.
          </motion.p>
        </div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className="px-6 py-2 rounded-full transition-all duration-300"
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No products found in this category.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Carousel Container */}
            <div 
              className="relative overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {visibleProducts.map((product, index) => (
                    <motion.div
                      key={`${product.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                    >
                      {/* Product Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.featured && (
                          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            <Star className="w-4 h-4 inline mr-1" />
                            Featured
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                          Stock: {product.stock}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        
                        {/* Price and Actions */}
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-blue-600">
                            ₹{product.price?.toLocaleString() || 0}
                          </div>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {totalPages > 1 && (
                <>
                  <Button
                    onClick={() => setCurrentPage(prev => prev === 0 ? totalPages - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-3 rounded-full shadow-lg z-10"
                    size="icon"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(prev => (prev + 1) % totalPages)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-3 rounded-full shadow-lg z-10"
                    size="icon"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      currentPage === index ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Products);