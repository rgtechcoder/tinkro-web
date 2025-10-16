import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import ProductService from '../services/ProductService';

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Load products from ProductService
  useEffect(() => {
    const loadProducts = () => {
      try {
        setIsLoading(true);
        const publishedProducts = ProductService.getPublishedProducts();
        setProducts(publishedProducts);
        console.log('✅ Products loaded:', publishedProducts.length);
      } catch (error) {
        console.error('❌ Error loading products:', error);
        toast({
          title: "Error Loading Products",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Get unique categories
  const categories = ['All', ...ProductService.getCategories()];
  
  // Filter products by category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Pagination logic (3 products per page)
  const productsPerPage = 3;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = currentPage * productsPerPage;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Auto-slide functionality (similar to blog carousel)
  useEffect(() => {
    if (totalPages <= 1) return;
    
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentPage(prev => (prev + 1) % totalPages);
      }
    }, 5000); // 5 seconds for products
    
    return () => clearInterval(interval);
  }, [totalPages, isHovered]);

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast({
      title: "Added to Cart! 🎉",
      description: `${product.name} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => prev > 0 ? prev - 1 : totalPages - 1);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  return (
    <>
      <Helmet>
        <title>Products - Tinkro | Robotics Kits for Students</title>
        <meta name="description" content="Explore our range of educational robotics kits designed for students of all levels. From beginner to advanced, find the perfect kit for your learning journey." />
      </Helmet>
      
      <div className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-orange-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              Our Products
            </motion.h1>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Discover our range of educational robotics kits designed to inspire and educate students of all levels.
            </motion.p>
            
            {!isLoading && (
              <motion.div 
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {filteredProducts.length} products • Page {currentPage + 1} of {totalPages}
              </motion.div>
            )}
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {categories.map(category => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Products Grid with Auto-Slide */}
              <div 
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentPage}-${selectedCategory}`}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[500px]"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    {visibleProducts.map((product, index) => (
                      <motion.div
                        key={`${product.id}-${currentPage}`}
                        className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        whileHover={{ y: -10 }}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <motion.img
                            key={`${product.id}-${product.image}`}
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            onLoad={() => {
                              console.log(`✅ Product image loaded: ${product.name}`);
                            }}
                            onError={(e) => {
                              console.log(`❌ Product image failed: ${product.name}`);
                              e.target.src = 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=500&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300" />
                          
                          {/* Featured Badge */}
                          {product.featured && (
                            <motion.div 
                              className="absolute top-4 left-4"
                              whileHover={{ scale: 1.1 }}
                            >
                              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                                <Star className="w-3 h-3" />
                                Featured
                              </span>
                            </motion.div>
                          )}
                          
                          {/* Stock Status */}
                          <motion.div 
                            className="absolute top-4 right-4"
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              product.stock > 10 
                                ? 'bg-green-500 text-white' 
                                : product.stock > 0 
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-red-500 text-white'
                            }`}>
                              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </motion.div>
                        </div>
                        
                        <div className="p-6">
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                          </motion.div>
                          
                          <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                            {product.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <motion.span 
                              className="text-2xl font-bold text-blue-600"
                              whileHover={{ scale: 1.05 }}
                            >
                              ₹{product.price?.toLocaleString() || product.price}
                            </motion.span>
                            
                            <Button
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock <= 0}
                              className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              size="sm"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                          </div>
                          
                          {/* Category Badge */}
                          <div className="mt-3">
                            <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                              {product.category}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Controls */}
              {totalPages > 1 && (
                <motion.div 
                  className="flex justify-center items-center space-x-6 mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.button
                    onClick={handlePrevPage}
                    className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-blue-600"
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </motion.button>
                  
                  {/* Page Dots */}
                  <div className="flex space-x-3">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentPage === index
                            ? 'bg-gradient-to-r from-blue-600 to-orange-500 w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      />
                    ))}
                  </div>
                  
                  <motion.button
                    onClick={handleNextPage}
                    className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-700 hover:text-blue-600"
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Auto-slide indicator */}
              {totalPages > 1 && !isHovered && (
                <motion.div 
                  className="flex justify-center mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Auto-sliding every 5 seconds • Hover to pause
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;