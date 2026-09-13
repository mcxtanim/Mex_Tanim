'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  X,
  Star,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Flame,
  Zap,
  ChevronRight as ArrowRight,
  Home as HomeIcon,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { Header } from '@/features/shared/Header';
import { Footer } from '@/features/shared/Footer';
import { fetchLiveProducts, getBrandName, getCachedProducts, fetchProductById } from '@/features/catalog/productService';
import { Product } from '@/features/catalog/types';
import { ProductCard } from '@/features/catalog/ProductCard';
import { useCart } from '@/features/cart/CartContext';
import { useLanguage } from '@/features/shared/LanguageContext';
import { WhatsAppIcon } from '@/features/shared/WhatsAppIcon';
import { BuyNowModal } from '@/features/checkout/BuyNowModal';
import { getReviewsForProduct, ProductReview } from '@/features/catalog/reviewService';
import { useStoreSettings, formatWhatsAppUrl } from '@/features/shared/storeSettingsService';

export default function DedicatedProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const settings = useStoreSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    // 1. Instant 0ms cache lookup on client mount
    const cached = getCachedProducts();
    if (cached.length > 0) {
      setAllProducts(cached);
      const found = cached.find((p) => String(p.id) === String(productId));
      if (found) {
        setProduct(found);
        setIsLoading(false);
      }
    }

    // 2. Fetch specific product by ID if not in memory cache
    fetchProductById(productId).then((prod) => {
      if (prod) {
        setProduct(prod);
        setIsLoading(false);
      }
    });

    // 3. Background revalidation for fresh Supabase data
    fetchLiveProducts().then((data) => {
      setAllProducts(data);
      const found = data.find((p) => String(p.id) === String(productId));
      if (found) {
        setProduct(found);
        setIsLoading(false);
      } else if (data.length > 0) {
        setProduct((prev) => prev || data[0]);
        setIsLoading(false);
      }
    });
  }, [productId]);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);

  // Zoom States
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  const relatedRailRef = useRef<HTMLDivElement>(null);

  // Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  useEffect(() => {
    if (product?.id) {
      setReviews(getReviewsForProduct(product.id));
    }
  }, [product?.id]);

  useEffect(() => {
    const handleSync = () => {
      if (product?.id) {
        setReviews(getReviewsForProduct(product.id));
      }
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [product?.id]);

  // Sync active image when product changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.image || '');
      setQuantity(1);
    }
  }, [productId, product?.id]);

  // Early Loading / Missing Product Guard (Structured identically to main layout for SSR consistency)
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
            <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl border border-gray-200 shadow-xl max-w-sm mx-auto space-y-4 animate-pulse">
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

  const totalReviewsCount = reviews.length > 0 ? reviews.length : (product.reviewCount || 0);
  const averageRatingScore = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : (product.rating || 5.0).toFixed(1);

  // Safe non-empty image source fallback
  const displayImage =
    activeImage ||
    product.image ||
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80';

  // Gallery Images (Main image + comboImages)
  const galleryImages = Array.from(
    new Set([
      product.image,
      ...(product.comboImages || []),
    ])
  ).filter((img) => Boolean(img));

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
    setIsBuyNowModalOpen(true);
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    if (!settings.whatsappNumber) {
      alert(language === 'bn' ? 'হোয়াটসঅ্যাপ নম্বর এখনো যুক্ত করা হয়নি' : 'WhatsApp number is not configured yet');
      return;
    }
    const storeName = settings.storeName || 'Mex Tanim Store';
    const message = `Hello! I want to order this product from ${storeName}:\n\n*Product:* ${product.name}\n*Price:* ৳${product.price}\n*Quantity:* ${quantity}`;
    const url = formatWhatsAppUrl(settings.whatsappNumber, message);
    if (url) window.open(url, '_blank');
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Mex Tanim Store!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  // Filter Related Products (Same category, excluding current product)
  let relatedProducts = allProducts.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.categoryBn === product.categoryBn)
  );

  if (relatedProducts.length < 4) {
    const extra = allProducts.filter(
      (p) => p.id !== product.id && !relatedProducts.some((r) => r.id === p.id)
    );
    relatedProducts = [...relatedProducts, ...extra].slice(0, 8);
  } else {
    relatedProducts = relatedProducts.slice(0, 8);
  }

  const handleScrollRelated = (dir: 'left' | 'right') => {
    if (relatedRailRef.current) {
      const amount = dir === 'left' ? -320 : 320;
      relatedRailRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/50">
      {/* Fullscreen Mobile/Tablet Image Lightbox */}
      {isFullscreenImage && (
        <div className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreenImage(false)}
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 p-2.5 rounded-full transition z-70"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={displayImage}
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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Breadcrumb Bar */}
          <nav className="flex items-center space-x-2 text-xs text-gray-500 font-medium bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/60 shadow-lg shadow-slate-900/5">
            <Link href="/" className="hover:text-orange-600 flex items-center gap-1 transition">
              <HomeIcon className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="capitalize">{product.categoryBn || product.category}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="font-extrabold text-slate-900 truncate max-w-[200px] sm:max-w-md">
              {language === 'bn' ? product.nameBn : product.name}
            </span>
          </nav>

          {/* DEDICATED PRODUCT DETAILS CONTAINER */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN — PRODUCT IMAGE GALLERY WITH CURSOR-FOLLOWING ZOOM */}
            <div className="md:col-span-6 space-y-4">
              {/* Main Image View */}
              <div
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setIsFullscreenImage(true)}
                className="relative w-full h-[350px] sm:h-[450px] bg-slate-50 rounded-3xl border border-gray-200/80 overflow-hidden flex items-center justify-center cursor-zoom-in group shadow-2xs"
              >
                {/* Discount Badge */}
                {product.discountBadge && (
                  <span className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                    {product.discountBadge}
                  </span>
                )}

                {/* Magnifier Indicator */}
                <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-slate-700 flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 transition pointer-events-none">
                  <ZoomIn className="w-3.5 h-3.5 text-orange-400" />
                  <span>{language === 'bn' ? 'জুম করতে মাউস রাখুন' : 'Hover to Zoom'}</span>
                </div>

                {/* Main Image with Cursor-Following Lens Zoom */}
                <img
                  src={displayImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 transition-transform duration-150 ease-out"
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

              {/* Thumbnails Rail */}
              {galleryImages.length > 1 && (
                <div className="flex items-center space-x-3 overflow-x-auto py-1 scrollbar-none">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`w-18 h-18 rounded-2xl border-2 p-1.5 bg-white overflow-hidden shrink-0 transition-all cursor-pointer ${
                        displayImage === imgUrl
                          ? 'border-orange-500 shadow-md scale-105'
                          : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN — PRODUCT INFORMATION & PURCHASE CONTROLS */}
            <div className="md:col-span-6 space-y-6">
              {/* Category, Brand & Stock Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-orange-50 text-orange-600 font-extrabold text-xs uppercase px-3.5 py-1 rounded-full border border-orange-200">
                  {product.categoryBn || product.category}
                </span>

                {/* Brand Name Badge */}
                <span className="bg-slate-100 text-slate-800 font-extrabold text-xs px-3.5 py-1 rounded-full border border-slate-200 flex items-center space-x-1">
                  <span className="text-gray-500 font-medium">{language === 'bn' ? 'ব্র্যান্ড:' : 'Brand:'}</span>
                  <span className="text-slate-900 font-black">{getBrandName(product, language)}</span>
                </span>

                <span className="flex items-center space-x-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>{language === 'bn' ? 'স্টকে এভেলেবল' : 'In Stock'}</span>
                </span>
              </div>

              {/* Title & Brand Name */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {language === 'bn' ? product.nameBn : product.name}
                </h1>
                <div className="flex items-center space-x-2 mt-1.5 text-xs sm:text-sm">
                  <span className="text-gray-500 font-medium">{language === 'bn' ? 'ব্র্যান্ড নাম:' : 'Brand Name:'}</span>
                  <span className="font-black text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg shadow-2xs">
                    {getBrandName(product, language)}
                  </span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-orange-50/80 p-5 rounded-3xl border border-orange-200/80 space-y-1">
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">৳{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through font-bold">
                      ৳{product.originalPrice}
                    </span>
                  )}
                </div>
                {product.originalPrice > product.price && (
                  <p className="text-xs font-extrabold text-emerald-600 flex items-center space-x-1 pt-1">
                    <Zap className="w-3.5 h-3.5 fill-emerald-600" />
                    <span>
                      {language === 'bn'
                        ? `অফারে সাশ্রয় করুন ৳${product.originalPrice - product.price}`
                        : `Save ৳${product.originalPrice - product.price} on this deal!`}
                    </span>
                  </p>
                )}
              </div>

              {/* Description & Specs */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  {language === 'bn' ? product.descriptionBn : product.description}
                </p>

                {product.specs && product.specs.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200/80 space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                      {language === 'bn' ? 'মূল বৈশিষ্ট্যসমূহ:' : 'Key Specifications:'}
                    </h4>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1.5">
                      {product.specs.map((spec, i) => (
                        <li key={i} className="flex items-center space-x-2 font-medium">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl border border-gray-200/60">
                  <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="font-bold">{language === 'bn' ? '১০০% আসল প্রোডাক্ট' : '100% Original'}</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-xl border border-gray-200/60">
                  <Truck className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="font-bold">{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="space-y-4 pt-3 border-t border-gray-100">
                {/* Quantity + Add to Cart */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-300 rounded-2xl p-1 bg-gray-50 shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-slate-900 hover:text-white font-black text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
                    >
                      -
                    </button>
                    <span className="px-4 font-black text-sm text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-slate-900 hover:text-white font-black text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={added}
                    className={`flex-1 py-3.5 px-6 font-extrabold rounded-2xl text-xs sm:text-sm text-white shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95 ${
                      added
                        ? 'bg-emerald-600 shadow-emerald-600/30'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{language === 'bn' ? 'কার্টে যোগ হয়েছে!' : 'Added to Cart!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>
                          {language === 'bn'
                            ? `কার্টে যোগ করুন (৳${product.price * quantity})`
                            : `Add to Cart (৳${product.price * quantity})`}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Buy Now & WhatsApp Direct Order Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
                    <span>{language === 'bn' ? 'সরাসরি অর্ডার করুন' : 'Buy Now'}</span>
                  </button>

                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                    <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ অর্ডার' : 'WhatsApp Order'}</span>
                  </button>
                </div>

                {/* Share Product Option */}
                <button
                  onClick={handleShareProduct}
                  className="w-full py-2 text-xs font-bold text-gray-500 hover:text-slate-900 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'প্রোডাক্ট শেয়ার করুন' : 'Share Product'}</span>
                </button>
              </div>

            </div>

          </div>

          {/* DEDICATED RELATED ITEMS SECTION ("সম্পর্কিত আইটেম") */}
          {relatedProducts.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl p-6 sm:p-8 space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 text-orange-400 flex items-center justify-center shadow-md">
                    <Flame className="w-6 h-6 fill-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      {language === 'bn' ? 'সম্পর্কিত আইটেম (Related Items)' : 'Related Items'}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">
                      {language === 'bn'
                        ? 'একই ক্যাটাগরির আরও চমৎকার গেমিং গ্যাজেট দেখুন'
                        : 'Explore more gaming gadgets from the same category'}
                    </p>
                  </div>
                </div>

                {/* Carousel Nav Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleScrollRelated('left')}
                    className="w-9 h-9 rounded-full bg-slate-100 border border-gray-200 shadow-2xs hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
                    title="Scroll Left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleScrollRelated('right')}
                    className="w-9 h-9 rounded-full bg-slate-100 border border-gray-200 shadow-2xs hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
                    title="Scroll Right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Related Products Horizontal Carousel */}
              <div
                ref={relatedRailRef}
                className="flex space-x-4 overflow-x-auto scrollbar-none py-2 px-1 snap-x touch-pan-x"
              >
                {relatedProducts.map((relProd) => (
                  <div
                    key={relProd.id}
                    className="min-w-[240px] sm:min-w-[270px] max-w-[280px] shrink-0 snap-start"
                  >
                    <ProductCard product={relProd} />
                  </div>
                ))}
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Buy Now Checkout Modal */}
      <BuyNowModal
        product={product}
        isOpen={isBuyNowModalOpen}
        initialQuantity={quantity}
        onClose={() => setIsBuyNowModalOpen(false)}
      />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}
