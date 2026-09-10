'use client';

import React, { useState } from 'react';
import { Header } from '@/features/shared/Header';
import { HeroBanner } from '@/features/catalog/HeroBanner';
import { CategoryGrid } from '@/features/catalog/CategoryGrid';
import { ProductGrid } from '@/features/catalog/ProductGrid';
import { AppInstallBanner } from '@/features/shared/AppInstallBanner';
import { Footer } from '@/features/shared/Footer';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className="space-y-4">
          <HeroBanner />
          <CategoryGrid
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <ProductGrid
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
          <AppInstallBanner />
        </main>
      </div>
      <Footer />
    </div>
  );
}
