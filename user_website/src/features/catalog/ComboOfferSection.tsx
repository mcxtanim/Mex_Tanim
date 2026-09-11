'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { COMBO_PRODUCTS } from './mockData';
import { Product } from './types';
import { useLanguage } from '../shared/LanguageContext';
import { Flame, ChevronLeft, ChevronRight, Gift, ShoppingCart, Star, Plus } from 'lucide-react';
import { useCart } from '../cart/CartContext';

export const ComboOfferSection: React.FC = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto scroll carousel left-to-right continuously
  useEffect(() => {
    if (isHovered || !carouselRef.current) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 330, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Gift className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                {language === 'bn' ? 'মেগা সেভিংস' : 'MEGA SAVINGS'}
              </span>
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                {COMBO_PRODUCTS.length} {language === 'bn' ? 'টি অফার' : 'Combo Bundles'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              COMBO OFFER
            </h2>
          </div>
        </div>

        {/* Header Right: Carousel Controls */}
        <div className="flex items-center space-x-3 self-end sm:self-auto">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleScroll('left')}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-2xs hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
              title="Scroll Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-2xs hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
              title="Scroll Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Combo Products Carousel */}
      <div
        ref={carouselRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex space-x-5 overflow-x-auto scrollbar-none py-3 px-1 snap-x touch-pan-x"
      >
        {COMBO_PRODUCTS.map((comboProduct) => (
          <div
            key={comboProduct.id}
            className="min-w-[300px] sm:min-w-[340px] max-w-[350px] shrink-0 snap-start bg-white rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-xl hover:border-orange-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
            onClick={() => router.push(`/product/${comboProduct.id}`)}
          >
            {/* Combo Multi-Product Image Area */}
            <div className="relative p-3.5 bg-slate-50/70 overflow-hidden border-b border-gray-100">
              {/* Discount Badge */}
              <span className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md z-20 uppercase tracking-wide">
                {comboProduct.discountBadge}
              </span>

              {/* Sold Count Badge */}
              {comboProduct.soldCount && (
                <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-orange-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1 z-20">
                  <Flame className="w-3 h-3 fill-orange-400" />
                  {comboProduct.soldCount} {language === 'bn' ? 'বিক্রি' : 'Sold'}
                </span>
              )}

              {/* Multi-Item Product Images Layout (Showing all combo items together with + symbols) */}
              {comboProduct.comboImages && comboProduct.comboImages.length > 0 ? (
                <div className="pt-7 pb-1 px-1 flex items-center justify-center gap-1.5 h-44 sm:h-48">
                  {comboProduct.comboImages.map((imgSrc, idx) => (
                    <React.Fragment key={idx}>
                      <div className="flex-1 h-32 sm:h-36 bg-white rounded-2xl p-1.5 border border-gray-200/80 shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={imgSrc}
                          alt={`Combo item ${idx + 1}`}
                          className="max-h-full max-w-full object-contain drop-shadow-xs"
                        />
                      </div>
                      {idx < comboProduct.comboImages!.length - 1 && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-md shrink-0 z-10">
                          +
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="w-full h-44 sm:h-48 flex items-center justify-center p-2 pt-6">
                  <img
                    src={comboProduct.image}
                    alt={comboProduct.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Combo Card Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                {/* Rating & Category */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span className="bg-orange-50 text-orange-600 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-md border border-orange-200">
                    COMBO BUNDLE ({comboProduct.comboImages?.length || 2} ITEMS)
                  </span>
                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{comboProduct.rating}</span>
                    <span className="text-gray-400 text-[10px]">({comboProduct.reviewCount})</span>
                  </div>
                </div>

                {/* Combo Title */}
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                  {language === 'bn' ? comboProduct.nameBn : comboProduct.name}
                </h3>
              </div>

              {/* Price & Action Button */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      ৳{comboProduct.price}
                    </span>
                    {comboProduct.originalPrice > comboProduct.price && (
                      <span className="text-xs text-gray-400 line-through font-semibold">
                        ৳{comboProduct.originalPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-extrabold block">
                    {language === 'bn' ? 'কম্বো স্পেশাল ডিল' : 'Combo Special Deal'}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(comboProduct);
                  }}
                  className="px-3.5 py-2.5 bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center space-x-1.5 shrink-0 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'অর্ডার করুন' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};
