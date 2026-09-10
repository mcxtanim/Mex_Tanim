'use client';

import React, { useState } from 'react';
import { Header } from '@/features/shared/Header';
import { HeroBanner } from '@/features/catalog/HeroBanner';
import { CategorySidebar } from '@/features/catalog/CategorySidebar';
import { ProductGrid } from '@/features/catalog/ProductGrid';
import { AppInstallBanner } from '@/features/shared/AppInstallBanner';
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
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Main 2-Column Layout: Left Sticky Sidebar + Right Hero & Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Category Sidebar: Sticky & Independent Scroll */}
            <aside className="lg:col-span-4 xl:col-span-3 sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin pr-0.5">
              <CategorySidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </aside>

            {/* Right Main Content Column */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              <HeroBanner />
              <ProductGrid
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
              />
            </div>

          </div>

          <div className="mt-8">
            <AppInstallBanner />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
