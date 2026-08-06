import React, { useState, useEffect } from 'react';
import { BANNERS } from '../data/banners';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent(prev => (prev === 0 ? BANNERS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent(prev => (prev + 1) % BANNERS.length);
  };

  const banner = BANNERS[current];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg group">
      {/* Banner Container */}
      <div
        className="w-full h-44 sm:h-56 md:h-64 transition-all duration-700 ease-in-out relative flex items-center justify-between p-6 sm:p-10 text-white"
        style={{ background: banner.bgGradient }}
      >
        {/* Left Text Content */}
        <div className="max-w-xs sm:max-w-md z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] sm:text-xs font-black uppercase px-2.5 py-1 rounded-full tracking-wider border border-white/30">
            <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            {banner.badge}
          </span>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight leading-none text-white drop-shadow-md">
            {banner.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 font-medium line-clamp-2">
            {banner.subtitle}
          </p>
          <button className="mt-2 bg-white text-gray-900 font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md hover:bg-yellow-300 hover:text-black transition-all transform active:scale-95">
            {banner.cta} →
          </button>
        </div>

        {/* Right Image Graphic */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 sm:w-2/5 overflow-hidden">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)' }}
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              current === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
