'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Flame } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
import { Banner, DEFAULT_BANNERS, getStoredBanners, fetchLiveBanners, subscribeToBannerUpdates } from './bannerService';

export const HeroBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language, t } = useLanguage();
  const bannersRef = useRef<Banner[]>(banners);

  // Keep bannersRef always synchronized with current banners state
  bannersRef.current = banners;

  // 1. Initial preloading & Live updates
  useEffect(() => {
    const initial = getStoredBanners();
    setBanners(initial);

    // Preload images for smooth zero-flicker transitions
    const preload = (list: Banner[]) => {
      if (typeof window === 'undefined') return;
      list.forEach((b) => {
        if (b.imageUrl) {
          const img = new Image();
          img.src = b.imageUrl;
        }
      });
    };

    preload(initial);

    // Fetch fresh banners from Supabase
    fetchLiveBanners().then((live) => {
      if (live && live.length > 0) {
        setBanners(live);
        preload(live);
      }
    });

    // Real-time subscription (Supabase Realtime + BroadcastChannel + window focus + polling)
    const unsubscribe = subscribeToBannerUpdates((updated) => {
      if (updated && updated.length > 0) {
        setBanners(updated);
        preload(updated);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 2. UNSTOPPABLE Continuous Autoplay (changes slide every 3.5 seconds automatically)
  useEffect(() => {
    const interval = setInterval(() => {
      const list = bannersRef.current;
      if (list && list.length > 1) {
        setCurrentSlide((prev) => (prev + 1) % list.length);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const totalSlides = banners.length;
  const safeIndex = totalSlides > 0 ? currentSlide % totalSlides : 0;
  const currentBanner = banners[safeIndex];

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide(index);
  };

  if (!banners || banners.length === 0) {
    return null;
  }

  const titleText = language === 'bn'
    ? (currentBanner?.titleBn || currentBanner?.title)
    : (currentBanner?.title || currentBanner?.titleBn);

  const subtitleText = language === 'bn'
    ? (currentBanner?.subtitleBn || currentBanner?.subtitle)
    : (currentBanner?.subtitle || currentBanner?.subtitleBn);

  const badgeText = currentBanner?.badgeText || 'Exclusive Deals';
  const buttonText = currentBanner?.buttonText || t.addToCart;
  const buttonLink = currentBanner?.buttonLink || '#products';

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger slide change if swipe is predominantly horizontal and > 45px
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <section id="hero" className="w-full select-none">
      {/* Full-Bleed Hero Banner Slider Container - Centered Wide Aspect Ratio (Hunter Reference Style) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 shadow-md sm:shadow-xl border border-gray-100/80 aspect-[16/7.5] sm:aspect-[21/8] md:aspect-[24/8] lg:aspect-[26/8] min-h-[170px] sm:min-h-[280px] md:min-h-[340px] group flex items-center justify-center"
      >
        
        {/* Banner Images Carousel - Spanning 100% Full Area with Smooth Transition */}
        {banners.map((item, index) => {
          const isActive = index === safeIndex;
          return (
            <div
              key={item.id || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={item.imageUrl}
                alt={item.title || `Banner ${index + 1}`}
                className="w-full h-full object-cover object-center rounded-2xl sm:rounded-3xl"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {/* Subtle Gradient Overlay for visual contrast and text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/10 pointer-events-none" />
            </div>
          );
        })}

        {/* Dynamic Title / Subtitle Text Overlay (if custom title or subtitle is configured) */}
        {(titleText || subtitleText) && (
          <div className="absolute top-4 left-4 sm:top-10 sm:left-10 md:left-12 z-20 max-w-xl pointer-events-none space-y-1 sm:space-y-1.5 animate-in fade-in duration-300">
            {titleText && (
              <h2 className="text-sm sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] leading-tight">
                {titleText}
              </h2>
            )}
            {subtitleText && (
              <p className="text-[11px] sm:text-sm md:text-base font-semibold text-slate-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] line-clamp-1 sm:line-clamp-2">
                {subtitleText}
              </p>
            )}
          </div>
        )}

        {/* Bottom-Left Floating Badge */}
        {badgeText && (
          <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-8 z-20 flex items-center space-x-1.5 sm:space-x-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-orange-500/40 shadow-lg transition-all">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs font-black text-white tracking-wider">
              Mex Tanim <span className="text-orange-400">{badgeText}</span>
            </span>
          </div>
        )}

        {/* Floating Action Button on Bottom-Right */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-20 hidden sm:flex items-center space-x-3">
          <a
            href={buttonLink}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center space-x-2 transition active:scale-95 border border-white/20 backdrop-blur-md cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{buttonText}</span>
          </a>
        </div>

        {/* Left Arrow Button (Desktop only on hover) */}
        {totalSlides > 1 && (
          <button
            onClick={prevSlide}
            type="button"
            className="hidden sm:flex absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-slate-950/60 hover:bg-black text-white backdrop-blur-md border border-white/20 transition-all z-20 shadow-lg opacity-0 group-hover:opacity-90 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Arrow Button (Desktop only on hover) */}
        {totalSlides > 1 && (
          <button
            onClick={nextSlide}
            type="button"
            className="hidden sm:flex absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-slate-950/60 hover:bg-black text-white backdrop-blur-md border border-white/20 transition-all z-20 shadow-lg opacity-0 group-hover:opacity-90 hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

      </div>

      {/* Pagination Dots Placed Beneath the Banner (Matching Hunter Reference Screenshot) */}
      {totalSlides > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-3 sm:pt-3.5">
          {banners.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => handleDotClick(index, e)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                safeIndex === index
                  ? 'w-6 sm:w-7 bg-black scale-105'
                  : 'w-2 sm:w-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
