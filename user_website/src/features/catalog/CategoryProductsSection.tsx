'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from './types';
import { fetchLiveProducts, getCachedProducts } from './productService';
import { isCategorySelected } from './categoryData';

interface CategorySectionDef {
  id: string;
  titleEn: string;
  titleBn: string;
  dummyProducts: Product[];
}

const CATEGORY_SECTIONS: CategorySectionDef[] = [
  {
    id: 'gaming-cooler',
    titleEn: 'GAMING COOLER',
    titleBn: 'গেমিং কুলার',
    dummyProducts: [
      {
        id: 'cooler-ex2',
        name: 'PLEXTONE EX2 ULTRA',
        nameBn: 'প্লেক্সটোন EX2 আল্ট্রা ফোন কুলার',
        category: 'gaming-cooler',
        categoryBn: 'গেমিং কুলার',
        brand: 'Plextone',
        brandBn: 'প্লেক্সটোন',
        price: 1100,
        originalPrice: 1450,
        discountBadge: '-24%',
        rating: 4.9,
        reviewCount: 31,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=80',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isComboOffer: false,
        description: 'Magnetic RGB semiconductor phone cooler with high speed silent fan.',
        descriptionBn: 'উচ্চগতির সাইলেন্ট ফ্যান সহ ম্যাগনেটিক আরজিবি ফোন কুলার।',
        specs: ['Magnetic Mount', 'RGB Light', 'Silent Fan'],
      },
      {
        id: 'cooler-cx15',
        name: 'MEMO CX15',
        nameBn: 'মেমো CX15 ম্যাগনেটিক কুলার',
        category: 'gaming-cooler',
        categoryBn: 'গেমিং কুলার',
        brand: 'MEMO',
        brandBn: 'মেমো',
        price: 1270,
        originalPrice: 1550,
        discountBadge: '-18%',
        rating: 5.0,
        reviewCount: 83,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        isComboOffer: false,
        description: 'Instant freeze semiconductor mobile cooler for heavy gaming.',
        descriptionBn: 'ইনস্ট্যান্ট ফ্রিজ সেমিকন্ডাক্টর মোবাইল কুলার।',
        specs: ['Instant Freeze', 'RGB Display', 'Type-C'],
      },
      {
        id: 'cooler-cx12',
        name: 'MEMO CX12 BATTERY COOLER',
        nameBn: 'মেমো CX12 ব্যাটারি ফোন কুলার',
        category: 'gaming-cooler',
        categoryBn: 'গেমিং কুলার',
        brand: 'MEMO',
        brandBn: 'মেমো',
        price: 1390,
        originalPrice: 1600,
        discountBadge: '-13%',
        rating: 4.8,
        reviewCount: 145,
        image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&auto=format&fit=crop&q=80',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isComboOffer: false,
        description: 'Wireless built-in battery cooling fan for untethered mobile gaming.',
        descriptionBn: 'বিল্ট-ইন রিচার্জেবল ব্যাটারি বিশিষ্ট ওয়্যারলেস কুলার।',
        specs: ['Built-in Battery', 'Yellow Edition', 'Silent Mode'],
      },
      {
        id: 'cooler-cx14',
        name: 'MEMO CX14 BATTERY COOLER',
        nameBn: 'মেমো CX14 ব্যাটারি কুলার',
        category: 'gaming-cooler',
        categoryBn: 'গেমিং কুলার',
        brand: 'MEMO',
        brandBn: 'মেমো',
        price: 1380,
        originalPrice: 1500,
        discountBadge: '-8%',
        rating: 4.9,
        reviewCount: 118,
        image: 'https://res.cloudinary.com/nc5hyaab/image/upload/v1789770807/memo_cx08_cooler.jpg',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isComboOffer: false,
        description: 'Dual clip and magnetic semiconductor cooler with rechargeable cell.',
        descriptionBn: 'ডুয়াল মাউন্ট সুবিধাযুক্ত হাই-স্পিড রিচার্জেবল কুলার।',
        specs: ['Magnetic & Clip', 'Rechargeable', 'RGB Ring'],
      },
      {
        id: 'cooler-cx08-pro',
        name: 'MEMO CX08 PRO PHONE COOLER',
        nameBn: 'মেমো CX08 প্রো ফোন কুলার',
        category: 'gaming-cooler',
        categoryBn: 'গেমিং কুলার',
        brand: 'MEMO',
        brandBn: 'মেমো',
        price: 1400,
        originalPrice: 1750,
        discountBadge: '-20%',
        rating: 5.0,
        reviewCount: 66,
        image: 'https://res.cloudinary.com/nc5hyaab/image/upload/v1789770807/memo_cx08_cooler.jpg',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isComboOffer: false,
        description: 'Digital display temperature monitoring semiconductor cooler.',
        descriptionBn: 'ডিজিটাল ডিসপ্লে তাপমাত্রা মনিটরিং সেমিকন্ডাক্টর কুলার।',
        specs: ['Temp Display', 'RGB Lighting', 'Sub-Zero Chill'],
      },
    ],
  },
  {
    id: 'finger-sleeves',
    titleEn: 'FINGER SLEEVES',
    titleBn: 'ফিঙ্গার স্লিভস',
    dummyProducts: [
      {
        id: 'sleeves-sarafox-v8',
        name: 'SARAFOX V8 CARBON FIBER SLEEVES',
        nameBn: 'সারাফক্স V8 কার্বন ফাইবার স্লিভস',
        category: 'finger-sleeves',
        categoryBn: 'ফিঙ্গার স্লিভস',
        brand: 'Sarafox',
        brandBn: 'সারাফক্স',
        price: 180,
        originalPrice: 240,
        discountBadge: '-25%',
        rating: 4.9,
        reviewCount: 154,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isComboOffer: false,
        description: '0.25mm ultra-thin sweatproof glass silver fiber gaming sleeves.',
        descriptionBn: 'ঘামরোধী পাতলা কার্বন সিলভার ফাইবার গেমিং স্লিভস।',
        specs: ['Zero Friction', 'Sweatproof', 'High Elasticity'],
      },
      {
        id: 'sleeves-flydigi-5',
        name: 'FLYDIGI WASP FEELERS 5 SILVER',
        nameBn: 'ফ্লাইডিজি ওয়াস্প ফিলার্স ৫',
        category: 'finger-sleeves',
        categoryBn: 'ফিঙ্গার স্লিভস',
        brand: 'Flydigi',
        brandBn: 'ফ্লাইডিজি',
        price: 250,
        originalPrice: 320,
        discountBadge: '-22%',
        rating: 5.0,
        reviewCount: 98,
        image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&auto=format&fit=crop&q=80',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        isComboOffer: false,
        description: 'Dense silver cloth gaming finger sleeves for seamless touch.',
        descriptionBn: 'ঘন সিলভার ফেব্রিক বিশিষ্ট প্রো গেমিং ফিঙ্গার স্লিভস।',
        specs: ['Silver Cloth', 'Seamless Knit', 'Pro Grade'],
      },
      {
        id: 'sleeves-memo-sweatproof',
        name: 'MEMO SWEATPROOF GAMING SLEEVES (2 PAIR)',
        nameBn: 'মেমো সোয়েটপ্রুফ গেমিং স্লিভস (২ জোড়া)',
        category: 'finger-sleeves',
        categoryBn: 'ফিঙ্গার স্লিভস',
        brand: 'MEMO',
        brandBn: 'মেমো',
        price: 160,
        originalPrice: 200,
        discountBadge: '-20%',
        rating: 4.8,
        reviewCount: 88,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&auto=format&fit=crop&q=80',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isComboOffer: false,
        description: 'Breathable elastic finger cots for PUBG Mobile and Free Fire.',
        descriptionBn: 'পাবজি ও ফ্রি-ফায়ারের জন্য স্মুথ টাচ রেসপন্স স্লিভস।',
        specs: ['2 Pairs', 'Breathable', 'Universal Fit'],
      },
      {
        id: 'sleeves-blackshark',
        name: 'BLACK SHARK PRO GAMING SLEEVES',
        nameBn: 'ব্ল্যাক শার্ক প্রো গেমিং স্লিভস',
        category: 'finger-sleeves',
        categoryBn: 'ফিঙ্গার স্লিভস',
        brand: 'Black Shark',
        brandBn: 'ব্ল্যাক শার্ক',
        price: 290,
        originalPrice: 380,
        discountBadge: '-24%',
        rating: 4.9,
        reviewCount: 62,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isComboOffer: false,
        description: 'Official esports tournament grade superconducting finger sleeves.',
        descriptionBn: 'ই-স্পোর্টস গ্রেড সুপারকন্ডাক্টিং সিলভার ফাইবার।',
        specs: ['Tournament Grade', 'Zero Lag', 'Anti-slip'],
      },
      {
        id: 'sleeves-shezi-24',
        name: 'SHEZI 24-NEEDLE SILVER SLEEVES',
        nameBn: 'শেজি ২৪-নিডল সিলভার স্লিভস',
        category: 'finger-sleeves',
        categoryBn: 'ফিঙ্গার স্লিভস',
        brand: 'Shezi',
        brandBn: 'শেজি',
        price: 190,
        originalPrice: 250,
        discountBadge: '-24%',
        rating: 4.8,
        reviewCount: 44,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isComboOffer: false,
        description: '24-needle ultra-dense micro-conductive weave gaming sleeves.',
        descriptionBn: '২৪-নিডল আল্ট্রা ডেন্স সিলভার ক্লথ ওয়েভ।',
        specs: ['24-Needle', 'Ultra Sensitive', 'Washable'],
      },
    ],
  },
  {
    id: 'gaming-headsets',
    titleEn: 'GAMING EARPHONE & HEADSETS',
    titleBn: 'গেমিং ইয়ারফোন ও হেডসেট',
    dummyProducts: [
      {
        id: 'headset-plextone-g20',
        name: 'PLEXTONE G20 TYPE-C DUAL DRIVER',
        nameBn: 'প্লেক্সটোন G20 টাইপ-সি গেমিং ইয়ারফোন',
        category: 'gaming-headsets',
        categoryBn: 'গেমিং হেডসেট',
        brand: 'Plextone',
        brandBn: 'প্লেক্সটোন',
        price: 890,
        originalPrice: 1250,
        discountBadge: '-29%',
        rating: 4.9,
        reviewCount: 77,
        image: 'https://res.cloudinary.com/nc5hyaab/image/upload/v1789832462/products/photo-1546435770-a3e426bf472b.jpg',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isComboOffer: false,
        description: 'Tracking bass and detachable microphone for mobile gaming.',
        descriptionBn: 'ফুটস্টেপ ও গুলির শব্দ ট্র্যাকিং এবং ডিটাচেবল মাইক।',
        specs: ['Dual Driver', 'Detachable Mic', 'Type-C DAC'],
      },
      {
        id: 'headset-jbl-quantum-100',
        name: 'JBL QUANTUM 100 GAMING HEADSET',
        nameBn: 'জেবিএল কোয়ান্টাম ১০০ গেমিং হেডসেট',
        category: 'gaming-headsets',
        categoryBn: 'গেমিং হেডসেট',
        brand: 'JBL',
        brandBn: 'জেবিএল',
        price: 2450,
        originalPrice: 2990,
        discountBadge: '-18%',
        rating: 5.0,
        reviewCount: 52,
        image: 'https://res.cloudinary.com/nc5hyaab/image/upload/v1789832449/products/photo-1590658268037-6bf12165a8df.jpg',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isComboOffer: false,
        description: 'QuantumSOUND signature over-ear gaming headphones.',
        descriptionBn: 'কোয়ান্টাম সাউন্ড সিগনেচার ওভার-ইয়ার হেডফোন।',
        specs: ['QuantumSOUND', 'Memory Foam', 'Voice Focus Mic'],
      },
      {
        id: 'headset-fantech-hg11',
        name: 'FANTECH HG11 CAPTAIN 7.1 RGB',
        nameBn: 'ফ্যানটেক HG11 ক্যাপ্টেন ৭.১ আরজিবি',
        category: 'gaming-headsets',
        categoryBn: 'গেমিং হেডসেট',
        brand: 'Fantech',
        brandBn: 'ফ্যানটেক',
        price: 1850,
        originalPrice: 2300,
        discountBadge: '-20%',
        rating: 4.8,
        reviewCount: 41,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isComboOffer: false,
        description: '7.1 virtual surround sound with true immersion vibration bass.',
        descriptionBn: '৭.১ ভার্চুয়াল সাররাউন্ড সাউন্ড গেমিং হেডসেট।',
        specs: ['7.1 Surround', 'Vibration Bass', 'RGB Lighting'],
      },
    ],
  },
  {
    id: 'gaming-mice',
    titleEn: 'GAMING MICE',
    titleBn: 'গেমিং মাউস',
    dummyProducts: [
      {
        id: 'mouse-razer-deathadder',
        name: 'RAZER DEATHADDER ESSENTIAL',
        nameBn: 'রেজার ডেথঅ্যাডার এসেনশিয়াল মাউস',
        category: 'gaming-mice',
        categoryBn: 'গেমিং মাউস',
        brand: 'Razer',
        brandBn: 'রেজার',
        price: 1850,
        originalPrice: 2450,
        discountBadge: '-24%',
        rating: 4.9,
        reviewCount: 76,
        image: 'https://res.cloudinary.com/nc5hyaab/image/upload/v1789770792/gaming_keyboard.jpg',
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
        id: 'mouse-fantech-helios',
        name: 'FANTECH HELIOS UX3 SPACE RGB',
        nameBn: 'ফ্যানটেক হেলিওস UX3 আরজিবি মাউস',
        category: 'gaming-mice',
        categoryBn: 'গেমিং মাউস',
        brand: 'Fantech',
        brandBn: 'ফ্যানটেক',
        price: 2650,
        originalPrice: 3200,
        discountBadge: '-17%',
        rating: 4.9,
        reviewCount: 39,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: false,
        isNewArrival: true,
        isComboOffer: false,
        description: 'Pixart 3389 flagship sensor up to 16,000 DPI lightweight shell.',
        descriptionBn: 'পিক্সআর্ট ৩৩৮৯ সেন্সর বিশিষ্ট লাইটওয়েট প্রো গেমিং মাউস।',
        specs: ['16,000 DPI', '69g Ultra Light', 'Paracord Cable'],
      },
    ],
  },
  {
    id: 'mechanical-keyboards',
    titleEn: 'MECHANICAL KEYBOARDS',
    titleBn: 'মেকানিক্যাল কীবোর্ড',
    dummyProducts: [
      {
        id: 'kb-mex-custom-65',
        name: 'MEX TANIM CUSTOM 65% RGB',
        nameBn: 'মেক্স তানিম কাস্টম ৬৫% আরজিবি কীবোর্ড',
        category: 'mechanical-keyboards',
        categoryBn: 'মেকানিক্যাল কীবোর্ড',
        brand: 'Mex Tanim',
        brandBn: 'মেক্স তানিম',
        price: 3850,
        originalPrice: 4500,
        discountBadge: '-14%',
        rating: 5.0,
        reviewCount: 33,
        image: 'https://res.cloudinary.com/nc5hyaab/image/upload/v1789770792/gaming_keyboard.jpg',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        isComboOffer: false,
        description: 'Hot-swappable custom lubricated mechanical switches with per-key RGB.',
        descriptionBn: 'হট-সোয়াপ্যাবল কাস্টম লুব্রিকেটেড মেকানিক্যাল কীবোর্ড।',
        specs: ['Hot-Swap', 'Lubed Switches', 'PBT Keycaps'],
      },
      {
        id: 'kb-redragon-k552',
        name: 'REDRAGON K552 KUMARA RGB',
        nameBn: 'রেড্রাগন K552 কুমারা আরজিবি',
        category: 'mechanical-keyboards',
        categoryBn: 'মেকানিক্যাল কীবোর্ড',
        brand: 'Redragon',
        brandBn: 'রেড্রাগন',
        price: 2950,
        originalPrice: 3600,
        discountBadge: '-18%',
        rating: 4.8,
        reviewCount: 54,
        image: 'https://res.cloudinary.com/nc5hyaab/image/upload/v1789832461/products/photo-1587829741301-dc798b83add3.jpg',
        comboImages: [],
        inStock: true,
        isPopular: true,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        isComboOffer: false,
        description: 'Tenkeyless compact mechanical keyboard with dust-proof switches.',
        descriptionBn: 'ট্যাংক-গ্রেড মেটাল বিল্ড কম্প্যাক্ট মেকানিক্যাল কীবোর্ড।',
        specs: ['Dust-Proof Switch', 'Metal Construction', 'Rainbow RGB'],
      },
    ],
  },
];

interface CategoryRowItemProps {
  section: CategorySectionDef;
  liveProducts: Product[];
  onSelectCategory?: (category: string) => void;
}

const CategoryRowItem: React.FC<CategoryRowItemProps> = ({
  section,
  liveProducts,
  onSelectCategory,
}) => {
  const router = useRouter();
  const railRef = useRef<HTMLDivElement>(null);

  // Filter live products belonging to this category
  const matchingLive = liveProducts.filter((p) => isCategorySelected(p.category, section.id));

  // Merge live products with dummy products (live products appear first)
  const existingIds = new Set(matchingLive.map((p) => p.id));
  const supplemental = section.dummyProducts.filter((p) => !existingIds.has(p.id));
  const products = [...matchingLive, ...supplemental];

  const handleScroll = (direction: 'left' | 'right') => {
    if (railRef.current) {
      const cardWidth = railRef.current.firstElementChild
        ? (railRef.current.firstElementChild as HTMLElement).offsetWidth
        : 260;
      const scrollStep = (cardWidth + 16) * 2;
      railRef.current.scrollBy({
        left: direction === 'left' ? -scrollStep : scrollStep,
        behavior: 'smooth',
      });
    }
  };

  const handleViewAll = () => {
    if (onSelectCategory) {
      onSelectCategory(section.id);
    } else {
      router.push(`/categories?cat=${section.id}`);
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="space-y-3 sm:space-y-4">
      {/* Category Row Header (Matching Hunter Reference Screenshot) */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">
          {section.titleEn}
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
            className="text-xs font-bold text-slate-800 hover:text-black bg-[#F1F3F5] hover:bg-gray-200 transition-all flex items-center space-x-1 cursor-pointer px-3.5 py-1 rounded-full border border-gray-200/60 active:scale-95 shadow-2xs"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Horizontal Product Rail (Matching 5-Product Row) */}
      <div
        ref={railRef}
        className="flex space-x-3 sm:space-x-4 lg:space-x-4.5 overflow-x-auto scrollbar-none py-1.5 px-0.5 snap-x overscroll-x-contain scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[190px] sm:min-w-[220px] md:min-w-[245px] lg:min-w-[255px] max-w-[265px] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

interface CategoryProductsSectionProps {
  onSelectCategory?: (category: string) => void;
}

export const CategoryProductsSection: React.FC<CategoryProductsSectionProps> = ({
  onSelectCategory,
}) => {
  const [liveProducts, setLiveProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    const cached = getCachedProducts();
    if (cached.length > 0) {
      setLiveProducts(cached);
    }

    const loadData = async () => {
      const prods = await fetchLiveProducts();
      setLiveProducts(prods);
    };
    loadData();

    const handleProductsUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setLiveProducts(e.detail);
      }
    };

    window.addEventListener('products_updated', handleProductsUpdate);
    return () => {
      window.removeEventListener('products_updated', handleProductsUpdate);
    };
  }, []);

  return (
    <div className="space-y-8 sm:space-y-10 pt-2 pb-6">
      {CATEGORY_SECTIONS.map((section) => (
        <CategoryRowItem
          key={section.id}
          section={section}
          liveProducts={liveProducts}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </div>
  );
};

export default CategoryProductsSection;
