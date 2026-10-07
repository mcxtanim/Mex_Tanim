'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProductCard } from './ProductCard';
import { fetchLiveProducts, getCachedProducts } from './productService';
import { Product } from './types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type TabType = 'featured' | 'bestsellers' | 'newarrivals';

// Rich dummy gaming products with diverse images to enable smooth stepped horizontal scrolling
const DUMMY_FEATURED_PRODUCTS: Product[] = [
  {
    id: 'dummy-cooler-1',
    name: 'MEMO CX08 Pro Magnetic RGB Phone Cooler',
    nameBn: 'মেমো CX08 প্রো ম্যাগনেটিক আরজিবি ফোন কুলার',
    category: 'gaming-cooler',
    categoryBn: 'গেমিং কুলার',
    brand: 'MEMO',
    brandBn: 'মেমো',
    price: 1650,
    originalPrice: 2200,
    discountBadge: '-25%',
    rating: 4.9,
    reviewCount: 68,
    image: 'https://res.cloudinary.com/nc5hyaab/image/upload/v1789770807/memo_cx08_cooler.jpg',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: false,
    description: 'High speed RGB semiconductor phone cooler with digital temperature display.',
    descriptionBn: 'উচ্চগতির সেমিকন্ডাক্টর ফোন কুলার যা ফোনকে রাখে বরফের মতো ঠান্ডা।',
    specs: ['RGB Lighting', 'Magnetic Mount', 'Type-C Power'],
  },
  {
    id: 'dummy-cooler-2',
    name: 'Black Shark FunCooler 3 Pro RGB Semiconductor Cooler',
    nameBn: 'ব্ল্যাক শার্ক ফানকুলার ৩ প্রো আরজিবি',
    category: 'gaming-cooler',
    categoryBn: 'গেমিং কুলার',
    brand: 'Black Shark',
    brandBn: 'ব্ল্যাক শার্ক',
    price: 2450,
    originalPrice: 2990,
    discountBadge: '-18%',
    rating: 5.0,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=80',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isComboOffer: false,
    description: '20W ultra-high power cooling system with dual Peltier semiconductor.',
    descriptionBn: '২০W আল্ট্রা ফাস্ট কুলিং ক্ষমতা সহ গেমিং ফোন কুলার।',
    specs: ['20W Fast Chill', 'RGB Ambient', 'Universal Clip'],
  },
  {
    id: 'dummy-mouse-1',
    name: 'Razer DeathAdder Essential Gaming Mouse',
    nameBn: 'রেজার ডেথঅ্যাডার এসেনশিয়াল গেমিং মাউস',
    category: 'gaming-mice',
    categoryBn: 'গেমিং মাউস',
    brand: 'Razer',
    brandBn: 'রেজার',
    price: 1850,
    originalPrice: 2450,
    discountBadge: '-24%',
    rating: 4.9,
    reviewCount: 76,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: false,
    description: '6400 DPI optical sensor with 5 Hyperesponse programmable buttons.',
    descriptionBn: '৬৪০০ ডিপিআই অপটিক্যাল সেন্সর সহ পেশাদার গেমিং মাউস।',
    specs: ['6400 DPI', 'Mechanical Switches', 'Ergonomic Form'],
  },
  {
    id: 'dummy-trigger-1',
    name: 'MEMO AK05 Mechanical Gaming Triggers (L1R1)',
    nameBn: 'মেমো AK05 মেকানিক্যাল গেমিং ট্রিগার',
    category: 'gaming-triggers',
    categoryBn: 'গেমিং ট্রিগার',
    brand: 'MEMO',
    brandBn: 'মেমো',
    price: 650,
    originalPrice: 850,
    discountBadge: '-24%',
    rating: 4.8,
    reviewCount: 92,
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&auto=format&fit=crop&q=80',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: false,
    description: 'Capacitive pulse high frequency continuous click gaming triggers for PUBG.',
    descriptionBn: 'পাবজি ও ফ্রি-ফায়ারের জন্য হাই-স্পিড মেকানিক্যাল গেমিং ট্রিগার।',
    specs: ['Continuous Click', 'Alloy Button', 'Ergonomic Grip'],
  },
  {
    id: 'dummy-sleeve-1',
    name: 'Sarafox V8 Carbon Fiber Sweatproof Finger Sleeves',
    nameBn: 'সারাফক্স V8 কার্বন ফাইবার সোয়েটপ্রুফ ফিঙ্গার স্লিভস',
    category: 'finger-sleeves',
    categoryBn: 'ফিঙ্গার স্লিভস',
    brand: 'Sarafox',
    brandBn: 'সারাফক্স',
    price: 180,
    originalPrice: 250,
    discountBadge: '-28%',
    rating: 4.9,
    reviewCount: 140,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isComboOffer: false,
    description: 'Ultra-thin 0.25mm breathable glass silver fiber for zero latency touch.',
    descriptionBn: 'ঘামরোধী পাতলা গ্লাস সিলভার ফাইবার ফিঙ্গার স্লিভস।',
    specs: ['Zero Friction', 'Sweatproof', 'Ultra-sensitive'],
  },
  {
    id: 'dummy-keyboard-1',
    name: 'Redragon K552 Kumara RGB Mechanical Keyboard',
    nameBn: 'রেড্রাগন K552 কুমারা আরজিবি মেকানিক্যাল কীবোর্ড',
    category: 'mechanical-keyboards',
    categoryBn: 'মেকানিক্যাল কীবোর্ড',
    brand: 'Redragon',
    brandBn: 'রেড্রাগন',
    price: 2950,
    originalPrice: 3600,
    discountBadge: '-18%',
    rating: 4.9,
    reviewCount: 54,
    image: 'https://res.cloudinary.com/nc5hyaab/image/upload/v1789832461/products/photo-1587829741301-dc798b83add3.jpg',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: false,
    description: 'Compact 87-key Tenkeyless mechanical keyboard with dust-proof red switches.',
    descriptionBn: 'আরজিবি ব্যাকলিট প্রিমিয়াম মেকানিক্যাল গেমিং কীবোর্ড।',
    specs: ['Outemu Red Switch', 'RGB Backlight', 'Metal Construction'],
  },
  {
    id: 'dummy-earphone-1',
    name: 'Plextone G20 Type-C Dual Driver Gaming Earphones',
    nameBn: 'প্লেক্সটোন G20 টাইপ-সি ডুয়াল ড্রাইভার গেমিং ইয়ারফোন',
    category: 'gaming-headsets',
    categoryBn: 'গেমিং হেডসেট',
    brand: 'Plextone',
    brandBn: 'প্লেক্সটোন',
    price: 890,
    originalPrice: 1250,
    discountBadge: '-29%',
    rating: 4.8,
    reviewCount: 112,
    image: 'https://res.cloudinary.com/nc5hyaab/image/upload/v1789832462/products/photo-1546435770-a3e426bf472b.jpg',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isComboOffer: false,
    description: 'Gaming sound with tracking bass and detachable microphone for crystal chat.',
    descriptionBn: 'ফুটস্টেপ ও গুলির সাউন্ড নিখুঁতভাবে শোনার জন্য স্পেশাল গেমিং ইয়ারফোন।',
    specs: ['Footstep Boost', 'Detachable Mic', 'Noise Isolation'],
  },
  {
    id: 'dummy-charger-1',
    name: 'Baseus 65W GaN5 Pro Ultra Fast Charger',
    nameBn: 'বেসাস ৬৫W GaN5 প্রো ফাস্ট চার্জার',
    category: 'fast-chargers',
    categoryBn: 'ফাস্ট চার্জার',
    brand: 'Baseus',
    brandBn: 'বেসাস',
    price: 2150,
    originalPrice: 2650,
    discountBadge: '-19%',
    rating: 4.9,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    isComboOffer: false,
    description: 'Multi-device fast charging adapter supporting PD 3.0, QC 4.0 and PPS.',
    descriptionBn: 'ল্যাপটপ ও ফোন একই সাথে ফুল স্পিডে চার্জ করার ৬৫W ফাস্ট চার্জার।',
    specs: ['65W GaN5 Tech', '3-Port Output', 'BPS II Charging'],
  },
  {
    id: 'dummy-cooler-3',
    name: 'Memo DLA7 Digital Display RGB Phone Cooler',
    nameBn: 'মেমো DLA7 ডিজিটাল ডিসপ্লে আরজিবি ফোন কুলার',
    category: 'gaming-cooler',
    categoryBn: 'গেমিং কুলার',
    brand: 'MEMO',
    brandBn: 'মেমো',
    price: 1350,
    originalPrice: 1750,
    discountBadge: '-23%',
    rating: 4.8,
    reviewCount: 31,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    isComboOffer: false,
    description: 'Semiconductor cooling with real-time temperature screen and silent fan.',
    descriptionBn: 'রিয়েল-টাইম তাপমাত্রা মনিটর ও আরজিবি লাইট সহ ফোন কুলার।',
    specs: ['Live Temp Screen', 'Low Noise 25dB', 'Universal Clip'],
  },
  {
    id: 'dummy-powerbank-1',
    name: 'Remax RPP-291 80000mAh 22.5W Fast Power Bank',
    nameBn: 'রিমেক্স ৮০,০০০mAh ফাস্ট চার্জিং পাওয়ার ব্যাংক',
    category: 'power-bank',
    categoryBn: 'পাওয়ার ব্যাংক',
    brand: 'Remax',
    brandBn: 'রিমেক্স',
    price: 3650,
    originalPrice: 4500,
    discountBadge: '-19%',
    rating: 4.9,
    reviewCount: 27,
    image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&auto=format&fit=crop&q=80',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: false,
    description: 'Huge capacity mobile battery bank with dual inputs and LED flashlight.',
    descriptionBn: 'বিশাল ব্যাটারি ব্যাকআপ ও ফাস্ট চার্জিং সুবিধাযুক্ত পাওয়ার ব্যাংক।',
    specs: ['80000mAh Capacity', '22.5W Fast PD', 'LED Display'],
  },
];

export const ProductTabsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('featured');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Client-side cache hydration
    const cachedProds = getCachedProducts();
    if (cachedProds.length > 0) {
      setAllProducts(cachedProds);
    }

    const loadData = async () => {
      const prods = await fetchLiveProducts();
      setAllProducts(prods);
    };
    loadData();

    const handleProductsUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setAllProducts(e.detail);
      } else {
        loadData();
      }
    };

    window.addEventListener('products_updated', handleProductsUpdate);
    window.addEventListener('storage', loadData);
    window.addEventListener('focus', loadData);
    return () => {
      window.removeEventListener('products_updated', handleProductsUpdate);
      window.removeEventListener('storage', loadData);
      window.removeEventListener('focus', loadData);
    };
  }, []);

  // Merge live products with dummy products so there are always plenty of products to scroll
  const mergedProducts = React.useMemo(() => {
    const existingIds = new Set(allProducts.map((p) => p.id));
    const supplemental = DUMMY_FEATURED_PRODUCTS.filter((p) => !existingIds.has(p.id));
    return [...allProducts, ...supplemental];
  }, [allProducts]);

  const activeTabProducts = React.useMemo(() => {
    return mergedProducts.filter((p) => {
      if (activeTab === 'featured') return p.isFeatured === true || (!p.isFeatured && !p.isBestSeller && !p.isNewArrival);
      if (activeTab === 'bestsellers') return p.isBestSeller === true;
      if (activeTab === 'newarrivals') return p.isNewArrival === true;
      return true;
    });
  }, [mergedProducts, activeTab]);

  // Stepped Interval Auto-Scroll ("থেমে থেমে স্ক্রল" - scrolls forward by 1 card step, pauses for 2.8s, then scrolls again)
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || activeTabProducts.length === 0) return;

    let isPaused = false;
    let resumeTimeout: NodeJS.Timeout;

    const pause = () => {
      isPaused = true;
      clearTimeout(resumeTimeout);
    };

    const resumeWithDelay = (delayMs = 2500) => {
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isPaused = false;
      }, delayMs);
    };

    const onMouseEnter = () => pause();
    const onMouseLeave = () => resumeWithDelay(1200);
    const onTouchStart = () => pause();
    const onTouchEnd = () => resumeWithDelay(3000);

    rail.addEventListener('mouseenter', onMouseEnter);
    rail.addEventListener('mouseleave', onMouseLeave);
    rail.addEventListener('touchstart', onTouchStart, { passive: true });
    rail.addEventListener('touchend', onTouchEnd, { passive: true });

    // Step every 2.8 seconds: smoothly glide forward by 1 card, pause, repeat
    const interval = setInterval(() => {
      if (isPaused || document.hidden || !railRef.current) return;

      const el = railRef.current;
      const firstCard = el.firstElementChild as HTMLElement | null;
      const cardWidth = firstCard?.offsetWidth || 250;
      const scrollStep = cardWidth + 16; // card width + gap
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 15) {
        // Reached the end: loop back smoothly to start
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll forward from right to left
        el.scrollBy({ left: scrollStep, behavior: 'smooth' });
      }
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(resumeTimeout);
      rail.removeEventListener('mouseenter', onMouseEnter);
      rail.removeEventListener('mouseleave', onMouseLeave);
      rail.removeEventListener('touchstart', onTouchStart);
      rail.removeEventListener('touchend', onTouchEnd);
    };
  }, [activeTab, activeTabProducts.length]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (railRef.current) {
      const firstCard = railRef.current.firstElementChild as HTMLElement | null;
      const cardWidth = firstCard?.offsetWidth || 250;
      const scrollStep = (cardWidth + 16) * 2;
      railRef.current.scrollBy({
        left: direction === 'left' ? -scrollStep : scrollStep,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Section Header: Bengali Title, Subtitle, and Clean Underlined Tabs (Matching Reference Image) */}
      <div className="text-center space-y-1.5 sm:space-y-2 relative">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          ফিচার্ড পণ্য
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          আপনার পছন্দের পণ্য দেখে নিন!
        </p>

        {/* Centered Minimalist Underlined Tabs with Arrow Controls */}
        <div className="relative flex items-center justify-center pt-2 sm:pt-3 border-b border-gray-200/80">
          <div className="flex items-center space-x-6 sm:space-x-10">
            <button
              onClick={() => setActiveTab('featured')}
              className={`text-xs sm:text-sm md:text-base transition-all pb-2 cursor-pointer ${
                activeTab === 'featured'
                  ? 'font-black text-slate-900 border-b-2 border-slate-900 -mb-px'
                  : 'font-semibold text-slate-400 hover:text-slate-700'
              }`}
            >
              ফিচার্ড
            </button>

            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`text-xs sm:text-sm md:text-base transition-all pb-2 cursor-pointer ${
                activeTab === 'bestsellers'
                  ? 'font-black text-slate-900 border-b-2 border-slate-900 -mb-px'
                  : 'font-semibold text-slate-400 hover:text-slate-700'
              }`}
            >
              বেস্টসেলার
            </button>

            <button
              onClick={() => setActiveTab('newarrivals')}
              className={`text-xs sm:text-sm md:text-base transition-all pb-2 cursor-pointer ${
                activeTab === 'newarrivals'
                  ? 'font-black text-slate-900 border-b-2 border-slate-900 -mb-px'
                  : 'font-semibold text-slate-400 hover:text-slate-700'
              }`}
            >
              নতুন এসেছে
            </button>
          </div>

          {/* Desktop Manual Carousel Arrow Buttons */}
          <div className="hidden sm:flex items-center space-x-1.5 absolute right-0 bottom-2">
            <button
              onClick={() => handleManualScroll('left')}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-black hover:text-white text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer border border-gray-200/60 active:scale-95"
              title="Previous"
              aria-label="Scroll left products"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleManualScroll('right')}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-black hover:text-white text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer border border-gray-200/60 active:scale-95"
              title="Next"
              aria-label="Scroll right products"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Stepped Horizontal Carousel Rail ("থেমে থেমে স্ক্রল") */}
      {activeTabProducts.length > 0 ? (
        <div
          ref={railRef}
          className="flex space-x-3 sm:space-x-4 lg:space-x-4.5 overflow-x-auto scrollbar-none py-2 px-0.5 snap-x overscroll-x-contain scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activeTabProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[220px] sm:min-w-[250px] md:min-w-[275px] lg:min-w-[295px] max-w-[310px] shrink-0 snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-white rounded-3xl border border-gray-100 p-6 text-gray-500 text-sm font-bold shadow-2xs">
          এই ট্যাবে কোনো পণ্য পাওয়া যায়নি
        </div>
      )}
    </section>
  );
};
