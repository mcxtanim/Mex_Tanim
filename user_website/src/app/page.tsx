'use client';

import React, { useState } from 'react';
import { Header } from '@/features/shared/Header';
import { HeroBanner } from '@/features/catalog/HeroBanner';
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
          {selectedCategory === 'all' && <HeroBanner />}
          <ProductGrid
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}

