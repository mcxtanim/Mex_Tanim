'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn';

export const translations = {
  en: {
    siteTitle: 'Mex Tanim Store',
    tagline: 'Premium Gaming Gadgets Shop',
    searchPlaceholder: 'Search products...',
    cart: 'Cart',
    register: 'Register',
    login: 'Login',
    logout: 'Logout',
    welcomeUser: 'Welcome',
    categoriesTitle: 'All Categories',
    viewAll: 'View All',
    featuredProducts: 'Featured Products',
    allProducts: 'All Products',
    addToCart: 'Add to Cart',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    discount: 'OFF',
    currency: '৳',
    rating: 'Rating',
    reviews: 'reviews',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    emptyCart: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    insideDhaka: 'Inside Dhaka (৳60)',
    outsideDhaka: 'Outside Dhaka (৳120)',
    appInstallTitle: 'Install Mex Tanim Store App',
    appInstallDesc: 'Add to home screen for lightning fast shopping experience.',
    appInstallBtn: 'Install App',
    notNow: 'Not Now',
    chatTitle: 'Gaming Support 24/7',
    chatSubtitle: 'Ask us anything about gaming gadgets',
    chatPlaceholder: 'Type your message...',
    footerRights: 'All rights reserved.',
    footerTagline: 'Bangladesh\'s Most Trusted Gaming Gadget Destination',
    categories: {
      all: 'All',
      mice: 'Gaming Mice',
      keyboards: 'Mechanical Keyboards',
      headphones: 'Gaming Headsets',
      chargers: 'Fast Chargers',
      sleeves: 'Finger Sleeves',
      cables: 'Gaming Cables',
      soundbox: 'Soundboxes & Speakers',
      trimmers: 'Trimmers & Grooming',
    },
    banners: [
      {
        badge: '🔥 MEGA GAMING SALE',
        title: 'Best Gaming Gadgets All in One Place',
        subtitle: 'Get 100% authentic branded gadgets at the best prices in Bangladesh.',
        accentText: '100% Authentic Products',
        priceTag: 'Starting from ৳150',
      },
      {
        badge: '⚡ ULTRA PROFESSIONAL GEAR',
        title: 'Esports Gaming Mice & Mechanical Keyboards',
        subtitle: 'Elevate your gaming performance to new heights with zero latency.',
        accentText: 'Best Prices Nationwide',
        priceTag: 'Up to 30% Discount',
      },
      {
        badge: '🏆 MOBILE GAMERS CHOICE',
        title: 'PUBG & Free-Fire Sweatproof Finger Sleeves',
        subtitle: 'Ultra-thin silver fiber gloves for smooth touch control and speed.',
        accentText: 'Express Fast Delivery',
        priceTag: 'Special Buy 1 Get 1 Deal',
      },
      {
        badge: '🎧 IMMERSIVE SOUND ENGINE',
        title: '7.1 Surround Sound Gaming Headsets',
        subtitle: 'Crystal clear footstep audio and noise-canceling mic for pro gamers.',
        accentText: 'Official Warranty',
        priceTag: 'Exclusive Pro Series',
      },
    ],
  },
  bn: {
    siteTitle: 'Mex Tanim Store',
    tagline: 'সেরা গেমিং গ্যাজেট শপ',
    searchPlaceholder: 'পণ্য খুঁজুন...',
    cart: 'কার্ট',
    register: 'রেজিস্টার',
    login: 'লগইন',
    logout: 'লগআউট',
    welcomeUser: 'স্বাগতম',
    categoriesTitle: 'সকল ক্যাটাগরি',
    viewAll: 'সব দেখুন',
    featuredProducts: 'ফিচার্ড প্রোডাক্টস',
    allProducts: 'সকল পণ্য',
    addToCart: 'কার্টে যোগ করুন',
    inStock: 'স্টক আছে',
    outOfStock: 'স্টক শেষ',
    discount: 'ছাড়',
    currency: '৳',
    rating: 'রেটিং',
    reviews: 'রিভিউ',
    subtotal: 'সাবটোটাল',
    deliveryFee: 'ডেলিভারি চার্জ',
    total: 'সর্বমোট',
    checkout: 'অর্ডার কনফার্ম করুন',
    emptyCart: 'আপনার কার্ট খালি রয়েছে',
    continueShopping: 'কেনাকাটা চালিয়ে যান',
    insideDhaka: 'ঢাকার ভেতরে (৳৬০)',
    outsideDhaka: 'ঢাকার বাইরে (৳১২০)',
    appInstallTitle: 'Mex Tanim Store অ্যাপ ইন্সটল করুন',
    appInstallDesc: 'দ্রুত কেনাকাটার অভিজ্ঞতার জন্য হোম স্ক্রিনে যোগ করুন।',
    appInstallBtn: 'অ্যাপ ইন্সটল করুন',
    notNow: 'এখন নয়',
    chatTitle: 'গেমিং সাপোর্ট ২৪/৭',
    chatSubtitle: 'আপনার সহায়তায় আমরা আছি লাইভ অনলাইন',
    chatPlaceholder: 'বার্তা লিখুন...',
    footerRights: 'সর্বস্বত্ব সংরক্ষিত।',
    footerTagline: 'বাংলাদেশের সবচেয়ে বিশ্বস্ত গেমিং গ্যাজেট শপ',
    categories: {
      all: 'সব',
      mice: 'গেমিং মাউস',
      keyboards: 'মেকানিক্যাল কীবোর্ড',
      headphones: 'গেমিং হেডসেট',
      chargers: 'ফাস্ট চার্জার',
      sleeves: 'ফিঙ্গার স্লিকস',
      cables: 'গেমিং কেবলস',
      soundbox: 'সাউন্ডবক্স ও স্পিকার',
      trimmers: 'ট্রিমার ও গ্রুমিং',
    },
    banners: [
      {
        badge: '🔥 মেগা গেমিং সেল',
        title: 'সেরা গেমিং গ্যাজেট ১ জায়গাতেই সব',
        subtitle: 'দেশের সেরা দামে ১০০% অরিজিনাল ব্র্যান্ডেড গ্যাজেট পান হাতের মুঠোয়।',
        accentText: '১০০% অথেনটিক প্রোডাক্ট',
        priceTag: 'শুরু মাত্র ৳১৫০ থেকে',
      },
      {
        badge: '⚡ আল্ট্রা প্রফেশনাল গিয়ার',
        title: 'গেমিং মাউস ও মেকানিক্যাল কীবোর্ড',
        subtitle: 'আপনার গেমিং অভিজ্ঞতাকে নিয়ে যান নতুন উচ্চতায় সেরা পারফর্মেন্স সহ।',
        accentText: 'দেশের সেরা দামে',
        priceTag: '৩০% পর্যন্ত মূল্যছাড়',
      },
      {
        badge: '🏆 মোবাইল গেমার্স চয়েস',
        title: 'পাবজি ও ফ্রি-ফায়ার ফিঙ্গার স্লিকস',
        subtitle: 'সোয়েটপ্রুফ সিলভার ফাইবার ফিঙ্গার গ্লাভস দিয়ে পান স্মুথ টাচ কন্ট্রোল।',
        accentText: 'দ্রুত ডেলিভারি সুবিধা',
        priceTag: 'বাই ১ গেট ১ স্পেশাল ডিল',
      },
      {
        badge: '🎧 ইমার্সিভ সাউন্ড ইঞ্জিন',
        title: '৭.১ সার라운ড সাউন্ড গেমিং হেডসেট',
        subtitle: 'প্রো গেমারদের জন্য ক্রিস্টাল ক্লিয়ার অডিও ও নয়েজ ক্যানসেলিং মাইক্রোফোন।',
        accentText: 'অফিশিয়াল ওয়ারেন্টি',
        priceTag: 'এক্সক্লুসিভ প্রো সিরিজ',
      },
    ],
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en'); // Default to English as requested

  useEffect(() => {
    const saved = localStorage.getItem('mex_tanim_lang') as Language;
    if (saved === 'en' || saved === 'bn') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mex_tanim_lang', lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
