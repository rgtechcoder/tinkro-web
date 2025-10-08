import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'Getting Started with Robotics: A Beginner\'s Guide',
      excerpt: 'Learn the basics of robotics and how to start your journey with Tinkro kits. Perfect for students new to STEM.',
      author: 'Tinkro Team',
      date: 'January 15, 2025',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80',
      category: 'Tutorial',
    },
    {
      id: 2,
      title: '5 Amazing Robotics Projects for School Students',
      excerpt: 'Discover exciting project ideas that you can build with your Tinkro robotics kit. From line followers to obstacle avoiders!',
      author: 'Tinkro Team',
      date: 'January 10, 2025',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80',
      category: 'Projects',
    },
    {
      id: 3,
      title: 'Why STEM Education is Crucial for Future Careers',
      excerpt: 'Understanding the importance of Science, Technology, Engineering, and Mathematics in shaping tomorrow\'s workforce.',
      author: 'Tinkro Team',
      date: 'January 5, 2025',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80',
      category: 'Education',
    },
    {
      id: 4,
      title: 'How to Prepare for Robotics Competitions',
      excerpt: 'Tips and strategies to excel in school and national level robotics competitions with your Tinkro kit.',
      author: 'Tinkro Team',
      date: 'December 28, 2024',
      image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=500&q=80',
      category: 'Competition',
    },
    {
      id: 5,
      title: 'Understanding Sensors: The Eyes and Ears of Robots',
      excerpt: 'A deep dive into different types of sensors used in robotics and how they help robots interact with the world.',
      author: 'Tinkro Team',
      date: 'December 20, 2024',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&q=80',
      category: 'Tutorial',
    },
    {
      id: 6,
      title: 'AI in Robotics: The Future is Here',
      excerpt: 'Explore how artificial intelligence is revolutionizing robotics and what it means for young learners.',
      author: 'Tinkro Team',
      date: 'December 15, 2024',
      image: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=500&q=80',
      category: 'Innovation',
    },
  ];

  const handleReadMore = (post) => {
    toast({
      title: "🚧 Blog Post Coming Soon!",
      description: "Full blog articles will be available shortly. Stay tuned! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Blog - Tinkro | Robotics Tutorials & STEM Learning</title>
        <meta name="description" content="Read our latest robotics tutorials, project ideas, and STEM education insights. Learn and grow with Tinkro's educational content." />
      </Helmet>
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Tinkro Blog</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Tutorials, project ideas, and insights into the world of robotics and STEM education
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleReadMore(post)}
                  >
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;