'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, Flame, Tag, Award } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
import { useCart } from '../cart/CartContext';

const BANNER_IMAGES = [
  '/images/banners/banner1.png',
  '/images/banners/banner2.png',
  '/images/banners/banner3.png',
  '/images/banners/banner4.png',
];

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();
  const { openCart } = useCart();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const bannerData = t.banners[currentSlide] || t.banners[0];
  const currentImage = BANNER_IMAGES[currentSlide];

  return (
    <section id="hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2">
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white transition-all duration-700 shadow-2xl border border-slate-800 min-h-[380px] sm:min-h-[440px] flex items-center group">
        
        {/* Decorative Radial Backdrop Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-orange-950/60 z-0 pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative z-10 w-full p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 backdrop-blur-md">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="text-xs font-extrabold text-orange-300 tracking-wider">
                {bannerData.badge}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-orange-200">
              {bannerData.title}
            </h1>

            <p className="text-xs sm:text-base text-gray-300 max-w-xl leading-relaxed">
              {bannerData.subtitle}
            </p>

            {/* Highlights badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold">
              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>{bannerData.accentText}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-orange-500/30 text-orange-200 px-3 py-1.5 rounded-lg border border-orange-500/30">
                <Tag className="w-4 h-4 text-orange-400" />
                <span>{bannerData.priceTag}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="#products"
                className="px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-orange-500/30 flex items-center space-x-2 transition active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </a>
              <a
                href="#categories"
                className="px-5 py-3 sm:px-6 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/10 backdrop-blur-md transition"
              >
                {t.viewAll}
              </a>
            </div>
          </div>

          {/* Right Image Showcase using uploaded banner images */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative w-full max-w-lg h-60 sm:h-72 lg:h-80 rounded-2xl overflow-hidden border-2 border-orange-500/30 shadow-2xl transition duration-700">
              <img
                src={currentImage}
                alt={`Banner Slide ${currentSlide + 1}`}
                className="w-full h-full object-cover rounded-2xl transition-all duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 flex items-center space-x-1.5 shadow-lg">
                <Award className="w-4 h-4 text-orange-400" />
                <span>Mex Tanim Exclusive</span>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-orange-500 text-white backdrop-blur-md border border-white/10 transition z-20 shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-orange-500 text-white backdrop-blur-md border border-white/10 transition z-20 shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Live Sliding Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
          {BANNER_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-orange-500 shadow-md shadow-orange-500/50' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
