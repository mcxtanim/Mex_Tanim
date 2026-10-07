'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Home, ChevronRight, Heart, ShoppingBag, RotateCcw } from 'lucide-react';
import {
  CategoryItem,
  fetchLiveCategories,
  getCategoryProductCount,
  isCategorySelected,
  getCachedCategories,
  getCategoryName,
  DRAWER_COLLECTIONS,
} from './categoryData';
import { fetchLiveProducts, getCachedProducts, cleanProductTitle } from './productService';
import { PRODUCTS as FALLBACK_PRODUCTS } from './mockData';
import { Product } from './types';

interface CategoriesViewProps {
  initialCategory?: string;
}

const CategoriesViewContent: React.FC<CategoriesViewProps> = ({ initialCategory }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');

  const [selectedCategory, setSelectedCategory] = useState<string>(
    catParam || initialCategory || 'finger-sleeves'
  );
  const [categories, setCategories] = useState<CategoryItem[]>(DRAWER_COLLECTIONS);
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // 1. Client-side cache hydration
    const cachedCats = getCachedCategories();
    const cachedProds = getCachedProducts();
    if (cachedCats.length > 0) setCategories(cachedCats);
    if (cachedProds.length > 0) setProducts(cachedProds);

    const loadData = async () => {
      const [prods, cats] = await Promise.all([
        fetchLiveProducts(),
        fetchLiveCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    };
    loadData();

    const handleCategoriesUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCategories(e.detail);
      } else {
        loadData();
      }
    };

    const handleProductsUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setProducts(e.detail);
      } else {
        loadData();
      }
    };

    window.addEventListener('categories_updated', handleCategoriesUpdate);
    window.addEventListener('products_updated', handleProductsUpdate);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('categories_updated', handleCategoriesUpdate);
      window.removeEventListener('products_updated', handleProductsUpdate);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  // Find active category item
  const selectedCatObj =
    categories.find((c) => isCategorySelected(selectedCategory, c.id)) ||
    DRAWER_COLLECTIONS.find((c) => isCategorySelected(selectedCategory, c.id)) || {
      id: selectedCategory,
      nameEn: getCategoryName(selectedCategory, 'en'),
      nameBn: getCategoryName(selectedCategory, 'bn'),
      staticCount: 20,
    };

  // Filter products for this category
  const filteredProducts = products.filter((p) =>
    selectedCategory === 'all' ? true : isCategorySelected(selectedCategory, p.category)
  );

  const displayCount =
    filteredProducts.length > 0
      ? filteredProducts.length
      : selectedCatObj.staticCount || 20;

  const categoryTitle = selectedCatObj.nameEn || getCategoryName(selectedCategory, 'en');

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Breadcrumbs (Matching Reference Image 3: 🏠 Home > CATEGORY) */}
        <nav className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium pt-5">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-slate-900 transition"
          >
            <Home className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 stroke-[2]" />
          <span className="uppercase text-slate-700 font-semibold tracking-wide">
            {categoryTitle}
          </span>
        </nav>

        {/* 2. Centered Category Title & Product Count (Matching Reference Image 3) */}
        <div className="text-center mt-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-wide">
            {categoryTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            {displayCount} products
          </p>
        </div>

        {/* 3. Left Section Heading (Matching Reference Image 3: সব পণ্য) */}
        <div className="mb-5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            সব পণ্য
          </h2>
        </div>

        {/* 4. Product Grid (Matching Reference Image 3: 4-Column Responsive Grid) */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filteredProducts.map((product) => {
              const isWishlisted = Boolean(wishlist[product.id]);
              const discountPercent =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : product.discountBadge
                  ? parseInt(product.discountBadge.replace(/[^0-9]/g, '')) || 0
                  : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/product/${product.id}`)}
                  className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-2xs hover:shadow-md transition-shadow relative flex flex-col justify-between group cursor-pointer"
                >
                  {/* Top Badges Row */}
                  <div className="flex items-center justify-between w-full h-6 relative z-10">
                    {/* Discount Badge on Top-Left */}
                    {discountPercent > 0 ? (
                      <span className="bg-black text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-sm tracking-tight">
                        -{discountPercent}%
                      </span>
                    ) : (
                      <span />
                    )}

                    {/* Wishlist Heart Icon on Top-Right */}
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                      title="Wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 stroke-[1.8] ${
                          isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Centered Product Image */}
                  <div className="w-full aspect-square flex items-center justify-center p-2 my-2 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Title (Bold Uppercase) */}
                  <div className="mt-1">
                    <h3 className="font-black text-xs sm:text-[13px] text-slate-900 uppercase tracking-tight line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {cleanProductTitle(product.name)}
                    </h3>

                    {/* Price Row (Current BDT Price & Original Price Strikethrough) */}
                    <div className="flex items-baseline space-x-1.5 mt-2">
                      <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        ৳{product.price}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs sm:text-sm text-slate-400 line-through font-normal">
                          ৳{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-2xs space-y-4 max-w-lg mx-auto my-8">
            <div className="w-16 h-16 bg-gray-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              শীঘ্রই নতুন স্টক যুক্ত করা হবে। অন্য কোনো ক্যাটাগরি দেখতে পারেন।
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white" />
                <span>হোমপেজে ফিরে যান</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export const CategoriesView: React.FC<CategoriesViewProps> = (props) => {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center bg-white text-slate-400 font-bold text-sm">
          লোড হচ্ছে...
        </div>
      }
    >
      <CategoriesViewContent {...props} />
    </React.Suspense>
  );
};
