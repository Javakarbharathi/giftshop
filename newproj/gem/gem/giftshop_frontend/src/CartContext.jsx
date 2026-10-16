import { createContext, useState, useContext, useEffect, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const DEFAULT_COUPONS = {
  'WELCOME10': { code: 'WELCOME10', type: 'percentage', value: 10, label: '10% First Order Discount' },
  'GOBI50': { code: 'GOBI50', type: 'flat', value: 50, label: '₹50 Flat Discount' },
  'FESTIVE15': { code: 'FESTIVE15', type: 'percentage', value: 15, label: '15% Festive Celebration Discount' },
  'BULKGIFT': { code: 'BULKGIFT', type: 'flat', value: 100, label: '₹100 Bulk Order Special' }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('giftshop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const savedCoupon = localStorage.getItem('giftshop_coupon');
      return savedCoupon ? JSON.parse(savedCoupon) : null;
    } catch (e) {
      return null;
    }
  });

  const [addOns, setAddOns] = useState({
    giftPackaging: false,
    greetingNote: false,
    greetingMessage: '',
    expressDispatch: false
  });

  useEffect(() => {
    try {
      localStorage.setItem('giftshop_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem('giftshop_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('giftshop_coupon');
      }
    } catch (e) {}
  }, [appliedCoupon]);

  const addToCart = (item) => {
    setCart(prev => [
      ...prev,
      {
        ...item,
        cartId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        shape: item.shape || 'circle',
        frameSize: item.frameSize || null,
        frameMaterial: item.frameMaterial || null,
        customText: item.customText || '',
        quantity: Math.max(1, parseInt(item.quantity) || 1)
      }
    ]);
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId, newQuantity) => {
    const qty = Math.max(1, parseInt(newQuantity) || 1);
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem('giftshop_cart');
    localStorage.removeItem('giftshop_coupon');
  };

  const applyCoupon = async (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    
    // First try backend API validation
    try {
      const res = await fetch('http://127.0.0.1:8000/api/catalog/coupons/validate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, subtotal })
      });
      if (res.ok) {
        const data = await res.json();
        const couponObj = {
          code: data.code,
          type: 'flat',
          value: data.discount_amount,
          label: data.label
        };
        setAppliedCoupon(couponObj);
        return { success: true, message: `Coupon "${cleanCode}" applied: ${data.label}` };
      }
    } catch (e) {}

    // Fallback to local default coupons
    if (DEFAULT_COUPONS[cleanCode]) {
      setAppliedCoupon(DEFAULT_COUPONS[cleanCode]);
      return { success: true, message: `Coupon "${cleanCode}" applied: ${DEFAULT_COUPONS[cleanCode].label}` };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try WELCOME10 or GOBI50' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const toggleAddOn = (key, value) => {
    setAddOns(prev => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key]
    }));
  };

  const totalItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  }, [cart]);

  const getTierPrice = (baseOfferPrice, totalCount) => {
    if (totalCount >= 15) return 119;
    if (totalCount >= 10) return 129;
    if (totalCount >= 5) return 139;
    if (totalCount >= 2) return 149;
    return parseFloat(baseOfferPrice || 149);
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const unitPrice = getTierPrice(item.product?.offer_price, totalItemCount);
      return sum + (unitPrice * (item.quantity || 1));
    }, 0);
  }, [cart, totalItemCount]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    if (appliedCoupon.type === 'percentage') {
      return (subtotal * appliedCoupon.value) / 100;
    }
    if (appliedCoupon.type === 'flat') {
      return Math.min(subtotal, appliedCoupon.value);
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const addOnsTotal = useMemo(() => {
    let sum = 0;
    if (addOns.giftPackaging) sum += 35;
    if (addOns.greetingNote) sum += 20;
    if (addOns.expressDispatch) sum += 39;
    return sum;
  }, [addOns]);

  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + addOnsTotal);
  }, [subtotal, discountAmount, addOnsTotal]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItemCount,
      subtotal,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      discountAmount,
      addOns,
      toggleAddOn,
      addOnsTotal,
      finalTotal,
      getTierPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};