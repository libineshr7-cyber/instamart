import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { X, Star, Zap, ShieldCheck, Clock, RefreshCw, Plus, Minus } from 'lucide-react';

export const ProductModal = () => {
  const {
    selectedProductModal,
    setSelectedProductModal,
    cart,
    addToCart,
    removeFromCart
  } = useShop();

  if (!selectedProductModal) return null;

  const product = selectedProductModal;
  const qty = cart[product.id] || 0;

  const relatedProducts = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
            {product.subcategory}
          </span>
          <button
            onClick={() => setSelectedProductModal(null)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              {product.discount && (
                <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-md uppercase">
                  {product.discount}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-green-100 text-green-700 font-extrabold text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-green-700" />
                  {product.rating} ({product.reviewsCount} Ratings)
                </span>
                <span className="bg-red-50 text-red-600 font-extrabold text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-red-600" />
                  {product.deliveryTime}
                </span>
              </div>

              <h2 className="text-xl font-black text-gray-900 leading-snug">
                {product.name}
              </h2>
              <div className="text-xs font-bold text-gray-400">{product.unit}</div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                {product.mrp > product.price && (
                  <span className="text-base line-through text-gray-400 font-semibold">
                    ₹{product.mrp}
                  </span>
                )}
                {product.mrp > product.price && (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Save ₹{product.mrp - product.price}
                  </span>
                )}
              </div>

              {/* Add to Cart Stepper */}
              <div className="pt-3">
                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    + ADD TO CART
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-red-600 text-white rounded-xl p-2 font-black text-sm shadow-lg">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="px-3 py-1 hover:scale-125 transition-transform"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{qty} Added in Cart</span>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="px-3 py-1 hover:scale-125 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Attributes */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-100 text-center">
            <div>
              <div className="flex justify-center text-red-500 mb-1"><ShieldCheck className="w-5 h-5" /></div>
              <div className="text-[10px] font-bold uppercase text-gray-400">Origin</div>
              <div className="text-xs font-bold text-gray-800 truncate">{product.origin || 'India'}</div>
            </div>
            <div>
              <div className="flex justify-center text-amber-500 mb-1"><Clock className="w-5 h-5" /></div>
              <div className="text-[10px] font-bold uppercase text-gray-400">Shelf Life</div>
              <div className="text-xs font-bold text-gray-800 truncate">{product.shelfLife || '3-5 Days'}</div>
            </div>
            <div>
              <div className="flex justify-center text-blue-500 mb-1"><RefreshCw className="w-5 h-5" /></div>
              <div className="text-[10px] font-bold uppercase text-gray-400">Storage</div>
              <div className="text-xs font-bold text-gray-800 truncate">Cool & Dry</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-extrabold text-sm text-gray-900 mb-1">Product Details</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Related Recommendations */}
          {relatedProducts.length > 0 && (
            <div>
              <h4 className="font-extrabold text-sm text-gray-900 mb-3">Similar Items You Might Like</h4>
              <div className="grid grid-cols-3 gap-3">
                {relatedProducts.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => setSelectedProductModal(rel)}
                    className="p-2 border border-gray-100 rounded-xl hover:border-red-300 cursor-pointer transition-all bg-gray-50/50"
                  >
                    <img src={rel.image} alt={rel.name} className="w-full h-20 object-cover rounded-lg mb-1.5" />
                    <div className="font-bold text-xs text-gray-900 truncate">{rel.name}</div>
                    <div className="font-black text-xs text-red-600">₹{rel.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
