'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from './types';
import { getBrandName } from './productService';
import { getCategoryName } from './categoryData';
import { useCart } from '../cart/CartContext';
import { useLanguage } from '../shared/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const title = language === 'bn' ? (product.nameBn || product.name) : product.name;
  const description = language === 'bn' ? (product.descriptionBn || product.description) : product.description;

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/60 shadow-xl shadow-slate-900/5 rounded-2xl overflow-hidden hover:border-orange-500/40 hover:bg-white/95 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between">
      
      {/* Product Image & Badges */}
      <Link
        href={`/product/${product.id}`}
        className="relative block w-full h-48 sm:h-52 bg-slate-50/80 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-orange-500/90 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider z-10 border border-white/30">
            -{discountPercent}% {t.discount}
          </span>
        )}

        {/* Stock Badge */}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-xs z-10 border border-white/30 ${
            product.inStock
              ? 'bg-emerald-500/90 text-white'
              : 'bg-red-500/90 text-white'
          }`}
        >
          {product.inStock ? t.inStock : t.outOfStock}
        </span>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <div className="flex items-center space-x-1.5 overflow-hidden">
              <span className="font-semibold text-orange-600 uppercase text-[10px] tracking-wider truncate">
                {language === 'bn' ? (product.categoryBn || getCategoryName(product.category, 'bn')) : getCategoryName(product.category, 'en')}
              </span>
              <span className="text-gray-300">•</span>
              <span className="font-extrabold text-slate-800 text-[10px] bg-slate-100/90 backdrop-blur-xs px-1.5 py-0.5 rounded border border-slate-200/80 truncate">
                {getBrandName(product, language)}
              </span>
            </div>
          </div>

          <Link
            href={`/product/${product.id}`}
            className="font-bold text-sm text-slate-900 line-clamp-1 hover:text-orange-600 transition cursor-pointer block"
          >
            {title}
          </Link>

          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price & Official Add to Cart Button */}
        <div className="pt-2 border-t border-gray-100/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-gray-400 block font-medium">Price</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ৳{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ৳{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Official Add to Cart Thumbnail Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={!product.inStock}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900/90 hover:bg-orange-500/90 backdrop-blur-md text-white rounded-xl font-bold text-xs shadow-md border border-white/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn cursor-pointer"
            title={t.addToCart}
          >
            <ShoppingBag className="w-4 h-4 text-orange-400 group-hover/btn:text-white transition-colors" />
            <span className="hidden sm:inline">{t.addToCart}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
