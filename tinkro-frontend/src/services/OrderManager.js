class OrderManager {
  constructor() {
    this.orders = this.loadOrders();
  }

  // Generate unique order ID
  generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TKR${timestamp}${random}`;
  }

  // Create new order
  createOrder(customerData, cartItems, totalAmount) {
    const orderId = this.generateOrderId();
    
    const order = {
      orderId,
      customer: customerData,
      items: cartItems,
      totalAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      paymentStatus: 'pending'
    };

    this.orders.push(order);
    this.saveOrders();
    
    return order;
  }

  // Update order after payment
  updateOrderPayment(orderId, paymentData) {
    const orderIndex = this.orders.findIndex(order => order.orderId === orderId);
    
    if (orderIndex !== -1) {
      this.orders[orderIndex] = {
        ...this.orders[orderIndex],
        paymentId: paymentData.razorpay_payment_id,
        paymentStatus: 'completed',
        status: 'confirmed',
        updatedAt: new Date().toISOString(),
        razorpayData: paymentData
      };
      
      this.saveOrders();
      return this.orders[orderIndex];
    }
    
    return null;
  }

  // Get order by ID
  getOrder(orderId) {
    return this.orders.find(order => order.orderId === orderId);
  }

  // Get orders by customer email
  getCustomerOrders(email) {
    return this.orders.filter(order => 
      order.customer.email.toLowerCase() === email.toLowerCase()
    );
  }

  // Get all orders
  getAllOrders() {
    return [...this.orders].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Load orders from localStorage
  loadOrders() {
    try {
      const stored = localStorage.getItem('tinkro_orders');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  }

  // Save orders to localStorage
  saveOrders() {
    try {
      localStorage.setItem('tinkro_orders', JSON.stringify(this.orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  }

  // Get order statistics
  getOrderStats() {
    const totalOrders = this.orders.length;
    const completedOrders = this.orders.filter(order => order.paymentStatus === 'completed').length;
    const pendingOrders = totalOrders - completedOrders;
    const totalRevenue = this.orders
      .filter(order => order.paymentStatus === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue
    };
  }
}

export default new OrderManager();