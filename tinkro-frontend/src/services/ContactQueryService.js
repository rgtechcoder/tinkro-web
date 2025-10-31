// Contact Query Service for managing contact form submissions
class ContactQueryService {
  constructor() {
    this.storageKey = 'tinkro_contact_queries';
    this.initializeStorage();
  }

  // Initialize storage with demo data if empty
  initializeStorage() {
    const existingQueries = this.getAllQueries();
    if (existingQueries.length === 0) {
      const demoQueries = [
        {
          id: 'QUERY_' + Date.now(),
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          phone: '9876543210',
          message: 'I am interested in Arduino robotics kit for my son. Can you provide more details about pricing and availability?',
          status: 'new', // new, in-progress, resolved
          priority: 'medium', // low, medium, high
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          respondedAt: null,
          notes: '',
          category: 'product-inquiry'
        },
        {
          id: 'QUERY_' + (Date.now() + 1),
          name: 'Priya Sharma',
          email: 'priya.sharma@school.edu',
          phone: '8765432109',
          message: 'We are planning to introduce robotics in our school curriculum. Do you provide bulk discounts and training sessions for teachers?',
          status: 'in-progress',
          priority: 'high',
          submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          respondedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
          notes: 'Discussed bulk pricing. Sent quotation for 50 kits.',
          category: 'bulk-order'
        },
        {
          id: 'QUERY_' + (Date.now() + 2),
          name: 'Amit Patel',
          email: 'amit.tech@gmail.com',
          phone: '7654321098',
          message: 'My Raspberry Pi kit is not working properly. The LED is not lighting up even after following all instructions. Please help.',
          status: 'resolved',
          priority: 'high',
          submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          notes: 'Issue resolved. Faulty LED replaced. Replacement kit sent via courier.',
          category: 'technical-support'
        }
      ];
      
      localStorage.setItem(this.storageKey, JSON.stringify(demoQueries));
    }
  }

  // Get all contact queries
  getAllQueries() {
    try {
      const queries = localStorage.getItem(this.storageKey);
      return queries ? JSON.parse(queries) : [];
    } catch (error) {
      console.error('Error getting contact queries:', error);
      return [];
    }
  }

  // Add new contact query
  addQuery(queryData) {
    try {
      const queries = this.getAllQueries();
      
      // Auto-categorize based on message content
      const category = this.categorizeQuery(queryData.message);
      
      // Auto-prioritize based on keywords
      const priority = this.prioritizeQuery(queryData.message);
      
      const newQuery = {
        id: 'QUERY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: queryData.name || 'Anonymous',
        email: queryData.email || '',
        phone: queryData.phone || '',
        message: queryData.message || '',
        status: 'new',
        priority: priority,
        category: category,
        submittedAt: new Date().toISOString(),
        respondedAt: null,
        notes: '',
        source: 'website-contact-form'
      };

      queries.unshift(newQuery); // Add to beginning for latest first
      localStorage.setItem(this.storageKey, JSON.stringify(queries));

      return {
        success: true,
        query: newQuery,
        message: 'Query submitted successfully'
      };
    } catch (error) {
      console.error('Error adding contact query:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Auto-categorize query based on content
  categorizeQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('bulk') || lowerMessage.includes('wholesale') || lowerMessage.includes('school') || lowerMessage.includes('institute')) {
      return 'bulk-order';
    } else if (lowerMessage.includes('not working') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('help') || lowerMessage.includes('broken')) {
      return 'technical-support';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('availability') || lowerMessage.includes('buy')) {
      return 'product-inquiry';
    } else if (lowerMessage.includes('partnership') || lowerMessage.includes('business') || lowerMessage.includes('collaboration')) {
      return 'partnership';
    } else if (lowerMessage.includes('complaint') || lowerMessage.includes('refund') || lowerMessage.includes('return')) {
      return 'complaint';
    } else {
      return 'general';
    }
  }

  // Auto-prioritize query based on urgency keywords
  prioritizeQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency') || lowerMessage.includes('broken') || lowerMessage.includes('not working') || lowerMessage.includes('deadline')) {
      return 'high';
    } else if (lowerMessage.includes('bulk') || lowerMessage.includes('business') || lowerMessage.includes('school') || lowerMessage.includes('soon')) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  // Update query status
  updateQueryStatus(queryId, status, notes = '') {
    try {
      const queries = this.getAllQueries();
      const queryIndex = queries.findIndex(q => q.id === queryId);
      
      if (queryIndex === -1) {
        return { success: false, error: 'Query not found' };
      }

      queries[queryIndex].status = status;
      queries[queryIndex].notes = notes;
      
      if (status === 'in-progress' || status === 'resolved') {
        queries[queryIndex].respondedAt = new Date().toISOString();
      }

      localStorage.setItem(this.storageKey, JSON.stringify(queries));
      
      return {
        success: true,
        query: queries[queryIndex]
      };
    } catch (error) {
      console.error('Error updating query status:', error);
      return { success: false, error: error.message };
    }
  }

  // Update query priority
  updateQueryPriority(queryId, priority) {
    try {
      const queries = this.getAllQueries();
      const queryIndex = queries.findIndex(q => q.id === queryId);
      
      if (queryIndex === -1) {
        return { success: false, error: 'Query not found' };
      }

      queries[queryIndex].priority = priority;
      localStorage.setItem(this.storageKey, JSON.stringify(queries));
      
      return {
        success: true,
        query: queries[queryIndex]
      };
    } catch (error) {
      console.error('Error updating query priority:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete query
  deleteQuery(queryId) {
    try {
      const queries = this.getAllQueries();
      const filteredQueries = queries.filter(q => q.id !== queryId);
      
      localStorage.setItem(this.storageKey, JSON.stringify(filteredQueries));
      
      return {
        success: true,
        message: 'Query deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting query:', error);
      return { success: false, error: error.message };
    }
  }

  // Get query statistics
  getQueryStats() {
    const queries = this.getAllQueries();
    
    const stats = {
      total: queries.length,
      new: queries.filter(q => q.status === 'new').length,
      inProgress: queries.filter(q => q.status === 'in-progress').length,
      resolved: queries.filter(q => q.status === 'resolved').length,
      highPriority: queries.filter(q => q.priority === 'high').length,
      mediumPriority: queries.filter(q => q.priority === 'medium').length,
      lowPriority: queries.filter(q => q.priority === 'low').length,
      categories: {},
      todayQueries: 0,
      weekQueries: 0,
      monthQueries: 0
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    queries.forEach(query => {
      // Category stats
      stats.categories[query.category] = (stats.categories[query.category] || 0) + 1;
      
      // Time-based stats
      const queryDate = new Date(query.submittedAt);
      if (queryDate >= today) stats.todayQueries++;
      if (queryDate >= weekAgo) stats.weekQueries++;
      if (queryDate >= monthAgo) stats.monthQueries++;
    });

    return stats;
  }

  // Search queries
  searchQueries(searchTerm, filters = {}) {
    let queries = this.getAllQueries();
    
    // Text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      queries = queries.filter(q => 
        q.name.toLowerCase().includes(term) ||
        q.email.toLowerCase().includes(term) ||
        q.message.toLowerCase().includes(term) ||
        q.phone.includes(term) ||
        q.id.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      queries = queries.filter(q => q.status === filters.status);
    }

    // Filter by priority
    if (filters.priority && filters.priority !== 'all') {
      queries = queries.filter(q => q.priority === filters.priority);
    }

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      queries = queries.filter(q => q.category === filters.category);
    }

    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      queries = queries.filter(q => {
        const queryDate = new Date(q.submittedAt);
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : new Date('1900-01-01');
        const toDate = filters.dateTo ? new Date(filters.dateTo) : new Date('2100-01-01');
        return queryDate >= fromDate && queryDate <= toDate;
      });
    }

    return queries;
  }

  // Export queries to CSV
  exportToCSV() {
    const queries = this.getAllQueries();
    
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Message', 'Status', 'Priority', 'Category', 'Submitted At', 'Responded At', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...queries.map(q => [
        q.id,
        `"${q.name}"`,
        q.email,
        q.phone,
        `"${q.message.replace(/"/g, '""')}"`,
        q.status,
        q.priority,
        q.category,
        new Date(q.submittedAt).toLocaleString(),
        q.respondedAt ? new Date(q.respondedAt).toLocaleString() : '',
        `"${q.notes.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }
}

// Export singleton instance
const contactQueryService = new ContactQueryService();
export default contactQueryService;