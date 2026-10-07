'use client';

import React from 'react';
import { CategoryItem, getCategoryName, getSvgImageForSlug } from './categoryData';
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
  const catName = language === 'bn'
    ? (category.nameBn || getCategoryName(category.id, 'bn'))
    : (category.nameEn || getCategoryName(category.id, 'en'));

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = getSvgImageForSlug(category.id);
  };

  if (variant === 'icon') {
    return (
      <div
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center p-1.5 aspect-square transition-transform duration-300 group-hover:scale-110 ${
          isSelected
            ? 'bg-black text-white shadow-md'
            : category.colorClass
        } ${className}`}
      >
        <img
          src={category.image}
          alt={category.nameEn}
          onError={handleImageError}
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative shrink-0 flex-none rounded-2xl sm:rounded-3xl p-3 text-center flex flex-col items-center justify-between min-w-[105px] sm:min-w-[125px] md:min-w-[140px] h-[115px] sm:h-[130px] md:h-[142px] transition-all duration-200 group cursor-pointer ${
        isSelected
          ? 'border-2 border-slate-900 bg-white shadow-md scale-102 ring-2 ring-slate-900/10'
          : 'bg-gray-100/90 hover:bg-gray-200/90 border border-transparent hover:border-gray-300/80 shadow-2xs active:scale-95'
      } ${className}`}
    >
      {/* Centered Category Visual (Matching Hunter Reference Card Style) */}
      <div className="relative flex-1 w-full flex items-center justify-center min-h-0 pt-1">
        <img
          src={category.image}
          alt={category.nameEn}
          onError={handleImageError}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain group-hover:scale-108 transition-transform duration-200 drop-shadow-xs"
        />
      </div>

      {/* Typography: Clean Category Label */}
      <div className="w-full flex flex-col items-center mt-1 pb-0.5 shrink-0">
        <span className="text-[10px] sm:text-xs font-bold text-slate-800 tracking-tight text-center px-1 truncate w-full group-hover:text-black transition-colors">
          {catName}
        </span>
      </div>
    </button>
  );
};

export default CategoryThumbnail;
