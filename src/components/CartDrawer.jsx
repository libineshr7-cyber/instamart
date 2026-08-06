import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { COUPONS } from '../data/coupons';
import { X, ShoppingBag, Plus, Minus, Tag, Trash2, ShieldCheck, Check, ChevronRight, Heart } from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    getCartItemsList,
    addToCart,
    removeFromCart,
    getItemTotal,
    getMrpTotal,
    getSavingsTotal,
    getDeliveryFee,
    getCouponDiscount,
    getHandlingFee,
    getGrandTotal,
    appliedCoupon,
    applyCouponCode,
    removeCouponCode,
    tipAmount,
    setTipAmount,
    currentLocation,
    placeOrder,
    triggerToast
  } = useShop();

  const [inputCoupon, setInputCoupon] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  if (!isCartDrawerOpen) return null;

  const cartItems = getCartItemsList();
  const itemTotal = getItemTotal();
  const deliveryFee = getDeliveryFee();
  const handlingFee = getHandlingFee();
  const couponDiscount = getCouponDiscount();
  const grandTotal = getGrandTotal();
  const savings = getSavingsTotal() + couponDiscount;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon) return;
    if (applyCouponCode(inputCoupon)) {
      setInputCoupon('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-600" />
              <h2 className="font-black text-lg text-gray-900">My Cart ({cartItems.length} Items)</h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-3">🛒</div>
                <h3 className="font-extrabold text-lg text-gray-800">Your cart is empty</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  Good food and groceries are always waiting for you. Add items to get 10-minute instant delivery!
                </p>
                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-5 px-6 py-2.5 bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-red-700 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Delivery Progress Bar */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-emerald-800">
                  <div className="flex items-center justify-between text-xs font-extrabold mb-1">
                    <span>
                      {itemTotal >= 199
                        ? '🎉 You unlocked FREE Delivery!'
                        : `Add ₹${199 - itemTotal} more for FREE Delivery`}
                    </span>
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                      ⚡ 10 MINS
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (itemTotal / 199) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Delivery Location Summary */}
                <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Delivering To</span>
                    <div className="font-extrabold text-xs text-gray-900">{currentLocation.title}</div>
                    <div className="text-[11px] text-gray-500 line-clamp-1">{currentLocation.address}</div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded">
                    {currentLocation.sla}
                  </span>
                </div>

                {/* Items List */}
                <div className="bg-white rounded-2xl border border-gray-100 p-3 space-y-3">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider">
                    Itemized Order
                  </span>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 pt-2 border-t border-gray-50">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{item.name}</h4>
                        <div className="text-[10px] text-gray-400">{item.unit}</div>
                        <div className="font-black text-xs text-gray-900 mt-0.5">₹{item.price * item.qty}</div>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center bg-red-600 text-white rounded-lg px-2 py-1 font-bold text-xs gap-2">
                        <button onClick={() => removeFromCart(item.id)}><Minus className="w-3 h-3" /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => addToCart(item.id)}><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupons Section */}
                <div className="bg-white rounded-2xl border border-gray-100 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs font-black text-gray-900">
                    <span className="flex items-center gap-1.5 text-red-600">
                      <Tag className="w-4 h-4" /> Coupons & Offers
                    </span>
                    {appliedCoupon && (
                      <button onClick={removeCouponCode} className="text-[11px] text-red-600 hover:underline">
                        Remove
                      </button>
                    )}
                  </div>

                  {appliedCoupon ? (
                    <div className="bg-green-50 border border-green-200 p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-black text-green-700">{appliedCoupon.code} APPLIED!</span>
                        <p className="text-[11px] text-green-600">{appliedCoupon.description}</p>
                      </div>
                      <Check className="w-4 h-4 text-green-700" />
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code (e.g. INSTA100)"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-xl uppercase font-bold outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-gray-900 text-white font-extrabold text-xs rounded-xl hover:bg-gray-800"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Available Coupon Chips */}
                  {!appliedCoupon && (
                    <div className="flex gap-2 overflow-x-auto pt-1 scrollbar-none">
                      {COUPONS.map(c => (
                        <button
                          key={c.code}
                          onClick={() => applyCouponCode(c.code)}
                          className="px-2.5 py-1 bg-red-50 text-red-600 font-extrabold text-[10px] rounded-lg border border-red-200 whitespace-nowrap hover:bg-red-600 hover:text-white transition-colors"
                        >
                          {c.code} ({c.title})
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delivery Tip Selector */}
                <div className="bg-white rounded-2xl border border-gray-100 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-gray-900 mb-1">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" /> Tip Delivery Executive
                  </div>
                  <p className="text-[11px] text-gray-500 mb-2">100% of the tip goes to your delivery partner</p>
                  <div className="flex items-center gap-2">
                    {[0, 20, 30, 50].map(amt => (
                      <button
                        key={amt}
                        onClick={() => setTipAmount(amt)}
                        className={`flex-1 py-1.5 rounded-xl font-bold text-xs border transition-all ${
                          tipAmount === amt
                            ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {amt === 0 ? 'No Tip' : `₹${amt}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-white rounded-2xl border border-gray-100 p-3">
                  <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Payment Mode</span>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {[
                      { id: 'UPI', label: 'UPI / GPay' },
                      { id: 'CARD', label: 'Card' },
                      { id: 'COD', label: 'Cash / COD' }
                    ].map(pm => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          paymentMethod === pm.id
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Detailed Bill Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 p-3 space-y-2 text-xs">
                  <span className="font-black text-gray-900 uppercase text-[11px] tracking-wider">Bill Details</span>

                  <div className="flex justify-between text-gray-600">
                    <span>Item Total</span>
                    <span>₹{itemTotal}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Partner Fee</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-bold' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Handling Fee</span>
                    <span>₹{handlingFee}</span>
                  </div>

                  {tipAmount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Tip</span>
                      <span>₹{tipAmount}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-100 flex justify-between font-black text-sm text-gray-900">
                    <span>To Pay</span>
                    <span>₹{grandTotal}</span>
                  </div>

                  {savings > 0 && (
                    <div className="bg-green-50 text-green-700 font-extrabold text-[11px] p-2 rounded-xl text-center">
                      🎉 Total Savings on this order: ₹{savings}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Fixed Bottom Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-100 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                <span>PAYING VIA {paymentMethod}</span>
                <span className="font-black text-gray-900 text-sm">TOTAL: ₹{grandTotal}</span>
              </div>
              <button
                onClick={() => placeOrder(paymentMethod)}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>PROCEED TO PAY ₹{grandTotal}</span>
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
