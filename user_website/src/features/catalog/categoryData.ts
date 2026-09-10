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
import { PRODUCTS } from './mockData';

export interface CategoryItem {
  id: string;
  nameEn: string;
  nameBn: string;
  badge: string;
  icon: ComponentType<{ className?: string }>;
  colorClass: string;
  staticCount?: number;
}

export const getCategoryProductCount = (catId: string, staticCount: number = 0): number => {
  if (catId === 'all') return PRODUCTS.length;
  const realCount = PRODUCTS.filter(
    (p) =>
      p.category === catId ||
      (catId === 'finger-sleeves' && p.category === 'sleeves') ||
      (catId === 'sleeves' && p.category === 'finger-sleeves') ||
      (catId === 'soundboxes' && p.category === 'soundbox') ||
      (catId === 'soundbox' && p.category === 'soundboxes') ||
      (catId === 'chargers' && p.category === 'fast-chargers') ||
      (catId === 'fast-chargers' && p.category === 'chargers')
  ).length;
  return realCount > 0 ? realCount : staticCount;
};

export const isCategorySelected = (selectedCategory: string, catId: string): boolean => {
  if (selectedCategory === catId) return true;
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
    id: 'all',
    nameEn: 'ALL CATEGORIES',
    nameBn: 'সকল ক্যাটাগরি',
    icon: Grid,
    colorClass: 'bg-slate-100 text-slate-800 border border-slate-200',
    badge: 'A',
    staticCount: PRODUCTS.length,
  },
  {
    id: 'mice',
    nameEn: 'GAMING MICE',
    nameBn: 'গেমিং মাউস',
    icon: Mouse,
    colorClass: 'bg-orange-500/15 text-orange-600 border border-orange-500/20',
    badge: 'G',
    staticCount: 18,
  },
  {
    id: 'keyboards',
    nameEn: 'MECHANICAL KEYBOARDS',
    nameBn: 'মেকানিক্যাল কীবোর্ড',
    icon: Keyboard,
    colorClass: 'bg-blue-500/15 text-blue-600 border border-blue-500/20',
    badge: 'M',
    staticCount: 15,
  },
  {
    id: 'headphones',
    nameEn: 'GAMING HEADSETS',
    nameBn: 'গেমিং হেডসেট',
    icon: Headphones,
    colorClass: 'bg-purple-500/15 text-purple-600 border border-purple-500/20',
    badge: 'H',
    staticCount: 24,
  },
  {
    id: 'chargers',
    nameEn: 'FAST CHARGERS',
    nameBn: 'ফাস্ট চার্জার',
    icon: Zap,
    colorClass: 'bg-amber-500/15 text-amber-600 border border-amber-500/20',
    badge: 'F',
    staticCount: 32,
  },
  {
    id: 'finger-sleeves',
    nameEn: 'FINGER SLEEVES',
    nameBn: 'ফিঙ্গার স্লিকস',
    icon: Shield,
    colorClass: 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20',
    badge: 'S',
    staticCount: 12,
  },
  {
    id: 'cables',
    nameEn: 'CABLES',
    nameBn: 'কেবলস',
    icon: Cable,
    colorClass: 'bg-indigo-500/15 text-indigo-600 border border-indigo-500/20',
    badge: 'C',
    staticCount: 40,
  },
  {
    id: 'soundboxes',
    nameEn: 'SOUNDBOXES',
    nameBn: 'সাউন্ডবক্স',
    icon: Speaker,
    colorClass: 'bg-rose-500/15 text-rose-600 border border-rose-500/20',
    badge: 'B',
    staticCount: 16,
  },
  {
    id: 'trimmers',
    nameEn: 'TRIMMERS',
    nameBn: 'ট্রিমার',
    icon: Scissors,
    colorClass: 'bg-teal-500/15 text-teal-600 border border-teal-500/20',
    badge: 'T',
    staticCount: 10,
  },
];
