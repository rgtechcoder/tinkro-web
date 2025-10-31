// PromoCode Service for managing discount codes
class PromoCodeService {
  constructor() {
    this.storageKey = 'tinkro_promo_codes';
    this.usageKey = 'tinkro_promo_usage';
    this.initializeDefaultCodes();
  }

  // Initialize some default promo codes
  initializeDefaultCodes() {
    const existingCodes = this.getAllPromoCodes();
    if (existingCodes.length === 0) {
      const defaultCodes = [
        {
          id: 'WELCOME10',
          code: 'WELCOME10',
          type: 'percentage', // percentage or fixed
          value: 10, // 10% or ₹10
          minOrder: 500,
          maxDiscount: 100,
          description: 'Welcome offer - 10% off on orders above ₹500',
          expiryDate: '2025-12-31',
          usageLimit: 100,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'SAVE50',
          code: 'SAVE50',
          type: 'fixed',
          value: 50,
          minOrder: 300,
          maxDiscount: 50,
          description: 'Flat ₹50 off on orders above ₹300',
          expiryDate: '2025-11-30',
          usageLimit: 50,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'MEGA20',
          code: 'MEGA20',
          type: 'percentage',
          value: 20,
          minOrder: 1000,
          maxDiscount: 200,
          description: 'Mega deal - 20% off on orders above ₹1000',
          expiryDate: '2025-12-25',
          usageLimit: 25,
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];
      
      localStorage.setItem(this.storageKey, JSON.stringify(defaultCodes));
    }
  }

  // Get all promo codes
  getAllPromoCodes() {
    try {
      const codes = localStorage.getItem(this.storageKey);
      return codes ? JSON.parse(codes) : [];
    } catch (error) {
      console.error('Error getting promo codes:', error);
      return [];
    }
  }

  // Get promo code usage data
  getPromoUsage() {
    try {
      const usage = localStorage.getItem(this.usageKey);
      return usage ? JSON.parse(usage) : {};
    } catch (error) {
      console.error('Error getting promo usage:', error);
      return {};
    }
  }

  // Validate promo code
  validatePromoCode(code, orderAmount) {
    const promoCodes = this.getAllPromoCodes();
    const usage = this.getPromoUsage();
    
    const promoCode = promoCodes.find(p => 
      p.code.toUpperCase() === code.toUpperCase() && p.isActive
    );

    if (!promoCode) {
      return {
        isValid: false,
        error: 'Invalid promo code'
      };
    }

    // Check expiry
    if (new Date() > new Date(promoCode.expiryDate)) {
      return {
        isValid: false,
        error: 'Promo code has expired'
      };
    }

    // Check minimum order amount
    if (orderAmount < promoCode.minOrder) {
      return {
        isValid: false,
        error: `Minimum order amount is ₹${promoCode.minOrder}`
      };
    }

    // Check usage limit
    const currentUsage = usage[promoCode.id] || 0;
    if (currentUsage >= promoCode.usageLimit) {
      return {
        isValid: false,
        error: 'Promo code usage limit exceeded'
      };
    }

    return {
      isValid: true,
      promoCode: promoCode
    };
  }

  // Calculate discount
  calculateDiscount(promoCode, orderAmount) {
    let discount = 0;

    if (promoCode.type === 'percentage') {
      discount = (orderAmount * promoCode.value) / 100;
      if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
        discount = promoCode.maxDiscount;
      }
    } else if (promoCode.type === 'fixed') {
      discount = promoCode.value;
      if (discount > orderAmount) {
        discount = orderAmount;
      }
    }

    return Math.floor(discount); // Round down to nearest rupee
  }

  // Apply promo code
  applyPromoCode(code, orderAmount) {
    const validation = this.validatePromoCode(code, orderAmount);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      };
    }

    const discount = this.calculateDiscount(validation.promoCode, orderAmount);
    const finalAmount = orderAmount - discount;

    return {
      success: true,
      promoCode: validation.promoCode,
      discount: discount,
      originalAmount: orderAmount,
      finalAmount: finalAmount,
      savings: discount
    };
  }

  // Mark promo code as used
  usePromoCode(codeId) {
    const usage = this.getPromoUsage();
    usage[codeId] = (usage[codeId] || 0) + 1;
    localStorage.setItem(this.usageKey, JSON.stringify(usage));
  }

  // Add new promo code (for admin)
  addPromoCode(promoData) {
    const promoCodes = this.getAllPromoCodes();
    
    // Check if code already exists
    const exists = promoCodes.some(p => 
      p.code.toUpperCase() === promoData.code.toUpperCase()
    );
    
    if (exists) {
      return {
        success: false,
        error: 'Promo code already exists'
      };
    }

    const newPromoCode = {
      id: promoData.code.toUpperCase(),
      ...promoData,
      code: promoData.code.toUpperCase(),
      createdAt: new Date().toISOString()
    };

    promoCodes.push(newPromoCode);
    localStorage.setItem(this.storageKey, JSON.stringify(promoCodes));

    return {
      success: true,
      promoCode: newPromoCode
    };
  }

  // Update promo code status
  updatePromoCode(codeId, updates) {
    const promoCodes = this.getAllPromoCodes();
    const index = promoCodes.findIndex(p => p.id === codeId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Promo code not found'
      };
    }

    promoCodes[index] = {
      ...promoCodes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(promoCodes));
    
    return {
      success: true,
      promoCode: promoCodes[index]
    };
  }

  // Get promo code statistics
  getPromoStats() {
    const promoCodes = this.getAllPromoCodes();
    const usage = this.getPromoUsage();
    
    return promoCodes.map(promo => ({
      ...promo,
      timesUsed: usage[promo.id] || 0,
      remainingUses: promo.usageLimit - (usage[promo.id] || 0),
      isExpired: new Date() > new Date(promo.expiryDate)
    }));
  }

  // Delete promo code
  deletePromoCode(codeId) {
    const promoCodes = this.getAllPromoCodes();
    const filtered = promoCodes.filter(p => p.id !== codeId);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    
    return {
      success: true,
      message: 'Promo code deleted successfully'
    };
  }
}

// Export singleton instance
const promoCodeService = new PromoCodeService();
export default promoCodeService;