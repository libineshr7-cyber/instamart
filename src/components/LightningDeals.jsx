import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';
import { Zap, Clock, Plus, Minus } from 'lucide-react';

export const LightningDeals = () => {
  const { cart, addToCart, removeFromCart, setSelectedProductModal } = useShop();

  // Timer countdown: 02 hours, 45 minutes, 12 seconds
  const [timeLeft, setTimeLeft] = useState(9912); // seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 14400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const lightningItems = PRODUCTS.filter(p => p.isLightning);

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-2xl p-4 sm:p-5 text-white shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-white text-red-600 p-2 rounded-xl shadow-md">
            <Zap className="w-5 h-5 fill-red-600 animate-bounce" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl tracking-tight text-white leading-none">
              Lightning Deals ⚡
            </h3>
            <span className="text-[11px] font-medium text-amber-100">
              Limited stock! Grab before prices reset.
            </span>
          </div>
        </div>

        {/* Live Countdown Timer Badge */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20">
          <Clock className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-xs font-mono font-bold tracking-wider text-yellow-300">
            Ends in {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Horizontal Scroll Product Rail */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {lightningItems.map((product) => {
          const qty = cart[product.id] || 0;
          return (
            <div
              key={product.id}
              className="min-w-[170px] sm:min-w-[190px] max-w-[190px] bg-white rounded-xl p-3 text-gray-900 shadow-md flex flex-col justify-between flex-shrink-0 group hover:shadow-xl transition-all border border-amber-200/50"
            >
              <div>
                {/* Image & Discount Tag */}
                <div className="relative overflow-hidden rounded-lg mb-2 cursor-pointer" onClick={() => setSelectedProductModal(product)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-sm uppercase">
                    {product.discount}
                  </span>
                  <span className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-xs text-yellow-300 font-bold text-[9px] px-1.5 py-0.2 rounded">
                    {product.deliveryTime}
                  </span>
                </div>

                {/* Claim Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1">
                    <span className="text-red-600">{product.claimedPercent}% Claimed</span>
                    <span>Almost Sold</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-red-600 h-1.5 rounded-full"
                      style={{ width: `${product.claimedPercent}%` }}
                    />
                  </div>
                </div>

                {/* Details */}
                <h4
                  onClick={() => setSelectedProductModal(product)}
                  className="font-bold text-xs text-gray-900 line-clamp-2 leading-tight cursor-pointer hover:text-red-600"
                >
                  {product.name}
                </h4>
                <div className="text-[11px] text-gray-400 font-medium">{product.unit}</div>
              </div>

              {/* Price & Add Stepper */}
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-gray-100">
                <div>
                  <div className="font-black text-sm text-gray-900">₹{product.price}</div>
                  <div className="text-[10px] line-through text-gray-400">₹{product.mrp}</div>
                </div>

                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(product.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-black text-xs rounded-lg transition-colors border border-red-200 shadow-2xs"
                  >
                    + ADD
                  </button>
                ) : (
                  <div className="flex items-center bg-red-600 text-white rounded-lg px-2 py-1 font-bold text-xs gap-2">
                    <button onClick={() => removeFromCart(product.id)}><Minus className="w-3 h-3" /></button>
                    <span>{qty}</span>
                    <button onClick={() => addToCart(product.id)}><Plus className="w-3 h-3" /></button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
