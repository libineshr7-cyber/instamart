import React from 'react';
import { CATEGORIES } from '../data/categories';
import { useShop } from '../context/ShopContext';
import { Sparkles } from 'lucide-react';

export const CategorySidebar = () => {
  const { selectedCategory, setSelectedCategory, setSelectedSubcategory } = useShop();

  const handleSelect = (catId) => {
    setSelectedCategory(catId);
    setSelectedSubcategory("All");
  };

  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border border-gray-100 rounded-2xl p-3 shadow-xs sticky top-24 self-start max-h-[80vh] overflow-y-auto">
        <div className="text-xs font-black uppercase tracking-wider text-gray-400 px-3 py-2 flex items-center justify-between">
          <span>Categories</span>
          <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">10+ Hubs</span>
        </div>

        <nav className="space-y-1 mt-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all text-left group ${
                  isActive
                    ? 'bg-red-50 text-red-600 shadow-2xs font-extrabold border-l-4 border-red-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </div>
                {cat.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                      isActive ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile & Tablet Horizontal Scroll Bar */}
      <div className="lg:hidden w-full bg-white border-b border-gray-100 py-2.5 px-4 sticky top-14 z-30 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelect(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
