'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useLanguage } from '../shared/LanguageContext';
import { CategoryItem, fetchLiveCategories, isCategorySelected, getCachedCategories } from './categoryData';
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
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<CategoryItem[]>([]);

  useEffect(() => {
    // 1. Client-side cache hydration (prevents SSR hydration mismatch)
    const cached = getCachedCategories();
    if (cached.length > 0) {
      setCategories(cached);
    }

    const loadCategories = async () => {
      const liveCats = await fetchLiveCategories();
      setCategories(liveCats);
    };
    loadCategories();

    const handleCategoriesUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCategories(e.detail);
      } else {
        loadCategories();
      }
    };

    window.addEventListener('categories_updated', handleCategoriesUpdate);
    window.addEventListener('storage', loadCategories);
    window.addEventListener('focus', loadCategories);
    return () => {
      window.removeEventListener('categories_updated', handleCategoriesUpdate);
      window.removeEventListener('storage', loadCategories);
      window.removeEventListener('focus', loadCategories);
    };
  }, []);

  // Continuous left-to-right smooth auto-scroll with pause on user interaction
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || categories.length === 0) return;

    let animId: number;
    let isInteracting = false;
    let resumeTimeout: NodeJS.Timeout;

    const pause = () => {
      isInteracting = true;
      clearTimeout(resumeTimeout);
    };

    const resumeWithDelay = (delayMs = 1500) => {
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        isInteracting = false;
      }, delayMs);
    };

    const onMouseEnter = () => pause();
    const onMouseLeave = () => resumeWithDelay(600);
    const onTouchStart = () => pause();
    const onTouchEnd = () => resumeWithDelay(2000);
    const onWheel = () => {
      pause();
      resumeWithDelay(1500);
    };

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: true });

    let lastTime = performance.now();
    let accumulated = el.scrollLeft;

    const step = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isInteracting && !document.hidden && el) {
        // Continuous gentle gliding: ~35 pixels per second
        const px = (delta / 1000) * 35;
        accumulated += px;

        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 15) {
          if (accumulated >= maxScroll) {
            accumulated = 0;
            el.scrollLeft = 0;
          } else {
            el.scrollLeft = accumulated;
          }
        }
      } else if (el) {
        // Keep accumulator synced with manual user scroll position
        accumulated = el.scrollLeft;
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resumeTimeout);
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('wheel', onWheel);
    };
  }, [categories]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleViewAll = () => {
    onSelectCategory('all');
    if (onCloseBrowser) onCloseBrowser();
    
    // Check if products element is on page
    const prodEl = document.getElementById('products');
    if (prodEl) {
      prodEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push('/categories');
    }
  };

  return (
    <section id="category-showcase" className="w-full py-1 sm:py-2 select-none">
      {/* Section Header (Matching Hunter Reference Style) */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight">
            {language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}
          </h2>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Desktop Left/Right Scroll Arrow Buttons */}
          <div className="hidden sm:flex items-center space-x-1 bg-gray-100/90 p-1 rounded-full border border-gray-200/80">
            <button
              onClick={() => handleScroll('left')}
              className="w-7 h-7 rounded-full bg-white hover:bg-gray-50 text-slate-700 flex items-center justify-center shadow-2xs transition active:scale-95 cursor-pointer border border-gray-200/60"
              title="Scroll Left"
              aria-label="Scroll left categories"
            >
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-7 h-7 rounded-full bg-white hover:bg-gray-50 text-slate-700 flex items-center justify-center shadow-2xs transition active:scale-95 cursor-pointer border border-gray-200/60"
              title="Scroll Right"
              aria-label="Scroll right categories"
            >
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* View All Button (Matching Hunter Reference Pill) */}
          <button
            onClick={handleViewAll}
            className="text-xs font-bold text-slate-700 hover:text-black bg-gray-100 hover:bg-gray-200 transition-all flex items-center space-x-1 cursor-pointer px-3.5 py-1.5 rounded-full border border-gray-200/80 active:scale-95 shadow-2xs"
          >
            <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Thumbnail Rail (Hunter Reference Carousel) */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none flex space-x-2.5 sm:space-x-3.5 overscroll-x-contain py-1.5 px-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.length > 0 ? (
          categories.map((cat) => {
            const selected = isCategorySelected(selectedCategory, cat.id);

            return (
              <CategoryThumbnail
                key={cat.id}
                category={cat}
                isSelected={selected}
                onClick={() => onSelectCategory(cat.id)}
              />
            );
          })
        ) : (
          [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="snap-start shrink-0 flex-none rounded-2xl sm:rounded-3xl p-3 min-w-[105px] sm:min-w-[125px] md:min-w-[140px] h-[115px] sm:h-[130px] md:h-[142px] bg-gray-100/80 animate-pulse border border-gray-200/60 shadow-2xs flex flex-col items-center justify-between"
            >
              <div className="w-14 h-14 rounded-full bg-gray-200/80 mt-2" />
              <div className="w-16 h-3 bg-gray-200/80 rounded-full mb-1" />
            </div>
          ))
        )}
      </div>
    </section>
  );
};
