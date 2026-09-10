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
  ChevronRight,
  Radio,
} from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
export { CategorySidebar } from './CategorySidebar';

interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t, language } = useLanguage();

  const CATEGORIES = [
    {
      id: 'headphones',
      labelEn: 'GAMING EARPHONE',
      labelBn: 'গেমিং ইয়ারফোন',
      icon: Radio,
    },
    {
      id: 'mice',
      labelEn: 'GAMING MICE',
      labelBn: 'গেমিং মাউস',
      icon: Mouse,
    },
    {
      id: 'keyboards',
      labelEn: 'MECHANICAL KEYBOARDS',
      labelBn: 'মেকানিক্যাল কীবোর্ড',
      icon: Keyboard,
    },
    {
      id: 'headphones',
      labelEn: 'GAMING HEADSETS',
      labelBn: 'গেমিং হেডসেট',
      icon: Headphones,
    },
    {
      id: 'chargers',
      labelEn: 'FAST CHARGERS',
      labelBn: 'ফাস্ট চার্জার',
      icon: Zap,
    },
    {
      id: 'finger-sleeves',
      labelEn: 'FINGER SLEEVES',
      labelBn: 'ফিঙ্গার স্লিকস',
      icon: Shield,
    },
    {
      id: 'cables',
      labelEn: 'CABLES',
      labelBn: 'কেবলস',
      icon: Cable,
    },
    {
      id: 'soundboxes',
      labelEn: 'SOUNDBOXES',
      labelBn: 'সাউন্ডবক্স',
      icon: Speaker,
    },
    {
      id: 'trimmers',
      labelEn: 'TRIMMERS',
      labelBn: 'ট্রিমার',
      icon: Scissors,
    },
  ];

  return (
    <section id="categories" className="w-full py-4">
      {/* Header: All Categories & View All > Pill */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block shadow-sm"></span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {t.categoriesTitle}
          </h2>
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 hover:text-orange-700 text-xs sm:text-sm font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
        >
          <span>{t.viewAll}</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Grid of 9 Category Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-2.5 sm:gap-3">
        {CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          const isSelected =
            selectedCategory === cat.id ||
            (selectedCategory === 'sleeves' && cat.id === 'finger-sleeves') ||
            (selectedCategory === 'soundbox' && cat.id === 'soundboxes');
          const label = language === 'bn' ? cat.labelBn : cat.labelEn;

          return (
            <button
              key={`${cat.id}-${idx}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center justify-between p-3 rounded-2xl border transition-all duration-200 group cursor-pointer min-h-[100px] sm:min-h-[110px] ${
                isSelected
                  ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                  : 'bg-white border-gray-200/80 text-gray-800 hover:border-orange-500/60 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 group-hover:bg-orange-50 group-hover:text-orange-500'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-black text-center uppercase tracking-tight line-clamp-2 leading-tight ${
                  isSelected ? 'text-white' : 'text-slate-900 group-hover:text-orange-600'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
