'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchLiveProducts } from './productService';
import { Product } from './types';
import { useLanguage } from '../shared/LanguageContext';
import { Flame, ChevronLeft, ChevronRight, Gift, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../cart/CartContext';

const DEFAULT_COMBO_BUNDLES: Product[] = [
  {
    id: 'combo-phone-cooler-sleeves',
    name: 'ESPORTS DUO: PIVA B3 25W COOLER + FLYDIGI 5 SLEEVES',
    nameBn: 'ই-স্পোর্টস মেগা ডুও: পিভা B3 ফোন কুলার + ফ্লাইডিজি ৫ স্লিভস',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 1850,
    originalPrice: 2350,
    discountBadge: '-21%',
    rating: 5.0,
    reviewCount: 42,
    soldCount: 88,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=80',
    comboImages: [
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    ],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isComboOffer: true,
    description: '25W Ice Cooler plus Flydigi silver fiber gaming sleeves combo bundle.',
    descriptionBn: '২৫ ওয়াট সুপার চিলিং ফোন কুলার এবং ফ্লাইডিজি ঘামরোধী ফিঙ্গার স্লিভস মেগা কম্বো।',
    specs: ['25W Fast Cool', 'Flydigi 5 Sleeves', '2-in-1 Value Pack'],
  },
  {
    id: 'combo-keyboard-mouse',
    name: 'PRO GAMER SET: RGB MECHANICAL KEYBOARD + GAMING MOUSE',
    nameBn: 'প্রো গেমার সেট: আরজিবি মেকানিক্যাল কিবোর্ড + গেমিং মাউস',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 3650,
    originalPrice: 4700,
    discountBadge: '-22%',
    rating: 4.9,
    reviewCount: 68,
    soldCount: 125,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
    comboImages: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80',
    ],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Mechanical keyboard and precision gaming mouse combo pack.',
    descriptionBn: 'মেকানিক্যাল আরজিবি কীবোর্ড এবং হাই-ডিপিআই গেমিং মাউস কম্বো প্যাক।',
    specs: ['Mechanical Blue/Red Switch', '7200 DPI Mouse', 'Free Mousepad'],
  },
  {
    id: 'combo-streamer-3in1',
    name: 'ULTIMATE 3-IN-1: COOLER + SLEEVES + FAST CHARGER',
    nameBn: 'আলটিমেট ৩-ইন-১ প্যাক: মেমো কুলার + স্লিভস + ফাস্ট ক্যাবল',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 3250,
    originalPrice: 4400,
    discountBadge: '-26%',
    rating: 4.9,
    reviewCount: 54,
    soldCount: 76,
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&auto=format&fit=crop&q=80',
    comboImages: [
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
    ],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isComboOffer: true,
    description: '3-in-1 ultimate gaming streamer pack with 3 items together.',
    descriptionBn: 'ফোন কুলার, ফিঙ্গার স্লিভস এবং ফাস্ট চার্জিং কেবলসহ ৩টি পণ্য একসাথে।',
    specs: ['3 Items Included', 'Mega Savings', 'Free Fast Delivery'],
  },
  {
    id: 'combo-audio-duo',
    name: 'IMMERSIVE AUDIO: 7.1 HEADSET + PORTABLE SOUNDBOX',
    nameBn: 'ইমার্সিভ অডিও ডুও: ৭.১ গেমিং হেডসেট + পোর্টেবল সাউন্ডবক্স',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 3100,
    originalPrice: 4150,
    discountBadge: '-25%',
    rating: 4.8,
    reviewCount: 39,
    soldCount: 58,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
    comboImages: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=80',
    ],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Surround sound gaming headset and portable wireless speaker bundle.',
    descriptionBn: '৭.১ সাররাউন্ড সাউন্ড গেমিং হেডসেট এবং ওয়াটারপ্রুফ পোর্টেবল সাউন্ডবক্স কম্বো।',
    specs: ['7.1 Surround Sound', 'Deep Bass Soundbox', 'Dual Audio Deal'],
  },
];

export const ComboOfferSection: React.FC = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [comboProducts, setComboProducts] = useState<Product[]>(DEFAULT_COMBO_BUNDLES);
  const { language } = useLanguage();
  const { addToCart } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCombos = async () => {
      const allProds = await fetchLiveProducts();
      const liveCombos = allProds.filter((p) => p.isComboOffer === true || p.category === 'combo-offers' || p.category === 'combo');
      if (liveCombos.length > 0) {
        const merged = [
          ...liveCombos,
          ...DEFAULT_COMBO_BUNDLES.filter((d) => !liveCombos.some((l) => l.id === d.id)),
        ];
        setComboProducts(merged);
      } else {
        setComboProducts(DEFAULT_COMBO_BUNDLES);
      }
    };
    loadCombos();

    window.addEventListener('products_updated', loadCombos);
    window.addEventListener('storage', loadCombos);
    return () => {
      window.removeEventListener('products_updated', loadCombos);
      window.removeEventListener('storage', loadCombos);
    };
  }, []);

  useEffect(() => {
    if (isHovered || !carouselRef.current || comboProducts.length === 0) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
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
        className="flex space-x-4 sm:space-x-5 overflow-x-auto scrollbar-none py-3 px-1 snap-x overscroll-x-contain"
      >
        {comboProducts.map((comboProduct) => (
          <div
            key={comboProduct.id}
            className="min-w-[280px] sm:min-w-[350px] max-w-[365px] shrink-0 snap-start bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-2xs hover:shadow-xl hover:border-orange-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            <Link href={`/product/${comboProduct.id}`} className="block flex-1">
              <div className="relative p-3 bg-slate-100/70 overflow-hidden border-b border-gray-100">
                {comboProduct.discountBadge && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md z-20 uppercase tracking-wide">
                    {comboProduct.discountBadge}
                  </span>
                )}

                {/* Multiple Images Displayed Together in Combo Offer */}
                {comboProduct.comboImages && comboProduct.comboImages.length > 1 ? (
                  <div className="w-full h-48 sm:h-52 flex flex-col justify-center items-center py-2 px-1">
                    <div className="w-full flex items-center justify-center gap-2 sm:gap-2.5 flex-1">
                      {comboProduct.comboImages.slice(0, 3).map((imgUrl, idx, arr) => (
                        <React.Fragment key={idx}>
                          <div className="relative flex-1 h-34 sm:h-36 bg-white rounded-2xl p-2 flex items-center justify-center border border-gray-200/90 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={imgUrl}
                              alt={`${comboProduct.name} - Item ${idx + 1}`}
                              loading="lazy"
                              decoding="async"
                              className="max-h-full max-w-full object-contain drop-shadow-xs"
                            />
                            <span className="absolute bottom-1 right-1.5 text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.2 rounded-md shadow-2xs">
                              #{idx + 1}
                            </span>
                          </div>
                          {idx < arr.length - 1 && (
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-md z-10 border-2 border-white animate-pulse">
                              +
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Combo Count Badge */}
                    <div className="mt-2 text-center">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-orange-800 bg-orange-100/90 px-3 py-0.5 rounded-full border border-orange-200 shadow-2xs">
                        <Gift className="w-3 h-3 text-orange-600" />
                        <span>{comboProduct.comboImages.length}টি পণ্য একসাথে মেগা সেভিংস বান্ডেল</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 sm:h-52 flex items-center justify-center p-2 pt-6">
                    <img
                      src={comboProduct.image}
                      alt={comboProduct.name}
                      loading="lazy"
                      decoding="async"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-5 pb-0">
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
            </Link>

            <div className="p-4 sm:p-5 pt-3">
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
