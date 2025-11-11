class RewardService {
  static POINTS_PER_ORDER = 20;
  static POINTS_FOR_COUPON = 200;
  static COUPON_VALUE = 100; // ₹100 discount

  // Get user's current reward points
  static getUserRewardPoints(userId) {
    const userData = JSON.parse(localStorage.getItem('tinkro_current_user'));
    return userData?.rewardPoints || 0;
  }

  // Add reward points for order
  static addRewardPoints(userId, orderAmount) {
    const userData = JSON.parse(localStorage.getItem('tinkro_current_user'));
    if (!userData) return;

    const currentPoints = userData.rewardPoints || 0;
    const newPoints = currentPoints + this.POINTS_PER_ORDER;
    
    userData.rewardPoints = newPoints;
    userData.stats = {
      ...userData.stats,
      totalOrders: (userData.stats?.totalOrders || 0) + 1,
      totalSpent: (userData.stats?.totalSpent || 0) + orderAmount
    };

    localStorage.setItem('tinkro_current_user', JSON.stringify(userData));

    // Check if user can generate coupon
    if (newPoints >= this.POINTS_FOR_COUPON) {
      return {
        pointsAdded: this.POINTS_PER_ORDER,
        totalPoints: newPoints,
        canGenerateCoupon: true,
        newTotal: newPoints
      };
    }

    return {
      pointsAdded: this.POINTS_PER_ORDER,
      totalPoints: newPoints,
      canGenerateCoupon: false
    };
  }

  // Generate coupon from reward points
  static generateCoupon() {
    const userData = JSON.parse(localStorage.getItem('tinkro_current_user'));
    if (!userData || userData.rewardPoints < this.POINTS_FOR_COUPON) {
      return { success: false, message: 'Insufficient reward points' };
    }

    const couponCode = 'REWARD' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const coupon = {
      code: couponCode,
      value: this.COUPON_VALUE,
      type: 'reward',
      createdAt: new Date().toISOString(),
      isUsed: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
    };

    // Deduct points
    userData.rewardPoints = userData.rewardPoints - this.POINTS_FOR_COUPON;
    
    // Add coupon to user's coupons
    if (!userData.coupons) userData.coupons = [];
    userData.coupons.push(coupon);

    localStorage.setItem('tinkro_current_user', JSON.stringify(userData));

    return {
      success: true,
      coupon: coupon,
      remainingPoints: userData.rewardPoints
    };
  }

  // Get user's available coupons
  static getUserCoupons() {
    const userData = JSON.parse(localStorage.getItem('tinkro_current_user'));
    const userCoupons = JSON.parse(localStorage.getItem('tinkro_user_coupons') || '[]');
    
    // Get regular reward coupons
    const rewardCoupons = userData?.coupons ? userData.coupons.filter(coupon => 
      !coupon.isUsed && new Date(coupon.expiresAt) > new Date()
    ) : [];
    
    // Get welcome50 and other special coupons
    const specialCoupons = userCoupons.filter(coupon => 
      !coupon.isUsed && new Date(coupon.expiryDate) > new Date()
    );
    
    // Combine both types
    return [...specialCoupons, ...rewardCoupons];
  }

  // Apply coupon
  static applyCoupon(couponCode) {
    // Check for special welcome50 coupon
    if (couponCode === 'welcome50') {
      const userCoupons = JSON.parse(localStorage.getItem('tinkro_user_coupons') || '[]');
      const welcome50 = userCoupons.find(c => 
        c.code === 'welcome50' && !c.isUsed && new Date(c.expiryDate) > new Date()
      );
      
      if (welcome50) {
        return {
          success: true,
          discount: welcome50.discount,
          coupon: welcome50,
          type: 'welcome'
        };
      } else {
        return { success: false, message: 'Welcome coupon not found or already used' };
      }
    }

    // Check user's regular reward coupons
    const userData = JSON.parse(localStorage.getItem('tinkro_current_user'));
    if (!userData || !userData.coupons) {
      return { success: false, message: 'Coupon not found' };
    }

    const coupon = userData.coupons.find(c => 
      c.code === couponCode && !c.isUsed && new Date(c.expiresAt) > new Date()
    );

    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon' };
    }

    return {
      success: true,
      discount: coupon.value,
      coupon: coupon,
      type: 'reward'
    };
  }

  // Mark coupon as used
  static useCoupon(couponCode) {
    // Handle welcome50 coupon
    if (couponCode === 'welcome50') {
      const userCoupons = JSON.parse(localStorage.getItem('tinkro_user_coupons') || '[]');
      const couponIndex = userCoupons.findIndex(c => c.code === 'welcome50');
      if (couponIndex !== -1) {
        userCoupons[couponIndex].isUsed = true;
        userCoupons[couponIndex].usedAt = new Date().toISOString();
        localStorage.setItem('tinkro_user_coupons', JSON.stringify(userCoupons));
        return true;
      }
      return false;
    }

    // Handle regular reward coupons
    const userData = JSON.parse(localStorage.getItem('tinkro_current_user'));
    if (!userData || !userData.coupons) return false;

    const couponIndex = userData.coupons.findIndex(c => c.code === couponCode);
    if (couponIndex !== -1) {
      userData.coupons[couponIndex].isUsed = true;
      userData.coupons[couponIndex].usedAt = new Date().toISOString();
      localStorage.setItem('tinkro_current_user', JSON.stringify(userData));
      return true;
    }
    return false;
  }

  // Get reward history
  static getRewardHistory() {
    const userData = JSON.parse(localStorage.getItem('tinkro_current_user'));
    return userData?.rewardHistory || [];
  }

  // Add reward history entry
  static addRewardHistory(entry) {
    const userData = JSON.parse(localStorage.getItem('tinkro_current_user'));
    if (!userData) return;

    if (!userData.rewardHistory) userData.rewardHistory = [];
    userData.rewardHistory.push({
      ...entry,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem('tinkro_current_user', JSON.stringify(userData));
  }

  // Calculate points needed for next coupon
  static getPointsNeededForCoupon() {
    const currentPoints = this.getUserRewardPoints();
    const remainder = currentPoints % this.POINTS_FOR_COUPON;
    return this.POINTS_FOR_COUPON - remainder;
  }

  // Get progress towards next coupon (percentage)
  static getCouponProgress() {
    const currentPoints = this.getUserRewardPoints();
    const progress = (currentPoints % this.POINTS_FOR_COUPON);
    return (progress / this.POINTS_FOR_COUPON) * 100;
  }
}

export default RewardService;