'use client';

import React from 'react';
import {
  Mouse,
  Keyboard,
  Headphones,
  Zap,
  Shield,
  Cable,
  Speaker,
  Scissors,
  Grid,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
import { PRODUCTS } from './mockData';

interface CategorySidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onCloseMobile?: () => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { language } = useLanguage();

  const getProductCount = (catId: string, staticCount: number) => {
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

  const CATEGORIES = [
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

  return (
    <div className="w-full space-y-2.5">
      {/* List of Category Cards */}
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected =
          selectedCategory === cat.id ||
          (selectedCategory === 'sleeves' && cat.id === 'finger-sleeves') ||
          (selectedCategory === 'soundbox' && cat.id === 'soundboxes') ||
          (selectedCategory === 'fast-chargers' && cat.id === 'chargers');
        const count = getProductCount(cat.id, cat.staticCount);

        return (
          <button
            key={cat.id}
            onClick={() => {
              onSelectCategory(cat.id);
            }}
            className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl transition-all duration-300 group cursor-pointer ${
              isSelected
                ? 'bg-slate-900 text-white border border-slate-800 shadow-xl shadow-slate-900/20 scale-[1.02]'
                : 'backdrop-blur-md bg-white/85 border border-white/50 shadow-xl shadow-slate-900/5 hover:border-orange-500/40 hover:bg-white/95 hover:shadow-2xl text-slate-800'
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              {/* Icon Container with Badge */}
              <div className="relative shrink-0">
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                      : cat.colorClass
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span
                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center border border-white shadow-xs ${
                    isSelected
                      ? 'bg-white text-slate-900'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {cat.badge}
                </span>
              </div>

              {/* Category Name & Count */}
              <div className="text-left truncate">
                <h3
                  className={`text-xs font-bold uppercase tracking-wider truncate ${
                    isSelected
                      ? 'text-white'
                      : 'text-slate-900 group-hover:text-orange-600'
                  }`}
                >
                  {language === 'bn' ? cat.nameBn : cat.nameEn}
                </h3>
                <p
                  className={`text-[11px] font-semibold ${
                    isSelected ? 'text-orange-300' : 'text-gray-500'
                  }`}
                >
                  {count} {language === 'bn' ? 'টি প্রোডাক্ট' : 'products'}
                </p>
              </div>
            </div>

            {/* Right Chevron Arrow */}
            <ChevronRight
              className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${
                isSelected
                  ? 'text-orange-400'
                  : 'text-gray-400 group-hover:text-orange-500'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
