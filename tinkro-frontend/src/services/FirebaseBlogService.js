/**
 * FirebaseBlogService - Firebase-based Blog Management
 * Stores all blogs in Firestore for cross-device sync
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

class FirebaseBlogService {
  constructor() {
    this.collectionName = 'blogs';
  }

  /**
   * Check if Firebase is available
   */
  isAvailable() {
    return !!db;
  }

  /**
   * Get all blog posts
   */
  async getAllBlogs() {
    if (!this.isAvailable()) {
      console.warn('Firebase not available, returning empty array');
      return [];
    }

    try {
      const blogsRef = collection(db, this.collectionName);
      const q = query(blogsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const blogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      }));

      console.log(`✅ Loaded ${blogs.length} blogs from Firebase`);
      return blogs;
    } catch (error) {
      console.error('Error getting blogs:', error);
      return [];
    }
  }

  /**
   * Get published blogs only
   */
  async getPublishedBlogs() {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const blogsRef = collection(db, this.collectionName);
      const q = query(
        blogsRef, 
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      }));
    } catch (error) {
      console.error('Error getting published blogs:', error);
      return [];
    }
  }

  /**
   * Get single blog by ID
   */
  async getBlogById(blogId) {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const blogDoc = await getDoc(doc(db, this.collectionName, blogId));
      
      if (blogDoc.exists()) {
        return {
          id: blogDoc.id,
          ...blogDoc.data(),
          createdAt: blogDoc.data().createdAt?.toDate?.()?.toISOString() || blogDoc.data().createdAt,
          updatedAt: blogDoc.data().updatedAt?.toDate?.()?.toISOString() || blogDoc.data().updatedAt
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting blog:', error);
      return null;
    }
  }

  /**
   * Add new blog post
   */
  async addBlog(blogData) {
    if (!this.isAvailable()) {
      throw new Error('Firebase not available');
    }

    try {
      const newBlog = {
        title: blogData.title || 'Untitled',
        excerpt: blogData.excerpt || '',
        content: blogData.content || '',
        author: blogData.author || 'Tinkro Team',
        date: blogData.date || new Date().toISOString().split('T')[0],
        image: blogData.image || '',
        category: blogData.category || 'General',
        readTime: blogData.readTime || '5 min read',
        status: blogData.status || 'draft',
        tags: blogData.tags || [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, this.collectionName), newBlog);
      
      console.log('✅ Blog added to Firebase:', docRef.id);
      
      return {
        success: true,
        blog: {
          id: docRef.id,
          ...newBlog,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error adding blog:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Update existing blog
   */
  async updateBlog(blogId, updates) {
    if (!this.isAvailable()) {
      throw new Error('Firebase not available');
    }

    try {
      const blogRef = doc(db, this.collectionName, blogId);
      
      await updateDoc(blogRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      console.log('✅ Blog updated in Firebase:', blogId);
      
      return {
        success: true,
        blog: {
          id: blogId,
          ...updates,
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error updating blog:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete blog
   */
  async deleteBlog(blogId) {
    if (!this.isAvailable()) {
      throw new Error('Firebase not available');
    }

    try {
      await deleteDoc(doc(db, this.collectionName, blogId));
      
      console.log('✅ Blog deleted from Firebase:', blogId);
      
      return {
        success: true,
        message: 'Blog deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting blog:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Search blogs by title or content
   */
  async searchBlogs(searchTerm) {
    const allBlogs = await this.getAllBlogs();
    
    const lowerSearch = searchTerm.toLowerCase();
    return allBlogs.filter(blog => 
      blog.title.toLowerCase().includes(lowerSearch) ||
      blog.excerpt.toLowerCase().includes(lowerSearch) ||
      blog.content.toLowerCase().includes(lowerSearch) ||
      blog.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
    );
  }

  /**
   * Get blogs by category
   */
  async getBlogsByCategory(category) {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const blogsRef = collection(db, this.collectionName);
      const q = query(
        blogsRef,
        where('category', '==', category),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
      }));
    } catch (error) {
      console.error('Error getting blogs by category:', error);
      return [];
    }
  }

  /**
   * Initialize with default blogs (one-time setup)
   */
  async initializeDefaultBlogs() {
    if (!this.isAvailable()) {
      return { success: false, error: 'Firebase not available' };
    }

    try {
      // Check if blogs already exist
      const existing = await this.getAllBlogs();
      if (existing.length > 0) {
        console.log('Blogs already initialized');
        return { success: true, message: 'Blogs already exist' };
      }

      const defaultBlogs = [
        {
          title: "Getting Started with Robotics: A Beginner's Guide",
          excerpt: "Learn the basics of robotics and how to start your journey with Tinkro kits.",
          content: "Welcome to the exciting world of robotics! This guide will help you understand the fundamentals of robotics and get you started with your first project.",
          author: "Tinkro Team",
          date: "2024-03-15",
          image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80",
          category: "Tutorial",
          readTime: "5 min read",
          status: "published",
          tags: ["robotics", "beginner", "tutorial", "stem"]
        },
        {
          title: "5 Amazing Robotics Projects for School Students",
          excerpt: "Discover exciting project ideas that you can build with your Tinkro robotics kit.",
          content: "Ready to build something amazing? Here are five fantastic robotics projects perfect for school students.",
          author: "Tinkro Team",
          date: "2024-03-10",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80",
          category: "Projects",
          readTime: "8 min read",
          status: "published",
          tags: ["projects", "students", "diy"]
        }
      ];

      for (const blog of defaultBlogs) {
        await this.addBlog(blog);
      }

      console.log('✅ Default blogs initialized');
      return { success: true, message: 'Default blogs added' };
    } catch (error) {
      console.error('Error initializing blogs:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
const firebaseBlogService = new FirebaseBlogService();
export default firebaseBlogService;
