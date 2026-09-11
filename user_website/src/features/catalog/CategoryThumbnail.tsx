'use client';

import React from 'react';
import { CategoryItem } from './categoryData';
import { useLanguage } from '../shared/LanguageContext';

export interface CategoryThumbnailProps {
  category: CategoryItem;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: 'card' | 'icon';
  className?: string;
  count?: number;
}

export const CategoryThumbnail: React.FC<CategoryThumbnailProps> = ({
  category,
  isSelected = false,
  onClick,
  variant = 'card',
  className = '',
  count,
}) => {
  const { language } = useLanguage();
  const catName = language === 'bn' ? category.nameBn : category.nameEn;

  if (variant === 'icon') {
    return (
      <div
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center p-1.5 aspect-square transition-transform duration-300 group-hover:scale-110 ${
          isSelected
            ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
            : category.colorClass
        } ${className}`}
      >
        <img
          src={category.image}
          alt={category.nameEn}
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative snap-start shrink-0 flex-none rounded-3xl p-5 sm:p-6 text-center flex flex-col items-center justify-between min-w-[180px] sm:min-w-[210px] md:min-w-[240px] h-[220px] sm:h-[250px] md:h-[270px] backdrop-blur-md transition-all duration-300 group cursor-pointer ${
        isSelected
          ? 'border-2 border-red-500 bg-white/95 shadow-xl scale-105 ring-2 ring-red-500/20'
          : 'bg-white/80 backdrop-blur-md border border-white/60 shadow-xl shadow-slate-900/5 hover:border-red-500/40 hover:bg-white/95 hover:shadow-2xl'
      } ${className}`}
    >
      {/* Product Visual Container with Soft Red/Rose Backdrop Halo */}
      <div className="relative flex-1 w-full flex items-center justify-center min-h-0">
        <div className="absolute w-24 h-24 sm:w-30 sm:h-30 bg-red-500/15 rounded-full blur-xs blur-sm group-hover:scale-110 transition-transform pointer-events-none" />
        <img
          src={category.image}
          alt={category.nameEn}
          className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 object-contain group-hover:scale-105 transition-transform drop-shadow-md"
        />
      </div>

      {/* Typography & Red Underline Accent Bar */}
      <div className="flex flex-col items-center mt-3 shrink-0">
        <span className="text-xs sm:text-sm font-black uppercase text-slate-900 tracking-wider text-center line-clamp-1 group-hover:text-red-600 transition-colors">
          {catName}
        </span>
        <div className="w-8 sm:w-10 h-1 bg-red-600 rounded-full mt-1.5 transition-all duration-300 group-hover:w-12" />
        {count !== undefined && (
          <span className="text-[10px] sm:text-xs font-semibold text-gray-500 mt-1">
            {count} {language === 'bn' ? 'টি' : 'items'}
          </span>
        )}
      </div>
    </button>
  );
};

export default CategoryThumbnail;
