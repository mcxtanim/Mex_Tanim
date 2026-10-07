'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from './types';
import { fetchLiveProducts, getCachedProducts } from './productService';

export const STUDENT_COMBO_BUNDLES: Product[] = [
  {
    id: 'student-combo-pro-35mm',
    name: 'STUDENT COMBO PRO (3.5mm)',
    nameBn: 'স্টুডেন্ট কম্বো প্রো (৩.৫মিমি)',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 2100,
    originalPrice: 2100,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 21,
    image: '/combos/student-combo-pro.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Student Combo Pro with RGB phone cooler, 3.5mm gaming earphones, finger sleeves, and mobile triggers.',
    descriptionBn: 'স্টুডেন্ট কম্বো প্রো আরজিবি ফোন কুলার, ৩.৫মিমি গেমিং ইয়ারফোন, ফিঙ্গার স্লিভস এবং ট্রিগার সহ।',
    specs: ['Phone Cooler', '3.5mm Gaming Earphones', 'Finger Sleeves', 'Gaming Triggers'],
  },
  {
    id: 'combo-pc-gamer-master',
    name: 'PRO PC GAMER SET (4-IN-1)',
    nameBn: 'প্রো পিসি গেমার সেট (৪-ইন-১)',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 3650,
    originalPrice: 3650,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 38,
    image: '/combos/combo-pc-gamer.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Mechanical RGB Keyboard + Precision Gaming Mouse + Surround Gaming Headset + Heavy-Duty Fast Cable.',
    descriptionBn: 'মেকানিক্যাল আরজিবি কিবোর্ড + গেমিং মাউস + সাররাউন্ড হেডসেট + হেভি-ডিউটি কেবল কম্বো।',
    specs: ['Mechanical RGB Keyboard', 'Gaming Mouse', 'Surround Headset', 'Braided Cable'],
  },
  {
    id: 'combo-audio-streamer-duo',
    name: 'ULTIMATE AUDIO STREAMER DUO',
    nameBn: 'আলটিমেট অডিও স্ট্রিমার ডুও',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 3100,
    originalPrice: 3100,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 29,
    image: '/combos/combo-audio-duo.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: '7.1 Surround Gaming Headset + Portable RGB Bass Soundbox + Fast Braided Cable + Fast Charger adapter.',
    descriptionBn: '৭.১ গেমিং হেডসেট + আরজিবি ব্লুটুথ সাউন্ডবক্স + ফাস্ট চার্জার + টাইপ-সি ক্যাবল।',
    specs: ['7.1 Gaming Headset', 'RGB Soundbox', 'Fast Charger', 'Type-C Cable'],
  },
  {
    id: 'combo-fast-power-pack',
    name: 'FAST POWER ESPORTS PACK',
    nameBn: 'ফাস্ট পাওয়ার ই-স্পোর্টস প্যাক',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 2450,
    originalPrice: 2450,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 43,
    image: '/combos/combo-fast-power.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: '65W GaN Fast Charger + 100W Braided Cable + Semiconductor Phone Cooler + Silver Fiber Sleeves.',
    descriptionBn: '৬৫ ওয়াট ফাস্ট চার্জার + ১০০ ওয়াট ফাস্ট ক্যাবল + ম্যাগনেটিক কুলার + সিলভার স্লিভস।',
    specs: ['65W GaN Charger', '100W Fast Cable', 'Phone Cooler', 'Gaming Sleeves'],
  },
  {
    id: 'student-combo-double-power-typec',
    name: 'STUDENT COMBO DOUBLE POWER (TYPE-C)',
    nameBn: 'স্টুডেন্ট কম্বো ডাবল পাওয়ার (টাইপ-সি)',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 2000,
    originalPrice: 2000,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 15,
    image: '/combos/student-combo-double-power.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Dual-Turbine Semiconductor Phone Cooler + Type-C Low Latency Audio + Red Trim Sleeves + Mechanical Triggers.',
    descriptionBn: 'ডুয়াল ফ্যান টার্বো কুলার + টাইপ-সি অডিও ইয়ারফোন + ফিঙ্গার স্লিভস + অ্যালয় ট্রিগার।',
    specs: ['Dual Turbine Cooler', 'Type-C Audio', 'Red Sleeves', 'Mechanical Triggers'],
  },
  {
    id: 'combo-gamer-grooming-kit',
    name: 'GAMER GROOMING & LIFESTYLE KIT',
    nameBn: 'গেমার গ্রুমিং ও লাইফস্টাইল কিট',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 2250,
    originalPrice: 2250,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 18,
    image: '/combos/combo-gamer-grooming.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Vintage T9 Metal Trimmer + Waterproof Bluetooth Soundbox + Fast Wall Charger + Braided USB Cable.',
    descriptionBn: 'ভিন্টেজ T9 হেয়ার ট্রিমার + ওয়াটারপ্রুফ সাউন্ডবক্স + ফাস্ট চার্জার + ব্রেডেড ক্যাবল।',
    specs: ['T9 Pro Trimmer', 'Bluetooth Soundbox', 'Fast Charger', 'Type-C Cable'],
  },
  {
    id: 'combo-fps-tournament-pack',
    name: 'FPS TOURNAMENT PRO PACK',
    nameBn: 'এফপিএস টুর্নামেন্ট প্রো প্যাক',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 1850,
    originalPrice: 1850,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 52,
    image: '/combos/combo-fps-tactical.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Semiconductor Gaming Cooler + 24-Needle Silver Sleeves + Fast Charging Adapter + L-Bend Gaming Cable.',
    descriptionBn: 'গেমিং কুলার + ২৪-নিডল সিলভার স্লিভস + ফাস্ট চার্জার + এল-বেন্ড গেমিং ক্যাবল।',
    specs: ['Gaming Cooler', 'Silver Sleeves', 'Fast Charger', 'L-Bend Cable'],
  },
  {
    id: 'combo-desk-master-set',
    name: 'DESK SETUP MASTER COMBO',
    nameBn: 'ডেস্ক সেটআপ মাস্টার কম্বো',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 4200,
    originalPrice: 4200,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 27,
    image: '/combos/combo-desk-master.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'RGB Mechanical Keyboard + High DPI Gaming Mouse + Deep Bass Soundbox + GaN Multi-Port Charger.',
    descriptionBn: 'আরজিবি মেকানিক্যাল কিবোর্ড + গেমিং মাউস + ব্লুটুথ সাউন্ডবক্স + ফাস্ট চার্জার।',
    specs: ['Mechanical Keyboard', 'Gaming Mouse', 'Soundbox', 'GaN Charger'],
  },
];

interface ComboOfferSectionProps {
  onSelectCategory?: (category: string) => void;
}

export const ComboOfferSection: React.FC<ComboOfferSectionProps> = ({ onSelectCategory }) => {
  const router = useRouter();
  const railRef = useRef<HTMLDivElement>(null);
  const [comboProducts, setComboProducts] = useState<Product[]>(STUDENT_COMBO_BUNDLES);

  useEffect(() => {
    const cached = getCachedProducts();
    const cachedCombos = cached.filter(
      (p) => p.isComboOffer === true || p.category === 'combo-offers' || p.category === 'combo'
    );
    if (cachedCombos.length > 0) {
      setComboProducts([
        ...STUDENT_COMBO_BUNDLES,
        ...cachedCombos.filter((c) => !STUDENT_COMBO_BUNDLES.some((d) => d.id === c.id)),
      ]);
    }

    const loadCombos = async () => {
      const allProds = await fetchLiveProducts();
      const liveCombos = allProds.filter(
        (p) => p.isComboOffer === true || p.category === 'combo-offers' || p.category === 'combo'
      );
      if (liveCombos.length > 0) {
        setComboProducts([
          ...STUDENT_COMBO_BUNDLES,
          ...liveCombos.filter((c) => !STUDENT_COMBO_BUNDLES.some((d) => d.id === c.id)),
        ]);
      } else {
        setComboProducts(STUDENT_COMBO_BUNDLES);
      }
    };
    loadCombos();

    const handleProductsUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        const liveCombos = e.detail.filter(
          (p: Product) => p.isComboOffer === true || p.category === 'combo-offers' || p.category === 'combo'
        );
        if (liveCombos.length > 0) {
          setComboProducts([
            ...STUDENT_COMBO_BUNDLES,
            ...liveCombos.filter((c: Product) => !STUDENT_COMBO_BUNDLES.some((d) => d.id === c.id)),
          ]);
        }
      }
    };

    window.addEventListener('products_updated', handleProductsUpdate);
    window.addEventListener('storage', loadCombos);
    return () => {
      window.removeEventListener('products_updated', handleProductsUpdate);
      window.removeEventListener('storage', loadCombos);
    };
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  // Triple the combos array so the loop seamlessly continues forward indefinitely
  const loopProducts = React.useMemo(() => {
    if (comboProducts.length === 0) return [];
    return [...comboProducts, ...comboProducts, ...comboProducts];
  }, [comboProducts]);

  // Continuous seamless right-to-left auto-scroll every 2 seconds without ever reversing
  useEffect(() => {
    if (isHovered || !railRef.current || comboProducts.length <= 1) return;

    const interval = setInterval(() => {
      const rail = railRef.current;
      if (!rail) return;

      const first = rail.children[0] as HTMLElement | null;
      const second = rail.children[1] as HTMLElement | null;
      if (!first) return;

      const stride = second ? (second.offsetLeft - first.offsetLeft) : (first.offsetWidth + 16);
      const singleSetWidth = stride * comboProducts.length;

      // Silent invisible wrap: when scrolled past the set, silently shift back by 1 set width
      // with ZERO animation. Since sets are exact clones, the user's screen looks 100% identical!
      if (rail.scrollLeft >= singleSetWidth * 2 - 10) {
        rail.scrollLeft -= singleSetWidth;
      }

      // Smoothly advance 1 product card forward to the left
      rail.scrollBy({ left: stride, behavior: 'smooth' });
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovered, comboProducts.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    const rail = railRef.current;
    if (!rail || comboProducts.length === 0) return;

    const first = rail.children[0] as HTMLElement | null;
    const second = rail.children[1] as HTMLElement | null;
    if (!first) return;

    const stride = second ? (second.offsetLeft - first.offsetLeft) : (first.offsetWidth + 16);
    const singleSetWidth = stride * comboProducts.length;
    const scrollStep = stride * 2;

    if (direction === 'right') {
      if (rail.scrollLeft >= singleSetWidth * 2 - 10) {
        rail.scrollLeft -= singleSetWidth;
      }
      rail.scrollBy({ left: scrollStep, behavior: 'smooth' });
    } else {
      if (rail.scrollLeft <= stride) {
        rail.scrollLeft += singleSetWidth;
      }
      rail.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    }
  };

  const handleViewAll = () => {
    if (onSelectCategory) {
      onSelectCategory('combo-offers');
    } else {
      router.push('/categories?cat=combo-offers');
    }
  };

  if (comboProducts.length === 0) return null;

  return (
    <section className="space-y-3 sm:space-y-4">
      {/* Category Row Header (Matching Reference Screenshot) */}
      <div className="flex items-center justify-between pb-1">
        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-[#0B1A30] tracking-tight uppercase">
          COMBO OFFER
        </h3>

        <div className="flex items-center space-x-2">
          {/* Desktop Left/Right Scroll Arrows */}
          <div className="hidden sm:flex items-center space-x-1">
            <button
              onClick={() => handleScroll('left')}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-black hover:text-white text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer border border-gray-200/60 active:scale-95"
              title="Previous"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-7 h-7 rounded-full bg-gray-100 hover:bg-black hover:text-white text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer border border-gray-200/60 active:scale-95"
              title="Next"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* View All Pill Button (Matching Reference) */}
          <button
            onClick={handleViewAll}
            className="text-xs font-bold text-slate-800 hover:text-black bg-[#E5E7EB] hover:bg-gray-300 transition-all flex items-center space-x-1 cursor-pointer px-3.5 py-1 rounded-full border border-gray-300/60 active:scale-95 shadow-2xs"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Horizontal Product Rail (Infinite Seamless Right-to-Left Loop) */}
      <div
        ref={railRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex space-x-3 sm:space-x-4 lg:space-x-4.5 overflow-x-auto scrollbar-none py-1.5 px-0.5 overscroll-x-contain"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loopProducts.map((product, idx) => (
          <div
            key={`${product.id}-loop-${idx}`}
            className="min-w-[220px] sm:min-w-[250px] md:min-w-[275px] lg:min-w-[295px] max-w-[310px] shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComboOfferSection;
