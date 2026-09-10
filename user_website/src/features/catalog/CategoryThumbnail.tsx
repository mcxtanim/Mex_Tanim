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
            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
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
      className={`snap-start shrink-0 flex-none rounded-2xl p-4 text-center flex flex-col items-center justify-center min-w-[130px] sm:min-w-[150px] md:min-w-[160px] h-[140px] sm:h-[160px] transition-all duration-300 group cursor-pointer ${
        isSelected
          ? 'border-2 border-orange-500 bg-white shadow-md scale-105'
          : 'bg-gradient-to-b from-gray-100 to-gray-50/70 border border-gray-200/80 shadow-2xs hover:shadow-lg hover:border-orange-400'
      } ${className}`}
    >
      {/* Rounded 1:1 Container */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center p-1 aspect-square transition-transform duration-300">
        <img
          src={category.image}
          alt={category.nameEn}
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform"
        />
      </div>

      {/* Category Title Below */}
      <span className="text-xs font-black uppercase text-slate-900 tracking-wider text-center mt-2 group-hover:text-orange-600 transition-colors line-clamp-2">
        {catName}
      </span>
      {count !== undefined && (
        <span className="text-[10px] font-semibold text-gray-500 mt-0.5">
          {count} {language === 'bn' ? 'টি' : 'items'}
        </span>
      )}
    </button>
  );
};

export default CategoryThumbnail;
