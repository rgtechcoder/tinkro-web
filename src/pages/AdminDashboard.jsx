import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Users, 
  User,
  IndianRupee, 
  Calendar, 
  LogOut,
  // Advanced Features Icons
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Star,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  RefreshCw,
  Bell,
  Settings,
  Globe,
  Zap,
  ShoppingCart,
  CreditCard,
  Mail,
  Phone,
  FileText,
  PenTool,
  BookOpen,
  Save,
  X,
  Plus
} from 'lucide-react';
import OrderManager from '../services/OrderManager';
import AdminLogin from '../components/AdminLogin';
import UserManagement from '../components/UserManagement';
import ProductService from '../services/ProductService';
import ContactQueryService from '../services/ContactQueryService';
import BlogService from '../services/BlogService';

const AdminDashboard = () => {
  console.log("AdminDashboard - Advanced Professional Version Loading...");
  
  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Data States
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Advanced Features States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // Tab States
  const [activeTab, setActiveTab] = useState('orders'); // orders, queries, users
  
  // Contact Queries States
  const [contactQueries, setContactQueries] = useState([]);
  const [querySearchTerm, setQuerySearchTerm] = useState('');
  const [queryStatusFilter, setQueryStatusFilter] = useState('all');
  const [queryPriorityFilter, setQueryPriorityFilter] = useState('all');
  
  // Blog Management States
  const [blogs, setBlogs] = useState([]);
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState('all');
  const [blogStatusFilter, setBlogStatusFilter] = useState('all');
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [showEditBlog, setShowEditBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showBlogManagement, setShowBlogManagement] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Tinkro Team',
    date: new Date().toISOString().split('T')[0],
    image: '',
    category: 'Tutorial',
    readTime: '5 min read',
    status: 'published',
    tags: []
  });
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Arduino Kits',
    image: '',
    description: '',
    stock: '',
    featured: false,
    status: 'published'
  });
  const [realtimeData, setRealtimeData] = useState({
    activeUsers: Math.floor(Math.random() * 50) + 10,
    conversionRate: (Math.random() * 5 + 2).toFixed(1),
    avgResponseTime: (Math.random() * 200 + 50).toFixed(0)
  });
  
  // Notifications & Settings States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', title: 'New Order Received', message: 'Order #TK001 from John Doe', time: '2 mins ago', unread: true },
    { id: 2, type: 'payment', title: 'Payment Confirmed', message: '₹1,299 payment successful', time: '5 mins ago', unread: true },
    { id: 3, type: 'system', title: 'System Update', message: 'Dashboard updated successfully', time: '1 hour ago', unread: false },
    { id: 4, type: 'alert', title: 'Low Stock Alert', message: 'Arduino Uno Kit - Only 5 left', time: '2 hours ago', unread: true }
  ]);
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    lowStockAlert: 10,
    autoRefresh: true,
    darkMode: false,
    storeName: 'Tinkro Electronics',
    currency: 'INR',
    timezone: 'Asia/Kolkata'
  });

  // Add CSS animations
  React.useEffect(() => {
    const animationStyles = `
      .animate-scale-up {
        animation: scaleUp 0.3s ease-out forwards;
      }
      
      .animate-bounce-in {
        animation: bounceIn 0.5s ease-out;
      }
      
      .animate-pulse-glow {
        animation: pulseGlow 2s infinite;
      }
      
      .animate-gradient-shift {
        animation: gradientShift 3s ease-in-out infinite;
        background-size: 200% 200%;
      }

      @keyframes scaleUp {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      
      @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes pulseGlow {
        0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
        50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.3); }
      }
      
      @keyframes gradientShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      
      .hover-lift {
        transition: all 0.3s ease;
      }
      
      .hover-lift:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }
      
      .website-button-glow {
        animation: websiteGlow 2s ease-in-out infinite;
      }
      
      @keyframes websiteGlow {
        0%, 100% { 
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.3);
        }
        50% { 
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.3);
        }
      }
      
      .floating-icon {
        animation: floating 3s ease-in-out infinite;
      }
      
      @keyframes floating {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-2px) rotate(2deg); }
        66% { transform: translateY(2px) rotate(-2deg); }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
    
    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  // Check authentication
  useEffect(() => {
    console.log("Checking authentication...");
    try {
      const session = localStorage.getItem('tinkro_admin_session');
      if (session) {
        const sessionData = JSON.parse(session);
        const currentTime = Date.now();
        const sessionAge = currentTime - sessionData.timestamp;
        
        if (sessionAge < 86400000 && sessionData.loggedIn) {
          console.log("Valid session found");
          setIsAuthenticated(true);
        } else {
          console.log("Session expired");
          localStorage.removeItem('tinkro_admin_session');
          setIsAuthenticated(false);
        }
      } else {
        console.log("No session found");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  // Load orders when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Loading orders...");
      loadOrders();
      loadContactQueries();
      loadBlogs();
    }
  }, [isAuthenticated]);

  // Auto-refresh orders when Live mode is enabled
  useEffect(() => {
    if (isAuthenticated && settings.autoRefresh) {
      console.log("Auto-refresh enabled, setting up interval...");
      const interval = setInterval(() => {
        console.log("Auto-refreshing orders...");
        loadOrders();
        
        // Update real-time data
        setRealtimeData(prev => ({
          activeUsers: Math.floor(Math.random() * 50) + 10,
          conversionRate: (Math.random() * 5 + 2).toFixed(1),
          avgResponseTime: (Math.random() * 200 + 50).toFixed(0)
        }));
      }, 10000); // Refresh every 10 seconds

      return () => {
        console.log("Clearing auto-refresh interval");
        clearInterval(interval);
      };
    }
  }, [isAuthenticated, settings.autoRefresh]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      console.log("Loading orders from localStorage...");
      
      // Check multiple localStorage keys for orders
      const orderKeys = ['tinkro_orders', 'tinkro-orders', 'orders'];
      let allOrders = [];
      
      orderKeys.forEach(key => {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
              allOrders = [...allOrders, ...parsed];
            }
          }
        } catch (err) {
          console.warn(`Error parsing ${key}:`, err);
        }
      });
      
      // Remove duplicates based on orderId
      const uniqueOrders = allOrders.reduce((acc, order) => {
        if (order && order.orderId && !acc.find(o => o.orderId === order.orderId)) {
          acc.push(order);
        }
        return acc;
      }, []);
      
      console.log(`Orders loaded: ${uniqueOrders.length} unique orders found`);
      setOrders(uniqueOrders);
      
      // If no orders found, add some demo data for testing
      if (uniqueOrders.length === 0) {
        console.log("No orders found, adding demo data...");
        const demoOrders = [
          {
            orderId: 'TKR' + Date.now(),
            customer: { name: 'Demo User', email: 'hello@tinkro.in' },
            totalAmount: 1299,
            paymentStatus: 'completed',
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            items: [{ name: 'Arduino Uno Kit', quantity: 1, price: 1299 }]
          }
        ];
        setOrders(demoOrders);
        localStorage.setItem('tinkro_orders', JSON.stringify(demoOrders));
      }
      
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Contact Queries
  const loadContactQueries = async () => {
    try {
      console.log("Loading contact queries...");
      const queries = ContactQueryService.getAllQueries();
      console.log(`Contact queries loaded: ${queries.length} queries found`);
      setContactQueries(queries);
    } catch (error) {
      console.error('Error loading contact queries:', error);
      setContactQueries([]);
    }
  };

  // Update query status
  const updateQueryStatus = (queryId, status, notes = '') => {
    const result = ContactQueryService.updateQueryStatus(queryId, status, notes);
    if (result.success) {
      loadContactQueries(); // Reload queries
    }
    return result;
  };

  // Update query priority
  const updateQueryPriority = (queryId, priority) => {
    const result = ContactQueryService.updateQueryPriority(queryId, priority);
    if (result.success) {
      loadContactQueries(); // Reload queries
    }
    return result;
  };

  // Delete query
  const deleteQuery = (queryId) => {
    const result = ContactQueryService.deleteQuery(queryId);
    if (result.success) {
      loadContactQueries(); // Reload queries
    }
    return result;
  };

  // Blog Management Functions
  const loadBlogs = async () => {
    try {
      console.log("Loading blogs...");
      // Check if BlogService is properly imported
      if (!BlogService) {
        console.error('BlogService not found');
        setBlogs([]);
        return;
      }
      
      const blogPosts = BlogService.getAllBlogs();
      console.log(`Blogs loaded: ${blogPosts.length} blogs found`);
      
      // Ensure blogPosts is an array
      if (Array.isArray(blogPosts)) {
        setBlogs(blogPosts);
      } else {
        console.error('BlogService.getAllBlogs() did not return an array:', blogPosts);
        setBlogs([]);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
      setBlogs([]);
    }
  };

  // Add new blog
  const handleAddBlog = () => {
    try {
      const errors = BlogService.validateBlogData(newBlog);
      if (errors.length > 0) {
        alert('Please fix the following errors:\n' + errors.join('\n'));
        return;
      }

      const addedBlog = BlogService.addBlog(newBlog);
      console.log('Blog added:', addedBlog);
      
      // Reset form
      setNewBlog({
        title: '',
        excerpt: '',
        content: '',
        author: 'Tinkro Team',
        date: new Date().toISOString().split('T')[0],
        image: '',
        category: 'Tutorial',
        readTime: '5 min read',
        status: 'published',
        tags: []
      });
      
      setShowAddBlog(false);
      loadBlogs(); // Reload blogs
      alert('Blog added successfully!');
    } catch (error) {
      console.error('Error adding blog:', error);
      alert('Error adding blog: ' + error.message);
    }
  };

  // Edit blog
  const handleEditBlog = (blog) => {
    console.log('📝 RAW BLOG DATA RECEIVED:', blog);
    console.log('📝 Blog ID:', blog?.id, 'Type:', typeof blog?.id);
    console.log('📝 Blog Title:', blog?.title);
    console.log('📝 Full Blog Object Keys:', Object.keys(blog || {}));
    
    if (!blog) {
      console.error('❌ No blog object passed');
      alert('❌ Error: No blog data received.');
      return;
    }
    
    if (!blog.id && blog.id !== 0) {
      console.error('❌ Blog missing ID:', blog);
      alert('❌ Error: Blog ID is missing. Cannot edit this blog.');
      return;
    }
    
    // Create a clean copy of the blog with all required fields
    const blogCopy = {
      id: blog.id,
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      author: blog.author || 'Tinkro Team',
      date: blog.date || new Date().toISOString().split('T')[0],
      image: blog.image || '',
      category: blog.category || 'Tutorial',
      readTime: blog.readTime || '5 min read',
      status: blog.status || 'published',
      tags: blog.tags || [],
      createdAt: blog.createdAt || new Date().toISOString(),
      updatedAt: blog.updatedAt || new Date().toISOString()
    };
    
    console.log('✅ Setting editingBlog with clean copy:', blogCopy);
    setEditingBlog(blogCopy);
    setShowEditBlog(true);
  };

  // Update blog
  const handleUpdateBlog = async () => {
    try {
      console.log('🔄 Starting blog update...', editingBlog);
      
      if (!editingBlog || !editingBlog.id) {
        alert('❌ Error: No blog selected for editing');
        return;
      }

      console.log('📝 Blog ID for update:', editingBlog.id, typeof editingBlog.id);

      const errors = BlogService.validateBlogData(editingBlog);
      if (errors.length > 0) {
        alert('⚠️ Please fix the following errors:\n' + errors.join('\n'));
        return;
      }

      const updatedBlog = BlogService.updateBlog(editingBlog.id, editingBlog);
      console.log('✅ Blog updated successfully:', updatedBlog.title);
      
      // Clean up state properly
      setEditingBlog(null);
      setShowEditBlog(false);
      
      // Reload blogs to reflect changes
      await loadBlogs(); 
      
      alert('✅ Blog updated successfully!');
    } catch (error) {
      console.error('❌ Error updating blog:', error);
      alert('❌ Error updating blog: ' + error.message + '\n\nCheck console for details.');
    }
  };

  // Cancel blog editing
  const handleCancelEdit = () => {
    console.log('🚫 Canceling blog edit');
    setEditingBlog(null);
    setShowEditBlog(false);
  };

  // Delete blog
  const handleDeleteBlog = (blogId) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      BlogService.deleteBlog(blogId);
      console.log('Blog deleted:', blogId);
      loadBlogs(); // Reload blogs
      alert('Blog deleted successfully!');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Error deleting blog: ' + error.message);
    }
  };

  // Filter Functions - Advanced Filtering
  const getFilteredOrders = () => {
    return orders.filter(order => {
      // Search filter
      const matchesSearch = !searchTerm || 
        order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
      
      // Date filter
      let matchesDate = true;
      if (dateRange !== 'all' && order.createdAt) {
        const orderDate = new Date(order.createdAt);
        const now = new Date();
        
        switch (dateRange) {
          case 'today':
            matchesDate = orderDate.toDateString() === now.toDateString();
            break;
          case 'week':
            matchesDate = orderDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            matchesDate = orderDate >= new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          default:
            matchesDate = true;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  // Get Filtered Contact Queries
  const getFilteredQueries = () => {
    return ContactQueryService.searchQueries(querySearchTerm, {
      status: queryStatusFilter,
      priority: queryPriorityFilter
    });
  };

  // Get Filtered Blogs
  const getFilteredBlogs = () => {
    return BlogService.searchBlogs(blogSearchTerm, {
      category: blogCategoryFilter,
      status: blogStatusFilter
    });
  };

  // Realtime Data Updates
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        setRealtimeData({
          activeUsers: Math.floor(Math.random() * 50) + 10,
          conversionRate: (Math.random() * 5 + 2).toFixed(1),
          avgResponseTime: (Math.random() * 200 + 50).toFixed(0)
        });
      }, 30000); // Update every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Bulk Operations
  const handleBulkStatusUpdate = (newStatus) => {
    console.log(`Updating ${selectedOrders.length} orders to ${newStatus}`);
    // Implementation would go here
    setSelectedOrders([]);
  };

  const exportFilteredOrders = () => {
    const filtered = getFilteredOrders();
    const csv = [
      ['Order ID', 'Customer', 'Email', 'Amount', 'Status', 'Date'],
      ...filtered.map(order => [
        order.orderId || '',
        order.customer?.name || '',
        order.customer?.email || '',
        order.totalAmount || 0,
        order.paymentStatus || '',
        order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tinkro-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Notification Functions
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, unread: false })));
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => notif.unread).length;
  };

  // Settings Functions
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Save to localStorage
    const newSettings = { ...settings, [key]: value };
    localStorage.setItem('tinkro-admin-settings', JSON.stringify(newSettings));
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('tinkro-admin-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Enhanced Product Management with ProductService
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditProduct, setShowEditProduct] = useState(false);

  // Load products from ProductService
  const loadProducts = async () => {
    try {
      const allProducts = await ProductService.getAllProducts();
      setProducts(allProducts);
      console.log('✅ Products loaded from ProductService:', allProducts.length);
    } catch (error) {
      console.error('❌ Error loading products:', error);
    }
  };

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Enhanced Add Product with ProductService
  const handleAddProduct = () => {
    (async () => {
      try {
        console.log("🎯 Adding new product:", newProduct);
        const errors = ProductService.validateProductData(newProduct);
        if (errors.length > 0) {
          alert('⚠️ Please fix the following errors:\n' + errors.join('\n'));
          return;
        }
        const addedProduct = await ProductService.addProduct(newProduct);
        console.log('✅ Product added successfully:', addedProduct.name);
        setNewProduct({
          name: '',
          price: '',
          category: 'Arduino Kits',
          image: '',
          description: '',
          stock: '',
          featured: false,
          status: 'published'
        });
        setShowAddProduct(false);
        await loadProducts(); // Reload products
        alert(`✅ Product "${addedProduct.name}" added successfully!`);
      } catch (error) {
        console.error('❌ Error adding product:', error);
        alert('❌ Error adding product: ' + error.message);
      }
    })();
  };

  // Edit Product Functions
  const handleEditProduct = (product) => {
    console.log('📝 Editing product:', product.name);
    setEditingProduct({...product});
    setShowEditProduct(true);
  };

  const handleUpdateProduct = async () => {
    try {
      console.log('🔄 Starting product update...', editingProduct);
      
      if (!editingProduct || !editingProduct.id) {
        alert('❌ Error: No product selected for editing');
        return;
      }

      const errors = ProductService.validateProductData(editingProduct);
      if (errors.length > 0) {
        alert('⚠️ Please fix the following errors:\n' + errors.join('\n'));
        return;
      }

      const updatedProduct = ProductService.updateProduct(editingProduct.id, editingProduct);
      console.log('✅ Product updated successfully:', updatedProduct.name);
      
      // Clean up state
      setEditingProduct(null);
      setShowEditProduct(false);
      
      // Reload products
      await loadProducts();
      
      alert('✅ Product updated successfully!');
    } catch (error) {
      console.error('❌ Error updating product:', error);
      alert('❌ Error updating product: ' + error.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('⚠️ Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        ProductService.deleteProduct(productId);
        loadProducts();
        alert('✅ Product deleted successfully!');
      } catch (error) {
        console.error('❌ Error deleting product:', error);
        alert('❌ Error deleting product: ' + error.message);
      }
    }
  };

  // Toggle Featured Status
  const handleToggleFeatured = (productId) => {
    try {
      const updatedProduct = ProductService.toggleFeatured(productId);
      loadProducts();
      console.log(`✅ Featured status updated: ${updatedProduct.featured ? 'Featured' : 'Not Featured'}`);
    } catch (error) {
      console.error('❌ Error toggling featured status:', error);
      alert('❌ Error updating featured status: ' + error.message);
    }
  };

  // Update Product Order
  const handleUpdateProductOrder = (productId, newOrder) => {
    try {
      ProductService.updateProductOrder(productId, newOrder);
      loadProducts();
      console.log(`✅ Product order updated: ${newOrder}`);
    } catch (error) {
      console.error('❌ Error updating product order:', error);
      alert('❌ Error updating product order: ' + error.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProduct({...newProduct, image: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSuccess = () => {
    console.log("Login successful, setting authenticated");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem('tinkro_admin_session');
    setIsAuthenticated(false);
    // Redirect to main website
    window.location.hash = '';
    window.location.reload();
  };

  // Go back to main website function
  const goToWebsite = () => {
    console.log("Going back to website...");
    window.location.hash = '';
    window.location.reload();
  };

  // Advanced Analytics & Stats
  const calculateAdvancedStats = () => {
    const now = new Date();
    const today = now.toDateString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString();
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const todayOrders = orders.filter(order => 
      order.createdAt && new Date(order.createdAt).toDateString() === today
    );
    
    const yesterdayOrders = orders.filter(order => 
      order.createdAt && new Date(order.createdAt).toDateString() === yesterday
    );
    
    const weeklyOrders = orders.filter(order => 
      order.createdAt && new Date(order.createdAt) >= thisWeek
    );
    
    const monthlyOrders = orders.filter(order => 
      order.createdAt && new Date(order.createdAt) >= thisMonth
    );

    const completedOrders = orders.filter(order => order.paymentStatus === 'completed');
    const pendingOrders = orders.filter(order => order.paymentStatus === 'pending');
    const failedOrders = orders.filter(order => order.paymentStatus === 'failed');

    // Calculate growth rates
    const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const yesterdayRevenue = yesterdayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const revenueGrowth = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100) : 0;
    
    const orderGrowth = yesterdayOrders.length > 0 ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length * 100) : 0;

    return {
      // Basic Stats
      totalOrders: orders?.length || 0,
      totalRevenue: orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0,
      avgOrderValue: orders?.length > 0 ? (orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / orders.length) : 0,
      
      // Time-based Stats
      todayOrders: todayOrders.length,
      yesterdayOrders: yesterdayOrders.length,
      weeklyOrders: weeklyOrders.length,
      monthlyOrders: monthlyOrders.length,
      
      // Status-based Stats
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
      failedOrders: failedOrders.length,
      
      // Revenue Analytics
      todayRevenue,
      yesterdayRevenue,
      weeklyRevenue: weeklyOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      monthlyRevenue: monthlyOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      
      // Growth Rates
      revenueGrowth: revenueGrowth.toFixed(1),
      orderGrowth: orderGrowth.toFixed(1),
      
      // Success Rate
      successRate: orders.length > 0 ? ((completedOrders.length / orders.length) * 100).toFixed(1) : 0,
      
      // Top Products (Mock Data)
      topCategories: [
        { name: 'Arduino Kits', orders: Math.floor(completedOrders.length * 0.4), revenue: todayRevenue * 0.35 },
        { name: 'Raspberry Pi', orders: Math.floor(completedOrders.length * 0.3), revenue: todayRevenue * 0.28 },
        { name: 'Sensors', orders: Math.floor(completedOrders.length * 0.2), revenue: todayRevenue * 0.22 },
        { name: 'Motors & Actuators', orders: Math.floor(completedOrders.length * 0.1), revenue: todayRevenue * 0.15 }
      ]
    };
  };

  const stats = calculateAdvancedStats();

  // Loading screen during auth check
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    console.log("Not authenticated, showing login");
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  console.log("Authenticated, rendering dashboard");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl"></div>
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl border border-white/30"></div>
          
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600/95 via-purple-600/95 to-pink-600/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-yellow-300/20 rounded-full animate-ping"></div>
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-8">
                {/* Brand Icon Section */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-2xl group-hover:scale-110 transition-all duration-500">
                    {/* Circuit Board Style Logo */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl opacity-20 animate-pulse"></div>
                      <div className="relative flex items-center justify-center w-12 h-12">
                        {/* Central Microchip Design */}
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-purple-400 rounded-lg border-2 border-white/40 flex items-center justify-center relative group-hover:rotate-12 transition-transform duration-500">
                          {/* Circuit Lines */}
                          <div className="absolute inset-1 border border-white/60 rounded-sm"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          
                          {/* Side Connections */}
                          <div className="absolute -left-1 top-1 w-2 h-0.5 bg-white/80"></div>
                          <div className="absolute -left-1 top-3 w-2 h-0.5 bg-white/80"></div>
                          <div className="absolute -right-1 top-1 w-2 h-0.5 bg-white/80"></div>
                          <div className="absolute -right-1 top-3 w-2 h-0.5 bg-white/80"></div>
                          <div className="absolute -top-1 left-1 w-0.5 h-2 bg-white/80"></div>
                          <div className="absolute -top-1 left-3 w-0.5 h-2 bg-white/80"></div>
                          <div className="absolute -bottom-1 left-1 w-0.5 h-2 bg-white/80"></div>
                          <div className="absolute -bottom-1 left-3 w-0.5 h-2 bg-white/80"></div>
                        </div>
                        
                        {/* Data Flow Animation */}
                        <div className="absolute inset-0 animate-spin" style={{animationDuration: '12s'}}>
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="absolute inset-0 animate-spin" style={{animationDuration: '8s', animationDirection: 'reverse'}}>
                          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <div className="absolute inset-0 animate-spin" style={{animationDuration: '10s'}}>
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Enhanced Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-500"></div>
                </div>

                {/* Title Section */}
                <div className="space-y-2">
                  <div className="relative">
                    <h1 className="text-5xl font-black text-white mb-1 relative overflow-hidden">
                      <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent hover:from-yellow-200 hover:to-pink-200 transition-all duration-1000">
                        Tinkro Admin Hub
                      </span>
                      {/* Floating Icons */}
                      <div className="absolute -top-3 -right-12 text-2xl animate-bounce" style={{animationDelay: '0s'}}>🚀</div>
                      <div className="absolute -top-1 -right-16 text-lg animate-bounce" style={{animationDelay: '1s'}}>⚡</div>
                      <div className="absolute -bottom-2 -right-8 text-sm animate-bounce" style={{animationDelay: '2s'}}>✨</div>
                    </h1>
                    {/* Animated underline */}
                    <div className="h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-400 animate-pulse" />
                      <p className="text-white/90 text-lg font-medium">Real-time Intelligence</p>
                    </div>
                    <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-400 animate-bounce" />
                      <p className="text-white/90 text-lg font-medium">Advanced Analytics</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Controls */}
              <div className="flex items-center space-x-4">
                {/* Back to Website Button - Enhanced */}
                <div className="relative group z-50">
                  <button
                    onClick={goToWebsite}
                    className="website-button-glow bg-gradient-to-r from-green-500/25 to-emerald-500/25 backdrop-blur-sm rounded-full p-4 border-2 border-green-300/40 hover:from-green-500/50 hover:to-emerald-500/50 hover:border-green-300/60 transition-all duration-500 relative overflow-hidden hover:scale-110 cursor-pointer z-50"
                  >
                    {/* Animated Background Waves */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/20 to-green-300/20 rounded-full scale-0 group-hover:scale-125 transition-transform duration-500 delay-100 pointer-events-none"></div>
                    
                    {/* Icon Container */}
                    <div className="relative flex items-center justify-center pointer-events-none">
                      <Globe className="h-6 w-6 text-white floating-icon group-hover:rotate-180 group-hover:scale-125 transition-all duration-700" />
                      
                      {/* Multi-layer Orbiting Elements */}
                      <div className="absolute inset-0 animate-spin pointer-events-none" style={{animationDuration: '4s'}}>
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                      </div>
                      <div className="absolute inset-0 animate-spin pointer-events-none" style={{animationDuration: '3s', animationDirection: 'reverse'}}>
                        <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-1 h-1 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="absolute inset-0 animate-spin pointer-events-none" style={{animationDuration: '5s'}}>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce"></div>
                      </div>
                      <div className="absolute inset-0 animate-spin pointer-events-none" style={{animationDuration: '2.5s', animationDirection: 'reverse'}}>
                        <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </div>
                    
                    {/* Enhanced Tooltip with Arrow */}
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg pointer-events-none z-60">
                      🌐 Back to Website
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rotate-45 pointer-events-none"></div>
                    </div>
                  </button>
                  
                  {/* Multi-layer Pulsing Ring Effects */}
                  <div className="absolute inset-0 rounded-full border-2 border-green-400/40 scale-100 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"></div>
                  <div className="absolute inset-0 rounded-full border border-emerald-300/30 scale-100 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 pointer-events-none"></div>
                  
                  {/* Sparkle Effects */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300 delay-100 pointer-events-none"></div>
                  <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-emerald-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300 delay-300 pointer-events-none"></div>
                </div>

                {/* Notifications Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="bg-white/15 backdrop-blur-sm rounded-full p-3 border border-white/30 hover:bg-white/25 transition-all duration-300 relative group"
                  >
                    <Bell className="h-5 w-5 text-white group-hover:animate-bounce" />
                    {getUnreadCount() > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {getUnreadCount()}
                      </div>
                    )}
                  </button>
                </div>

                {/* Settings Button */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-white/15 backdrop-blur-sm rounded-full p-3 border border-white/30 hover:bg-white/25 transition-all duration-300 group"
                >
                  <Settings className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Live Status Toggle */}
                <button
                  onClick={() => setSettings(prev => ({...prev, autoRefresh: !prev.autoRefresh}))}
                  className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30 hover:bg-white/25 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${settings.autoRefresh ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                      {settings.autoRefresh && (
                        <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                      )}
                    </div>
                    <span className="text-white font-medium">
                      {settings.autoRefresh ? 'Live' : 'Offline'}
                    </span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {settings.autoRefresh ? 'Disable Auto-Refresh' : 'Enable Auto-Refresh'}
                  </div>
                </button>

                {/* Admin Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="bg-white/15 backdrop-blur-sm rounded-full p-3 border border-white/30 hover:bg-white/25 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-sm">A</span>
                      </div>
                      <span className="text-white font-medium hidden md:block">Admin</span>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Profile Settings
                    </div>
                  </button>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-300/30 text-white px-5 py-3 rounded-full hover:from-red-500/40 hover:to-pink-500/40 transition-all duration-300 flex items-center space-x-2 group"
                >
                  <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Realtime Analytics Bar */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Live Data</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Active Users:</span>
                <span className="font-bold text-blue-600">{realtimeData.activeUsers}</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Conversion:</span>
                <span className="font-bold text-green-600">{realtimeData.conversionRate}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-600">Avg Response:</span>
                <span className="font-bold text-orange-600">{realtimeData.avgResponseTime}ms</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders - Advanced */}
          <div className="group bg-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  parseFloat(stats.orderGrowth) >= 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {parseFloat(stats.orderGrowth) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{stats.orderGrowth}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{stats.totalOrders}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Today: {stats.todayOrders}</span>
                  <span>Success: {stats.successRate}%</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Revenue - Advanced */}
          <div className="group bg-white p-6 rounded-xl shadow-lg border border-green-100 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300">
                  <IndianRupee className="h-8 w-8 text-green-600" />
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  parseFloat(stats.revenueGrowth) >= 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {parseFloat(stats.revenueGrowth) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{stats.revenueGrowth}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">₹{stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Today: ₹{stats.todayRevenue.toLocaleString()}</span>
                  <span>Avg: ₹{stats.avgOrderValue.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Conversion Rate - New */}
          <div className="group bg-white p-6 rounded-xl shadow-lg border border-purple-100 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  <Star className="h-3 w-3" />
                  <span>Excellent</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{stats.successRate}%</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Completed: {stats.completedOrders}</span>
                  <span>Pending: {stats.pendingOrders}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Active Users - New */}
          <div className="group bg-white p-6 rounded-xl shadow-lg border border-orange-100 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-300">
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{realtimeData.activeUsers}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>AVG: ₹{stats.avgOrderValue.toFixed(0)}</span>
                  <span>Conversion: {realtimeData.conversionRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top Categories */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <PieChart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Top Product Categories</h3>
                  <p className="text-sm text-gray-600">Revenue breakdown by category</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {stats.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 
                      index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">{category.orders} orders</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{category.revenue.toFixed(0)}</p>
                    <div className={`w-20 h-2 rounded-full bg-gray-200 overflow-hidden ${
                      index === 0 ? 'bg-blue-100' : 
                      index === 1 ? 'bg-green-100' : 
                      index === 2 ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      <div 
                        className={`h-full rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-green-500' : 
                          index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${(category.revenue / stats.totalRevenue * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                <p className="text-sm text-gray-600">Manage your store</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={() => setShowAddProduct(true)}
                className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 group"
              >
                <ShoppingCart className="h-4 w-4 group-hover:animate-bounce" />
                <span>Add New Product</span>
                <div className="ml-auto text-xs opacity-70">→ Main Website</div>
              </button>

              <button 
                onClick={() => {
                  console.log('Blog Management modal opening...');
                  try {
                    // Load blogs before opening modal
                    loadBlogs();
                    setShowBlogModal(true);
                    console.log('Blog modal opened successfully');
                  } catch (error) {
                    console.error('Error opening blog modal:', error);
                    alert('Error opening Blog Management. Please check console.');
                  }
                }}
                className="w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 group"
              >
                <BookOpen className="h-4 w-4 group-hover:animate-pulse" />
                <span>Blog Management</span>
                <div className="ml-auto text-xs opacity-70">📝 {blogs?.length || 0}</div>
              </button>

              <button 
                onClick={exportFilteredOrders}
                className="w-full p-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 group"
              >
                <Download className="h-4 w-4 group-hover:animate-pulse" />
                <span>Export Orders</span>
                <div className="ml-auto text-xs opacity-70">CSV</div>
              </button>              <button className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 group">
                <Bell className="h-4 w-4 group-hover:animate-swing" />
                <span>Send Notifications</span>
                <div className="ml-auto text-xs opacity-70">📧</div>
              </button>
              
              <button className="w-full p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2 group">
                <Settings className="h-4 w-4 group-hover:animate-spin" />
                <span>Store Settings</span>
                <div className="ml-auto text-xs opacity-70">⚙️</div>
              </button>
            </div>
            
            {/* System Health */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">System Health</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Server Status</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-600 font-medium">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Response Time</span>
                  <span className="text-gray-900 font-medium">{realtimeData.avgResponseTime}ms</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Database</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-600 font-medium">Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Showing {getFilteredOrders().length} of {orders.length} orders
              </span>
              {selectedOrders.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-blue-600">
                    {selectedOrders.length} selected
                  </span>
                  <button
                    onClick={() => handleBulkStatusUpdate('completed')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
                  >
                    Mark Complete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Orders ({orders.length})</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('queries')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === 'queries'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Contact Queries ({contactQueries.length})</span>
                {contactQueries.filter(q => q.status === 'new').length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {contactQueries.filter(q => q.status === 'new').length}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Users</span>
              </div>
            </button>

          </div>
        </div>

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <Package className="h-5 w-5 text-white" />
                </div>
              <div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Recent Orders</h2>
                <p className="text-sm text-gray-600">Manage and track customer orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadOrders}
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
              >
                <div className={isLoading ? 'animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full' : 'w-4 h-4'}>
                  {!isLoading && '🔄'}
                </div>
                <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <span>📥</span>
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading orders...</p>
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredOrders().length > 0 ? (
                    getFilteredOrders().slice(0, 10).map((order, index) => (
                      <tr key={order.orderId || index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          #{order.orderId || `ORD-${index + 1}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{order.customer?.name || 'Unknown'}</div>
                            <div className="text-gray-500">{order.customer?.email || order.customer?.phone || 'No contact'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ₹{(order.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            order.paymentStatus === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : order.paymentStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.paymentStatus === 'completed' ? '✅ Paid' : 
                             order.paymentStatus === 'pending' ? '⏳ Pending' : 
                             '❌ Failed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Package className="h-12 w-12 text-gray-300 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
                          <p className="text-gray-500">Orders will appear here when customers make purchases</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        )}

        {/* Contact Queries Tab Content */}
        {activeTab === 'queries' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Queries Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Contact Queries</h3>
                  <p className="text-sm text-gray-500">Manage customer inquiries and support requests</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const csvContent = ContactQueryService.exportToCSV();
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `contact-queries-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
                
                <button
                  onClick={() => loadContactQueries()}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Query Filters */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Search */}
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search queries by name, email, message, or ID..."
                      value={querySearchTerm}
                      onChange={(e) => setQuerySearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Status Filter */}
                <div>
                  <select
                    value={queryStatusFilter}
                    onChange={(e) => setQueryStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                
                {/* Priority Filter */}
                <div>
                  <select
                    value={queryPriorityFilter}
                    onChange={(e) => setQueryPriorityFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Query Statistics */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{contactQueries.filter(q => q.status === 'new').length}</div>
                  <div className="text-sm text-gray-600">New</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600">{contactQueries.filter(q => q.status === 'in-progress').length}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{contactQueries.filter(q => q.status === 'resolved').length}</div>
                  <div className="text-sm text-gray-600">Resolved</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-red-600">{contactQueries.filter(q => q.priority === 'high').length}</div>
                  <div className="text-sm text-gray-600">High Priority</div>
                </div>
              </div>
            </div>

            {/* Queries Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Query Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredQueries().length > 0 ? getFilteredQueries().map((query) => (
                    <tr key={query.id} className="hover:bg-gray-50 transition-colors">
                      {/* Query Details */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="font-medium text-gray-900">{query.name}</div>
                            <span className="text-xs text-gray-500">#{query.id.slice(-8)}</span>
                          </div>
                          <div className="text-sm text-gray-600">{query.email}</div>
                          {query.phone && <div className="text-sm text-gray-500">{query.phone}</div>}
                          <div className="text-sm text-gray-700 max-w-xs">
                            {query.message.length > 100 ? `${query.message.slice(0, 100)}...` : query.message}
                          </div>
                        </div>
                      </td>
                      
                      {/* Status & Priority */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <select
                            value={query.status}
                            onChange={(e) => updateQueryStatus(query.id, e.target.value)}
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${
                              query.status === 'new' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              query.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-green-100 text-green-800 border-green-200'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                          
                          <select
                            value={query.priority}
                            onChange={(e) => updateQueryPriority(query.id, e.target.value)}
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${
                              query.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                              query.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </td>
                      
                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                          {query.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </td>
                      
                      {/* Date */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {new Date(query.submittedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(query.submittedAt).toLocaleTimeString()}
                        </div>
                        {query.respondedAt && (
                          <div className="text-xs text-green-600 mt-1">
                            Responded: {new Date(query.respondedAt).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <a
                            href={`mailto:${query.email}?subject=Re: Your inquiry - ${query.id.slice(-8)}&body=Hello ${query.name},%0D%0A%0D%0AThank you for contacting us regarding:%0D%0A"${query.message}"%0D%0A%0D%0A`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Reply via Email"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                          
                          {query.phone && (
                            <a
                              href={`tel:${query.phone}`}
                              className="text-green-600 hover:text-green-800 transition-colors"
                              title="Call Customer"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                          )}
                          
                          <button
                            onClick={() => deleteQuery(query.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Query"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="text-gray-400">
                          <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-medium mb-2">No Contact Queries Found</h3>
                          <p className="text-gray-500">Contact queries will appear here when customers submit forms</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Management Tab Content */}
        {activeTab === 'users' && (
          <UserManagement />
        )}



        {/* Notifications Panel */}
        {showNotifications && (
          <div className="fixed top-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 max-h-96 overflow-hidden z-50 animate-scale-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <h3 className="font-bold">Notifications</h3>
                  {getUnreadCount() > 0 && (
                    <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                      {getUnreadCount()} new
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors"
                  >
                    Mark all read
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="hover:bg-white/20 p-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markNotificationAsRead(notification.id)}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      notification.unread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'order' ? 'bg-green-100 text-green-600' :
                        notification.type === 'payment' ? 'bg-blue-100 text-blue-600' :
                        notification.type === 'system' ? 'bg-gray-100 text-gray-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {notification.type === 'order' ? <ShoppingCart className="h-4 w-4" /> :
                         notification.type === 'payment' ? <CreditCard className="h-4 w-4" /> :
                         notification.type === 'system' ? <Settings className="h-4 w-4" /> :
                         <Bell className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="fixed top-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 max-h-96 overflow-hidden z-50 animate-scale-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <h3 className="font-bold">Admin Settings</h3>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="hover:bg-white/20 p-1 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Settings Content */}
            <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
              {/* Store Settings */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800">Store Configuration</h4>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Store Name</label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => updateSetting('storeName', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Low Stock Alert (units)</label>
                  <input
                    type="number"
                    value={settings.lowStockAlert}
                    onChange={(e) => updateSetting('lowStockAlert', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Notification Settings */}
              <div className="space-y-3 border-t pt-4">
                <h4 className="font-semibold text-gray-800">Notification Preferences</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Push Notifications</span>
                  <button
                    onClick={() => updateSetting('notifications', !settings.notifications)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.notifications ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Alerts</span>
                  <button
                    onClick={() => updateSetting('emailAlerts', !settings.emailAlerts)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.emailAlerts ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      settings.emailAlerts ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Auto Refresh Data</span>
                  <button
                    onClick={() => updateSetting('autoRefresh', !settings.autoRefresh)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.autoRefresh ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      settings.autoRefresh ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-scale-up">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Add New Product</h2>
                      <p className="text-blue-100">Add product to main website</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowAddProduct(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Product Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Product Image</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                      {newProduct.image ? (
                        <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <div className="text-2xl">📷</div>
                          <div className="text-xs text-gray-500">Image</div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Recommended: 400x400px</p>
                    </div>
                  </div>
                </div>

                {/* Product Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Product Name</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="e.g., Arduino Uno R3 Kit"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Product Price */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Price (₹)</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="999"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Arduino Kits">Arduino Kits</option>
                      <option value="Raspberry Pi">Raspberry Pi</option>
                      <option value="Sensors">Sensors</option>
                      <option value="Motors & Actuators">Motors & Actuators</option>
                      <option value="Development Boards">Development Boards</option>
                      <option value="Robotics Kits">Robotics Kits</option>
                    </select>
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Stock Quantity</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="50"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Product Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Product Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Describe the product features, specifications, and benefits..."
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Preview Card */}
                {newProduct.name && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Product Preview</h3>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-4">
                        {newProduct.image && (
                          <img src={newProduct.image} alt={newProduct.name} className="w-16 h-16 object-cover rounded-lg" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{newProduct.name}</h4>
                          <p className="text-sm text-gray-600">{newProduct.category}</p>
                          {newProduct.price && (
                            <p className="text-lg font-bold text-green-600">₹{newProduct.price}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Add to Website button clicked', newProduct);
                    handleAddProduct();
                  }}
                  disabled={!newProduct.name || !newProduct.price}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Website</span>
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Blog Management Modal */}
        {showBlogModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            {console.log('Blog Modal is rendering...', { blogs: blogs, blogsLength: blogs?.length })}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Blog Management Center</h2>
                    <p className="text-sm text-gray-600">Create, edit, and manage all your blog posts</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBlogModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Stats Row */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-indigo-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-green-600">{blogs.filter(p => p.status === 'published').length}</div>
                    <div className="text-sm text-gray-600">Published</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-yellow-600">{blogs.filter(p => p.status === 'draft').length}</div>
                    <div className="text-sm text-gray-600">Drafts</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{blogs.length}</div>
                    <div className="text-sm text-gray-600">Total Posts</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">{BlogService.getCategories().length}</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  {/* Search */}
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search blogs by title, content, or tags..."
                        value={blogSearchTerm}
                        onChange={(e) => setBlogSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex gap-2">
                    <select
                      value={blogStatusFilter}
                      onChange={(e) => setBlogStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                    
                    <select
                      value={blogCategoryFilter}
                      onChange={(e) => setBlogCategoryFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All Categories</option>
                      {BlogService.getCategories().map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={loadBlogs}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        if (confirm('🚨 FORCE RESET: Clear all blogs and restore 6 original blogs?\n\nThis will delete ALL custom blogs including "AI Innovation"!')) {
                          try {
                            console.log('🔄 Starting force reset...');
                            
                            // Step 1: Clear localStorage completely
                            localStorage.removeItem('tinkro_blog_posts');
                            console.log('✅ localStorage cleared');
                            
                            // Step 2: Reset to default
                            const defaultBlogs = BlogService.resetToDefault();
                            console.log('✅ Default blogs restored:', defaultBlogs.length);
                            
                            // Step 3: Reload blogs
                            loadBlogs();
                            
                            // Step 4: Force page refresh to clear any cache
                            setTimeout(() => {
                              window.location.reload();
                            }, 1000);
                            
                            alert('✅ FORCE RESET COMPLETE!\n\n6 original blogs restored.\nPage will refresh in 1 second...');
                          } catch (error) {
                            console.error('❌ Force reset error:', error);
                            alert('❌ Error in force reset. Check console.');
                          }
                        }
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>🚨 FORCE RESET</span>
                    </button>
                    
                    <button
                      onClick={() => setShowAddBlog(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New Blog</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Blog Posts List */}
              <div className="flex-1 overflow-y-auto">
                {getFilteredBlogs().length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {getFilteredBlogs().map((post) => (
                      <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-4">
                          {/* Blog Image */}
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-24 h-24 object-cover rounded-xl flex-shrink-0 shadow-sm"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80';
                            }}
                          />
                          
                          {/* Blog Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h4>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <User className="h-3 w-3" />
                                    <span>{post.author}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(post.date).toLocaleDateString()}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{post.readTime}</span>
                                  </span>
                                </div>
                              </div>
                              
                              {/* Status & Category */}
                              <div className="flex flex-col items-end space-y-2 ml-4">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  post.status === 'published' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                </span>
                                <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                                  {post.category}
                                </span>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex items-center space-x-3 mt-4">
                              <button
                                onClick={() => {
                                  console.log('🔘 EDIT BUTTON CLICKED for post:', post);
                                  console.log('🔘 Post ID before sending:', post?.id);
                                  handleEditBlog(post);
                                }}
                                className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="text-sm font-medium">Edit</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  const newStatus = post.status === 'published' ? 'draft' : 'published';
                                  BlogService.updateBlog(post.id, { status: newStatus });
                                  loadBlogs();
                                }}
                                className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-all ${
                                  post.status === 'published' 
                                    ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50' 
                                    : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                }`}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {post.status === 'published' ? 'Make Draft' : 'Publish'}
                                </span>
                              </button>
                              
                              <button
                                onClick={() => handleDeleteBlog(post.id)}
                                className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-sm font-medium">Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No Blog Posts Found</h3>
                      <p className="text-gray-500 mb-4">Create your first blog post to get started</p>
                      <button
                        onClick={() => setShowAddBlog(true)}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Create First Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add New Blog Modal */}
        {showAddBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                    <PenTool className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Add New Blog Post</h2>
                </div>
                <button
                  onClick={() => setShowAddBlog(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Blog Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter blog title..."
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Blog Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt/Summary *
                  </label>
                  <textarea
                    placeholder="Brief description of the blog post..."
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Blog Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    placeholder="Write your blog content here..."
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Row 1: Category and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {BlogService.getCategories().map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newBlog.status}
                      onChange={(e) => setNewBlog({...newBlog, status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Author and Read Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      placeholder="Author name..."
                      value={newBlog.author}
                      onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Read Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 5 min read"
                      value={newBlog.readTime}
                      onChange={(e) => setNewBlog({...newBlog, readTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Blog Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL 🖼️ <span className="text-xs text-gray-500">(Accepts: JPG, PNG, WebP, GIF)</span>
                  </label>
                  
                  {/* Quick Upload Instructions */}
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs text-blue-700 font-medium mb-2">📤 Local Image को Upload करें:</div>
                    <div className="text-xs text-blue-600 space-y-1">
                      <div>• <strong>Imgur:</strong> imgur.com → Upload → Direct Link copy करें</div>
                      <div>• <strong>GitHub:</strong> Repo → Upload file → Raw URL copy करें</div>
                      <div>• <strong>Unsplash:</strong> unsplash.com → Free images</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://i.imgur.com/abc123.jpg या https://images.unsplash.com/photo-xyz.jpg"
                      value={newBlog.image}
                      onChange={(e) => {
                        const imageUrl = e.target.value.trim();
                        console.log('🖼️ New image URL entered:', imageUrl);
                        setNewBlog({...newBlog, image: imageUrl});
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    
                    {/* Local File Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            console.log('📁 New blog - Local file selected:', file.name, 'Size:', file.size);
                            
                            // Check file size (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              alert('❌ File too large! Please select image less than 5MB');
                              return;
                            }
                            
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64Image = event.target.result;
                              console.log('✅ Base64 conversion complete for new blog');
                              console.log('🆕 New image:', base64Image.substring(0, 50) + '...');
                              
                              // Force state update
                              setNewBlog(prev => ({
                                ...prev,
                                image: base64Image
                              }));
                              
                              alert('✅ Image uploaded successfully!');
                            };
                            reader.onerror = () => {
                              console.error('❌ Error reading file');
                              alert('❌ Error reading file. Please try again.');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                      >
                        📁 Upload
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    💡 <strong>Option 1:</strong> URL paste करें | <strong>Option 2:</strong> File upload करें (base64)
                  </div>
                  
                  {/* Image Preview */}
                  {newBlog.image && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-600 mb-2">
                        Image Preview: 
                        <span className="ml-1 text-blue-600">
                          {newBlog.image.startsWith('data:') ? '📁 Local File (Base64)' : '🌐 URL Image'}
                        </span>
                      </div>
                      <img
                        key={newBlog.image} // Force re-render when image changes
                        src={newBlog.image}
                        alt="Preview"
                        className="w-40 h-24 object-cover rounded-lg shadow-md border-2 border-gray-200"
                        onLoad={() => {
                          console.log('✅ New blog preview image loaded successfully');
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          console.log('❌ New blog preview image failed to load');
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setShowAddBlog(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBlog}
                  disabled={!newBlog.title || !newBlog.excerpt || !newBlog.content}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Create Blog Post</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Blog Modal */}
        {showEditBlog && editingBlog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <Edit className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Edit Blog Post</h2>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Blog Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter blog title..."
                    value={editingBlog.title}
                    onChange={(e) => setEditingBlog({...editingBlog, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Blog Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt/Summary *
                  </label>
                  <textarea
                    placeholder="Brief description of the blog post..."
                    value={editingBlog.excerpt}
                    onChange={(e) => setEditingBlog({...editingBlog, excerpt: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Blog Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    placeholder="Write your blog content here..."
                    value={editingBlog.content}
                    onChange={(e) => setEditingBlog({...editingBlog, content: e.target.value})}
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Row 1: Category and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={editingBlog.category}
                      onChange={(e) => setEditingBlog({...editingBlog, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {BlogService.getCategories().map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={editingBlog.status}
                      onChange={(e) => setEditingBlog({...editingBlog, status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Author and Read Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      placeholder="Author name..."
                      value={editingBlog.author}
                      onChange={(e) => setEditingBlog({...editingBlog, author: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Read Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 5 min read"
                      value={editingBlog.readTime}
                      onChange={(e) => setEditingBlog({...editingBlog, readTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Blog Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL 🖼️ <span className="text-xs text-gray-500">(Update होने के लिए cache clear होगा)</span>
                  </label>
                  
                  {/* Quick Upload Instructions for Edit */}
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-xs text-green-700 font-medium mb-2">📤 Local Image को Replace करें:</div>
                    <div className="text-xs text-green-600 space-y-1">
                      <div>• <strong>Imgur:</strong> imgur.com → Upload → Direct Link copy करें</div>
                      <div>• <strong>GitHub:</strong> Repo में upload → Raw URL copy करें</div>
                      <div>• <strong>Current:</strong> {editingBlog.image ? editingBlog.image.substring(0, 50) + '...' : 'No image'}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://i.imgur.com/abc123.jpg या https://images.unsplash.com/photo-xyz.jpg"
                      value={editingBlog.image}
                      onChange={(e) => {
                        const imageUrl = e.target.value.trim();
                        console.log('🖼️ Editing image URL:', imageUrl);
                        console.log('🖼️ Previous image URL:', editingBlog.image);
                        setEditingBlog({...editingBlog, image: imageUrl});
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    {/* Local File Upload Button for Edit */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            console.log('📁 Editing - Local file selected:', file.name, 'Size:', file.size);
                            
                            // Check file size (max 5MB)
                            if (file.size > 5 * 1024 * 1024) {
                              alert('❌ File too large! Please select image less than 5MB');
                              return;
                            }
                            
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const base64Image = event.target.result;
                              console.log('✅ Base64 conversion complete for edit');
                              console.log('🔄 Previous image:', editingBlog.image ? editingBlog.image.substring(0, 50) + '...' : 'None');
                              console.log('🆕 New image:', base64Image.substring(0, 50) + '...');
                              
                              // Force state update with new object
                              setEditingBlog(prev => ({
                                ...prev,
                                image: base64Image
                              }));
                              
                              alert('✅ Image uploaded successfully!');
                            };
                            reader.onerror = () => {
                              console.error('❌ Error reading file');
                              alert('❌ Error reading file. Please try again.');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="imageUploadEdit"
                      />
                      <label
                        htmlFor="imageUploadEdit"
                        className="px-4 py-3 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
                      >
                        📁 Replace
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    💡 <strong>Option 1:</strong> URL paste करें | <strong>Option 2:</strong> File upload करें (base64)
                  </div>
                  {editingBlog.image && (
                    <div className="mt-3">
                      <div className="text-xs text-gray-600 mb-2">
                        Current Image Preview: 
                        <span className="ml-1 text-blue-600">
                          {editingBlog.image.startsWith('data:') ? '📁 Local File (Base64)' : '🌐 URL Image'}
                        </span>
                      </div>
                      <img
                        key={editingBlog.image} // Force re-render when image changes
                        src={editingBlog.image}
                        alt="Preview"
                        className="w-40 h-24 object-cover rounded-lg shadow-md border-2 border-gray-200"
                        onLoad={() => {
                          console.log('✅ Edit preview image loaded successfully');
                        }}
                        onError={(e) => {
                          console.log('❌ Edit preview image failed to load');
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateBlog}
                  disabled={!editingBlog.title || !editingBlog.excerpt || !editingBlog.content}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Update Blog Post</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;