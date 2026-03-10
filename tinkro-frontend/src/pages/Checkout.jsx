import React from 'react';
import { useParams } from 'react-router-dom';
import CustomerForm from '../components/CustomerForm';

const Checkout = () => {
  const { productId } = useParams();
  // TODO: Fetch product info and price using productId
  // For now, use placeholder price
  const totalPrice = 999;
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
