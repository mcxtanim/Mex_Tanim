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

// Backward-compatibility export; dynamically populated from Supabase
export const CATEGORIES: CategoryItem[] = [];

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
  'fast-chargers': { en: 'FAST CHARGERS', bn: 'ফাস্ট চার্জার', badge: 'F' },
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

  // 1. Check in cached live categories from Supabase
  const liveList = getCachedCategories();
  const matchedLive = liveList.find(
    (c) => c.id.toLowerCase() === clean || isCategorySelected(clean, c.id)
  );
  if (matchedLive) {
    return lang === 'bn'
      ? (matchedLive.nameBn || matchedLive.nameEn)
      : matchedLive.nameEn;
  }

  // 2. Check translation table
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

export const getLucideIconForSlug = (slug: string): ComponentType<{ className?: string }> => {
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

export const getSvgImageForSlug = (slug: string, fallbackImage?: string): string => {
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

const STORAGE_KEY = 'mex_tanim_live_categories';
let memoryCategoriesCache: CategoryItem[] | null = null;
let lastCategoriesFetchTimestamp = 0;
let inFlightCategoriesPromise: Promise<CategoryItem[]> | null = null;
let realtimeInitialized = false;

export function mapRawCategoryToItem(item: any): CategoryItem {
  const rawName = String(item.name || '').trim();
  const slug = String(item.slug || item.id || rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
  
  const enName = rawName || getCategoryName(slug, 'en');
  const bnName = (item.name_bn && /[\u0980-\u09FF]/.test(item.name_bn))
    ? item.name_bn
    : getCategoryName(slug, 'bn');

  const badge = rawName ? rawName.charAt(0).toUpperCase() : slug.charAt(0).toUpperCase();

  let finalImg = item.image_url || item.image || '';
  if (!finalImg || (typeof finalImg === 'string' && finalImg.startsWith('data:image') && finalImg.length > 500)) {
    finalImg = getSvgImageForSlug(slug, finalImg);
  }

  return {
    id: slug,
    nameEn: enName,
    nameBn: bnName,
    badge,
    badgeBg: 'bg-slate-900 text-white',
    icon: getLucideIconForSlug(slug),
    colorClass: 'bg-slate-900 text-white',
    staticCount: Number(item.product_count) || 0,
    image: finalImg || getSvgImageForSlug(slug),
  };
}

export function getCachedCategories(): CategoryItem[] {
  if (memoryCategoriesCache && memoryCategoriesCache.length > 0) {
    return memoryCategoriesCache;
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('mex_tanim_admin_categories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped = parsed.map(mapRawCategoryToItem);
          memoryCategoriesCache = mapped;
          return mapped;
        }
      }
    } catch (e) {
      console.warn('Error reading cached categories from localStorage:', e);
    }
  }

  return [];
}

export function saveCachedCategories(cats: CategoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Strip large base64 images to stay within storage quota
    const sanitized = cats.map((c) => ({
      ...c,
      image: c.image && c.image.startsWith('data:image') && c.image.length > 500 ? '' : c.image,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('Could not persist categories to localStorage:', err);
  }
}

export async function fetchLiveCategories(forceRefresh = false): Promise<CategoryItem[]> {
  // Return cached if fresh (within 30 seconds)
  if (!forceRefresh && memoryCategoriesCache && memoryCategoriesCache.length > 0 && Date.now() - lastCategoriesFetchTimestamp < 30000) {
    return memoryCategoriesCache;
  }

  if (inFlightCategoriesPromise) {
    return inFlightCategoriesPromise;
  }

  inFlightCategoriesPromise = (async () => {
    let rawList: any[] = [];

    // 1. Fetch from Supabase categories table
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
        console.warn('Supabase categories fetch error in customer website:', e);
      }
    }

    // 2. Fallback to cached categories if Supabase network is unavailable
    if (rawList.length === 0 && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('mex_tanim_admin_categories');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            rawList = parsed;
          }
        }
      } catch (err) {
        console.warn('Error accessing stored categories fallback:', err);
      }
    }

    // 3. Map database rows to dynamic CategoryItem list
    const mappedCategories: CategoryItem[] = rawList.map(mapRawCategoryToItem);

    memoryCategoriesCache = mappedCategories;
    lastCategoriesFetchTimestamp = Date.now();
    saveCachedCategories(mappedCategories);

    // 4. Initialize Supabase Realtime subscription once in browser
    if (supabase && typeof window !== 'undefined' && !realtimeInitialized) {
      try {
        realtimeInitialized = true;
        supabase
          .channel('public:categories_sync')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'categories' },
            async () => {
              const updated = await fetchLiveCategories(true);
              window.dispatchEvent(new CustomEvent('categories_updated', { detail: updated }));
              window.dispatchEvent(new Event('storage'));
            }
          )
          .subscribe();
      } catch (subErr) {
        console.warn('Supabase Realtime subscription notice for categories:', subErr);
      }
    }

    return mappedCategories;
  })().finally(() => {
    inFlightCategoriesPromise = null;
  });

  return inFlightCategoriesPromise;
}
