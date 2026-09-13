import { ComponentType } from 'react';
import {
  Grid,
  Mouse,
  Keyboard,
  Headphones,
  Zap,
  Shield,
  Cable,
  Speaker,
  Scissors,
  Gift,
  Layers,
} from 'lucide-react';
import { Product } from './types';
import { supabase } from '../../lib/supabase';

export interface CategoryItem {
  id: string;
  nameEn: string;
  nameBn: string;
  badge: string;
  badgeBg: string;
  icon: ComponentType<{ className?: string }>;
  colorClass: string;
  staticCount?: number;
  image: string;
}

export const CATEGORY_TRANSLATIONS: Record<string, { en: string; bn: string; badge: string }> = {
  'gaming-cooler': { en: 'GAMING COOLER', bn: 'গেমিং কুলার', badge: 'G' },
  'cooler': { en: 'GAMING COOLER', bn: 'গেমিং কুলার', badge: 'G' },
  'finger-sleeves': { en: 'FINGER SLEEVES', bn: 'ফিঙ্গার স্লিকস', badge: 'F' },
  'sleeves': { en: 'FINGER SLEEVES', bn: 'ফিঙ্গার স্লিকস', badge: 'F' },
  'gaming-headsets': { en: 'GAMING HEADSETS', bn: 'গেমিং হেডসেট', badge: 'H' },
  'gaming-earphone': { en: 'GAMING EARPHONE', bn: 'গেমিং ইয়ারফোন', badge: 'E' },
  'headphones': { en: 'GAMING HEADSETS', bn: 'গেমিং হেডসেট', badge: 'H' },
  'headphone': { en: 'GAMING HEADSETS', bn: 'গেমিং হেডসেট', badge: 'H' },
  'headsets': { en: 'GAMING HEADSETS', bn: 'গেমিং হেডসেট', badge: 'H' },
  'earphone': { en: 'GAMING EARPHONE', bn: 'গেমিং ইয়ারফোন', badge: 'E' },
  'gaming-powder': { en: 'GAMING POWDER', bn: 'গেমিং পাউডার', badge: 'P' },
  'magnetic-plates': { en: 'MAGNETIC PLATES', bn: 'ম্যাগনেটিক প্লেটস', badge: 'M' },
  'gaming-triggers': { en: 'GAMING TRIGGERS', bn: 'গেমিং ট্রিগার', badge: 'T' },
  'power-bank': { en: 'POWER BANK', bn: 'পাওয়ার ব্যাংক', badge: 'P' },
  'fast-chargers': { en: 'FAST CHARGERS', bn: 'ফাস্ট চার্জার', badge: 'F' },
  'charger-adapter': { en: 'CHARGER ADAPTER', bn: 'চার্জার এডাপ্টার', badge: 'C' },
  'chargers': { en: 'FAST CHARGERS', bn: 'ফাস্ট চার্জার', badge: 'F' },
  'charger': { en: 'FAST CHARGERS', bn: 'ফাস্ট চার্জার', badge: 'F' },
  'cables': { en: 'CABLES', bn: 'কেবলস', badge: 'C' },
  'cable': { en: 'CABLES', bn: 'কেবলস', badge: 'C' },
  'gaming-mice': { en: 'GAMING MICE', bn: 'গেমিং মাউস', badge: 'M' },
  'mice': { en: 'GAMING MICE', bn: 'গেমিং মাউস', badge: 'M' },
  'mouse': { en: 'GAMING MICE', bn: 'গেমিং মাউস', badge: 'M' },
  'mechanical-keyboards': { en: 'MECHANICAL KEYBOARDS', bn: 'মেকানিক্যাল কিবোর্ড', badge: 'K' },
  'keyboards': { en: 'MECHANICAL KEYBOARDS', bn: 'মেকানিক্যাল কিবোর্ড', badge: 'K' },
  'keyboard': { en: 'MECHANICAL KEYBOARDS', bn: 'মেকানিক্যাল কিবোর্ড', badge: 'K' },
  'soundboxes': { en: 'SOUNDBOXES', bn: 'সাউন্ডবক্স', badge: 'S' },
  'soundbox': { en: 'SOUNDBOXES', bn: 'সাউন্ডবক্স', badge: 'S' },
  'speakers': { en: 'SOUNDBOXES', bn: 'সাউন্ডবক্স', badge: 'S' },
  'speaker': { en: 'SOUNDBOXES', bn: 'সাউন্ডবক্স', badge: 'S' },
  'trimmers': { en: 'TRIMMERS', bn: 'ট্রিমার', badge: 'T' },
  'trimmer': { en: 'TRIMMERS', bn: 'ট্রিমার', badge: 'T' },
  'combo-offers': { en: 'COMBO OFFERS', bn: 'কম্বো অফার', badge: 'C' },
  'combo': { en: 'COMBO OFFERS', bn: 'কম্বো অফার', badge: 'C' },
  'all': { en: 'ALL CATEGORIES', bn: 'সকল ক্যাটাগরি', badge: 'A' },
};

export const getCategoryName = (categoryKeyOrSlug: string, lang: 'en' | 'bn' | string = 'en'): string => {
  if (!categoryKeyOrSlug) return lang === 'bn' ? 'গেমিং গ্যাজেট' : 'Gaming Gadget';
  const clean = categoryKeyOrSlug.toLowerCase().trim().replace(/\s+/g, '-');

  if (CATEGORY_TRANSLATIONS[clean]) {
    return lang === 'bn' ? CATEGORY_TRANSLATIONS[clean].bn : CATEGORY_TRANSLATIONS[clean].en;
  }

  for (const [key, val] of Object.entries(CATEGORY_TRANSLATIONS)) {
    if (clean === key || clean.includes(key) || key.includes(clean)) {
      return lang === 'bn' ? val.bn : val.en;
    }
  }

  if (lang === 'bn' && /[\u0980-\u09FF]/.test(categoryKeyOrSlug)) {
    return categoryKeyOrSlug;
  }

  return categoryKeyOrSlug.replace(/-/g, ' ').toUpperCase();
};

export const isCategorySelected = (selectedCategory: string, catId: string): boolean => {
  if (!selectedCategory || !catId) return false;
  const s = selectedCategory.toLowerCase().trim().replace(/\s+/g, '-');
  const c = catId.toLowerCase().trim().replace(/\s+/g, '-');
  if (s === c) return true;

  if ((s === 'gaming-cooler' || s === 'cooler') && (c === 'gaming-cooler' || c === 'cooler')) return true;
  if ((s === 'finger-sleeves' || s === 'sleeves') && (c === 'finger-sleeves' || c === 'sleeves')) return true;
  if ((s === 'soundboxes' || s === 'soundbox' || s === 'speaker' || s === 'speakers') && (c === 'soundboxes' || c === 'soundbox' || c === 'speaker' || c === 'speakers')) return true;
  if ((s === 'fast-chargers' || s === 'chargers' || s === 'charger' || s === 'charger-adapter') && (c === 'fast-chargers' || c === 'chargers' || c === 'charger' || c === 'charger-adapter')) return true;
  if ((s === 'mechanical-keyboards' || s === 'keyboards' || s === 'keyboard') && (c === 'mechanical-keyboards' || c === 'keyboards' || c === 'keyboard')) return true;
  if ((s === 'gaming-mice' || s === 'mice' || s === 'mouse') && (c === 'gaming-mice' || c === 'mice' || c === 'mouse')) return true;
  if ((s === 'gaming-headsets' || s === 'headphones' || s === 'headphone' || s === 'headsets' || s === 'gaming-earphone' || s === 'earphone') && (c === 'gaming-headsets' || c === 'headphones' || c === 'headphone' || c === 'headsets' || c === 'gaming-earphone' || c === 'earphone')) return true;
  if ((s === 'cables' || s === 'cable') && (c === 'cables' || c === 'cable')) return true;
  if ((s === 'trimmers' || s === 'trimmer') && (c === 'trimmers' || c === 'trimmer')) return true;
  if ((s === 'combo-offers' || s === 'combo') && (c === 'combo-offers' || c === 'combo')) return true;

  return false;
};

export const getCategoryProductCount = (catId: string, staticCount: number = 0, productsList: Product[] = []): number => {
  if (!productsList || productsList.length === 0) return staticCount;
  if (catId === 'all') return productsList.length;
  const realCount = productsList.filter((p) => isCategorySelected(catId, p.category)).length;
  return realCount > 0 ? realCount : staticCount;
};

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'combo-offers',
    nameEn: 'COMBO OFFERS',
    nameBn: 'কম্বো অফার',
    icon: Gift,
    colorClass: 'bg-gradient-to-r from-red-600 to-amber-500 text-white',
    badge: 'C',
    badgeBg: 'bg-red-600 text-white',
    staticCount: 5,
    image: '/categories/all.svg',
  },
  {
    id: 'gaming-cooler',
    nameEn: 'GAMING COOLER',
    nameBn: 'গেমিং কুলার',
    icon: Zap,
    colorClass: 'bg-slate-900 text-white',
    badge: 'G',
    badgeBg: 'bg-black text-white',
    staticCount: 28,
    image: '/categories/gaming-mice.svg',
  },
  {
    id: 'finger-sleeves',
    nameEn: 'FINGER SLEEVES',
    nameBn: 'ফিঙ্গার স্লিকস',
    icon: Shield,
    colorClass: 'bg-slate-900 text-white',
    badge: 'F',
    badgeBg: 'bg-black text-white',
    staticCount: 16,
    image: '/categories/finger-sleeves.svg',
  },
  {
    id: 'gaming-headsets',
    nameEn: 'GAMING HEADSETS',
    nameBn: 'গেমিং হেডসেট',
    icon: Headphones,
    colorClass: 'bg-blue-500 text-white',
    badge: 'H',
    badgeBg: 'bg-blue-500 text-white',
    staticCount: 12,
    image: '/categories/gaming-headsets.svg',
  },
  {
    id: 'gaming-earphone',
    nameEn: 'GAMING EARPHONE',
    nameBn: 'গেমিং ইয়ারফোন',
    icon: Headphones,
    colorClass: 'bg-blue-500 text-white',
    badge: 'E',
    badgeBg: 'bg-blue-500 text-white',
    staticCount: 12,
    image: '/categories/gaming-headsets.svg',
  },
  {
    id: 'gaming-powder',
    nameEn: 'GAMING POWDER',
    nameBn: 'গেমিং পাউডার',
    icon: Grid,
    colorClass: 'bg-emerald-600 text-white',
    badge: 'G',
    badgeBg: 'bg-emerald-700 text-white',
    staticCount: 4,
    image: '/categories/all.svg',
  },
  {
    id: 'magnetic-plates',
    nameEn: 'MAGNETIC PLATES',
    nameBn: 'ম্যাগনেটিক প্লেটস',
    icon: Grid,
    colorClass: 'bg-slate-900 text-white',
    badge: 'M',
    badgeBg: 'bg-black text-white',
    staticCount: 8,
    image: '/categories/mechanical-keyboards.svg',
  },
  {
    id: 'gaming-triggers',
    nameEn: 'GAMING TRIGGERS',
    nameBn: 'গেমিং ট্রিগার',
    icon: Zap,
    colorClass: 'bg-amber-600 text-white',
    badge: 'G',
    badgeBg: 'bg-amber-600 text-white',
    staticCount: 3,
    image: '/categories/gaming-mice.svg',
  },
  {
    id: 'power-bank',
    nameEn: 'POWER BANK',
    nameBn: 'পাওয়ার ব্যাংক',
    icon: Zap,
    colorClass: 'bg-slate-900 text-white',
    badge: 'P',
    badgeBg: 'bg-black text-white',
    staticCount: 4,
    image: '/categories/fast-chargers.svg',
  },
  {
    id: 'fast-chargers',
    nameEn: 'FAST CHARGERS',
    nameBn: 'ফাস্ট চার্জার',
    icon: Zap,
    colorClass: 'bg-slate-900 text-white',
    badge: 'F',
    badgeBg: 'bg-black text-white',
    staticCount: 14,
    image: '/categories/fast-chargers.svg',
  },
  {
    id: 'charger-adapter',
    nameEn: 'CHARGER ADAPTER',
    nameBn: 'চার্জার এডাপ্টার',
    icon: Zap,
    colorClass: 'bg-slate-900 text-white',
    badge: 'C',
    badgeBg: 'bg-black text-white',
    staticCount: 3,
    image: '/categories/fast-chargers.svg',
  },
  {
    id: 'cables',
    nameEn: 'CABLE',
    nameBn: 'কেবলস',
    icon: Cable,
    colorClass: 'bg-blue-500 text-white',
    badge: 'C',
    badgeBg: 'bg-blue-500 text-white',
    staticCount: 40,
    image: '/categories/cables.svg',
  },
  {
    id: 'gaming-mice',
    nameEn: 'GAMING MICE',
    nameBn: 'গেমিং মাউস',
    icon: Mouse,
    colorClass: 'bg-slate-900 text-white',
    badge: 'G',
    badgeBg: 'bg-black text-white',
    staticCount: 18,
    image: '/categories/gaming-mice.svg',
  },
  {
    id: 'mice',
    nameEn: 'GAMING MICE',
    nameBn: 'গেমিং মাউস',
    icon: Mouse,
    colorClass: 'bg-slate-900 text-white',
    badge: 'G',
    badgeBg: 'bg-black text-white',
    staticCount: 18,
    image: '/categories/gaming-mice.svg',
  },
  {
    id: 'mechanical-keyboards',
    nameEn: 'MECHANICAL KEYBOARDS',
    nameBn: 'মেকানিক্যাল কিবোর্ড',
    icon: Keyboard,
    colorClass: 'bg-slate-900 text-white',
    badge: 'M',
    badgeBg: 'bg-black text-white',
    staticCount: 15,
    image: '/categories/mechanical-keyboards.svg',
  },
  {
    id: 'keyboards',
    nameEn: 'MECHANICAL KEYBOARDS',
    nameBn: 'মেকানিক্যাল কিবোর্ড',
    icon: Keyboard,
    colorClass: 'bg-slate-900 text-white',
    badge: 'M',
    badgeBg: 'bg-black text-white',
    staticCount: 15,
    image: '/categories/mechanical-keyboards.svg',
  },
  {
    id: 'soundboxes',
    nameEn: 'SOUNDBOXES',
    nameBn: 'সাউন্ডবক্স',
    icon: Speaker,
    colorClass: 'bg-slate-900 text-white',
    badge: 'S',
    badgeBg: 'bg-black text-white',
    staticCount: 12,
    image: '/categories/soundboxes.svg',
  },
  {
    id: 'trimmers',
    nameEn: 'TRIMMERS',
    nameBn: 'ট্রিমার',
    icon: Scissors,
    colorClass: 'bg-slate-900 text-white',
    badge: 'T',
    badgeBg: 'bg-black text-white',
    staticCount: 10,
    image: '/categories/trimmers.svg',
  },
];

const getLucideIconForSlug = (slug: string): ComponentType<{ className?: string }> => {
  const s = slug.toLowerCase();
  if (s.includes('headphone') || s.includes('headset') || s.includes('earphone')) return Headphones;
  if (s.includes('mouse') || s.includes('mice')) return Mouse;
  if (s.includes('keyboard')) return Keyboard;
  if (s.includes('charger') || s.includes('power')) return Zap;
  if (s.includes('sleeve')) return Shield;
  if (s.includes('cable')) return Cable;
  if (s.includes('sound') || s.includes('speaker')) return Speaker;
  if (s.includes('trimmer')) return Scissors;
  if (s.includes('combo')) return Gift;
  return Layers;
};

const getSvgImageForSlug = (slug: string, fallbackImage?: string): string => {
  if (fallbackImage && fallbackImage.startsWith('/') && !fallbackImage.includes('data:image')) {
    return fallbackImage;
  }
  const s = slug.toLowerCase();
  if (s.includes('headphone') || s.includes('headset') || s.includes('earphone')) return '/categories/gaming-headsets.svg';
  if (s.includes('mouse') || s.includes('mice')) return '/categories/gaming-mice.svg';
  if (s.includes('keyboard')) return '/categories/mechanical-keyboards.svg';
  if (s.includes('charger') || s.includes('power')) return '/categories/fast-chargers.svg';
  if (s.includes('sleeve')) return '/categories/finger-sleeves.svg';
  if (s.includes('cable')) return '/categories/cables.svg';
  if (s.includes('sound') || s.includes('speaker')) return '/categories/soundboxes.svg';
  if (s.includes('trimmer')) return '/categories/trimmers.svg';
  return '/categories/all.svg';
};

let memoryCategoriesCache: CategoryItem[] | null = null;
let lastCategoriesFetchTimestamp = 0;
let inFlightCategoriesPromise: Promise<CategoryItem[]> | null = null;

export function getCachedCategories(): CategoryItem[] {
  if (memoryCategoriesCache && memoryCategoriesCache.length > 0) {
    return memoryCategoriesCache;
  }
  return CATEGORIES;
}

export async function fetchLiveCategories(forceRefresh = false): Promise<CategoryItem[]> {
  if (!forceRefresh && memoryCategoriesCache && memoryCategoriesCache.length > 0 && Date.now() - lastCategoriesFetchTimestamp < 60000) {
    return memoryCategoriesCache;
  }

  if (inFlightCategoriesPromise) {
    return inFlightCategoriesPromise;
  }

  inFlightCategoriesPromise = (async () => {
    let rawList: any[] = [];

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          rawList = data;
        }
      } catch (e) {
        console.warn('Supabase categories fetch error in user_website:', e);
      }
    }

    if (rawList.length === 0 && typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('mex_tanim_admin_categories');
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            rawList = parsed;
          }
        }
      } catch (err) {
        console.warn('localStorage categories read error:', err);
      }
    }

    if (rawList.length === 0) {
      memoryCategoriesCache = CATEGORIES;
      return CATEGORIES;
    }

  const categoryMap = new Map<string, CategoryItem>();

  CATEGORIES.forEach((cat) => {
    categoryMap.set(cat.id, cat);
  });

  rawList.forEach((item: any) => {
    const rawName = item.name || '';
    const slug = (item.slug || item.id || rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
    
    const defaultMatch = CATEGORIES.find((c) => isCategorySelected(c.id, slug) || c.id === slug || c.id === String(item.id).toLowerCase());

    const enName = rawName ? rawName.toUpperCase() : (defaultMatch ? defaultMatch.nameEn : getCategoryName(slug, 'en'));
    const bnName = (item.name_bn && /[\u0980-\u09FF]/.test(item.name_bn))
      ? item.name_bn
      : (defaultMatch ? defaultMatch.nameBn : getCategoryName(slug, 'bn'));

    const catItem: CategoryItem = {
      id: slug,
      nameEn: enName,
      nameBn: bnName,
      badge: rawName ? rawName.trim().charAt(0).toUpperCase() : (defaultMatch ? defaultMatch.badge : slug.charAt(0).toUpperCase()),
      badgeBg: defaultMatch ? defaultMatch.badgeBg : 'bg-slate-900 text-white',
      icon: defaultMatch ? defaultMatch.icon : getLucideIconForSlug(slug),
      colorClass: defaultMatch ? defaultMatch.colorClass : 'bg-slate-900 text-white',
      staticCount: Number(item.product_count) || (defaultMatch ? defaultMatch.staticCount : 0),
      image: getSvgImageForSlug(slug, item.image_url || item.image),
    };

    categoryMap.set(slug, catItem);
  });

  // Ensure default categories like combo-offers are included if missing
  CATEGORIES.forEach((cat) => {
    if (!categoryMap.has(cat.id)) {
      categoryMap.set(cat.id, cat);
    }
  });

    const result = Array.from(categoryMap.values());
    memoryCategoriesCache = result;
    lastCategoriesFetchTimestamp = Date.now();
    return result;
  })().finally(() => {
    inFlightCategoriesPromise = null;
  });

  return inFlightCategoriesPromise;
}
