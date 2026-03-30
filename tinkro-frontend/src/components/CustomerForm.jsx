
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, X, Gift, Tag, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PromoCodeService from '../services/PromoCodeService';

const CustomerForm = ({ onSubmit, totalPrice, onCancel, currentUserEmail }) => {
  const [addresses] = useState([
    {
      id: 1,
      label: 'WORK',
      name: 'Ravi Tech',
      address: 'Indore, Indore, Madhya Pradesh - 452010',
      phone: '9907725429',
      email: currentUserEmail || 'ravitech@gmail.com',
    },
  ]);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || null);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: currentUserEmail ? currentUserEmail : '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
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

  const handleChange = (field, value) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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
      className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-2"
      style={{ boxShadow: 'none' }}
      onClick={e => e.stopPropagation()}
    >
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-blue-100/60 relative overflow-hidden max-h-[90vh] my-4 flex flex-col" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)' }}>
        {/* Decorative Top Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400" />
        <form onSubmit={handleSubmitWithPromo} className="px-6 pt-6 pb-2 flex-1 overflow-y-auto w-full" style={{ minHeight: 0, maxHeight: 'calc(90vh - 32px)' }}>
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-extrabold text-blue-800 tracking-tight flex-1 text-left drop-shadow-sm">Checkout</h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-blue-100 rounded-full transition-colors ml-2"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-blue-400" />
          </button>
        </div>

        {/* Saved Addresses Section */}
        {addresses.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-base text-blue-700">Saved Address</span>
              <button
                type="button"
                className="text-blue-500 text-xs hover:underline"
                onClick={() => alert('Add New Address logic here')}
              >
                + Add New Address
              </button>
            </div>
            <div
              className={`border rounded-lg p-3 bg-blue-50 cursor-pointer mb-1 transition-all duration-200 flex flex-col gap-1 ${selectedAddress ? 'border-blue-400 shadow' : 'border-gray-200'}`}
              onClick={() => setSelectedAddress(addresses[0])}
              style={{ boxShadow: selectedAddress ? '0 2px 8px rgba(59,130,246,0.08)' : '' }}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-gray-800">{addresses[0].name}</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{addresses[0].label}</span>
              </div>
              <div className="text-gray-700 text-xs">{addresses[0].address}</div>
              <div className="text-gray-500 text-xs">{addresses[0].phone}</div>
            </div>
          </div>
        )}

        {/* Required fields message */}
        <p className="text-xs text-gray-500 text-left mb-3">
          All fields marked with <span className="text-red-500">*</span> are required
        </p>

        {/* Name Field */}
        <div className="mb-3">
          <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
            <User className="w-4 h-4 mr-1 text-blue-400" />
            Full Name <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={customerData.name}
            onChange={e => handleChange('name', e.target.value)}
            className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your full name"
            style={{ pointerEvents: 'auto' }}
            required
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
            <Mail className="w-4 h-4 mr-1 text-blue-400" />
            Email Address <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            value={customerData.email}
            disabled
            className="w-full px-3 py-1.5 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300 text-sm"
            placeholder="Enter your email"
            required
          />
          <p className="text-xs text-gray-400 mt-1">This is your account email. Orders will be linked to this email.</p>
        </div>

        {/* Phone Field */}
        <div className="mb-3">
          <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
            <Phone className="w-4 h-4 mr-1 text-blue-400" />
            Phone Number <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="tel"
            value={customerData.phone}
            onChange={e => handleChange('phone', e.target.value)}
            className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your phone number"
            required
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Address Field */}
        <div className="mb-3">
          <label className="flex items-center text-xs font-medium text-gray-700 mb-1">
            <MapPin className="w-4 h-4 mr-1 text-blue-400" />
            Address <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={customerData.address}
            onChange={e => handleChange('address', e.target.value)}
            className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your complete address"
            rows="2"
            required
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        {/* City and Pincode */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              City <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={customerData.city}
              onChange={e => handleChange('city', e.target.value)}
              className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="City"
              required
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              Pincode <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={customerData.pincode}
              onChange={e => handleChange('pincode', e.target.value)}
              className={`w-full px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Pincode"
              required
            />
            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg mt-4 border border-purple-100 shadow-sm">
          <label className="flex items-center text-xs font-medium text-gray-700 mb-2">
            <Gift className="w-4 h-4 mr-1 text-purple-500" />
            Have a Promo Code?
          </label>
          {!appliedPromo ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Tag className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoError('');
                    }}
                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white text-sm"
                    placeholder="Enter promo code"
                  />
                </div>
                <Button
                  type="button"
                  onClick={applyPromoCode}
                  disabled={isApplyingPromo || !promoCode.trim()}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed shadow text-xs"
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
              <div className="text-xs text-gray-500 bg-white p-1 rounded border-l-4 border-purple-300 mt-1">
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
        <div className="bg-gray-50 p-3 rounded-lg mt-4 shadow-sm border border-gray-100">
          <h4 className="font-semibold text-blue-700 mb-2 text-base">Order Summary</h4>
          <div className="space-y-1 text-xs">
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
            <div className="flex justify-between text-base font-bold">
              <span>Total Amount:</span>
              <span className={appliedPromo ? 'text-green-600' : 'text-blue-600'}>
                ₹{finalPrice}
              </span>
            </div>
            {appliedPromo && (
              <p className="text-xs text-green-600 text-center mt-1">
                💰 You saved ₹{appliedPromo.discount} with {appliedPromo.promoCode.code}!
              </p>
            )}
          </div>
        </div>

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-2">
            <p className="text-red-600 text-xs font-medium mb-1">
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
          className={`w-full py-2 mt-6 cursor-pointer relative z-10 transition-all duration-300 text-base font-semibold rounded-lg shadow-md ${Object.keys(errors).length === 0 ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white' : 'bg-gray-400 hover:bg-gray-500 text-white opacity-75'}`}
          style={{ pointerEvents: 'auto' }}
        >
          Proceed to Payment ₹{finalPrice}
        </Button>
        </form>
        {/* Decorative Bottom Bar - subtle, no radius */}
        <div className="h-2 w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400" />
      </div>
    </motion.div>
  );
};

export default CustomerForm;