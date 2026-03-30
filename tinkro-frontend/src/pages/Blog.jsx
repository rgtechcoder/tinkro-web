import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import BlogService from '../services/BlogService';

const Blog = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load blog posts from BlogService
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setIsLoading(true);
        const posts = BlogService.getPublishedBlogs();
        setBlogPosts(posts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
        // Fallback to default posts if service fails
        setBlogPosts([
          {
            id: 1,
            title: "Getting Started with Robotics: A Beginner's Guide",
            excerpt: "Learn the basics of robotics and how to start your journey with Tinkro kits. Perfect for students new to STEM.",
            author: "Tinkro Team",
            date: "2024-03-15",
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80",
            category: "Tutorial",
            readTime: "5 min read"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  // Get unique categories from blog posts
  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  // Blog detail modal state
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogDetail, setShowBlogDetail] = useState(false);
  
  // Slider state
  const [currentPage, setCurrentPage] = useState(0);
  const blogsPerPage = 3; // Show only 3 blogs at once
  const totalPages = Math.ceil(filteredPosts.length / blogsPerPage);
  
  // Auto slider states  
  const [isPaused, setIsPaused] = useState(false);

  const handleReadMore = (post) => {
    console.log('📖 Opening blog detail for:', post.title);
    setSelectedBlog(post);
    setShowBlogDetail(true);
  };

  const closeBlogDetail = () => {
    setSelectedBlog(null);
    setShowBlogDetail(false);
  };

  // Slider navigation
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Get current blogs to display
  const getCurrentBlogs = () => {
    const startIndex = currentPage * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  };

  // Reset to first page when category changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  // Auto-slide functionality - continuous automatic sliding
  React.useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 3000); // 4 seconds medium speed
    
    return () => clearInterval(interval);
  }, [isPaused, totalPages]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      y: 50, 
      opacity: 0,
      scale: 0.9
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  // Scroll to top if already on /blog and user clicks Blog nav
  React.useEffect(() => {
    const handleNavClick = (e) => {
      if (window.location.pathname === '/blog') {
        setTimeout(() => window.scrollTo(0, 0), 10);
      }
    };
    window.addEventListener('tinkro-nav-blog', handleNavClick);
    return () => window.removeEventListener('tinkro-nav-blog', handleNavClick);
  }, []);
  return (
    <>
      <Helmet>
        <title>Blog - Tinkro | Robotics Tutorials & STEM Learning</title>
        <meta name="description" content="Read our latest robotics tutorials, project ideas, and STEM education insights. Learn and grow with Tinkro's educational content." />
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
              Tinkro Blog
            </motion.h1>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Tutorials, project ideas, and insights into the world of robotics and STEM education
            </motion.p>
            
            {!isLoading && (
              <motion.div 
                className="mt-4 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {filteredPosts.length} articles • Page {currentPage + 1} of {totalPages}
              </motion.div>
            )}
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading blog posts...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Category Filter */}
              <motion.div 
                className="flex justify-center mb-12"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
            <div className="flex space-x-2 bg-white/70 backdrop-blur-sm p-2 rounded-2xl shadow-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-xl transition-all duration-300 font-medium ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-white/80 hover:text-blue-600'
                  }`}
                >
                  <Tag className="inline-block w-4 h-4 mr-1" />
                  {category}
                </button>
              ))}
            </div>
          </motion.div>



          {/* Navigation Controls */}


          <AnimatePresence mode="wait">
            <motion.div 
              key={`${selectedCategory}-${currentPage}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {getCurrentBlogs().map((post, index) => (
                <motion.article
                  key={post.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onHoverStart={() => {
                    setHoveredCard(post.id);
                    setIsPaused(true); // Pause auto-slider on hover
                  }}
                  onHoverEnd={() => {
                    setHoveredCard(null);
                    setIsPaused(false); // Resume auto-slider when hover ends
                  }}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow relative group"
                  style={{
                    background: hoveredCard === post.id 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)'
                      : 'rgba(255,255,255,0.8)'
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      key={`${post.id}-${post.image}`} // Force re-render on image change
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      onLoad={() => {
                        console.log(`✅ Image loaded successfully for blog ${post.id}:`, post.image);
                      }}
                      onError={(e) => {
                        console.log(`❌ Image failed to load for blog ${post.id}:`, post.image);
                        e.target.src = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop&auto=format';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300" />
                    <motion.div 
                      className="absolute top-4 left-4"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg">
                        {post.category}
                      </span>
                    </motion.div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <motion.h2 
                      className="text-xl font-bold mb-3 line-clamp-2 text-gray-800"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {post.title}
                    </motion.h2>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
                      <motion.div 
                        className="flex items-center space-x-1"
                        whileHover={{ scale: 1.05 }}
                      >
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center space-x-1"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center space-x-1 text-blue-600 font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}</span>
                      </motion.div>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full bg-gradient-to-r from-blue-50 to-orange-50 border-2 border-transparent hover:border-gradient-to-r hover:from-blue-200 hover:to-orange-200 font-semibold"
                        onClick={() => handleReadMore(post)}
                      >
                        <span>Read More</span>
                        <motion.div
                          className="ml-2"
                          animate={{ x: hoveredCard === post.id ? 4 : 0 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls - Below Blogs */}
          {totalPages > 1 && (
            <motion.div 
              className="flex justify-center items-center space-x-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={prevPage}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-blue-50 group"
              >
                <ArrowRight className="h-5 w-5 text-blue-600 rotate-180 group-hover:scale-110 transition-transform" />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full">
                  {currentPage + 1} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => goToPage(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentPage === index 
                          ? 'bg-blue-600 scale-125' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <button
                onClick={nextPage}
                className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-blue-50 group"
              >
                <ArrowRight className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>
          )}
            </>
          )}
        </div>
      </div>

      {/* Blog Detail Modal */}
      <AnimatePresence>
        {showBlogDetail && selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeBlogDetail}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <img 
                  src={selectedBlog.image} 
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={closeBlogDetail}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 transition-all"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-96">
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{selectedBlog.author}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(selectedBlog.date).toLocaleDateString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedBlog.readTime}</span>
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedBlog.title}
                </h1>

                <div className="prose max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedBlog.content}
                  </p>
                </div>

                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {selectedBlog.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Blog;