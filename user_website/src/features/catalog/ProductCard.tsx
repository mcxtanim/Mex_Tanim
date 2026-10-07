'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Heart } from 'lucide-react';
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
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const title = language === 'bn' ? (product.nameBn || product.name) : product.name;
  const description = language === 'bn' ? (product.descriptionBn || product.description) : product.description;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 hover:border-gray-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Product Image & Badges (Matching Reference Style) */}
      <div className="relative block w-full aspect-square bg-[#F8FAFC] overflow-hidden p-3 sm:p-4 cursor-pointer flex items-center justify-center">
        <img
          src={product.image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain group-hover:scale-105 transition duration-500 drop-shadow-xs"
        />

        {/* Black Discount Badge on Top-Left (Matching Reference Style) */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-black text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-tight z-10">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Heart Icon on Top-Right (Matching Reference Style) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-2.5 right-2.5 w-7.5 h-7.5 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-2xs transition active:scale-90 z-10 cursor-pointer ${
            isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 stroke-[2] ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Out of Stock Badge (if applicable) */}
        {!product.inStock && (
          <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-600/90 text-white z-10 shadow-xs">
            {t.outOfStock}
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
        <div>
          <div className="flex items-center space-x-1.5 overflow-hidden text-[10px] font-semibold text-gray-400 mb-1">
            <span className="text-orange-600 uppercase tracking-wider truncate">
              {language === 'bn' ? (product.categoryBn || getCategoryName(product.category, 'bn')) : getCategoryName(product.category, 'en')}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded truncate">
              {getBrandName(product, language)}
            </span>
          </div>

          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 group-hover:text-orange-600 transition cursor-pointer block">
            {title}
          </h3>

          <p className="text-[11px] text-gray-500 line-clamp-1 sm:line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price & Official Add to Cart Button */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-1.5 sm:gap-2">
          <div>
            <div className="flex items-baseline space-x-1 sm:space-x-1.5">
              <span className="text-sm sm:text-base md:text-lg font-black text-slate-900">
                ৳{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
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
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-black hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            title={t.addToCart}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-white" />
            <span className="hidden md:inline text-[11px]">{t.addToCart}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
