import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import CustomerForm from './CustomerForm';
import EmailService from '../services/EmailService';
import OrderManager from '../services/OrderManager';

const Cart = ({ isOpen, setIsOpen, cartItems, updateQuantity, removeItem, totalPrice }) => {
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const handleInitialCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to cart before checkout.",
        duration: 2500,
      });
      return;
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    
    if (!razorpayKey || razorpayKey === 'rzp_test_your_key_id_here') {
      toast({
        title: "Payment Setup Required",
        description: "Please configure Razorpay keys in .env file to enable payments.",
        duration: 3000,
      });
      return;
    }

    // Show customer form instead of direct payment
    setShowCustomerForm(true);
  };

  const handleCustomerFormSubmit = async (customerData) => {
    console.log("Starting payment process for:", customerData);
    
    // Extract promo information
    const finalAmount = customerData.finalPrice || totalPrice;
    const originalAmount = customerData.originalPrice || totalPrice;
    const appliedPromo = customerData.appliedPromo;
    const discount = customerData.discount || 0;
    
    console.log("Payment amounts:", { originalAmount, finalAmount, discount, appliedPromo });
    
    // Create order in system with promo details
    const orderData = {
      ...customerData,
      originalAmount,
      finalAmount,
      discount,
      appliedPromo
    };
    const order = OrderManager.createOrder(orderData, cartItems, finalAmount);
    setCurrentOrder(order);

    // If promo code was used, mark it as used
    if (appliedPromo) {
      try {
        const PromoCodeService = (await import('../services/PromoCodeService')).default;
        PromoCodeService.usePromoCode(appliedPromo.promoCode.id);
        console.log("Promo code usage recorded:", appliedPromo.promoCode.code);
      } catch (error) {
        console.error("Failed to record promo usage:", error);
      }
    }

    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    console.log("Using Razorpay key:", razorpayKey);

    // Simple, working Razorpay options
    const options = {
      key: razorpayKey,
      amount: finalAmount * 100, // Convert to paise (use discounted amount)
      currency: 'INR',
      name: 'Tinkro Edutech',
      description: appliedPromo 
        ? `Order #${order.orderId} (${appliedPromo.promoCode.code} applied - Save ₹${discount})`
        : `Order #${order.orderId}`,
      image: '/logo.png', // Optional logo
      handler: function (response) {
        console.log("Payment successful:", response);
        
        try {
          // Update order with payment details
          OrderManager.updateOrderPayment(order.orderId, response);
          
          // Show success message
          const successMessage = appliedPromo 
            ? `Order ID: ${order.orderId}\nPayment ID: ${response.razorpay_payment_id}\n💰 You saved ₹${discount} with ${appliedPromo.promoCode.code}!`
            : `Order ID: ${order.orderId}\nPayment ID: ${response.razorpay_payment_id}`;
            
          toast({
            title: "🎉 Payment Successful!",
            description: successMessage,
            duration: 6000,
          });
          
          // Clear cart and close modals
          cartItems.forEach(item => removeItem(item.id));
          setShowCustomerForm(false);
          setIsOpen(false);
          
          // Try to send email (non-blocking)
          try {
            const emailData = {
              ...customerData,
              orderId: order.orderId,
              paymentId: response.razorpay_payment_id,
              originalAmount: originalAmount,
              totalAmount: finalAmount,
              discount: discount,
              appliedPromo: appliedPromo,
              cartItems: cartItems
            };
            EmailService.sendOrderConfirmation(emailData);
          } catch (emailError) {
            console.log("Email sending failed, but order is confirmed");
          }
          
        } catch (error) {
          console.error('Order processing error:', error);
          toast({
            title: "Payment Received ✅",
            description: "Payment successful! Order details saved.",
            duration: 3000,
          });
        }
      },
      prefill: {
        name: customerData.name,
        email: customerData.email,
        contact: customerData.phone,
      },
      theme: {
        color: '#3B82F6',
      },
      modal: {
        ondismiss: function() {
          toast({
            title: "Payment cancelled",
            description: "You can retry payment anytime.",
            duration: 2500,
          });
        },
      },
    };

    try {
      if (typeof window.Razorpay !== 'undefined') {
        console.log('Initializing Razorpay with key:', razorpayKey.substring(0, 15) + '...');
        const rzp = new window.Razorpay({
          ...options,
          handler: async function(response) {
            try {
              console.log('Payment successful:', response);
              
              // Update order with payment details
              const updatedOrder = OrderManager.updateOrderPayment(order.orderId, response);
              
              // Prepare email data
              const emailData = {
                ...customerData,
                orderId: order.orderId,
                paymentId: response.razorpay_payment_id,
                totalAmount: totalPrice,
                cartItems: cartItems
              };
              
              // Send confirmation email
              await EmailService.sendOrderConfirmation(emailData);
              
              toast({
                title: "Order Confirmed! 🎉",
                description: `Order ID: ${order.orderId}\nPayment ID: ${response.razorpay_payment_id}`,
                duration: 5000,
              });
              
              // Clear cart and close modals
              cartItems.forEach(item => removeItem(item.id));
              setShowCustomerForm(false);
              setIsOpen(false);
              
            } catch (error) {
              console.error('Post-payment error:', error);
              toast({
                title: "Payment Successful ✅",
                description: "Order confirmed! Email notification may be delayed.",
                duration: 3000,
              });
            }
          },
          modal: {
            ondismiss: function() {
              toast({
                title: "Payment Cancelled",
                description: "You can retry payment anytime from your orders.",
                duration: 2500,
              });
            },
            onhidden: function() {
              console.log('Payment modal closed');
            }
          }
        });
        
        rzp.on('payment.failed', function(response) {
          console.error('Payment failed:', response.error);
          toast({
            title: "Payment Failed",
            description: `Error: ${response.error.description || 'Please try again with different payment method'}`,
            duration: 4000,
          });
        });
        
        rzp.open();
      } else {
        console.error('Razorpay SDK not loaded');
        toast({
          title: "Payment System Error",
          description: "Payment system not available. Please refresh and try again.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast({
        title: "Payment Setup Error",
        description: "Unable to initialize payment. Please contact support.",
        duration: 3000,
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => {
              if (!showCustomerForm) {
                setIsOpen(false);
              }
            }}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-blue-600 font-bold">₹{item.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-600">₹{totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                  onClick={handleInitialCheckout}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>
            )}
          </motion.div>

        </>
      )}

      {/* Customer Form Modal - Outside cart container */}
      <AnimatePresence>
        {showCustomerForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4"
            onClick={() => setShowCustomerForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full"
            >
              <Button
                variant="ghost" 
                size="icon"
                className="absolute -top-2 -right-2 z-10 bg-white rounded-full shadow-lg hover:bg-gray-100"
                onClick={() => setShowCustomerForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CustomerForm 
                onSubmit={handleCustomerFormSubmit}
                totalPrice={totalPrice}
                onCancel={() => setShowCustomerForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default Cart;