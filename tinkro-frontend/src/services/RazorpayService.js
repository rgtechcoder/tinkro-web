// RazorpayService.js - Enhanced Payment Service with Testing
export class RazorpayService {
  constructor() {
    this.keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    this.isTestMode = this.keyId?.startsWith('rzp_test_');
    this.initializeRazorpay();
  }

  initializeRazorpay() {
    // Check if Razorpay script is loaded
    if (typeof window.Razorpay === 'undefined') {
      console.error('Razorpay SDK not loaded. Please include the script tag.');
      return false;
    }

    if (!this.keyId) {
      console.error('Razorpay Key ID not found in environment variables');
      return false;
    }

    console.log('Razorpay initialized:', {
      keyId: this.keyId.substring(0, 10) + '...',
      isTestMode: this.isTestMode
    });

    return true;
  }

  // Test Razorpay Configuration
  testConnection() {
    return new Promise((resolve) => {
      try {
        if (!this.initializeRazorpay()) {
          resolve({
            success: false,
            error: 'SDK_NOT_LOADED',
            message: 'Razorpay SDK is not loaded'
          });
          return;
        }

        // Test with minimal configuration
        const testOptions = {
          key: this.keyId,
          amount: 100, // ₹1 for testing
          currency: 'INR',
          name: 'Tinkro Test',
          description: 'Connection Test',
          handler: (response) => {
            resolve({
              success: true,
              message: 'Razorpay connection successful',
              paymentId: response.razorpay_payment_id
            });
          },
          modal: {
            ondismiss: () => {
              resolve({
                success: false,
                error: 'USER_CANCELLED',
                message: 'Payment cancelled by user'
              });
            }
          }
        };

        const rzp = new window.Razorpay(testOptions);
        
        // Test if we can create instance
        resolve({
          success: true,
          message: 'Razorpay SDK loaded and configured correctly',
          testMode: this.isTestMode
        });

      } catch (error) {
        resolve({
          success: false,
          error: error.message,
          message: 'Error initializing Razorpay'
        });
      }
    });
  }

  // Create Payment Order
  createOrder(orderData) {
    return new Promise((resolve) => {
      try {
        if (!this.initializeRazorpay()) {
          resolve({
            success: false,
            error: 'SDK_NOT_LOADED'
          });
          return;
        }

        const orderId = 'ORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        const options = {
          key: this.keyId,
          amount: Math.round(orderData.amount * 100), // Convert to paise
          currency: orderData.currency || 'INR',
          name: orderData.companyName || 'Tinkro',
          description: orderData.description || 'Purchase from Tinkro',
          order_id: orderId,
          
          // Customer details
          prefill: {
            name: orderData.customer?.name || '',
            email: orderData.customer?.email || '',
            contact: orderData.customer?.phone || ''
          },

          // Payment success handler
          handler: (response) => {
            console.log('Payment successful:', response);
            
            const paymentData = {
              razorpay_order_id: orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature || '',
              amount: orderData.amount,
              currency: orderData.currency || 'INR',
              timestamp: new Date().toISOString(),
              customer: orderData.customer,
              items: orderData.items || []
            };

            // Save payment to localStorage for order history
            this.savePaymentRecord(paymentData);

            resolve({
              success: true,
              payment: paymentData,
              message: 'Payment completed successfully!'
            });
          },

          // Payment modal configuration
          modal: {
            ondismiss: () => {
              resolve({
                success: false,
                error: 'USER_CANCELLED',
                message: 'Payment cancelled by user'
              });
            },
            
            // Escape key handler
            escape: true,
            
            // Animation
            animation: true
          },

          // Theme customization
          theme: {
            color: '#FF6B35' // Tinkro orange color
          },

          // Test mode notifications
          notes: {
            company: 'Tinkro Edutech LLP',
            environment: this.isTestMode ? 'test' : 'live'
          }
        };

        console.log('Creating Razorpay order:', {
          orderId,
          amount: options.amount,
          testMode: this.isTestMode
        });

        const rzp = new window.Razorpay(options);
        
        // Handle payment failure
        rzp.on('payment.failed', (response) => {
          console.error('Payment failed:', response.error);
          
          resolve({
            success: false,
            error: response.error.code,
            message: response.error.description,
            details: response.error
          });
        });

        // Open payment modal
        rzp.open();

      } catch (error) {
        console.error('Error creating Razorpay order:', error);
        resolve({
          success: false,
          error: error.message,
          message: 'Failed to initialize payment'
        });
      }
    });
  }

  // Save payment record to localStorage
  savePaymentRecord(paymentData) {
    try {
      const payments = JSON.parse(localStorage.getItem('tinkro_payments') || '[]');
      payments.push({
        ...paymentData,
        id: 'PAY_' + Date.now(),
        status: 'completed',
        createdAt: new Date().toISOString()
      });
      
      // Keep only last 100 payments
      if (payments.length > 100) {
        payments.splice(0, payments.length - 100);
      }
      
      localStorage.setItem('tinkro_payments', JSON.stringify(payments));
    } catch (error) {
      console.error('Error saving payment record:', error);
    }
  }

  // Get payment history
  getPaymentHistory() {
    try {
      return JSON.parse(localStorage.getItem('tinkro_payments') || '[]')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error retrieving payment history:', error);
      return [];
    }
  }

  // Test payment with ₹1
  testPayment() {
    return this.createOrder({
      amount: 1,
      description: 'Test Payment - ₹1',
      customer: {
        name: 'Test User',
        email: 'test@tinkro.com',
        phone: '9999999999'
      },
      items: [
        {
          name: 'Test Item',
          price: 1,
          quantity: 1
        }
      ]
    });
  }

  // Get Razorpay status
  getStatus() {
    return {
      sdkLoaded: typeof window.Razorpay !== 'undefined',
      keyConfigured: !!this.keyId,
      testMode: this.isTestMode,
      keyId: this.keyId ? this.keyId.substring(0, 10) + '...' : 'Not configured'
    };
  }

  // Verify payment (client-side basic verification)
  verifyPayment(paymentData) {
    // Basic client-side verification
    const requiredFields = ['razorpay_payment_id', 'razorpay_order_id'];
    
    for (const field of requiredFields) {
      if (!paymentData[field]) {
        return {
          success: false,
          error: 'MISSING_FIELD',
          message: `Missing required field: ${field}`
        };
      }
    }

    return {
      success: true,
      message: 'Payment data verified (basic check)'
    };
  }
}

// Export singleton instance
const razorpayService = new RazorpayService();
export default razorpayService;