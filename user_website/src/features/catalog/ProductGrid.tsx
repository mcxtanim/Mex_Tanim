'use client';

import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { PRODUCTS } from './mockData';
import { Product } from './types';
import { useLanguage } from '../shared/LanguageContext';
import { Flame } from 'lucide-react';

interface ProductGridProps {
  selectedCategory: string;
  searchQuery: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  selectedCategory,
  searchQuery,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { t } = useLanguage();

  const filteredProducts = PRODUCTS.filter((product) => {
    // Category Filter
    if (selectedCategory !== 'all') {
      const isMatch =
        product.category === selectedCategory ||
        (selectedCategory === 'finger-sleeves' && product.category === 'sleeves') ||
        (selectedCategory === 'sleeves' && product.category === 'finger-sleeves') ||
        (selectedCategory === 'soundboxes' && product.category === 'soundbox') ||
        (selectedCategory === 'soundbox' && product.category === 'soundboxes') ||
        (selectedCategory === 'headphones' && product.category === 'earphones') ||
        (selectedCategory === 'earphones' && product.category === 'headphones');
      if (!isMatch) return false;
    }
    // Search Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q) || product.nameBn.includes(q);
      const matchDesc = product.description.toLowerCase().includes(q) || product.descriptionBn.includes(q);
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
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white border border-gray-200 rounded-3xl p-8">
          <p className="text-gray-500 font-semibold text-sm">
            No products found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>
      )}

      {/* Product Detail Popup Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </section>
  );
};
