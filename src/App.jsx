import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { CATEGORIES } from './data/categories';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { LocationModal } from './components/LocationModal';
import { SearchModal } from './components/SearchModal';
import { BannerCarousel } from './components/BannerCarousel';
import { LightningDeals } from './components/LightningDeals';
import { CategorySidebar } from './components/CategorySidebar';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { UserProfileDrawer } from './components/UserProfileDrawer';
import { Toast } from './components/Toast';
import { ShoppingBag, ArrowUpDown, Filter, ChevronRight, Zap } from 'lucide-react';

const MainContent = () => {
  const {
    selectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    sortBy,
    setSortBy,
    getItemCount,
    getItemTotal,
    setIsCartDrawerOpen
  } = useShop();

  const activeCategoryObj = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

  // Filter Products by Category & Subcategory
  let displayProducts = PRODUCTS.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory) return false;
    return true;
  });

  // Sort Products
  displayProducts = [...displayProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'discount') {
      const getNum = d => parseInt(d) || 0;
      return getNum(b.discount) - getNum(a.discount);
    }
    return 0; // relevance
  });

  const itemCount = getItemCount();
  const itemTotal = getItemTotal();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Main Page Layout Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Left Category Navigation Sidebar */}
        <CategorySidebar />

        {/* Right Main Content Panel */}
        <main className="flex-1 space-y-8 min-w-0">
          
          {/* Promotional Hero Banners */}
          <BannerCarousel />

          {/* Flash Sale / Lightning Deals Rail */}
          <LightningDeals />

          {/* Category Banner Header & Subcategory Tabs */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-red-50 rounded-2xl">{activeCategoryObj.icon}</span>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {activeCategoryObj.name}
                  </h1>
                  <span className="text-xs text-gray-400 font-medium">
                    Showing {displayProducts.length} fresh items delivered in 10 mins
                  </span>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-100 hover:bg-gray-200 border-none rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 outline-none cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>

            {/* Subcategory Pills */}
            {activeCategoryObj.subcategories && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedSubcategory("All")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                    selectedSubcategory === "All"
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Items
                </button>
                {activeCategoryObj.subcategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                      selectedSubcategory === sub
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {displayProducts.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <div className="text-5xl mb-3">🥦</div>
              <h3 className="font-extrabold text-lg text-gray-800">No items available in this category</h3>
              <p className="text-xs text-gray-400 mt-1">Please try selecting another subcategory or category.</p>
            </div>
          )}
        </main>
      </div>

      {/* Floating Bottom Cart Pill (Mobile/Responsive view) */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between font-black text-sm active:scale-98 transition-all ring-4 ring-green-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                  {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'} ADDED
                </span>
                <span className="text-base font-black">₹{itemTotal}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-xl text-xs font-extrabold">
              <span>View Cart</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>
      )}

      {/* Instamart Real Footer */}
      <footer className="bg-[#02060C] text-white mt-16 border-t border-gray-800">
        {/* App Download Nudge Bar */}
        <div className="bg-[#1A1E26] py-10 px-6 border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                For better experience, download the Instamart app now
              </h3>
              <p className="text-xs text-gray-400 mt-1">Get instant 10-minute grocery delivery on iOS & Android</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-gray-900 border border-gray-700 hover:border-gray-500 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2">
                <span> App Store</span>
              </button>
              <button className="bg-gray-900 border border-gray-700 hover:border-gray-500 px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2">
                <span>▶ Google Play</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 text-xs text-gray-400">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-xl">
              <span className="bg-red-600 px-2 py-0.5 rounded-lg text-sm">IM</span> instamart
            </div>
            <p className="text-[11px] leading-relaxed">
              © 2026 Bundl Technologies Pvt. Ltd. Instamart is Swiggy's quick-commerce service delivering groceries in 10 minutes.
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm mb-3">Company</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li className="hover:text-white cursor-pointer">Instamart Dark Stores</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Swiggy One</li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm mb-3">Contact us</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Help & Support</li>
              <li className="hover:text-white cursor-pointer">Partner with us</li>
              <li className="hover:text-white cursor-pointer">Ride with us</li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm mb-3">We deliver to</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Bengaluru</li>
              <li className="hover:text-white cursor-pointer">Mumbai</li>
              <li className="hover:text-white cursor-pointer">Delhi NCR</li>
              <li className="hover:text-white cursor-pointer">Hyderabad</li>
              <li className="hover:text-white cursor-pointer">Pune & 27+ Cities</li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-white text-sm mb-3">Top Categories</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Fresh Vegetables</li>
              <li className="hover:text-white cursor-pointer">Fresh Fruits</li>
              <li className="hover:text-white cursor-pointer">Dairy & Bread</li>
              <li className="hover:text-white cursor-pointer">Munchies & Chips</li>
            </ul>
          </div>
        </div>

        {/* Bottom Social Bar */}
        <div className="max-w-7xl mx-auto px-6 py-6 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <span>© 2026 Swiggy Instamart Clone</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Facebook</span>
            <span className="hover:text-white cursor-pointer">Instagram</span>
            <span className="hover:text-white cursor-pointer">Twitter / X</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Notifications */}
      <LocationModal />
      <SearchModal />
      <ProductModal />
      <CartDrawer />
      <OrderTrackerModal />
      <UserProfileDrawer />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
