import React from 'react';
import { useShop } from '../context/ShopContext';
import { Plus, Minus, Star, Zap } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { cart, addToCart, removeFromCart, setSelectedProductModal } = useShop();
  const qty = cart[product.id] || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 flex flex-col justify-between hover:shadow-xl hover:border-gray-200 transition-all duration-300 group relative">
      <div>
        {/* Top Badges & Image Container */}
        <div
          onClick={() => setSelectedProductModal(product)}
          className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-gray-50 cursor-pointer mb-3"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />

          {/* Discount Badge */}
          {product.discount && product.discount !== 'MRP' && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
              {product.discount}
            </span>
          )}

          {/* Delivery SLA Pill */}
          <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-md text-gray-900 font-extrabold text-[10px] px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <Zap className="w-3 h-3 text-red-500 fill-red-500" />
            {product.deliveryTime}
          </span>
        </div>

        {/* Rating & Subcategory */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
          <span className="font-semibold text-gray-400 truncate max-w-[110px]">{product.subcategory}</span>
          <div className="flex items-center gap-0.5 bg-green-50 text-green-700 font-extrabold px-1.5 py-0.2 rounded">
            <Star className="w-3 h-3 fill-green-700 text-green-700" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Product Title & Unit */}
        <h3
          onClick={() => setSelectedProductModal(product)}
          className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-tight cursor-pointer hover:text-red-600 transition-colors"
        >
          {product.name}
        </h3>
        <p className="text-[11px] font-medium text-gray-400 mt-1">{product.unit}</p>
      </div>

      {/* Pricing & Add Stepper */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <div className="font-black text-sm sm:text-base text-gray-900">
            ₹{product.price}
          </div>
          {product.mrp > product.price && (
            <div className="text-[11px] line-through text-gray-400 font-medium">
              ₹{product.mrp}
            </div>
          )}
        </div>

        {/* Add Stepper Button */}
        {qty === 0 ? (
          <button
            onClick={() => addToCart(product.id)}
            className="px-4 py-2 bg-white border-2 border-red-500 text-red-600 font-black text-xs rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-2xs active:scale-95"
          >
            + ADD
          </button>
        ) : (
          <div className="flex items-center bg-red-600 text-white rounded-xl px-3 py-1.5 font-extrabold text-xs gap-3 shadow-md">
            <button
              onClick={() => removeFromCart(product.id)}
              className="hover:scale-125 transition-transform"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="min-w-[14px] text-center font-black">{qty}</span>
            <button
              onClick={() => addToCart(product.id)}
              className="hover:scale-125 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
