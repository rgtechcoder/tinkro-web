// UserManagementService.js - Service for managing user data in Admin Dashboard
import AuthService from './AuthService';

export class UserManagementService {
  constructor() {
    this.authService = new AuthService();
  }

  // Get all registered users
  getAllUsers() {
    try {
      const allUsers = [];
      
      // Get current user data
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        allUsers.push(currentUser);
      }

      // Get user profiles from localStorage
      const userProfiles = JSON.parse(localStorage.getItem('tinkro_user_profiles') || '[]');
      userProfiles.forEach(profile => {
        if (!allUsers.find(u => u.uid === profile.uid)) {
          allUsers.push(profile);
        }
      });

      // Get login history to identify users
      const loginHistory = JSON.parse(localStorage.getItem('tinkro_login_history') || '[]');
      
      // Deduplicate and enrich user data
      const uniqueUsers = this.deduplicateUsers(allUsers);
      return this.enrichUserData(uniqueUsers);
      
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Get user statistics
  getUserStats() {
    const users = this.getAllUsers();
    const loginHistory = JSON.parse(localStorage.getItem('tinkro_login_history') || '[]');
    const logoutHistory = JSON.parse(localStorage.getItem('tinkro_logout_history') || '[]');
    
    const today = new Date().toDateString();
    const thisWeek = this.getWeekStart(new Date());
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isLoggedIn).length,
      newUsersToday: users.filter(u => 
        new Date(u.createdAt).toDateString() === today
      ).length,
      newUsersThisWeek: users.filter(u => 
        new Date(u.createdAt) >= thisWeek
      ).length,
      totalLogins: loginHistory.length,
      loginsToday: loginHistory.filter(l => 
        new Date(l.timestamp).toDateString() === today
      ).length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      verifiedUsers: users.filter(u => u.emailVerified).length,
      unverifiedUsers: users.filter(u => !u.emailVerified).length
    };
  }

  // Get user activity analytics
  getUserActivity() {
    const loginHistory = JSON.parse(localStorage.getItem('tinkro_login_history') || '[]');
    const logoutHistory = JSON.parse(localStorage.getItem('tinkro_logout_history') || '[]');
    
    // Group by date for last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayLogins = loginHistory.filter(l => 
        new Date(l.timestamp).toDateString() === dateStr
      );
      
      last7Days.push({
        date: date.toLocaleDateString(),
        logins: dayLogins.length,
        methods: this.getLoginMethods(dayLogins)
      });
    }
    
    return {
      weeklyActivity: last7Days,
      loginMethods: this.getOverallLoginMethods(loginHistory),
      averageSessionDuration: this.calculateAverageSessionDuration(logoutHistory)
    };
  }

  // Get recent user registrations
  getRecentRegistrations(limit = 10) {
    const users = this.getAllUsers();
    return users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
      .map(user => ({
        ...user,
        timeAgo: this.getTimeAgo(user.createdAt)
      }));
  }

  // Get active sessions
  getActiveSessions() {
    const users = this.getAllUsers();
    return users
      .filter(u => u.isLoggedIn)
      .map(user => ({
        ...user,
        sessionDuration: this.authService.calculateSessionDuration(user.lastLogin),
        lastActivity: this.getTimeAgo(user.lastLogin)
      }));
  }

  // Get user orders summary
  getUserOrdersSummary(uid) {
    try {
      const orders = JSON.parse(localStorage.getItem(`tinkro_orders_${uid}`) || '[]');
      return {
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
        lastOrder: orders.length > 0 ? orders[orders.length - 1] : null,
        avgOrderValue: orders.length > 0 
          ? orders.reduce((sum, order) => sum + (order.total || 0), 0) / orders.length 
          : 0
      };
    } catch (error) {
      return { totalOrders: 0, totalSpent: 0, lastOrder: null, avgOrderValue: 0 };
    }
  }

  // Helper methods
  deduplicateUsers(users) {
    const seen = new Set();
    return users.filter(user => {
      if (seen.has(user.uid)) return false;
      seen.add(user.uid);
      return true;
    });
  }

  enrichUserData(users) {
    return users.map(user => {
      const ordersSummary = this.getUserOrdersSummary(user.uid);
      return {
        ...user,
        ...ordersSummary,
        joinDate: new Date(user.createdAt).toLocaleDateString(),
        lastLoginFormatted: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
        timeAgo: this.getTimeAgo(user.createdAt)
      };
    });
  }

  getLoginMethods(logins) {
    const methods = {};
    logins.forEach(login => {
      methods[login.method] = (methods[login.method] || 0) + 1;
    });
    return methods;
  }

  getOverallLoginMethods(loginHistory) {
    const methods = {};
    loginHistory.forEach(login => {
      methods[login.method] = (methods[login.method] || 0) + 1;
    });
    
    return Object.entries(methods).map(([method, count]) => ({
      method,
      count,
      percentage: ((count / loginHistory.length) * 100).toFixed(1)
    }));
  }

  calculateAverageSessionDuration(logoutHistory) {
    if (logoutHistory.length === 0) return '0m';
    
    const totalMinutes = logoutHistory.reduce((sum, logout) => {
      const duration = logout.sessionDuration || '0h 0m';
      const matches = duration.match(/(\d+)h\s*(\d+)m/);
      if (matches) {
        return sum + (parseInt(matches[1]) * 60) + parseInt(matches[2]);
      }
      return sum;
    }, 0);
    
    const avgMinutes = Math.floor(totalMinutes / logoutHistory.length);
    const hours = Math.floor(avgMinutes / 60);
    const minutes = avgMinutes % 60;
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return 'Just now';
  }

  getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  // Search and filter users
  searchUsers(query) {
    const users = this.getAllUsers();
    const lowQuery = query.toLowerCase();
    
    return users.filter(user => 
      user.displayName?.toLowerCase().includes(lowQuery) ||
      user.email?.toLowerCase().includes(lowQuery) ||
      user.phoneNumber?.includes(query) ||
      user.role?.toLowerCase().includes(lowQuery)
    );
  }

  // Export user data
  exportUserData() {
    const users = this.getAllUsers();
    const stats = this.getUserStats();
    const activity = this.getUserActivity();
    
    return {
      exportDate: new Date().toISOString(),
      totalUsers: users.length,
      statistics: stats,
      activity: activity,
      users: users.map(user => ({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber,
        role: user.role,
        verified: user.emailVerified,
        joinDate: user.joinDate,
        lastLogin: user.lastLoginFormatted,
        totalOrders: user.totalOrders,
        totalSpent: user.totalSpent,
        loginCount: user.loginCount
      }))
    };
  }
}

const userManagementService = new UserManagementService();
export default userManagementService;