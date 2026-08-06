import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Search, X, TrendingUp, History, Plus, Minus, Zap } from 'lucide-react';

const RECENT_SEARCHES = ['Mangoes', 'Amul Milk', 'Maggi Noodles', 'Whole Wheat Bread', 'Lays Chips'];

export const SearchModal = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    cart,
    addToCart,
    removeFromCart,
    setSelectedProductModal
  } = useShop();

  const [query, setQuery] = useState('');

  if (!isSearchModalOpen) return null;

  const filteredProducts = query.trim()
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-red-500" />
          <input
            type="text"
            placeholder="Search groceries, fruits, snacks, dairy..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-base font-semibold text-gray-900 outline-none placeholder:text-gray-400 placeholder:font-normal"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs font-bold text-gray-500 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg"
          >
            ESC / Close
          </button>
        </div>

        {/* Results / Default State */}
        <div className="p-4 overflow-y-auto flex-1 space-y-5">
          {!query.trim() ? (
            <>
              {/* Recent Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2.5">
                  <History className="w-3.5 h-3.5" /> Recent Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {RECENT_SEARCHES.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Products */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-red-500" /> Trending Items Near You
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRODUCTS.slice(0, 4).map((product) => {
                    const qty = cart[product.id] || 0;
                    return (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-2.5 border border-gray-100 hover:border-gray-200 rounded-xl hover:shadow-xs transition-all bg-slate-50/50"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-lg cursor-pointer"
                          onClick={() => {
                            setSelectedProductModal(product);
                            setIsSearchModalOpen(false);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4
                            onClick={() => {
                              setSelectedProductModal(product);
                              setIsSearchModalOpen(false);
                            }}
                            className="font-bold text-xs text-gray-900 truncate cursor-pointer hover:text-red-600"
                          >
                            {product.name}
                          </h4>
                          <span className="text-[10px] text-gray-500">{product.unit}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-extrabold text-xs text-gray-900">₹{product.price}</span>
                            <span className="text-[10px] line-through text-gray-400">₹{product.mrp}</span>
                          </div>
                        </div>

                        {/* Add Button */}
                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(product.id)}
                            className="px-3 py-1.5 bg-white border border-red-500 text-red-600 font-extrabold text-xs rounded-lg hover:bg-red-600 hover:text-white transition-colors shadow-xs"
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
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div>
              <div className="text-xs font-extrabold text-gray-500 mb-3">
                Found {filteredProducts.length} matching products for "{query}"
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-2">🔍</div>
                  <h3 className="font-bold text-gray-700 text-base">No items found</h3>
                  <p className="text-xs text-gray-400 mt-1">Try searching for milk, mangoes, bread, or tomato</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredProducts.map((product) => {
                    const qty = cart[product.id] || 0;
                    return (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 border border-gray-100 hover:border-gray-200 rounded-xl hover:bg-gray-50/50 transition-all"
                      >
                        <div
                          className="flex items-center gap-3.5 cursor-pointer flex-1"
                          onClick={() => {
                            setSelectedProductModal(product);
                            setIsSearchModalOpen(false);
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 object-cover rounded-lg border border-gray-100"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.2 rounded">
                              {product.deliveryTime}
                            </span>
                            <h4 className="font-extrabold text-sm text-gray-900 mt-0.5">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 text-xs">
                              <span className="font-extrabold text-gray-900">₹{product.price}</span>
                              <span className="line-through text-gray-400 text-[11px]">₹{product.mrp}</span>
                              <span className="text-green-600 font-bold text-[11px]">{product.discount}</span>
                            </div>
                          </div>
                        </div>

                        {qty === 0 ? (
                          <button
                            onClick={() => addToCart(product.id)}
                            className="px-4 py-2 bg-white border-2 border-red-500 text-red-600 font-black text-xs rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-xs"
                          >
                            + ADD
                          </button>
                        ) : (
                          <div className="flex items-center bg-red-600 text-white rounded-xl px-3 py-1.5 font-bold text-xs gap-3 shadow-xs">
                            <button onClick={() => removeFromCart(product.id)}><Minus className="w-3.5 h-3.5" /></button>
                            <span>{qty}</span>
                            <button onClick={() => addToCart(product.id)}><Plus className="w-3.5 h-3.5" /></button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
