/**
 * BlogService - Comprehensive Blog Management Service
 * Handles all blog operations: Create, Read, Update, Delete
 * Uses localStorage for data persistence
 */

class BlogService {
  static STORAGE_KEY = 'tinkro_blog_posts';

  // Default blog posts for initialization
  static getDefaultBlogs() {
    return [
      {
        id: 1,
        title: "Getting Started with Robotics: A Beginner's Guide",
        excerpt: "Learn the basics of robotics and how to start your journey with Tinkro kits. Perfect for students new to STEM.",
        content: "Welcome to the exciting world of robotics! This comprehensive guide will help you understand the fundamentals of robotics and get you started with your first project. Robotics combines engineering, programming, and creativity to build amazing machines that can interact with the world around them.",
        author: "Tinkro Team",
        date: "2024-03-15",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80",
        category: "Tutorial",
        readTime: "5 min read",
        status: "published",
        tags: ["robotics", "beginner", "tutorial", "stem"],
        createdAt: new Date("2024-03-15").toISOString(),
        updatedAt: new Date("2024-03-15").toISOString()
      },
      {
        id: 2,
        title: "5 Amazing Robotics Projects for School Students",
        excerpt: "Discover exciting project ideas that you can build with your Tinkro robotics kit. From line followers to obstacle avoiders!",
        content: "Ready to build something amazing? Here are five fantastic robotics projects that are perfect for school students. Each project is designed to teach different concepts while being fun and engaging.",
        author: "Tinkro Team",
        date: "2024-03-10",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
        category: "Projects",
        readTime: "8 min read",
        status: "published",
        tags: ["projects", "students", "diy", "learning"],
        createdAt: new Date("2024-03-10").toISOString(),
        updatedAt: new Date("2024-03-10").toISOString()
      },
      {
        id: 3,
        title: "Why STEM Education is Crucial for Future Careers",
        excerpt: "Understanding the importance of Science, Technology, Engineering, and Mathematics in shaping tomorrow's workforce.",
        content: "STEM education is more important than ever in today's rapidly evolving technological landscape. This article explores why STEM skills are essential for future careers and how robotics plays a crucial role in STEM learning.",
        author: "Tinkro Team",
        date: "2024-03-05",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80",
        category: "Education",
        readTime: "6 min read",
        status: "published",
        tags: ["stem", "education", "careers", "future"],
        createdAt: new Date("2024-03-05").toISOString(),
        updatedAt: new Date("2024-03-05").toISOString()
      },
      {
        id: 4,
        title: "Building Your First Arduino Project",
        excerpt: "Step-by-step guide to creating your first Arduino-based robotics project using Tinkro components.",
        content: "Arduino is the heart of many robotics projects. In this detailed tutorial, we'll walk you through creating your first Arduino project from scratch, covering everything from basic circuit connections to programming.",
        author: "Tinkro Team",
        date: "2024-02-28",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop&auto=format",
        category: "Tutorial",
        readTime: "10 min read",
        status: "published",
        tags: ["arduino", "tutorial", "electronics", "programming"],
        createdAt: new Date("2024-02-28").toISOString(),
        updatedAt: new Date("2024-02-28").toISOString()
      },
      {
        id: 5,
        title: "The Future of Robotics in Education",
        excerpt: "Exploring how robotics is transforming the way students learn and engage with technology in the classroom.",
        content: "Robotics is revolutionizing education by making learning more interactive, engaging, and practical. Discover how educational robotics is shaping the future of learning and preparing students for tomorrow's challenges.",
        author: "Tinkro Team",
        date: "2024-02-20",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop&auto=format",
        category: "Education",
        readTime: "7 min read",
        status: "published",
        tags: ["education", "future", "classroom", "innovation"],
        createdAt: new Date("2024-02-20").toISOString(),
        updatedAt: new Date("2024-02-20").toISOString()
      },
      {
        id: 6,
        title: "Advanced Sensor Integration Techniques",
        excerpt: "Learn how to integrate multiple sensors in your robotics projects for enhanced functionality and precision.",
        content: "Sensors are the eyes and ears of robots. This advanced guide covers various sensor types, integration techniques, and best practices for creating sophisticated robotics systems with multiple sensor inputs.",
        author: "Tinkro Team",
        date: "2024-02-15",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop&auto=format",
        category: "Tutorial",
        readTime: "12 min read",
        status: "published",
        tags: ["sensors", "advanced", "integration", "technology"],
        createdAt: new Date("2024-02-15").toISOString(),
        updatedAt: new Date("2024-02-15").toISOString()
      }
    ];
  }

  // Initialize storage with default blogs if empty
  static initializeStorage() {
    try {
      const existing = localStorage.getItem(this.STORAGE_KEY);
      if (!existing || JSON.parse(existing).length === 0) {
        const defaultBlogs = this.getDefaultBlogs();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultBlogs));
        console.log('BlogService: Initialized with default blogs');
        return defaultBlogs;
      }
      return JSON.parse(existing);
    } catch (error) {
      console.error('BlogService: Error initializing storage:', error);
      const defaultBlogs = this.getDefaultBlogs();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultBlogs));
      return defaultBlogs;
    }
  }

  // Get all blog posts
  static getAllBlogs() {
    try {
      const blogs = this.initializeStorage();
      return blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('BlogService: Error getting all blogs:', error);
      return this.getDefaultBlogs();
    }
  }

  // Get published blog posts only (for public display)
  static getPublishedBlogs() {
    try {
      const allBlogs = this.getAllBlogs();
      return allBlogs.filter(blog => blog.status === 'published');
    } catch (error) {
      console.error('BlogService: Error getting published blogs:', error);
      return this.getDefaultBlogs().filter(blog => blog.status === 'published');
    }
  }

  // Get blog by ID
  static getBlogById(id) {
    try {
      const blogs = this.getAllBlogs();
      return blogs.find(blog => blog.id === parseInt(id));
    } catch (error) {
      console.error('BlogService: Error getting blog by ID:', error);
      return null;
    }
  }

  // Add new blog post
  static addBlog(blogData) {
    try {
      const blogs = this.getAllBlogs();
      const newId = Math.max(...blogs.map(b => b.id), 0) + 1;
      
      const newBlog = {
        id: newId,
        title: blogData.title || '',
        excerpt: blogData.excerpt || '',
        content: blogData.content || '',
        author: blogData.author || 'Tinkro Team',
        date: blogData.date || new Date().toISOString().split('T')[0],
        image: blogData.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80',
        category: blogData.category || 'Tutorial',
        readTime: blogData.readTime || '5 min read',
        status: blogData.status || 'published',
        tags: blogData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      blogs.unshift(newBlog);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(blogs));
      console.log('BlogService: Blog added successfully:', newBlog.title);
      return newBlog;
    } catch (error) {
      console.error('BlogService: Error adding blog:', error);
      throw error;
    }
  }

  // Update existing blog post
  static updateBlog(id, blogData) {
    try {
      const blogs = this.getAllBlogs();
      
      // Try multiple comparison methods to handle different ID types
      let blogIndex = blogs.findIndex(blog => blog.id === parseInt(id));
      if (blogIndex === -1) {
        blogIndex = blogs.findIndex(blog => blog.id.toString() === id.toString());
      }
      if (blogIndex === -1) {
        blogIndex = blogs.findIndex(blog => blog.id == id); // Loose equality
      }
      
      if (blogIndex === -1) {
        throw new Error('Blog not found');
      }

      const updatedBlog = {
        ...blogs[blogIndex],
        ...blogData,
        id: parseInt(id), // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      };

      blogs[blogIndex] = updatedBlog;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(blogs));
      console.log('BlogService: Blog updated successfully:', updatedBlog.title);
      return updatedBlog;
    } catch (error) {
      console.error('BlogService: Error updating blog:', error);
      throw error;
    }
  }

  // Delete blog post
  static deleteBlog(id) {
    try {
      const blogs = this.getAllBlogs();
      const filteredBlogs = blogs.filter(blog => blog.id !== parseInt(id));
      
      if (blogs.length === filteredBlogs.length) {
        throw new Error('Blog not found');
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredBlogs));
      console.log('BlogService: Blog deleted successfully, ID:', id);
      return true;
    } catch (error) {
      console.error('BlogService: Error deleting blog:', error);
      throw error;
    }
  }

  // Search blogs
  static searchBlogs(searchTerm, filters = {}) {
    try {
      let blogs = this.getAllBlogs();
      
      // Apply text search
      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        blogs = blogs.filter(blog => 
          blog.title.toLowerCase().includes(term) ||
          blog.excerpt.toLowerCase().includes(term) ||
          blog.content.toLowerCase().includes(term) ||
          blog.tags.some(tag => tag.toLowerCase().includes(term))
        );
      }

      // Apply category filter
      if (filters.category && filters.category !== 'all') {
        blogs = blogs.filter(blog => blog.category === filters.category);
      }

      // Apply status filter
      if (filters.status && filters.status !== 'all') {
        blogs = blogs.filter(blog => blog.status === filters.status);
      }

      // Apply author filter
      if (filters.author && filters.author !== 'all') {
        blogs = blogs.filter(blog => blog.author === filters.author);
      }

      return blogs;
    } catch (error) {
      console.error('BlogService: Error searching blogs:', error);
      return [];
    }
  }

  // Get blog statistics
  static getBlogStats() {
    try {
      const blogs = this.getAllBlogs();
      const published = blogs.filter(blog => blog.status === 'published');
      const draft = blogs.filter(blog => blog.status === 'draft');
      
      const categoryCounts = blogs.reduce((acc, blog) => {
        acc[blog.category] = (acc[blog.category] || 0) + 1;
        return acc;
      }, {});

      return {
        total: blogs.length,
        published: published.length,
        draft: draft.length,
        categories: categoryCounts,
        recentPosts: blogs.slice(0, 5)
      };
    } catch (error) {
      console.error('BlogService: Error getting blog stats:', error);
      return {
        total: 0,
        published: 0,
        draft: 0,
        categories: {},
        recentPosts: []
      };
    }
  }

  // Get available categories
  static getCategories() {
    return ['Tutorial', 'Projects', 'Education', 'Technology', 'Innovation', 'Competition'];
  }

  // Get available authors
  static getAuthors() {
    try {
      const blogs = this.getAllBlogs();
      const authors = [...new Set(blogs.map(blog => blog.author))];
      return authors;
    } catch (error) {
      console.error('BlogService: Error getting authors:', error);
      return ['Tinkro Team'];
    }
  }

  // Validate blog data
  static validateBlogData(blogData) {
    const errors = [];

    if (!blogData.title || blogData.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters long');
    }

    if (!blogData.excerpt || blogData.excerpt.trim().length < 10) {
      errors.push('Excerpt must be at least 10 characters long');
    }

    if (!blogData.content || blogData.content.trim().length < 50) {
      errors.push('Content must be at least 50 characters long');
    }

    if (!blogData.category) {
      errors.push('Category is required');
    }

    if (!blogData.author || blogData.author.trim().length < 2) {
      errors.push('Author name must be at least 2 characters long');
    }

    return errors;
  }

  // Export blogs data (for backup)
  static exportBlogs() {
    try {
      const blogs = this.getAllBlogs();
      const dataStr = JSON.stringify(blogs, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `tinkro-blogs-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      console.log('BlogService: Blogs exported successfully');
      return true;
    } catch (error) {
      console.error('BlogService: Error exporting blogs:', error);
      return false;
    }
  }

  // Import blogs data (for restore)
  static importBlogs(jsonData) {
    try {
      const blogs = JSON.parse(jsonData);
      if (!Array.isArray(blogs)) {
        throw new Error('Invalid data format');
      }

      // Validate each blog entry
      const validBlogs = blogs.filter(blog => {
        return blog.id && blog.title && blog.content;
      });

      if (validBlogs.length === 0) {
        throw new Error('No valid blog entries found');
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validBlogs));
      console.log(`BlogService: ${validBlogs.length} blogs imported successfully`);
      return validBlogs.length;
    } catch (error) {
      console.error('BlogService: Error importing blogs:', error);
      throw error;
    }
  }
}

export default BlogService;