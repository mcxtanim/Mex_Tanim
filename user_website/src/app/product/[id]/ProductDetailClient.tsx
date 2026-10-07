'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  X,
  Play,
  Heart,
  ZoomIn,
  Package,
  Tag,
  ShoppingBag,
  ShoppingCart,
  Share2,
  ChevronRight as ArrowRight,
  Home as HomeIcon,
} from 'lucide-react';
import { Header } from '@/features/shared/Header';
import { Footer } from '@/features/shared/Footer';
import {
  fetchLiveProducts,
  getBrandName,
  getCachedProducts,
  fetchProductById,
  cleanProductTitle,
} from '@/features/catalog/productService';
import { getCategoryName } from '@/features/catalog/categoryData';
import { Product } from '@/features/catalog/types';
import { useCart } from '@/features/cart/CartContext';
import { useLanguage } from '@/features/shared/LanguageContext';
import { WhatsAppIcon } from '@/features/shared/WhatsAppIcon';
import { useStoreSettings, formatWhatsAppUrl } from '@/features/shared/storeSettingsService';

interface DedicatedProductPageProps {
  initialProduct?: Product | null;
}

export default function DedicatedProductPage({ initialProduct }: DedicatedProductPageProps = {}) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const pathSegments = (pathname || (typeof window !== 'undefined' ? window.location.pathname : ''))
    .split('/')
    .filter(Boolean);
  const productIdx = pathSegments.indexOf('product');
  const pathId =
    productIdx !== -1 && pathSegments[productIdx + 1] && pathSegments[productIdx + 1] !== 'preview'
      ? pathSegments[productIdx + 1]
      : '';
  const paramId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const productId = pathId || paramId || (initialProduct?.id ? String(initialProduct.id) : '1');

  const { addToCart } = useCart();
  const { language } = useLanguage();
  const settings = useStoreSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const sanitize = (p?: Product | null): Product | undefined => {
    if (!p) return undefined;
    return {
      ...p,
      name: cleanProductTitle(p.name),
      nameBn: cleanProductTitle(p.nameBn || p.name),
    };
  };

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | undefined>(() => sanitize(initialProduct));
  const [isLoading, setIsLoading] = useState(!initialProduct);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Zoom States
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const cached = getCachedProducts();
    if (cached.length > 0) {
      setAllProducts(cached);
      const found = cached.find((p) => String(p.id) === String(productId));
      if (found) {
        setProduct(sanitize(found));
        setIsLoading(false);
      }
    }

    fetchProductById(productId).then((prod) => {
      if (prod) {
        setProduct(sanitize(prod));
        setIsLoading(false);
      }
    });

    fetchLiveProducts().then((data) => {
      setAllProducts(data);
      const found = data.find((p) => String(p.id) === String(productId));
      if (found) {
        setProduct(sanitize(found));
        setIsLoading(false);
      } else if (data.length > 0) {
        setProduct((prev) => sanitize(prev || data[0]));
        setIsLoading(false);
      }
    });
  }, [productId]);

  // Sync active image when product changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.image || '');
      setIsVideoActive(false);
      setQuantity(1);
    }
  }, [productId, product?.id]);

  // Build 4 distinct product images for gallery selection matching reference Image 2
  const productGallery = useMemo(() => {
    if (!product) return [];
    const list: string[] = [product.image];
    if (product.comboImages && product.comboImages.length > 0) {
      list.push(...product.comboImages);
    }

    const fallbacks: Record<string, string[]> = {
      'finger-sleeves': [
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
      ],
      'gaming-cooler': [
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
      ],
      'gaming-headsets': [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      ],
      'gaming-mice': [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
      ],
      'mechanical-keyboards': [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
      ],
      'fast-chargers': [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      ],
      'soundboxes': [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
      ],
    };

    const categoryFallbacks = fallbacks[product.category] || [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
    ];

    for (const fb of categoryFallbacks) {
      if (list.length >= 4) break;
      if (!list.includes(fb)) list.push(fb);
    }

    return list.slice(0, 4);
  }, [product]);

  // Early Loading / Missing Product Guard
  if (!isMounted || isLoading || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50/50">
        <div>
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              router.push('/');
            }}
          />
          <main className="max-w-7xl mx-auto px-4 py-20 text-center flex-1 flex items-center justify-center min-h-[60vh]">
            <div className="bg-white p-10 rounded-3xl border border-gray-200 shadow-xl max-w-sm mx-auto space-y-4 animate-pulse">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <ShoppingBag className="w-7 h-7 animate-bounce" />
              </div>
              <p className="text-sm font-extrabold text-slate-800">
                {language === 'bn' ? 'পণ্য তথ্য লোড হচ্ছে...' : 'Loading product details...'}
              </p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  // Safe display image source
  const currentVisualImage = activeImage || product.image;

  // Discount calculation
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : product.discountBadge
      ? parseInt(product.discountBadge.replace(/[^0-9]/g, '')) || 0
      : 0;

  // Realistic Sold & Stock Counts
  const soldCount = product.soldCount && product.soldCount > 0
    ? product.soldCount
    : (product.reviewCount && product.reviewCount > 0 ? product.reviewCount * 3 + 25 : 330);

  const stockCount = 67;

  // Handle Cursor-Following Zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const whatsappNum = settings.whatsappNumber || '8801700000000';
    const storeName = settings.storeName || 'Mex Tanim Store';
    const message = `Hello! I want to order this product from ${storeName}:\n\n*Product:* ${product.name}\n*Price:* ৳${product.price}\n*Quantity:* ${quantity}\n*URL:* ${typeof window !== 'undefined' ? window.location.href : ''}`;
    const url = formatWhatsAppUrl(whatsappNum, message);
    if (url) window.open(url, '_blank');
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on Mex Tanim Store!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard! (প্রোডাক্ট লিংক কপি করা হয়েছে)');
    }
  };

  // Filter 4 Related Products for Section (Matching Reference Image 5)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.categoryBn === product.categoryBn))
    .slice(0, 4);

  const fallbackRelated =
    relatedProducts.length < 4
      ? [
          ...relatedProducts,
          ...allProducts.filter((p) => p.id !== product.id && !relatedProducts.some((r) => r.id === p.id)),
        ].slice(0, 4)
      : relatedProducts;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F9FA]">
      {/* Fullscreen Image Lightbox */}
      {isFullscreenImage && !isVideoActive && (
        <div className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreenImage(false)}
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 p-2.5 rounded-full transition z-70 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentVisualImage}
            alt={product.name}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      <div>
        {/* Site Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            router.push('/');
          }}
        />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-8">
          {/* Breadcrumb Bar */}
          <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
            <Link href="/" className="hover:text-black flex items-center gap-1 transition">
              <HomeIcon className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="capitalize">
              {language === 'bn'
                ? product.categoryBn || getCategoryName(product.category, 'bn')
                : getCategoryName(product.category, 'en')}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="font-extrabold text-slate-900 truncate max-w-[200px] sm:max-w-md">
              {language === 'bn' ? product.nameBn : product.name}
            </span>
          </nav>

          {/* TOP SECTION — MATCHING REFERENCE IMAGE 2 (media_1791404392474.png) */}
          <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-9 shadow-[0_2px_16px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: MAIN VISUAL & THUMBNAILS (WITH DIRECT VIDEO PLAYBACK) */}
            <div className="md:col-span-6 space-y-4">
              {/* Main Visual Display Container */}
              <div className="relative w-full h-[360px] sm:h-[460px] bg-white rounded-2xl sm:rounded-3xl border border-gray-150 overflow-hidden flex items-center justify-center shadow-2xs">
                {isVideoActive ? (
                  /* Interactive Video Player (Plays video right inside the main area) */
                  <div className="w-full h-full bg-black relative flex items-center justify-center">
                    <video
                      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  /* Image View with Zoom on Hover */
                  <div
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                    onMouseMove={handleMouseMove}
                    onClick={() => setIsFullscreenImage(true)}
                    className="relative w-full h-full flex items-center justify-center cursor-zoom-in group select-none"
                  >
                    {/* Wishlist Heart Button on Top Right (Matching Reference Image 2) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsWishlisted(!isWishlisted);
                      }}
                      className={`absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white shadow-2xs border border-gray-100 flex items-center justify-center transition-all active:scale-90 z-20 cursor-pointer ${
                        isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                      title="Wishlist"
                    >
                      <Heart className={`w-5 h-5 stroke-[1.8] ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                    </button>

                    {/* Magnifier Lens Icon on Bottom Right (Matching Reference Image 2) */}
                    <div className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full bg-slate-700/80 hover:bg-slate-800 text-white flex items-center justify-center shadow-md transition pointer-events-none z-10">
                      <ZoomIn className="w-4.5 h-4.5 stroke-[2]" />
                    </div>

                    {/* Zoomable Product Image */}
                    <img
                      src={currentVisualImage}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-150 ease-out"
                      style={
                        isZoomed
                          ? {
                              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                              transform: 'scale(2.2)',
                            }
                          : { transform: 'scale(1)' }
                      }
                    />
                  </div>
                )}
              </div>

              {/* Thumbnails Row: Multiple Images Selection + VIDEO Thumbnail Button */}
              <div className="flex items-center space-x-2.5 sm:space-x-3 overflow-x-auto py-1 scrollbar-none">
                {productGallery.map((imgUrl, idx) => {
                  const isSelected = !isVideoActive && (activeImage === imgUrl || (!activeImage && idx === 0));
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsVideoActive(false);
                        setActiveImage(imgUrl);
                      }}
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-2 p-1.5 bg-white overflow-hidden shrink-0 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-slate-900 shadow-sm scale-102 ring-1 ring-slate-900'
                          : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail view ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  );
                })}

                {/* VIDEO Thumbnail Button (Matching Reference Image 2 & 3) */}
                <button
                  type="button"
                  onClick={() => setIsVideoActive(true)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-2 bg-[#0F172A] text-white flex flex-col items-center justify-center shrink-0 transition-all cursor-pointer group shadow-2xs ${
                    isVideoActive
                      ? 'border-red-500 ring-2 ring-red-500 scale-102'
                      : 'border-gray-800 hover:border-gray-600 hover:bg-[#1E293B]'
                  }`}
                  title="Watch Product Video"
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center mb-0.5">
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white ml-0.5" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-white/90">
                    VIDEO
                  </span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: BUY BOX & PRODUCT DETAILS (MATCHING REFERENCE IMAGE 2) */}
            <div className="md:col-span-6 space-y-4 sm:space-y-5">
              {/* In Stock Badge (Box icon + X স্টকে আছে) — NO Review Rating */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50/80 border border-emerald-300">
                  <Package className="w-3.5 h-3.5 stroke-[2] text-emerald-600" />
                  <span>{stockCount} স্টকে আছে</span>
                </span>
              </div>

              {/* Product Title (Bold Uppercase Dark) */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0B1A30] uppercase tracking-tight leading-snug">
                {cleanProductTitle(language === 'bn' ? product.nameBn || product.name : product.name)}
              </h1>

              {/* Price Row (৳ Price, Strikethrough, X% OFF Black Badge) */}
              <div className="flex items-baseline space-x-3 pt-0.5">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0B1A30] tracking-tight">
                  ৳{product.price.toLocaleString('en-US')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base text-gray-400 line-through font-bold">
                    ৳{product.originalPrice.toLocaleString('en-US')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-black text-white text-[11px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Sold Count */}
              <div className="flex items-center space-x-1.5 text-slate-500 font-semibold text-xs sm:text-sm">
                <Tag className="w-4 h-4 stroke-[1.8] text-slate-400" />
                <span>{soldCount} Sold</span>
              </div>

              {/* Brand and Quantity Row */}
              <div className="flex items-center justify-between gap-3 pt-2">
                {/* Brand Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F1F3F5] text-slate-800 text-xs sm:text-sm font-bold border border-gray-200">
                  <ShoppingBag className="w-3.5 h-3.5 stroke-[2] text-slate-600" />
                  <span>
                    Brand: <strong className="font-black text-slate-900">{getBrandName(product, language)}</strong>
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-700">পরিমাণ</span>
                  <div className="flex items-center bg-[#E5E7EB]/80 border border-gray-300 rounded-xl overflow-hidden p-0.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-transparent hover:bg-white text-slate-800 font-bold flex items-center justify-center transition cursor-pointer active:scale-95"
                    >
                      -
                    </button>
                    <span className="w-9 text-center font-black text-sm text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-transparent hover:bg-white text-slate-800 font-bold flex items-center justify-center transition cursor-pointer active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Matching Reference Image 2) */}
              <div className="space-y-3 pt-2">
                {/* Row 1: Add to Cart (White/Black) + Buy Now (Black) */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-slate-900 border-2 border-slate-900 font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4 stroke-[2]" />
                    <span>{added ? 'কার্টে যোগ হয়েছে!' : 'কার্টে যোগ করুন'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full py-3 px-4 bg-black hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 stroke-[2]" />
                    <span>BUY NOW</span>
                  </button>
                </div>

                {/* Row 2: WhatsApp Chat Button (Solid Green with WhatsApp Icon) */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 px-6 bg-[#16A34A] hover:bg-[#15803D] text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer tracking-wide"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                  <span>CHAT ON WHATSAPP</span>
                </button>

                {/* Row 3: Share Product Button */}
                <button
                  type="button"
                  onClick={handleShareProduct}
                  className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-slate-700 border border-gray-300 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 stroke-[2]" />
                  <span>SHARE THIS PRODUCT</span>
                </button>
              </div>

              {/* DESCRIPTION & SPECIFICATIONS SECTION (DIRECTLY AFTER SHARE BUTTON - MATCHING REFERENCE IMAGE) */}
              <div className="pt-6 border-t border-gray-200/90 space-y-5">
                {/* Section Header: 'বিবরণ' (Matching Reference Image) */}
                <div className="flex items-center gap-6 border-b border-gray-200">
                  <div className="pb-3 font-extrabold text-sm sm:text-base text-slate-900 border-b-2 border-black">
                    বিবরণ
                  </div>
                </div>

                {/* Description Content */}
                <div className="space-y-5 text-slate-800 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-[#0B1A30] uppercase tracking-wide">
                        {cleanProductTitle(product.name)}
                      </h3>
                      <p className="font-extrabold text-slate-900 mt-1 flex items-center gap-2 text-sm sm:text-base">
                        <span>⚡</span>
                        <span>Look আলাদা, gameplay-ও আরও smooth!</span>
                      </p>
                    </div>

                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                      <strong className="text-slate-900 font-bold">{cleanProductTitle(product.name)}</strong> mobile gamers-এর জন্য তৈরি, যেখানে gaming comfort-এর সঙ্গে রয়েছে একটি eye-catching luminous look। Finger movement-এর friction কমিয়ে touchscreen-এর ওপর smoother swipe, drag এবং aiming control পেতে সাহায্য করে। Gaming-এর সময় আঙুলে sweat বা moisture জমলে touch control-এর consistency প্রভাবিত হতে পারে। এটি ব্যবহার করে এই সমস্যা কমাতে সাহায্য করা যায়, ফলে fast-paced gameplay-এ finger movement আরও comfortable থাকে।
                    </p>

                    {/* Features List with Emojis */}
                    <div className="space-y-2.5 pt-2">
                      <h4 className="font-black text-slate-900 text-sm uppercase">
                        কেন {cleanProductTitle(product.name)}?
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-gray-700 font-medium">
                        <li className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">⚡</span>
                          <div>
                            <strong className="text-slate-900 font-bold">Luminous Gaming Design —</strong> gaming setup-এ আলাদা visual style এনে দেয়।
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">🎯</span>
                          <div>
                            <strong className="text-slate-900 font-bold">Smooth Touch Control —</strong> swipe, drag ও aiming-এর সময় smoother movement নিশ্চিত করে।
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">🪶</span>
                          <div>
                            <strong className="text-slate-900 font-bold">Low-Friction Feel —</strong> fast finger movement-এর জন্য suitable ও হালকা অনুভূতি।
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">💧</span>
                          <div>
                            <strong className="text-slate-900 font-bold">Moisture Management —</strong> sweat-related touch issues কমাতে সাহায্য করে।
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">🎮</span>
                          <div>
                            <strong className="text-slate-900 font-bold">Made for Mobile Gaming —</strong> competitive gameplay-এর জন্য practical।
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">👆</span>
                          <div>
                            <strong className="text-slate-900 font-bold">Comfortable Finger Movement —</strong> দীর্ঘ gameplay-এ convenient feel।
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">✨</span>
                          <div>
                            <strong className="text-slate-900 font-bold">Stylish Gaming Accessory —</strong> performance setup-এর সঙ্গে added visual appeal।
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Perfect For Games List (Matching Image 4) */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <h4 className="font-black text-slate-900 text-sm">
                        Perfect For
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                          <span>Free Fire / Free Fire MAX</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                          <span>PUBG Mobile</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                          <span>Call of Duty Mobile</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                          <span>eFootball</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                          <span>FPS & Battle Royale Games</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                          <span>Competitive Mobile Gaming</span>
                        </div>
                      </div>
                    </div>

                    {/* Short Description Block (Matching Image 4) */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <h4 className="font-black text-slate-900 text-sm">
                        Short Description
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        <strong className="text-slate-900 font-bold">{cleanProductTitle(product.name)}</strong> হলো stylish gaming এক্সেসরিজ, যা smooth touch movement, aiming ও fast swiping-এ সাহায্য করে। Luminous design-এর সঙ্গে আপনার mobile gaming setup-এ যোগ করুন আরও comfortable control।
                      </p>
                    </div>
                  </div>
              </div>

            </div>

          </div>

          {/* BOTTOM SECTION — RELATED ITEMS ("সম্পর্কিত আইটেম") MATCHING REFERENCE IMAGE 5 */}
          {fallbackRelated.length > 0 && (
            <div className="space-y-6 pt-4">
              {/* Centered Title */}
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  সম্পর্কিত আইটেম
                </h2>
              </div>

              {/* 4 Related Product Cards Grid (Matching Reference Image 5) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
                {fallbackRelated.map((rel, index) => (
                  <div
                    key={rel.id}
                    onClick={() => router.push(`/product/${rel.id}`)}
                    className="bg-white rounded-2xl border border-gray-200/80 p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-lg hover:border-gray-300 transition-all duration-300 relative group cursor-pointer"
                  >
                    {/* Small number badge in top right (Matching Image 5) */}
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-bold text-slate-400 bg-gray-50 border border-gray-200 w-5 h-5 rounded-full flex items-center justify-center">
                      {(index % 4) + 3}
                    </span>

                    {/* Product Image on Clean White Container */}
                    <div className="w-full aspect-square bg-white flex items-center justify-center p-2 mb-2 overflow-hidden">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Title */}
                    <div className="flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {rel.name}
                      </h3>
                    </div>

                    {/* Price & Cart row (Matching Image 5) */}
                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="inline-block bg-gray-100 text-slate-900 font-black text-xs sm:text-sm px-2.5 py-0.5 rounded-md">
                          {rel.price} TK
                        </span>
                        <span className="text-[11px] font-bold text-emerald-600 block mt-1">
                          স্টক আছে
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(rel);
                        }}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4 stroke-[2]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
