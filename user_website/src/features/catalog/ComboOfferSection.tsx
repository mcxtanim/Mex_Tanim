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
    nameBn: 'STUDENT COMBO PRO (3.5mm)',
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
    description: 'Student Combo Pro (3.5mm) with phone cooler, 3.5mm gaming earphones, finger sleeves, and gaming triggers.',
    descriptionBn: 'স্টুডেন্ট কম্বো প্রো (৩.৫মিমি) ফোন কুলার, গেমিং ইয়ারফোন, ফিঙ্গার স্লিভস এবং ট্রিগার সহ।',
    specs: ['Phone Cooler', '3.5mm Gaming Earphones', 'Finger Sleeves', 'Gaming Triggers'],
  },
  {
    id: 'student-combo-lite-35mm',
    name: 'STUDENT COMBO LITE (3.5mm)',
    nameBn: 'STUDENT COMBO LITE (3.5mm)',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 1400,
    originalPrice: 1400,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 21,
    image: '/combos/student-combo-lite.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Student Combo Lite (3.5mm) gaming set with cooler, earphones, sleeves, and triggers.',
    descriptionBn: 'স্টুডেন্ট কম্বো লাইট (৩.৫মিমি) গেমিং কম্বো প্যাক।',
    specs: ['RGB Cooler', '3.5mm Earphones', 'Gaming Sleeves', 'Mobile Trigger'],
  },
  {
    id: 'student-combo-lite-typec',
    name: 'STUDENT COMBO LITE (TYPE-C)',
    nameBn: 'STUDENT COMBO LITE (TYPE-C)',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 1500,
    originalPrice: 1500,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 25,
    image: '/combos/student-combo-lite-typec.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Student Combo Lite (Type-C) high-speed gaming setup.',
    descriptionBn: 'স্টুডেন্ট কম্বো লাইট (টাইপ-সি) স্পেশাল গেমিং প্যাক।',
    specs: ['Type-C Audio', 'Cooling Fan', 'Sweatproof Sleeves', 'Gaming Trigger'],
  },
  {
    id: 'student-combo-double-power-typec',
    name: 'STUDENT COMBO DOUBLE POWER (TYPE-C)',
    nameBn: 'STUDENT COMBO DOUBLE POWER (TYPE-C)',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 2000,
    originalPrice: 2000,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 1,
    image: '/combos/student-combo-double-power.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Student Combo Double Power (Type-C) dual-fan cooler combo setup.',
    descriptionBn: 'স্টুডেন্ট কম্বো ডাবল পাওয়ার (টাইপ-সি) ডুয়াল ফ্যান কুলার কম্বো।',
    specs: ['Dual Fan Cooler', 'Type-C Earphones', 'RGB Sleeves', 'Mechanical Trigger'],
  },
  {
    id: 'student-combo-ai-typec',
    name: 'STUDENT COMBO AI (TYPE-C)',
    nameBn: 'STUDENT COMBO AI (TYPE-C)',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 1900,
    originalPrice: 1900,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 47,
    image: '/combos/student-combo-ai.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Student Combo AI (Type-C) smart cooling and audio setup.',
    descriptionBn: 'স্টুডেন্ট কম্বো এআই (টাইপ-সি) স্মার্ট কুলিং ও অডিও কম্বো।',
    specs: ['AI Smart Cooler', 'Gaming Earphones', 'Fingertip Sleeves', 'Controller Trigger'],
  },
  {
    id: 'student-combo-ultra-typec',
    name: 'STUDENT COMBO ULTRA (TYPE-C)',
    nameBn: 'STUDENT COMBO ULTRA (TYPE-C)',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 2200,
    originalPrice: 2200,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 32,
    image: '/combos/student-combo-pro.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Student Combo Ultra (Type-C) ultra cooling bundle.',
    descriptionBn: 'স্টুডেন্ট কম্বো আল্ট্রা (টাইপ-সি) স্পেশাল বান্ডেল।',
    specs: ['Ultra Cooler', 'Gaming Audio', 'Flydigi Sleeves', 'Metal Triggers'],
  },
  {
    id: 'student-combo-rgb-max',
    name: 'STUDENT COMBO RGB MAX (3.5mm)',
    nameBn: 'STUDENT COMBO RGB MAX (3.5mm)',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 1750,
    originalPrice: 1750,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 19,
    image: '/combos/student-combo-lite.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Student Combo RGB Max (3.5mm) full gaming kit.',
    descriptionBn: 'স্টুডেন্ট কম্বো আরজিবি ম্যাক্স সম্পূর্ণ গেমিং কিট।',
    specs: ['RGB Chilling Fan', 'Bass Earphones', 'Gaming Sleeves', 'Fast Trigger'],
  },
  {
    id: 'student-combo-turbo-typec',
    name: 'STUDENT COMBO TURBO (TYPE-C)',
    nameBn: 'STUDENT COMBO TURBO (TYPE-C)',
    category: 'combo-offers',
    categoryBn: 'কম্বো অফার',
    brand: 'Mex Tanim',
    brandBn: 'মেক্স তানিম',
    price: 2350,
    originalPrice: 2350,
    discountBadge: '',
    rating: 0,
    reviewCount: 0,
    soldCount: 53,
    image: '/combos/student-combo-ai.png',
    comboImages: [],
    inStock: true,
    isPopular: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    isComboOffer: true,
    description: 'Student Combo Turbo (Type-C) high-performance esports set.',
    descriptionBn: 'স্টুডেন্ট কম্বো টার্বো (টাইপ-সি) হাই-পারফরম্যান্স ই-স্পোর্টস সেট।',
    specs: ['Turbo Cooling', 'Type-C DAC Earphones', 'Conductive Sleeves', 'Pro Trigger'],
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

  const handleScroll = (direction: 'left' | 'right') => {
    if (railRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      railRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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
      {/* Category Row Header (Matching Reference Screenshot media_1791399242536.png) */}
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

      {/* Horizontal Product Rail */}
      <div
        ref={railRef}
        className="flex space-x-3 sm:space-x-4 lg:space-x-4.5 overflow-x-auto scrollbar-none py-1.5 px-0.5 snap-x overscroll-x-contain scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {comboProducts.map((product) => (
          <div
            key={product.id}
            className="min-w-[220px] sm:min-w-[250px] md:min-w-[275px] lg:min-w-[295px] max-w-[310px] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComboOfferSection;
