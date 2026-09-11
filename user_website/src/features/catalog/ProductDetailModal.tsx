'use client';

import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { Product } from './types';
import { PRODUCTS, COMBO_PRODUCTS, getBrandName } from './mockData';
import { ProductCard } from './ProductCard';
import { useCart } from '../cart/CartContext';
import { useLanguage } from '../shared/LanguageContext';
import { WhatsAppIcon } from '../shared/WhatsAppIcon';

const DEVELOPER_WHATSAPP = '8801317170609';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product: initialProduct,
  onClose,
}) => {
  const { addToCart } = useCart();
  const { language } = useLanguage();

  // Active product state (can change when clicking a related item)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>(initialProduct?.image || '');
  
  // Image Zoom states
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const relatedRailRef = useRef<HTMLDivElement>(null);

  // Sync initial product and set active image
  useEffect(() => {
    if (initialProduct) {
      setCurrentProduct(initialProduct);
      setActiveImage(initialProduct.image);
      setQuantity(1);
    }
  }, [initialProduct]);

  // When currentProduct changes, reset active image and scroll modal to top
  useEffect(() => {
    if (currentProduct) {
      setActiveImage(currentProduct.image);
      setQuantity(1);
      if (modalContainerRef.current) {
        modalContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentProduct]);

  if (!currentProduct) return null;

  // Safe non-empty image source fallback
  const displayImage =
    activeImage ||
    currentProduct.image ||
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80';

  // Gallery Images List (Main image + comboImages or alternative views)
  const galleryImages = Array.from(
    new Set([
      currentProduct.image,
      ...(currentProduct.comboImages || []),
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
    addToCart(currentProduct, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    addToCart(currentProduct, quantity);
    onClose();
    // Smooth scroll to checkout or open cart drawer if available
    const cartButton = document.querySelector('[aria-label="Cart"]') as HTMLElement;
    if (cartButton) cartButton.click();
  };

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello! I want to order this product from Mex Tanim Store:\n\n*Product:* ${currentProduct.name}\n*Price:* ৳${currentProduct.price}\n*Quantity:* ${quantity}`
    );
    window.open(`https://wa.me/${DEVELOPER_WHATSAPP}?text=${text}`, '_blank');
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: currentProduct.name,
        text: `Check out ${currentProduct.name} on Mex Tanim Store!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  // Filter Related Products (Same category, excluding current product)
  const allAvailable = [...PRODUCTS, ...COMBO_PRODUCTS];
  let relatedProducts = allAvailable.filter(
    (p) => p.id !== currentProduct.id && (p.category === currentProduct.category || p.categoryBn === currentProduct.categoryBn)
  );

  // If not enough related products, fill with popular items
  if (relatedProducts.length < 4) {
    const extra = allAvailable.filter(
      (p) => p.id !== currentProduct.id && !relatedProducts.some((r) => r.id === p.id)
    );
    relatedProducts = [...relatedProducts, ...extra].slice(0, 8);
  } else {
    relatedProducts = relatedProducts.slice(0, 8);
  }

  const handleScrollRelated = (dir: 'left' | 'right') => {
    if (relatedRailRef.current) {
      const amount = dir === 'left' ? -300 : 300;
      relatedRailRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 overflow-y-auto">
      
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
            alt={currentProduct.name}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {/* Main Modal Window */}
      <div
        ref={modalContainerRef}
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-y-auto border border-gray-100 max-h-[92vh] flex flex-col scrollbar-thin animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header Bar with Close Button */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-6 bg-orange-500 rounded-full inline-block" />
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              {language === 'bn' ? 'পণ্য বিস্তারিত' : 'Product Details'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-slate-900 hover:text-white text-slate-700 rounded-full transition cursor-pointer active:scale-95 shadow-2xs"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Product Gallery + Information Grid */}
        <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE — PRODUCT IMAGE GALLERY WITH CURSOR-FOLLOWING ZOOM */}
          <div className="md:col-span-6 space-y-4">
            {/* Main Image Container */}
            <div
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsFullscreenImage(true)}
              className="relative w-full h-[320px] sm:h-[400px] bg-slate-50 rounded-3xl border border-gray-200/80 overflow-hidden flex items-center justify-center cursor-zoom-in group shadow-xs"
            >
              {/* Discount Badge */}
              {currentProduct.discountBadge && (
                <span className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                  {currentProduct.discountBadge}
                </span>
              )}

              {/* Magnifier Hover Indicator */}
              <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-slate-700 flex items-center space-x-1.5 opacity-90 group-hover:opacity-100 transition pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5 text-orange-400" />
                <span>{language === 'bn' ? 'জুম করতে মাউস রাখুন' : 'Hover to Zoom'}</span>
              </div>

              {/* Main Image with Smooth Cursor-Following Zoom */}
              <img
                src={displayImage}
                alt={currentProduct.name}
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

            {/* Thumbnails Rail (if multiple gallery images exist) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto py-1 scrollbar-none">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-16 h-16 rounded-2xl border-2 p-1 bg-white overflow-hidden shrink-0 transition-all cursor-pointer ${
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

          {/* RIGHT SIDE — PRODUCT INFORMATION & PURCHASE CONTROLS */}
          <div className="md:col-span-6 space-y-5">
            {/* Category, Brand & Stock Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-orange-50 text-orange-600 font-extrabold text-xs uppercase px-3 py-1 rounded-full border border-orange-200">
                {currentProduct.categoryBn || currentProduct.category}
              </span>

              {/* Brand Name Badge */}
              <span className="bg-slate-100 text-slate-800 font-extrabold text-xs px-3 py-1 rounded-full border border-slate-200 flex items-center space-x-1">
                <span className="text-gray-500 font-medium">{language === 'bn' ? 'ব্র্যান্ড:' : 'Brand:'}</span>
                <span className="text-slate-900 font-black">{getBrandName(currentProduct, language)}</span>
              </span>

              {/* Stock availability */}
              <span className="flex items-center space-x-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>{language === 'bn' ? 'স্টকে এভেলেবল' : 'In Stock'}</span>
              </span>
            </div>

            {/* Product Title & Brand Name */}
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {language === 'bn' ? currentProduct.nameBn : currentProduct.name}
              </h1>
              <div className="flex items-center space-x-2 mt-1.5 text-xs sm:text-sm">
                <span className="text-gray-500 font-medium">{language === 'bn' ? 'ব্র্যান্ড নাম:' : 'Brand Name:'}</span>
                <span className="font-black text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg shadow-2xs">
                  {getBrandName(currentProduct, language)}
                </span>
              </div>
            </div>

            {/* Rating Stars & Customer Review Count */}
            <div className="flex items-center space-x-3 text-xs bg-slate-50 p-2.5 rounded-2xl border border-gray-200/60 w-fit">
              <div className="flex items-center space-x-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-extrabold text-slate-900 text-sm ml-1">
                  {currentProduct.rating}
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-gray-600 font-semibold">
                {currentProduct.reviewCount} {language === 'bn' ? 'টি কাস্টমার রিভিউ' : 'Customer Reviews'}
              </span>
            </div>

            {/* Pricing Section */}
            <div className="bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-orange-50/80 p-4 rounded-3xl border border-orange-200/80 space-y-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-slate-900">৳{currentProduct.price}</span>
                {currentProduct.originalPrice > currentProduct.price && (
                  <span className="text-sm text-gray-400 line-through font-bold">
                    ৳{currentProduct.originalPrice}
                  </span>
                )}
              </div>
              {currentProduct.originalPrice > currentProduct.price && (
                <p className="text-xs font-extrabold text-emerald-600 flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5 fill-emerald-600" />
                  <span>
                    {language === 'bn'
                      ? `অফারে সাশ্রয় করুন ৳${currentProduct.originalPrice - currentProduct.price}`
                      : `Save ৳${currentProduct.originalPrice - currentProduct.price} on this deal!`}
                  </span>
                </p>
              )}
            </div>

            {/* Description & Key Specifications */}
            <div className="space-y-3 pt-1">
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                {language === 'bn' ? currentProduct.descriptionBn : currentProduct.description}
              </p>

              {currentProduct.specs && currentProduct.specs.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200/80 space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                    {language === 'bn' ? 'মূল বৈশিষ্ট্যসমূহ:' : 'Key Specifications:'}
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1.5">
                    {currentProduct.specs.map((spec, i) => (
                      <li key={i} className="flex items-center space-x-2 font-medium">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Trust Highlights Row */}
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 pt-1">
              <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200/60">
                <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-bold">{language === 'bn' ? '১০০% আসল প্রোডাক্ট' : '100% Original'}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200/60">
                <Truck className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-bold">{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
              </div>
            </div>

            {/* Purchase Controls & Action Buttons */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              {/* Quantity Selector + Add to Cart */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-2xl p-1 bg-gray-50 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-900 hover:text-white font-black text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
                  >
                    -
                  </button>
                  <span className="px-4 font-black text-sm text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-slate-900 hover:text-white font-black text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex-1 py-3 px-5 font-extrabold rounded-2xl text-xs sm:text-sm text-white shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95 ${
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
                          ? `কার্টে যোগ করুন (৳${currentProduct.price * quantity})`
                          : `Add to Cart (৳${currentProduct.price * quantity})`}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Buy Now & WhatsApp Direct Order Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
                  <span>{language === 'bn' ? 'সরাসরি অর্ডার করুন' : 'Buy Now'}</span>
                </button>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition active:scale-95 flex items-center justify-center space-x-2 cursor-pointer"
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

        {/* Section 2: RELATED ITEMS SECTION ("সম্পর্কিত আইটেম") */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200/80 p-6 sm:p-8 bg-slate-50/50 space-y-6">
            
            {/* Related Items Header */}
            <div className="flex items-center justify-between border-b border-gray-200/80 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-orange-400 flex items-center justify-center shadow-md">
                  <Flame className="w-5 h-5 fill-orange-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-black text-slate-900">
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
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-2xs hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleScrollRelated('right')}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-2xs hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition cursor-pointer active:scale-95"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Related Items Horizontal Carousel */}
            <div
              ref={relatedRailRef}
              className="flex space-x-4 overflow-x-auto scrollbar-none py-2 px-1 snap-x touch-pan-x"
            >
              {relatedProducts.map((relProd) => (
                <div
                  key={relProd.id}
                  className="min-w-[240px] sm:min-w-[270px] max-w-[280px] shrink-0 snap-start transition-transform duration-200 hover:scale-[1.02]"
                >
                  <ProductCard
                    product={relProd}
                    onSelect={(p) => {
                      setCurrentProduct(p);
                    }}
                  />
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
