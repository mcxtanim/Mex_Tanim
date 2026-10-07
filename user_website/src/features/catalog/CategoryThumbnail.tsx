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
      className={`relative shrink-0 flex-none text-center flex flex-col items-center justify-start group cursor-pointer transition-all duration-200 ${className}`}
    >
      {/* Light Gray Rounded Square Box for Category Icon (Matching Reference Style) */}
      <div
        className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl flex items-center justify-center p-3 sm:p-4 transition-all duration-300 ${
          isSelected
            ? 'bg-white border-2 border-slate-900 shadow-md ring-2 ring-slate-900/10 scale-102'
            : 'bg-[#F1F3F5] hover:bg-gray-200/90 border border-gray-200/50 shadow-2xs active:scale-95'
        }`}
      >
        <img
          src={category.image}
          alt={category.nameEn}
          onError={handleImageError}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-xs"
        />
      </div>

      {/* Category Name in Bold Uppercase Below the Square Box */}
      <span className="text-[10px] sm:text-xs font-black uppercase text-slate-800 group-hover:text-black tracking-tight text-center mt-2 sm:mt-2.5 max-w-[105px] sm:max-w-[125px] truncate w-full transition-colors block">
        {catName}
      </span>
    </button>
  );
};

export default CategoryThumbnail;
