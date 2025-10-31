import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, X, Gift, Tag, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PromoCodeService from '../services/PromoCodeService';

const CustomerForm = ({ onSubmit, totalPrice, onCancel }) => {
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});
  
  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [finalPrice, setFinalPrice] = useState(totalPrice);

  const validateForm = () => {
    const newErrors = {};
    
    if (!customerData.name.trim()) newErrors.name = 'Name is required';
    if (!customerData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(customerData.email)) newErrors.email = 'Invalid email';
    if (!customerData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(customerData.phone)) newErrors.phone = 'Invalid phone number';
    if (!customerData.address.trim()) newErrors.address = 'Address is required';
    if (!customerData.city.trim()) newErrors.city = 'City is required';
    if (!customerData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(customerData.pincode)) newErrors.pincode = 'Invalid pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(customerData);
    }
  };

  const handleChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation - clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Show required field error immediately if field becomes empty
    if (!value.trim() && field !== '') {
      const fieldNames = {
        name: 'Name is required',
        email: 'Email is required',
        phone: 'Phone is required',
        address: 'Address is required',
        city: 'City is required',
        pincode: 'Pincode is required'
      };
      
      setTimeout(() => {
        if (!customerData[field]?.trim()) {
          setErrors(prev => ({ ...prev, [field]: fieldNames[field] || 'This field is required' }));
        }
      }, 1000); // Show error after 1 second of inactivity
    }
  };

  // Promo code functions
  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setIsApplyingPromo(true);
    setPromoError('');

    try {
      const result = PromoCodeService.applyPromoCode(promoCode.trim(), totalPrice);
      
      if (result.success) {
        setAppliedPromo(result);
        setFinalPrice(result.finalAmount);
        setPromoError('');
      } else {
        setPromoError(result.error);
        setAppliedPromo(null);
        setFinalPrice(totalPrice);
      }
    } catch (error) {
      setPromoError('Failed to apply promo code');
      setAppliedPromo(null);
      setFinalPrice(totalPrice);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setAppliedPromo(null);
    setPromoError('');
    setFinalPrice(totalPrice);
  };

  const handleSubmitWithPromo = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = {
        ...customerData,
        appliedPromo: appliedPromo,
        originalPrice: totalPrice,
        finalPrice: finalPrice,
        discount: appliedPromo ? appliedPromo.discount : 0
      };
      onSubmit(submissionData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto relative z-10 mt-4 mb-4 max-h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header with Close Button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-center flex-1">Billing Details</h3>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      {/* Required fields message */}
      <p className="text-sm text-gray-600 text-center mb-6">
        All fields marked with <span className="text-red-500">*</span> are required
      </p>
      
      <form onSubmit={handleSubmitWithPromo} className="space-y-4">
        {/* Name Field */}
        <div>
          {/* OLD: Full Name (without asterisk and required) */}
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 mr-2" />
            {/* OLD: Full Name */}
            Full Name <span className="text-red-500 ml-1">*</span> {/* NEW: Added red asterisk */}
          </label>
          <input
            type="text"
            value={customerData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
            style={{ pointerEvents: 'auto' }}
            required // NEW: Added required attribute
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 mr-2" />
            Email Address <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            value={customerData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4 mr-2" />
            Phone Number <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="tel"
            value={customerData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
            required
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Address Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 mr-2" />
            Address <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={customerData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your complete address"
            rows="2"
            required
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* City and Pincode */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              City <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={customerData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="City"
              required
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Pincode <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={customerData.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.pincode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Pincode"
              required
            />
            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mt-6 border border-purple-200">
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Gift className="w-4 h-4 mr-2 text-purple-600" />
            Have a Promo Code?
          </label>
          
          {!appliedPromo ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoError('');
                    }}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter promo code"
                  />
                </div>
                <Button
                  type="button"
                  onClick={applyPromoCode}
                  disabled={isApplyingPromo || !promoCode.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplyingPromo ? 'Applying...' : 'Apply'}
                </Button>
              </div>
              
              {promoError && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <X className="w-3 h-3 mr-1" />
                  {promoError}
                </p>
              )}
              
              {/* Available Promo Codes Hint */}
              <div className="text-xs text-gray-500 bg-white p-2 rounded border-l-4 border-purple-400">
                <p className="font-medium mb-1">💡 Try these codes:</p>
                <p><span className="font-mono bg-gray-100 px-1 rounded">WELCOME10</span> - 10% off on ₹500+</p>
                <p><span className="font-mono bg-gray-100 px-1 rounded">SAVE50</span> - ₹50 off on ₹300+</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
                <div className="flex items-center text-green-700">
                  <Percent className="w-4 h-4 mr-2" />
                  <span className="font-medium">{appliedPromo.promoCode.code}</span>
                  <span className="ml-2 text-sm">({appliedPromo.promoCode.description})</span>
                </div>
                <button
                  type="button"
                  onClick={removePromoCode}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove promo code"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-green-600 text-sm font-medium">
                🎉 You saved ₹{appliedPromo.discount}!
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-md mt-6">
          <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{totalPrice}</span>
            </div>
            
            {appliedPromo && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({appliedPromo.promoCode.code}):</span>
                <span>-₹{appliedPromo.discount}</span>
              </div>
            )}
            
            <hr className="my-2" />
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className={appliedPromo ? 'text-green-600' : 'text-blue-600'}>
                ₹{finalPrice}
              </span>
            </div>
            
            {appliedPromo && (
              <p className="text-xs text-green-600 text-center mt-2">
                💰 You saved ₹{appliedPromo.discount} with {appliedPromo.promoCode.code}!
              </p>
            )}
          </div>
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm font-medium mb-1">
              ⚠️ Please fix the following errors:
            </p>
            <ul className="text-red-600 text-xs space-y-1">
              {Object.values(errors).map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className={`w-full py-3 mt-6 cursor-pointer relative z-10 transition-all duration-300 ${
            Object.keys(errors).length === 0 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-400 hover:bg-gray-500 text-white opacity-75'
          }`}
          style={{ pointerEvents: 'auto' }}
        >
          Proceed to Payment ₹{totalPrice}
        </Button>
      </form>
    </motion.div>
  );
};

export default CustomerForm;