import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Simple Products page without Firebase - SAFE VERSION
const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Simple default products - no Firebase calls
  const defaultProducts = [
    {
      id: 1,
      name: 'Beginner Robotics Kit',
      price: 2499,
      description: 'Perfect starter kit for class 6-8 students. Includes motors, sensors, and easy-to-follow guide.',
      image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=500&q=80',
      category: 'Arduino Kits',
      stock: 50,
      status: 'published',
      featured: true,
      order: 1
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
      featured: true,
      order: 2
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
      featured: false,
      order: 3
    }
  ];

  // Simple loading without Firebase
  useEffect(() => {
    const loadProducts = () => {
      try {
        console.log('🔄 Loading safe products without Firebase...');
        setIsLoading(true);
        
        setTimeout(() => {
          setProducts(defaultProducts);
          const cats = [...new Set(defaultProducts.map(p => p.category))];
          setCategories(['All', ...cats]);
          setIsLoading(false);
          console.log('✅ Safe products loaded successfully');
        }, 1000);
        
      } catch (error) {
        console.error('❌ Error in safe products loading:', error);
        setProducts([]);
        setCategories(['All']);
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);
  
  // Filter products by category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Pagination logic (3 products per page)
  const productsPerPage = 3;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = currentPage * productsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

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
      <div className="min-h-screen flex items-center justify-center">
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
                      key={product.id}
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

export default Products;