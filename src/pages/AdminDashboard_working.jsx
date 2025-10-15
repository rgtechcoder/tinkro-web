import React, { useState, useEffect } from 'react';
import { Package, Users, IndianRupee, Calendar, LogOut } from 'lucide-react';
import OrderManager from '../services/OrderManager';
import AdminLogin from '../components/AdminLogin';

const AdminDashboard = () => {
  console.log("AdminDashboard - Simple Working Version Loading...");
  
  // States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const orderData = await OrderManager.getAllOrders();
      console.log("Orders loaded:", orderData);
      setOrders(orderData || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
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
  };

  // Calculate stats safely
  const stats = {
    totalOrders: orders?.length || 0,
    totalRevenue: orders?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0,
    todayOrders: orders?.filter(order => {
      if (!order.createdAt) return false;
      const today = new Date().toDateString();
      return new Date(order.createdAt).toDateString() === today;
    }).length || 0,
    avgOrderValue: orders?.length > 0 ? (orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) / orders.length) : 0
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 Tinkro Admin Dashboard</h1>
              <p className="text-gray-600">Manage your robotics business</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          {/* Revenue */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <IndianRupee className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toFixed(0)}</p>
              </div>
            </div>
          </div>
          
          {/* Today's Orders */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayOrders}</p>
              </div>
            </div>
          </div>
          
          {/* Avg Order Value */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-100">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.avgOrderValue.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">📋 Recent Orders</h2>
            <button
              onClick={loadOrders}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <div className={isLoading ? 'animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full' : 'w-4 h-4'}>
                {!isLoading && '🔄'}
              </div>
              <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
            </button>
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
                  {orders && orders.length > 0 ? (
                    orders.slice(0, 10).map((order, index) => (
                      <tr key={order.orderId || index} className="hover:bg-gray-50 transition-colors">
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
      </div>
    </div>
  );
};

export default AdminDashboard;