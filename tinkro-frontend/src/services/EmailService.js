import emailjs from '@emailjs/browser';

class EmailService {
  constructor() {
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    // Initialize EmailJS
    if (this.publicKey) {
      emailjs.init(this.publicKey);
    }
  }

  async sendOrderConfirmation(orderData) {
    try {
      const templateParams = {
        to_email: orderData.email,
        customer_name: orderData.name,
        order_id: orderData.orderId,
        payment_id: orderData.paymentId,
        total_amount: orderData.totalAmount,
        order_date: new Date().toLocaleDateString('en-IN'),
        customer_phone: orderData.phone,
        customer_address: orderData.address,
        cart_items: this.formatCartItems(orderData.cartItems),
        company_name: 'Tinkro',
        company_email: 'hello@tinkro.in',
        company_phone: '+91-XXXXXXXXXX'
      };

      const result = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('Email sent successfully:', result);
      return { success: true, result };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }
  }

  formatCartItems(cartItems) {
    return cartItems.map(item => 
      `• ${item.title} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
  }

  // Alternative: Simple webhook notification
  async sendWebhookNotification(orderData) {
    try {
      const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;
      
      if (!webhookUrl) {
        console.log('No webhook URL configured');
        return;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'order_created',
          order: orderData,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        console.log('Webhook notification sent successfully');
      } else {
        console.error('Webhook notification failed');
      }
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }
}

export default new EmailService();