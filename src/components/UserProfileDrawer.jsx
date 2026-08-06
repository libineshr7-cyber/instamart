import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, User, ShoppingBag, MapPin, HelpCircle, ChevronRight, RotateCcw } from 'lucide-react';

export const UserProfileDrawer = () => {
  const {
    isProfileDrawerOpen,
    setIsProfileDrawerOpen,
    orderHistory,
    setActiveOrderTracker,
    currentLocation,
    savedAddresses
  } = useShop();

  if (!isProfileDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-black text-white text-lg">
                U
              </div>
              <div>
                <h2 className="font-black text-base">Rahul Sharma</h2>
                <span className="text-xs text-gray-400">+91 98765 43210</span>
              </div>
            </div>
            <button
              onClick={() => setIsProfileDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-gray-50/50">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Total Orders</span>
                <div className="text-xl font-black text-gray-900 mt-0.5">{orderHistory.length + 3}</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Swiggy One Pass</span>
                <div className="text-xs font-black text-green-600 mt-1">ACTIVE (Free Del)</div>
              </div>
            </div>

            {/* Past Orders */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Past Orders</span>
                <span className="text-[11px] font-bold text-red-600">View All</span>
              </div>

              {orderHistory.length === 0 ? (
                <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
                  No previous orders yet. Place your first order today!
                </div>
              ) : (
                <div className="space-y-3">
                  {orderHistory.map((ord) => (
                    <div
                      key={ord.orderId}
                      className="bg-white p-3.5 rounded-2xl border border-gray-100 space-y-2 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-gray-900">
                        <span>Order #{ord.orderId}</span>
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-black">
                          DELIVERED
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">
                        {ord.items.map(i => `${i.name} (x${i.qty})`).join(', ')}
                      </div>
                      <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                        <span className="font-black text-xs text-gray-900">Total: ₹{ord.grandTotal}</span>
                        <button
                          onClick={() => {
                            setActiveOrderTracker(ord);
                            setIsProfileDrawerOpen(false);
                          }}
                          className="px-3 py-1 bg-red-50 text-red-600 text-xs font-extrabold rounded-lg hover:bg-red-600 hover:text-white transition-colors flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Track Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Delivery Addresses */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Saved Addresses</span>
              <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="p-3 flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-gray-900">{addr.title}</div>
                      <p className="text-[11px] text-gray-500">{addr.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Links */}
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 text-xs font-bold text-gray-800">
              <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                <span className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-gray-400" /> Help & Support</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
              <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                <span className="flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-gray-400" /> Partner with Instamart</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
