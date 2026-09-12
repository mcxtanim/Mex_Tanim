'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchLiveProducts } from './productService';
import { Product } from './types';
import { useLanguage } from '../shared/LanguageContext';
import { Flame, ChevronLeft, ChevronRight, Gift, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../cart/CartContext';

export const ComboOfferSection: React.FC = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [comboProducts, setComboProducts] = useState<Product[]>([]);
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCombos = async () => {
      const allProds = await fetchLiveProducts();
      const combos = allProds.filter((p) => p.isComboOffer === true || p.category === 'combo-offers' || p.category === 'combo');
      setComboProducts(combos);
    };
    loadCombos();

    window.addEventListener('storage', loadCombos);
    return () => window.removeEventListener('storage', loadCombos);
  }, []);

  useEffect(() => {
    if (isHovered || !carouselRef.current || comboProducts.length === 0) return;

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
  }, [isHovered, comboProducts]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (comboProducts.length === 0) return null;

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
                {comboProducts.length} {language === 'bn' ? 'টি অফার' : 'Combo Bundles'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              COMBO OFFER
            </h2>
          </div>
        </div>

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
        {comboProducts.map((comboProduct) => (
          <div
            key={comboProduct.id}
            className="min-w-[300px] sm:min-w-[340px] max-w-[350px] shrink-0 snap-start bg-white rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-xl hover:border-orange-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
            onClick={() => router.push(`/product/${comboProduct.id}`)}
          >
            <div className="relative p-3.5 bg-slate-50/70 overflow-hidden border-b border-gray-100">
              {comboProduct.discountBadge && (
                <span className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md z-20 uppercase tracking-wide">
                  {comboProduct.discountBadge}
                </span>
              )}

              <div className="w-full h-44 sm:h-48 flex items-center justify-center p-2 pt-6">
                <img
                  src={comboProduct.image}
                  alt={comboProduct.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                />
              </div>
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                  <span className="bg-orange-50 text-orange-600 font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-md border border-orange-200">
                    COMBO BUNDLE
                  </span>
                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{comboProduct.rating}</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                  {language === 'bn' ? comboProduct.nameBn : comboProduct.name}
                </h3>
              </div>

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
