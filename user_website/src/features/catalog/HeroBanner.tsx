'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Flame, Sparkles, Award } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';

const BANNER_IMAGES = [
  '/images/banners/banner1.png',
  '/images/banners/banner2.png',
  '/images/banners/banner3.png',
  '/images/banners/banner4.png',
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length);

  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2">
      {/* Full-Bleed Hero Banner Slider Container */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 aspect-[21/9] sm:aspect-[24/9] md:aspect-[27/9] min-h-[260px] sm:min-h-[360px] md:min-h-[420px] group flex items-center justify-center">
        
        {/* Banner Images Carousel - Spanning 100% Full Area */}
        {BANNER_IMAGES.map((imgSrc, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={imgSrc}
              alt={`Mex Tanim Store Banner ${index + 1}`}
              className="w-full h-full object-cover object-center rounded-3xl"
            />
            {/* Subtle Gradient Overlay for visual polish */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-black/20 pointer-events-none" />
          </div>
        ))}

        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-orange-500/40 shadow-lg">
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
          <span className="text-xs font-black text-white tracking-wider">
            Mex Tanim <span className="text-orange-400">Exclusive Deals</span>
          </span>
        </div>

        {/* Floating Shop Now Action Button */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 z-20 hidden sm:flex items-center space-x-3">
          <a
            href="#products"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-orange-500/40 flex items-center space-x-2 transition active:scale-95 border border-white/20 backdrop-blur-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.addToCart}</span>
          </a>
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-slate-950/70 hover:bg-orange-500 text-white backdrop-blur-md border border-white/20 transition-all z-20 shadow-xl opacity-90 hover:opacity-100 hover:scale-110 active:scale-95"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-slate-950/70 hover:bg-orange-500 text-white backdrop-blur-md border border-white/20 transition-all z-20 shadow-xl opacity-90 hover:opacity-100 hover:scale-110 active:scale-95"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Live Sliding Pagination Indicators Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2.5 z-20 bg-slate-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          {BANNER_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'w-8 bg-orange-500 shadow-md shadow-orange-500/80 scale-105'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
