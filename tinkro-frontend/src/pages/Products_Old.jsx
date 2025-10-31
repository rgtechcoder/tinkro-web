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
        <meta name="description" content="Browse our collection of robotics kits for students. From beginner to advanced levels, find the perfect kit for learning robotics." />
      </Helmet>
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Our Robotics Kits</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Choose from our range of carefully designed robotics kits for every skill level
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">₹{product.price}</span>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;