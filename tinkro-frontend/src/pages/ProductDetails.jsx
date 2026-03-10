import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProductDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  // TODO: Fetch product details using productId
  // For now, show placeholder
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-4">Product Details (ID: {productId})</h1>
      {/* Product image, title, price, description, etc. */}
      <div className="h-48 w-full bg-gray-200 rounded mb-4 flex items-center justify-center">Image</div>
      <p className="mb-2">Product description goes here...</p>
      <p className="mb-4 font-semibold">Price: ₹999</p>
      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded"
        onClick={() => navigate(`/checkout/${productId}`)}
      >
        Buy Now
      </button>
    </div>
  );
};

export default ProductDetails;
