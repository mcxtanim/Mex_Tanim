'use client';

import React, { useState } from 'react';
import { Header } from '@/features/shared/Header';
import { HeroBanner } from '@/features/catalog/HeroBanner';
import { CategorySidebar } from '@/features/catalog/CategorySidebar';
import { CategoryGrid } from '@/features/catalog/CategoryGrid';
import { ProductGrid } from '@/features/catalog/ProductGrid';
import { Footer } from '@/features/shared/Footer';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/50">
      <div>
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left column: Sticky Category Sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3 sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
              <CategorySidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </aside>

            {/* Right column: Banner, Horizontal Grid, and Products */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6 min-w-0">
              {selectedCategory === 'all' && (
                <>
                  <HeroBanner />
                  <CategoryGrid
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </>
              )}
              <ProductGrid
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

