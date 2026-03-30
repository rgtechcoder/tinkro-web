import React from 'react';
import { useParams } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';

const Checkout = () => {
  const { productId } = useParams();
  // Get product from localStorage tinkro_buy_now
  let product = null;
  try {
    const buyNowArr = JSON.parse(localStorage.getItem('tinkro_buy_now') || '[]');
    if (Array.isArray(buyNowArr)) {
      product = buyNowArr.find(p => String(p.id) === String(productId)) || buyNowArr[0];
    }
  } catch (e) {}
  const totalPrice = product?.price || 0;
  const handleSubmit = (data) => {
    // Handle order submission
    alert('Order placed!');
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg">
        <CustomerForm onSubmit={handleSubmit} totalPrice={totalPrice} onCancel={() => window.history.back()} />
      </div>
    </div>
  );
};

export default Checkout;
