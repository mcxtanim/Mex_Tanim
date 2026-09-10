'use client';

import React, { useState } from 'react';
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
  X,
  Filter,
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
  onCloseMobile,
}) => {
  const { language } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(true);

  const getProductCount = (catId: string, staticCount: number) => {
    if (catId === 'all') return PRODUCTS.length;
    const realCount = PRODUCTS.filter(
      (p) =>
        p.category === catId ||
        (catId === 'finger-sleeves' && p.category === 'sleeves') ||
        (catId === 'sleeves' && p.category === 'finger-sleeves') ||
        (catId === 'soundboxes' && p.category === 'soundbox') ||
        (catId === 'soundbox' && p.category === 'soundboxes')
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
      staticCount: PRODUCTS.length,
    },
    {
      id: 'mice',
      nameEn: 'GAMING MICE',
      nameBn: 'গেমিং মাউস',
      icon: Mouse,
      colorClass: 'bg-orange-500/15 text-orange-600 border border-orange-500/20',
      staticCount: 18,
    },
    {
      id: 'keyboards',
      nameEn: 'MECHANICAL KEYBOARDS',
      nameBn: 'মেকানিক্যাল কীবোর্ড',
      icon: Keyboard,
      colorClass: 'bg-blue-500/15 text-blue-600 border border-blue-500/20',
      staticCount: 15,
    },
    {
      id: 'headphones',
      nameEn: 'GAMING HEADSETS',
      nameBn: 'গেমিং হেডসেট',
      icon: Headphones,
      colorClass: 'bg-purple-500/15 text-purple-600 border border-purple-500/20',
      staticCount: 24,
    },
    {
      id: 'chargers',
      nameEn: 'FAST CHARGERS',
      nameBn: 'ফাস্ট চার্জার',
      icon: Zap,
      colorClass: 'bg-amber-500/15 text-amber-600 border border-amber-500/20',
      staticCount: 32,
    },
    {
      id: 'finger-sleeves',
      nameEn: 'FINGER SLEEVES',
      nameBn: 'ফিঙ্গার স্লিকস',
      icon: Shield,
      colorClass: 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20',
      staticCount: 12,
    },
    {
      id: 'cables',
      nameEn: 'CABLES',
      nameBn: 'কেবলস',
      icon: Cable,
      colorClass: 'bg-indigo-500/15 text-indigo-600 border border-indigo-500/20',
      staticCount: 40,
    },
    {
      id: 'soundboxes',
      nameEn: 'SOUNDBOXES',
      nameBn: 'সাউন্ডবক্স',
      icon: Speaker,
      colorClass: 'bg-rose-500/15 text-rose-600 border border-rose-500/20',
      staticCount: 16,
    },
    {
      id: 'trimmers',
      nameEn: 'TRIMMERS',
      nameBn: 'ট্রিমার',
      icon: Scissors,
      colorClass: 'bg-teal-500/15 text-teal-600 border border-teal-500/20',
      staticCount: 10,
    },
  ];

  return (
    <div className="w-full space-y-3">
      {/* Category Sidebar Glassmorphic Header Card */}
      <div className="flex items-center justify-between p-4 backdrop-blur-md bg-white/90 border border-white/60 rounded-2xl shadow-lg shadow-slate-900/5">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block shadow-sm"></span>
          <h2 className="text-base font-extrabold text-slate-900 tracking-wider">
            {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
          </h2>
          <span className="bg-orange-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs">
            8
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {selectedCategory !== 'all' && (
            <button
              onClick={() => onSelectCategory('all')}
              className="text-xs font-bold text-orange-600 hover:bg-orange-50 px-2 py-1 rounded-lg transition"
              title="Clear Filter"
            >
              {language === 'bn' ? 'রিসেট' : 'Reset'}
            </button>
          )}

          {onCloseMobile ? (
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-gray-400 hover:text-slate-800 rounded-lg hover:bg-gray-100 transition lg:hidden"
              title="Close categories"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-1.5 text-gray-400 hover:text-slate-800 rounded-lg hover:bg-gray-100 transition lg:hidden"
              title="Toggle categories view"
            >
              <Filter className="w-4 h-4 text-orange-500" />
            </button>
          )}
        </div>
      </div>

      {/* List of Category Cards */}
      <div className={`space-y-2.5 ${isMobileOpen ? 'block' : 'hidden lg:block'}`}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected =
            selectedCategory === cat.id ||
            (selectedCategory === 'sleeves' && cat.id === 'finger-sleeves') ||
            (selectedCategory === 'soundbox' && cat.id === 'soundboxes');
          const count = getProductCount(cat.id, cat.staticCount);

          return (
            <button
              key={cat.id}
              onClick={() => {
                onSelectCategory(cat.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl transition-all duration-300 group cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border border-slate-800 shadow-xl shadow-slate-900/20 scale-[1.02]'
                  : 'backdrop-blur-md bg-white/85 border border-white/50 shadow-xl shadow-slate-900/5 hover:border-orange-500/40 hover:bg-white/95 hover:shadow-2xl'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                {/* Colorful Rounded Square Icon Container */}
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                      : cat.colorClass
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>

                {/* Category Name & Count */}
                <div className="text-left truncate">
                  <h3
                    className={`text-xs font-black uppercase tracking-wider truncate ${
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
    </div>
  );
};
