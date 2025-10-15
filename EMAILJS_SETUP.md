# 📧 EmailJS Setup Guide for Tinkro Payment System

## 🚀 Quick Setup (5 minutes)

### 1. Create EmailJS Account
- Visit: https://www.emailjs.com/
- Sign up for FREE account
- Verify your email

### 2. Create Email Service
```
Dashboard → Add New Service → Gmail (or any provider)
- Service Name: "Tinkro Orders"
- Connect your Gmail account
- Copy SERVICE ID
```

### 3. Create Email Template
```
Dashboard → Email Templates → Create New Template
- Template Name: "Order Confirmation"
- Use this template content:
```

## 📧 Email Template Content:

```html
Subject: Order Confirmed! 🎉 Your Tinkro Purchase #{order_id}

<!DOCTYPE html>
<html>
<head>
    <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial; }
        .header { background: linear-gradient(135deg, #3B82F6, #F59E0B); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .order-details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .button { background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your purchase, {{customer_name}}!</p>
        </div>
        
        <div class="content">
            <h2>Order Details</h2>
            <div class="order-details">
                <p><strong>Order ID:</strong> {{order_id}}</p>
                <p><strong>Payment ID:</strong> {{payment_id}}</p>
                <p><strong>Total Amount:</strong> ₹{{total_amount}}</p>
                <p><strong>Order Date:</strong> {{order_date}}</p>
            </div>

            <h3>Items Ordered:</h3>
            <pre>{{cart_items}}</pre>

            <h3>Delivery Address:</h3>
            <p>{{customer_address}}</p>
            <p><strong>Phone:</strong> {{customer_phone}}</p>
        </div>

        <div class="footer">
            <p>Questions? Contact us at {{company_email}} or {{company_phone}}</p>
            <p>© 2024 {{company_name}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### 4. Update .env file with your credentials:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id  
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

## 🔧 Alternative: Simple Email Setup (No EmailJS)

If you want to skip EmailJS for now, the system will work without it. Just customer order management will be active.

## 📊 Features Included:

✅ **Professional Checkout Form**
- Customer name, email, phone validation
- Complete billing address
- Professional UI with animations

✅ **Order Management**
- Unique Order IDs (TKR...)
- Order tracking in localStorage
- Payment status tracking

✅ **Email Notifications**
- Automatic confirmation emails
- Order details included
- Professional template

✅ **Enhanced User Experience**
- Multi-step checkout process
- Form validations
- Loading states
- Success/error messages

## 🚀 Ready to Test!

After setting up EmailJS (or skipping it), your professional payment system is ready with:
- Customer details collection
- Automatic emails
- Order tracking
- Professional UI

Your customers will get a complete e-commerce experience! 🛒✨