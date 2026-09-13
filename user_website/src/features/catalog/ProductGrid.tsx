'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { fetchLiveProducts, getCachedProducts } from './productService';
import { Product } from './types';
import { useLanguage } from '../shared/LanguageContext';
import { Flame, PackageSearch } from 'lucide-react';

interface ProductGridProps {
  selectedCategory: string;
  searchQuery: string;
  onSelectCategory?: (category: string) => void;
}

const isCategoryMatch = (prodCat: string, selCat: string): boolean => {
  if (selCat === 'all') return true;
  if (prodCat === selCat) return true;

  // finger-sleeves <-> sleeves
  if (
    (selCat === 'finger-sleeves' || selCat === 'sleeves') &&
    (prodCat === 'finger-sleeves' || prodCat === 'sleeves')
  ) {
    return true;
  }
  // soundboxes <-> soundbox
  if (
    (selCat === 'soundboxes' || selCat === 'soundbox') &&
    (prodCat === 'soundboxes' || prodCat === 'soundbox')
  ) {
    return true;
  }
  // chargers <-> fast-chargers
  if (
    (selCat === 'chargers' || selCat === 'fast-chargers') &&
    (prodCat === 'chargers' || prodCat === 'fast-chargers')
  ) {
    return true;
  }

  return false;
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  selectedCategory,
  searchQuery,
  onSelectCategory,
}) => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>(() => getCachedProducts());
  const [loading, setLoading] = useState(() => getCachedProducts().length === 0);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchLiveProducts();
      setProducts(data);
      setLoading(false);
    };
    loadData();

    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const filteredProducts = products.filter((product) => {
    // Category Filter with alias matching
    if (!isCategoryMatch(product.category, selectedCategory)) {
      return false;
    }
    // Search Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName =
        product.name.toLowerCase().includes(q) ||
        product.nameBn.toLowerCase().includes(q);
      const matchDesc =
        product.description.toLowerCase().includes(q) ||
        product.descriptionBn.toLowerCase().includes(q);
      return matchName || matchDesc;
    }
    return true;
  });

  return (
    <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Section Title Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block"></span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            {t.featuredProducts}
          </h2>
        </div>
        <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          <Flame className="w-3.5 h-3.5 fill-orange-500" />
          <span>{filteredProducts.length} Items</span>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="py-14 text-center text-slate-400 text-xs font-bold animate-pulse">
          {language === 'bn' ? 'পণ্য লোড হচ্ছে...' : 'Loading Products from Database...'}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-14 px-6 text-center bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-3xl shadow-sm max-w-md mx-auto my-6 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 border border-orange-200/60 flex items-center justify-center shadow-inner">
            <PackageSearch className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-900">
              {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
            </h3>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              {language === 'bn'
                ? 'এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি'
                : 'No products found in this category'}
            </p>
          </div>
          {onSelectCategory && (
            <button
              onClick={() => onSelectCategory('all')}
              className="mt-2 px-5 py-2.5 bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center space-x-2 cursor-pointer"
            >
              <span>
                {language === 'bn' ? 'সকল ক্যাটাগরি দেখুন' : 'View All Categories'}
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

    </section>
  );
};
