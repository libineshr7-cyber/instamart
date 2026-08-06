import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { MapPin, ChevronDown, Search, User, ShoppingBag, Zap, Clock } from 'lucide-react';

const SEARCH_PLACEHOLDERS = [
  'Search "milk"',
  'Search "curd"',
  'Search "tomatoes"',
  'Search "lays chips"',
  'Search "alphonso mangoes"',
  'Search "whole wheat bread"',
  'Search "ice cream"'
];

export const Header = () => {
  const {
    currentLocation,
    setIsLocationModalOpen,
    setIsSearchModalOpen,
    setIsCartDrawerOpen,
    setIsProfileDrawerOpen,
    getItemCount,
    getItemTotal,
    getSavingsTotal
  } = useShop();

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const itemCount = getItemCount();
  const itemTotal = getItemTotal();
  const savings = getSavingsTotal();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Top Delivery Announcement Bar */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-red-500 text-white text-xs font-semibold py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-1.5">
            <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
              DARK STORE LIVE
            </span>
            <span className="hidden sm:inline">⚡ Instant 10-Minute Dark Store Express Delivery in your locality!</span>
            <span className="sm:hidden">⚡ 10-Min Dark Store Delivery!</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-medium">Free Delivery &gt; ₹199</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Location Selector */}
          <div className="flex items-center gap-6">
            {/* Instamart Logo */}
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-gradient-to-tr from-[#E23744] to-[#F04F5F] text-white p-2 rounded-xl shadow-md flex items-center justify-center font-black tracking-tighter text-xl">
                <span>IM</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-xl tracking-tight text-gray-900">
                  instamart
                </span>
                <span className="text-[10px] font-bold text-red-500 tracking-widest uppercase flex items-center gap-0.5">
                  <Zap className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />
                  10 Mins Store
                </span>
              </div>
            </div>

            {/* SLA & Location Picker Pill */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-gray-200/80 px-3.5 py-1.5 rounded-xl text-left transition-all duration-200 group"
            >
              <div className="bg-red-100 text-red-600 p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                <MapPin className="w-4 h-4 fill-red-600/20 text-red-600" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-gray-900 line-clamp-1 max-w-[150px]">
                    {currentLocation.title}
                  </span>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {currentLocation.sla}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 line-clamp-1 max-w-[200px]">
                  {currentLocation.address}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-700 ml-1 transition-colors" />
            </button>
          </div>

          {/* Interactive Search Bar Trigger */}
          <div className="flex-1 max-w-xl">
            <div
              onClick={() => setIsSearchModalOpen(true)}
              className="relative flex items-center bg-gray-100/90 hover:bg-gray-100 border border-transparent hover:border-gray-300 rounded-xl px-4 py-2.5 cursor-pointer transition-all duration-200 group shadow-inner"
            >
              <Search className="w-4 h-4 text-gray-400 group-hover:text-red-500 mr-3 transition-colors" />
              <div className="flex-1 overflow-hidden h-5 relative">
                <span className="absolute inset-0 text-sm text-gray-400 font-medium transition-all duration-300 transform">
                  {SEARCH_PLACEHOLDERS[placeholderIndex]}
                </span>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-bold bg-white text-gray-400 px-2 py-0.5 rounded border border-gray-200 shadow-2xs">
                ⌘K / Click
              </span>
            </div>
          </div>

          {/* User Account & Cart Button */}
          <div className="flex items-center gap-3">
            {/* Account Drawer Trigger */}
            <button
              onClick={() => setIsProfileDrawerOpen(true)}
              className="p-2.5 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1.5"
              title="Profile & Orders"
            >
              <User className="w-5 h-5" />
              <span className="hidden lg:inline text-xs font-bold text-gray-800">Account</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 shadow-md active:scale-95 ${
                itemCount > 0
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 ring-2 ring-green-400/30'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-green-600">
                    {itemCount}
                  </span>
                )}
              </div>

              {itemCount > 0 ? (
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[10px] font-medium text-green-100 uppercase tracking-wider">My Cart</span>
                  <span className="font-extrabold text-sm">₹{itemTotal}</span>
                </div>
              ) : (
                <span className="hidden sm:inline font-bold">My Cart</span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Location Sub-bar */}
        <div className="md:hidden mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-1.5 text-left text-xs font-semibold text-gray-800"
          >
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span className="truncate max-w-[200px]">{currentLocation.title}</span>
            <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.2 rounded font-bold">
              {currentLocation.sla}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          {savings > 0 && (
            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Savings: ₹{savings}
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
