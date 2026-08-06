import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { COUPONS } from '../data/coupons';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Cart state: { [productId]: quantity }
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('instamart_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem('instamart_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Location state
  const [currentLocation, setCurrentLocation] = useState({
    id: "loc-1",
    title: "HSR Layout, Sector 3",
    address: "14th Main Road, Sector 3, HSR Layout, Bengaluru",
    tag: "HOME",
    sla: "⚡ 8-10 MINS"
  });

  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: "loc-1",
      title: "HSR Layout, Sector 3",
      address: "14th Main Road, Sector 3, HSR Layout, Bengaluru",
      tag: "HOME",
      sla: "⚡ 8-10 MINS"
    },
    {
      id: "loc-2",
      title: "Koramangala, 5th Block",
      address: "80 Feet Road, Near Sony World Signal, Bengaluru",
      tag: "WORK",
      sla: "⚡ 10-12 MINS"
    },
    {
      id: "loc-3",
      title: "Indiranagar, 100ft Road",
      address: "12th Main Rd, Indiranagar, Bengaluru",
      tag: "OTHER",
      sla: "⚡ 12-15 MINS"
    }
  ]);

  // Modals & UI Toggles
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [activeOrderTracker, setActiveOrderTracker] = useState(null);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance"); // relevance, price-low, price-high, discount

  // Cart Extras
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [tipAmount, setTipAmount] = useState(20);

  // User Orders History
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('instamart_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast Notification
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  // Cart Operations
  const addToCart = (productId) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0;
      const next = { ...prev, [productId]: currentQty + 1 };
      return next;
    });
    const item = PRODUCTS.find(p => p.id === productId);
    if (item) {
      triggerToast(`Added "${item.name}" to cart`, "success");
    }
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const currentQty = prev[productId] || 0;
      if (currentQty <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: currentQty - 1 };
    });
  };

  const updateQuantity = (productId, qty) => {
    setCart(prev => {
      if (qty <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: qty };
    });
  };

  const clearCart = () => {
    setCart({});
    setAppliedCoupon(null);
  };

  // Cart Total Computations
  const getCartItemsList = () => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = PRODUCTS.find(p => p.id === id);
        return product ? { ...product, qty } : null;
      })
      .filter(Boolean);
  };

  const getItemCount = () => {
    return Object.values(cart).reduce((sum, q) => sum + q, 0);
  };

  const getItemTotal = () => {
    return getCartItemsList().reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const getMrpTotal = () => {
    return getCartItemsList().reduce((sum, item) => sum + item.mrp * item.qty, 0);
  };

  const getSavingsTotal = () => {
    return getMrpTotal() - getItemTotal();
  };

  const getDeliveryFee = () => {
    const itemTotal = getItemTotal();
    if (itemTotal === 0) return 0;
    if (appliedCoupon && appliedCoupon.discountType === "free_delivery") return 0;
    return itemTotal >= 199 ? 0 : 35;
  };

  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    const itemTotal = getItemTotal();
    if (itemTotal < appliedCoupon.minAmount) return 0;

    if (appliedCoupon.discountType === "flat") {
      return appliedCoupon.discountValue;
    } else if (appliedCoupon.discountType === "percent") {
      const calculated = (itemTotal * appliedCoupon.discountValue) / 100;
      return Math.min(calculated, appliedCoupon.maxDiscount || calculated);
    }
    return 0;
  };

  const getHandlingFee = () => (getItemTotal() > 0 ? 5 : 0);

  const getGrandTotal = () => {
    const total = getItemTotal() + getDeliveryFee() + getHandlingFee() + tipAmount - getCouponDiscount();
    return Math.max(0, total);
  };

  // Coupon Application
  const applyCouponCode = (code) => {
    const found = COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!found) {
      triggerToast("Invalid coupon code", "error");
      return false;
    }
    if (getItemTotal() < found.minAmount) {
      triggerToast(`Minimum order amount of ₹${found.minAmount} required for ${found.code}`, "warning");
      return false;
    }
    setAppliedCoupon(found);
    triggerToast(`Coupon ${found.code} applied successfully!`, "success");
    return true;
  };

  const removeCouponCode = () => {
    setAppliedCoupon(null);
    triggerToast("Coupon removed", "info");
  };

  // Place Order Simulation
  const placeOrder = (paymentMethod = "UPI") => {
    const items = getCartItemsList();
    if (items.length === 0) return;

    const newOrder = {
      orderId: "INSTA-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      items: items,
      itemTotal: getItemTotal(),
      deliveryFee: getDeliveryFee(),
      handlingFee: getHandlingFee(),
      tipAmount: tipAmount,
      couponDiscount: getCouponDiscount(),
      grandTotal: getGrandTotal(),
      address: currentLocation,
      paymentMethod: paymentMethod,
      status: "PLACED", // PLACED -> PACKING -> ASSIGNED -> OUT_FOR_DELIVERY -> DELIVERED
      estimatedMinutes: 10
    };

    const updatedHistory = [newOrder, ...orderHistory];
    setOrderHistory(updatedHistory);
    try {
      localStorage.setItem('instamart_orders', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error(e);
    }

    clearCart();
    setIsCartDrawerOpen(false);
    triggerToast("Redirecting to payment...", "info");

    window.location.href = "https://secure-payment-t90a.onrender.com";
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItemsList,
        getItemCount,
        getItemTotal,
        getMrpTotal,
        getSavingsTotal,
        getDeliveryFee,
        getCouponDiscount,
        getHandlingFee,
        getGrandTotal,
        
        currentLocation,
        setCurrentLocation,
        savedAddresses,
        setSavedAddresses,
        
        isLocationModalOpen,
        setIsLocationModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isProfileDrawerOpen,
        setIsProfileDrawerOpen,
        selectedProductModal,
        setSelectedProductModal,
        activeOrderTracker,
        setActiveOrderTracker,
        
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        
        appliedCoupon,
        applyCouponCode,
        removeCouponCode,
        tipAmount,
        setTipAmount,
        
        orderHistory,
        placeOrder,
        
        toast,
        triggerToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
