'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  CheckCircle2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Header } from '@/features/shared/Header';
import { Footer } from '@/features/shared/Footer';
import { FloatingChat } from '@/features/shared/FloatingChat';
import { useCart } from '@/features/cart/CartContext';
import { useLanguage } from '@/features/shared/LanguageContext';
import { useStoreSettings } from '@/features/shared/storeSettingsService';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const { language, t } = useLanguage();
  const settings = useStoreSettings();
  const [searchQuery, setSearchQuery] = useState('');

  const insideFee = Number(settings.insideDhakaFee) || 60;
  const outsideFee = Number(settings.outsideDhakaFee) || 120;
  const isFreeDelivery = settings.freeDeliveryThreshold > 0 && subtotal >= settings.freeDeliveryThreshold;
  const freeThresholdRemaining = settings.freeDeliveryThreshold > 0 ? settings.freeDeliveryThreshold - subtotal : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory="all"
          onSelectCategory={(cat) => router.push(`/?cat=${cat}`)}
        />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-orange-600 transition flex items-center space-x-1">
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">{language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}</span>
          </div>

          {/* Page Heading */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {language === 'bn' ? 'আপনার শপিং কার্ট' : 'Your Shopping Cart'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {language === 'bn'
                    ? `মোট ${totalItems}টি পণ্য আপনার কার্টে রয়েছে`
                    : `You have ${totalItems} items in your cart`}
                </p>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={() => {
                  if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে কার্টের সব পণ্য মুছে ফেলতে চান?' : 'Are you sure you want to clear your cart?')) {
                    clearCart();
                  }
                }}
                className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'কার্ট খালি করুন' : 'Clear Cart'}</span>
              </button>
            )}
          </div>

          {/* Empty Cart View */}
          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-16 text-center shadow-sm max-w-2xl mx-auto my-8 space-y-6">
              <div className="w-24 h-24 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {language === 'bn' ? 'আপনার কার্ট বর্তমানে খালি!' : 'Your Cart is Currently Empty!'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  {language === 'bn'
                    ? 'আপনি এখনো কোনো পণ্য কার্টে যোগ করেননি। আমাদের সেরা গেমিং ও টেক গ্যাজেটগুলো ঘুরে দেখুন!'
                    : "Looks like you haven't added any gear to your cart yet. Explore our top authentic gadgets!"}
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 bg-slate-900 hover:bg-orange-500 text-white rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-95 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{language === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Cart Items & Summary Grid */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column: Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {/* Free Delivery Threshold Progress Bar */}
                {settings.freeDeliveryThreshold > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs">
                    {isFreeDelivery ? (
                      <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          {language === 'bn'
                            ? 'অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন।'
                            : 'Congratulations! You unlocked FREE Delivery.'}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between font-bold text-emerald-900">
                          <span className="flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>
                              {language === 'bn'
                                ? `আর মাত্র ৳${freeThresholdRemaining} টাকার অর্ডার করলেই পাচ্ছেন ফ্রি ডেলিভারি!`
                                : `Add ৳${freeThresholdRemaining} more to get FREE Delivery!`}
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, Math.round((subtotal / settings.freeDeliveryThreshold) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Items Card List */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
                  {cart.map(({ product, quantity }) => {
                    const title = language === 'bn' ? product.nameBn || product.name : product.name;
                    const itemTotal = product.price * quantity;

                    return (
                      <div key={product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                        {/* Thumbnail & Info */}
                        <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
                          <Link href={`/product/${product.id}`} className="shrink-0 group">
                            <img
                              src={product.image}
                              alt={title}
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition"
                            />
                          </Link>

                          <div className="min-w-0 flex-1 space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md inline-block">
                              {language === 'bn' ? product.categoryBn || product.category : product.category}
                            </span>
                            <Link href={`/product/${product.id}`} className="block">
                              <h3 className="font-bold text-sm sm:text-base text-slate-900 hover:text-orange-600 transition truncate">
                                {title}
                              </h3>
                            </Link>
                            <div className="flex items-center space-x-2 text-xs">
                              <span className="font-black text-slate-900">৳{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-slate-400 line-through text-[11px]">
                                  ৳{product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls & Remove */}
                        <div className="flex items-center justify-between sm:justify-end sm:space-x-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {/* Quantity Counter */}
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, Math.max(1, quantity - 1))}
                              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-black text-xs text-slate-900">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition shadow-2xs cursor-pointer active:scale-95"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <div className="text-right min-w-[75px]">
                            <span className="text-[10px] text-slate-400 block font-medium">Subtotal</span>
                            <span className="font-black text-slate-900 text-sm sm:text-base">৳{itemTotal}</span>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(product.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                            title={language === 'bn' ? 'মুছে ফেলুন' : 'Remove item'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Action Links */}
                <div className="flex items-center justify-between pt-2">
                  <Link
                    href="/"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-orange-600 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'আরও পণ্য ব্রাউজ করুন' : 'Continue Shopping'}</span>
                  </Link>

                  <button
                    onClick={() => {
                      if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে কার্টের সব পণ্য মুছে ফেলতে চান?' : 'Are you sure you want to clear your cart?')) {
                        clearCart();
                      }
                    }}
                    className="sm:hidden text-xs font-bold text-red-600 hover:underline"
                  >
                    {language === 'bn' ? 'কার্ট খালি করুন' : 'Clear Cart'}
                  </button>
                </div>
              </div>

              {/* Right Column: Order Summary Card */}
              <div className="lg:col-span-1 space-y-4 sticky top-28">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-5">
                  <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
                    {language === 'bn' ? 'অর্ডার সারাংশ' : 'Order Summary'}
                  </h2>

                  {/* Summary Rows */}
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>{language === 'bn' ? 'পণ্যের মোট মূল্য' : 'Subtotal'}</span>
                      <span className="font-bold text-slate-900">৳{subtotal}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>{language === 'bn' ? 'ডেলিভারি চার্জ (আনুমানিক)' : 'Estimated Delivery'}</span>
                      <span className="font-bold text-slate-900">
                        {isFreeDelivery ? (
                          <span className="text-emerald-600 font-extrabold uppercase">
                            {language === 'bn' ? 'ফ্রি' : 'Free'}
                          </span>
                        ) : (
                          <span>৳{insideFee} - ৳{outsideFee}</span>
                        )}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {language === 'bn'
                        ? `ঢাকার ভিতরে ৳${insideFee}, ঢাকার বাইরে ৳${outsideFee}। পরবর্তী ধাপে জেলা অনুযায়ী স্বয়ংক্রিয়ভাবে হিসাব হবে।`
                        : `Inside Dhaka ৳${insideFee}, Outside ৳${outsideFee}. Calculated in the next step based on your district.`}
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                      <span className="font-black text-slate-900 text-sm">
                        {language === 'bn' ? 'সর্বমোট প্রদেয়' : 'Total Amount'}
                      </span>
                      <div className="text-right">
                        <span className="text-xl font-black text-orange-600">৳{subtotal}</span>
                        <span className="block text-[10px] text-slate-400">
                          {language === 'bn' ? '+ ডেলিভারি চার্জ' : '+ Delivery fee'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proceed to Checkout CTA Button */}
                  <Link
                    href="/checkout"
                    className="w-full py-4 px-6 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:shadow-orange-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 text-center"
                  >
                    <span>{language === 'bn' ? 'অর্ডার সম্পন্ন করতে এগিয়ে যান' : 'Proceed to Checkout'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Trust Badges */}
                  <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা দিন)' : 'Cash on Delivery Available'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{language === 'bn' ? '১০০% আসল ও অথেনটিক গ্যাজেট' : '100% Authentic Products'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RotateCcw className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{language === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট ওয়ারেন্টি' : '7 Days Easy Replacement'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
      <FloatingChat />
    </div>
  );
}
