'use client';

import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
import { CATEGORIES, isCategorySelected } from './categoryData';
import { CategoryThumbnail } from './CategoryThumbnail';

interface CategoryShowcaseProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onCloseBrowser?: () => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  selectedCategory,
  onSelectCategory,
  onCloseBrowser,
}) => {
  const { language } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
    };

    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    const intervalId = setInterval(() => {
      if (isHoveredRef.current || !scrollRef.current) return;
      const container = scrollRef.current;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: 360, behavior: 'smooth' });
      }
    }, 2500);

    return () => {
      clearInterval(intervalId);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleViewAll = () => {
    onSelectCategory('all');
    if (onCloseBrowser) onCloseBrowser();
    setTimeout(() => {
      const prodEl = document.getElementById('products');
      if (prodEl) {
        prodEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section id="category-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-6 sm:w-3 sm:h-7 bg-orange-500 rounded-full inline-block shadow-sm"></span>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            {language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}
          </h2>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Desktop Left/Right Scroll Arrow Buttons */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-gray-100/80 p-1 rounded-full border border-gray-200/80">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 rounded-full bg-white hover:bg-orange-50 hover:text-orange-600 text-slate-700 flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer border border-gray-200/60"
              title="Scroll Left"
              aria-label="Scroll left categories"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 rounded-full bg-white hover:bg-orange-50 hover:text-orange-600 text-slate-700 flex items-center justify-center shadow-xs transition active:scale-95 cursor-pointer border border-gray-200/60"
              title="Scroll Right"
              aria-label="Scroll right categories"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* View All Button */}
          <button
            onClick={handleViewAll}
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 hover:bg-orange-100/80 transition-all flex items-center space-x-1.5 cursor-pointer bg-orange-50 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-orange-200/80 active:scale-95 shadow-2xs"
          >
            <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Thumbnail Rail */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none flex space-x-3 sm:space-x-4 snap-x touch-pan-x py-2 px-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((cat) => {
          const selected = isCategorySelected(selectedCategory, cat.id);

          return (
            <CategoryThumbnail
              key={cat.id}
              category={cat}
              isSelected={selected}
              onClick={() => onSelectCategory(cat.id)}
            />
          );
        })}
      </div>
    </section>
  );
};
