'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from './types';
import { useCart } from '../cart/CartContext';
import { useLanguage } from '../shared/LanguageContext';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    }
    router.push(`/product/${product.id}`);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const title = language === 'bn' ? (product.nameBn || product.name) : product.name;
  const description = language === 'bn' ? (product.descriptionBn || product.description) : product.description;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-orange-500/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
      
      {/* Product Image & Badges */}
      <div
        onClick={handleCardClick}
        className="relative w-full h-48 sm:h-52 bg-slate-50 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider z-10">
            -{discountPercent}% {t.discount}
          </span>
        )}

        {/* Stock Badge */}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-xs z-10 ${
            product.inStock
              ? 'bg-emerald-500/90 text-white'
              : 'bg-red-500/90 text-white'
          }`}
        >
          {product.inStock ? t.inStock : t.outOfStock}
        </span>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-orange-600 uppercase text-[10px] tracking-wider">
              {product.categoryBn || product.category}
            </span>
            <div className="flex items-center space-x-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3
            onClick={handleCardClick}
            className="font-bold text-sm text-slate-900 line-clamp-1 hover:text-orange-600 transition cursor-pointer"
          >
            {title}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price & Official Add to Cart Button */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
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
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-orange-500 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn cursor-pointer"
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
