import { ComponentType } from 'react';
import {
  Grid,
  Mouse,
  Keyboard,
  Headphones,
  Zap,
  Shield,
  Cable,
  Speaker,
  Scissors,
} from 'lucide-react';
import { Product } from './types';

export interface CategoryItem {
  id: string;
  nameEn: string;
  nameBn: string;
  badge: string;
  badgeBg: string;
  icon: ComponentType<{ className?: string }>;
  colorClass: string;
  staticCount?: number;
  image: string;
}

export const getCategoryProductCount = (catId: string, staticCount: number = 0, productsList: Product[] = []): number => {
  if (!productsList || productsList.length === 0) return staticCount;
  if (catId === 'all') return productsList.length;
  const realCount = productsList.filter(
    (p) =>
      p.category === catId ||
      (catId === 'gaming-cooler' && (p.category === 'cooler' || p.category === 'gaming-cooler')) ||
      (catId === 'finger-sleeves' && (p.category === 'sleeves' || p.category === 'finger-sleeves')) ||
      (catId === 'gaming-earphone' && (p.category === 'earphone' || p.category === 'gaming-earphone')) ||
      (catId === 'gaming-powder' && (p.category === 'powder' || p.category === 'gaming-powder')) ||
      (catId === 'magnetic-plates' && (p.category === 'plates' || p.category === 'magnetic-plates')) ||
      (catId === 'gaming-triggers' && (p.category === 'triggers' || p.category === 'gaming-triggers')) ||
      (catId === 'power-bank' && (p.category === 'powerbank' || p.category === 'power-bank')) ||
      (catId === 'charger-adapter' && (p.category === 'chargers' || p.category === 'fast-chargers' || p.category === 'charger-adapter')) ||
      (catId === 'soundboxes' && (p.category === 'soundbox' || p.category === 'soundboxes')) ||
      (catId === 'chargers' && (p.category === 'fast-chargers' || p.category === 'chargers'))
  ).length;
  return realCount > 0 ? realCount : staticCount;
};

export const isCategorySelected = (selectedCategory: string, catId: string): boolean => {
  if (selectedCategory === catId) return true;
  if (selectedCategory === 'gaming-cooler' && catId === 'cooler') return true;
  if (selectedCategory === 'cooler' && catId === 'gaming-cooler') return true;
  if (selectedCategory === 'sleeves' && catId === 'finger-sleeves') return true;
  if (selectedCategory === 'finger-sleeves' && catId === 'sleeves') return true;
  if (selectedCategory === 'soundbox' && catId === 'soundboxes') return true;
  if (selectedCategory === 'soundboxes' && catId === 'soundbox') return true;
  if (selectedCategory === 'fast-chargers' && catId === 'chargers') return true;
  if (selectedCategory === 'chargers' && catId === 'fast-chargers') return true;
  return false;
};

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'gaming-cooler',
    nameEn: 'GAMING COOLER',
    nameBn: 'গেমিং কুলার',
    icon: Zap,
    colorClass: 'bg-slate-900 text-white',
    badge: 'G',
    badgeBg: 'bg-black text-white',
    staticCount: 28,
    image: '/categories/gaming-mice.svg',
  },
  {
    id: 'finger-sleeves',
    nameEn: 'FINGER SLEEVES',
    nameBn: 'ফিঙ্গার স্লিকস',
    icon: Shield,
    colorClass: 'bg-slate-900 text-white',
    badge: 'F',
    badgeBg: 'bg-black text-white',
    staticCount: 16,
    image: '/categories/finger-sleeves.svg',
  },
  {
    id: 'gaming-earphone',
    nameEn: 'GAMING EARPHONE',
    nameBn: 'গেমিং ইয়ারফোন',
    icon: Headphones,
    colorClass: 'bg-blue-500 text-white',
    badge: 'G',
    badgeBg: 'bg-blue-500 text-white',
    staticCount: 12,
    image: '/categories/gaming-headsets.svg',
  },
  {
    id: 'gaming-powder',
    nameEn: 'GAMING POWDER',
    nameBn: 'গেমিং পাউডার',
    icon: Grid,
    colorClass: 'bg-emerald-600 text-white',
    badge: 'G',
    badgeBg: 'bg-emerald-700 text-white',
    staticCount: 4,
    image: '/categories/all.svg',
  },
  {
    id: 'magnetic-plates',
    nameEn: 'MAGNETIC PLATES',
    nameBn: 'ম্যাগনেটিক প্লেটস',
    icon: Grid,
    colorClass: 'bg-slate-900 text-white',
    badge: 'M',
    badgeBg: 'bg-black text-white',
    staticCount: 8,
    image: '/categories/mechanical-keyboards.svg',
  },
  {
    id: 'gaming-triggers',
    nameEn: 'GAMING TRIGGERS',
    nameBn: 'গেমিং ট্রিগার',
    icon: Zap,
    colorClass: 'bg-amber-600 text-white',
    badge: 'G',
    badgeBg: 'bg-amber-600 text-white',
    staticCount: 3,
    image: '/categories/gaming-mice.svg',
  },
  {
    id: 'power-bank',
    nameEn: 'POWER BANK',
    nameBn: 'পাওয়ার ব্যাংক',
    icon: Zap,
    colorClass: 'bg-slate-900 text-white',
    badge: 'P',
    badgeBg: 'bg-black text-white',
    staticCount: 4,
    image: '/categories/fast-chargers.svg',
  },
  {
    id: 'charger-adapter',
    nameEn: 'CHARGER ADAPTER',
    nameBn: 'চার্জার এডাপ্টার',
    icon: Zap,
    colorClass: 'bg-slate-900 text-white',
    badge: 'C',
    badgeBg: 'bg-black text-white',
    staticCount: 3,
    image: '/categories/fast-chargers.svg',
  },
  {
    id: 'cables',
    nameEn: 'CABLE',
    nameBn: 'কেবলস',
    icon: Cable,
    colorClass: 'bg-blue-500 text-white',
    badge: 'C',
    badgeBg: 'bg-blue-500 text-white',
    staticCount: 40,
    image: '/categories/cables.svg',
  },
  {
    id: 'mice',
    nameEn: 'GAMING MICE',
    nameBn: 'গেমিং মাউস',
    icon: Mouse,
    colorClass: 'bg-slate-900 text-white',
    badge: 'G',
    badgeBg: 'bg-black text-white',
    staticCount: 18,
    image: '/categories/gaming-mice.svg',
  },
  {
    id: 'keyboards',
    nameEn: 'MECHANICAL KEYBOARDS',
    nameBn: 'মেকানিক্যাল কীবোর্ড',
    icon: Keyboard,
    colorClass: 'bg-slate-900 text-white',
    badge: 'M',
    badgeBg: 'bg-black text-white',
    staticCount: 15,
    image: '/categories/mechanical-keyboards.svg',
  },
  {
    id: 'trimmers',
    nameEn: 'TRIMMERS',
    nameBn: 'ট্রিমার',
    icon: Scissors,
    colorClass: 'bg-slate-900 text-white',
    badge: 'T',
    badgeBg: 'bg-black text-white',
    staticCount: 10,
    image: '/categories/trimmers.svg',
  },
];
