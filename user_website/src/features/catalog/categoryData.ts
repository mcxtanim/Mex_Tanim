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

// Exact 12 collections matching Reference Image 2 (media_1791405440395.png)
export const DRAWER_COLLECTIONS: CategoryItem[] = [
  {
    id: 'gaming-cooler',
    nameEn: 'GAMING COOLER',
    nameBn: 'গেমিং কুলার',
    badge: 'G',
    badgeBg: 'bg-black text-white',
    icon: Layers,
    colorClass: 'bg-black text-white',
    staticCount: 34,
    image: '/categories/gaming-cooler.svg',
  },
  {
    id: 'finger-sleeves',
    nameEn: 'FINGER SLEEVES',
    nameBn: 'ফিঙ্গার স্লিকস',
    badge: 'F',
    badgeBg: 'bg-black text-white',
    icon: Shield,
    colorClass: 'bg-black text-white',
    staticCount: 20,
    image: '/categories/finger-sleeves.svg',
  },
  {
    id: 'gaming-earphone',
    nameEn: 'GAMING EARPHONE',
    nameBn: 'গেমিং ইয়ারফোন',
    badge: 'G',
    badgeBg: 'bg-gradient-to-br from-[#1e88e5] to-[#1565c0] text-white',
    icon: Headphones,
    colorClass: 'bg-blue-600 text-white',
    staticCount: 18,
    image: '/categories/gaming-headsets.svg',
  },
  {
    id: 'gaming-powder',
    nameEn: 'GAMING POWDER',
    nameBn: 'গেমিং পাউডার',
    badge: 'G',
    badgeBg: 'bg-gradient-to-br from-[#00897b] to-[#004d40] text-white',
    icon: Zap,
    colorClass: 'bg-emerald-700 text-white',
    staticCount: 4,
    image: '/categories/all.svg',
  },
  {
    id: 'magnetic-plates',
    nameEn: 'MAGNETIC PLATES',
    nameBn: 'ম্যাগনেটিক প্লেটস',
    badge: 'M',
    badgeBg: 'bg-black text-white',
    icon: Layers,
    colorClass: 'bg-black text-white',
    staticCount: 9,
    image: '/categories/all.svg',
  },
  {
    id: 'gaming-triggers',
    nameEn: 'GAMING TRIGGERS',
    nameBn: 'গেমিং ট্রিগার্স',
    badge: 'G',
    badgeBg: 'bg-gradient-to-br from-[#d97706] to-[#78350f] text-white',
    icon: Zap,
    colorClass: 'bg-amber-700 text-white',
    staticCount: 4,
    image: '/categories/all.svg',
  },
  {
    id: 'power-bank',
    nameEn: 'POWER BANK',
    nameBn: 'পাওয়ার ব্যাংক',
    badge: 'P',
    badgeBg: 'bg-black text-white',
    icon: Zap,
    colorClass: 'bg-black text-white',
    staticCount: 9,
    image: '/categories/fast-chargers.svg',
  },
  {
    id: 'charger-adapter',
    nameEn: 'CHARGER ADAPTER',
    nameBn: 'চার্জার অ্যাডাপ্টার',
    badge: 'C',
    badgeBg: 'bg-black text-white',
    icon: Zap,
    colorClass: 'bg-black text-white',
    staticCount: 6,
    image: '/categories/fast-chargers.svg',
  },
  {
    id: 'cables',
    nameEn: 'CABLES',
    nameBn: 'কেবলস',
    badge: 'C',
    badgeBg: 'bg-gradient-to-br from-[#1e88e5] to-[#1565c0] text-white',
    icon: Cable,
    colorClass: 'bg-blue-600 text-white',
    staticCount: 3,
    image: '/categories/cables.svg',
  },
  {
    id: 'gaming-mice',
    nameEn: 'GAMING MICE',
    nameBn: 'গেমিং মাউস',
    badge: 'G',
    badgeBg: 'bg-black text-white',
    icon: Mouse,
    colorClass: 'bg-black text-white',
    staticCount: 12,
    image: '/categories/gaming-mice.svg',
  },
  {
    id: 'mechanical-keyboards',
    nameEn: 'MECHANICAL KEYBOARDS',
    nameBn: 'মেকানিক্যাল কিবোর্ড',
    badge: 'M',
    badgeBg: 'bg-black text-white',
    icon: Keyboard,
    colorClass: 'bg-black text-white',
    staticCount: 8,
    image: '/categories/mechanical-keyboards.svg',
  },
  {
    id: 'combo-offers',
    nameEn: 'COMBO OFFERS',
    nameBn: 'কম্বো অফার',
    badge: 'C',
    badgeBg: 'bg-black text-white',
    icon: Gift,
    colorClass: 'bg-black text-white',
    staticCount: 5,
    image: '/categories/all.svg',
  },
];

// Backward-compatibility export; dynamically populated from Supabase
export const CATEGORIES: CategoryItem[] = DRAWER_COLLECTIONS;

export const CATEGORY_TRANSLATIONS: Record<string, { en: string; bn: string; badge: string }> = {
  'gaming-cooler': { en: 'GAMING COOLER', bn: 'গেমিং কুলার', badge: 'G' },
  'cooler': { en: 'GAMING COOLER', bn: 'গেমিং কুলার', badge: 'G' },
  'finger-sleeves': { en: 'FINGER SLEEVES', bn: 'ফিঙ্গার স্লিকস', badge: 'F' },
  'sleeves': { en: 'FINGER SLEEVES', bn: 'ফিঙ্গার স্লিকস', badge: 'F' },
  'gaming-headsets': { en: 'GAMING HEADSETS', bn: 'গেমিং হেডসেট', badge: 'H' },
  'gaming-earphone': { en: 'GAMING EARPHONE', bn: 'গেমিং ইয়ারফোন', badge: 'G' },
  'headphones': { en: 'GAMING HEADSETS', bn: 'গেমিং হেডসেট', badge: 'H' },
  'headphone': { en: 'GAMING HEADSETS', bn: 'গেমিং হেডসেট', badge: 'H' },
  'headsets': { en: 'GAMING HEADSETS', bn: 'গেমিং হেডসেট', badge: 'H' },
  'earphone': { en: 'GAMING EARPHONE', bn: 'গেমিং ইয়ারফোন', badge: 'G' },
  'gaming-powder': { en: 'GAMING POWDER', bn: 'গেমিং পাউডার', badge: 'G' },
  'powder': { en: 'GAMING POWDER', bn: 'গেমিং পাউডার', badge: 'G' },
  'magnetic-plates': { en: 'MAGNETIC PLATES', bn: 'ম্যাগনেটিক প্লেটস', badge: 'M' },
  'plates': { en: 'MAGNETIC PLATES', bn: 'ম্যাগনেটিক প্লেটস', badge: 'M' },
  'gaming-triggers': { en: 'GAMING TRIGGERS', bn: 'গেমিং ট্রিগার্স', badge: 'G' },
  'triggers': { en: 'GAMING TRIGGERS', bn: 'গেমিং ট্রিগার্স', badge: 'G' },
  'power-bank': { en: 'POWER BANK', bn: 'পাওয়ার ব্যাংক', badge: 'P' },
  'power': { en: 'POWER BANK', bn: 'পাওয়ার ব্যাংক', badge: 'P' },
  'fast-chargers': { en: 'FAST CHARGERS', bn: 'ফাস্ট চার্জার', badge: 'F' },
  'chargers': { en: 'FAST CHARGERS', bn: 'ফাস্ট চার্জার', badge: 'F' },
  'charger': { en: 'FAST CHARGERS', bn: 'ফাস্ট চার্জার', badge: 'F' },
  'charger-adapter': { en: 'CHARGER ADAPTER', bn: 'চার্জার অ্যাডাপ্টার', badge: 'C' },
  'adapter': { en: 'CHARGER ADAPTER', bn: 'চার্জার অ্যাডাপ্টার', badge: 'C' },
  'cables': { en: 'CABLES', bn: 'কেবলস', badge: 'C' },
  'cable': { en: 'CABLE', bn: 'কেবল', badge: 'C' },
  'gaming-mice': { en: 'GAMING MICE', bn: 'গেমিং মাউস', badge: 'G' },
  'mice': { en: 'GAMING MICE', bn: 'গেমিং মাউস', badge: 'G' },
  'mouse': { en: 'GAMING MICE', bn: 'গেমিং মাউস', badge: 'G' },
  'mechanical-keyboards': { en: 'MECHANICAL KEYBOARDS', bn: 'মেকানিক্যাল কিবোর্ড', badge: 'M' },
  'keyboards': { en: 'MECHANICAL KEYBOARDS', bn: 'মেকানিক্যাল কিবোর্ড', badge: 'M' },
  'keyboard': { en: 'MECHANICAL KEYBOARDS', bn: 'মেকানিক্যাল কিবোর্ড', badge: 'M' },
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

export const getStaticTranslation = (categoryKeyOrSlug: string, lang: 'en' | 'bn' | string = 'en'): string => {
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

export const getCategoryName = (categoryKeyOrSlug: string, lang: 'en' | 'bn' | string = 'en'): string => {
  if (!categoryKeyOrSlug) return lang === 'bn' ? 'গেমিং গ্যাজেট' : 'Gaming Gadget';
  const clean = categoryKeyOrSlug.toLowerCase().trim().replace(/\s+/g, '-');

  // 1. Check in-memory cache directly (NEVER invoke getCachedCategories to avoid recursion)
  if (memoryCategoriesCache && memoryCategoriesCache.length > 0) {
    const matchedLive = memoryCategoriesCache.find(
      (c) => c.id.toLowerCase() === clean || isCategorySelected(clean, c.id)
    );
    if (matchedLive) {
      return lang === 'bn'
        ? (matchedLive.nameBn || matchedLive.nameEn)
        : matchedLive.nameEn;
    }
  }

  // 2. Fallback to direct translation table
  return getStaticTranslation(clean, lang);
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

let isMappingCategories = false;

export function mapRawCategoryToItem(item: any): CategoryItem {
  const rawName = String(item.name || '').trim();
  const slug = String(item.slug || item.id || rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-')).toLowerCase();
  
  const predefined = DRAWER_COLLECTIONS.find((dc) => dc.id === slug || isCategorySelected(slug, dc.id));

  const enName = rawName || (predefined ? predefined.nameEn : getStaticTranslation(slug, 'en'));
  const bnName = (item.name_bn && /[\u0980-\u09FF]/.test(item.name_bn))
    ? item.name_bn
    : (predefined ? predefined.nameBn : getStaticTranslation(slug, 'bn'));

  const badge = predefined ? predefined.badge : (rawName ? rawName.charAt(0).toUpperCase() : slug.charAt(0).toUpperCase());
  const badgeBg = predefined ? predefined.badgeBg : 'bg-black text-white';

  const finalImg = item.image_url || item.image || (predefined ? predefined.image : getSvgImageForSlug(slug));

  return {
    id: slug,
    nameEn: enName,
    nameBn: bnName,
    badge,
    badgeBg,
    icon: predefined ? predefined.icon : getLucideIconForSlug(slug),
    colorClass: predefined ? predefined.colorClass : 'bg-black text-white',
    staticCount: Number(item.product_count) || (predefined ? predefined.staticCount : 0) || 0,
    image: finalImg || getSvgImageForSlug(slug),
  };
}

/**
 * Merges raw database/storage categories with the 12 canonical collections.
 * Preserves uploaded images, names, and product counts from Supabase while
 * ensuring all 12 canonical collections appear in their defined order, followed
 * by any additional custom categories created in admin panel.
 */
function mergeRawWithCanonicalCollections(rawList: any[]): CategoryItem[] {
  // 1. Map each canonical collection to its live version if available
  const canonicalItems = DRAWER_COLLECTIONS.map((dc) => {
    const matched = rawList.find((r) => {
      const rSlug = String(r.slug || r.id || r.name || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-');
      return rSlug === dc.id || isCategorySelected(rSlug, dc.id);
    });

    if (matched) {
      const liveImg = matched.image_url || matched.image;
      return {
        ...dc,
        nameEn: matched.name || dc.nameEn,
        nameBn: (matched.name_bn && /[\u0980-\u09FF]/.test(matched.name_bn)) ? matched.name_bn : dc.nameBn,
        image: liveImg || dc.image,
        staticCount: Number(matched.product_count) || dc.staticCount,
      };
    }
    return dc;
  });

  // 2. Append any extra categories created by admin that are not in DRAWER_COLLECTIONS
  const result = [...canonicalItems];
  for (const raw of rawList) {
    const rSlug = String(raw.slug || raw.id || raw.name || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
    const alreadyPresent = result.some((c) => c.id === rSlug || isCategorySelected(rSlug, c.id));
    if (!alreadyPresent && raw.name) {
      result.push(mapRawCategoryToItem(raw));
    }
  }

  return result;
}

export function getCachedCategories(): CategoryItem[] {
  if (memoryCategoriesCache && memoryCategoriesCache.length > 0) {
    return memoryCategoriesCache;
  }

  if (isMappingCategories) {
    return DRAWER_COLLECTIONS;
  }

  let list: CategoryItem[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('mex_tanim_admin_categories');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          isMappingCategories = true;
          try {
            list = mergeRawWithCanonicalCollections(parsed);
          } finally {
            isMappingCategories = false;
          }
        }
      }
    } catch (e) {
      console.warn('Error reading cached categories from localStorage:', e);
    }
  }

  if (list.length > 0) {
    memoryCategoriesCache = list;
    return list;
  }

  memoryCategoriesCache = DRAWER_COLLECTIONS;
  return DRAWER_COLLECTIONS;
}

export function saveCachedCategories(cats: CategoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  } catch (err) {
    console.warn('Could not persist categories to localStorage:', err);
  }
}

export function initCategoriesRealtime(): void {
  if (typeof window === 'undefined' || realtimeInitialized) return;
  realtimeInitialized = true;

  // Supabase Cross-App Realtime Broadcast & Postgres Changes
  if (supabase) {
    try {
      supabase
        .channel('mex_tanim_cross_tab_sync')
        .on('broadcast', { event: 'CATEGORIES_UPDATED' }, async () => {
          memoryCategoriesCache = null;
          lastCategoriesFetchTimestamp = 0;
          const updated = await fetchLiveCategories(true);
          window.dispatchEvent(new CustomEvent('categories_updated', { detail: updated }));
        })
        .subscribe();

      supabase
        .channel('public:categories_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'categories' },
          async () => {
            memoryCategoriesCache = null;
            lastCategoriesFetchTimestamp = 0;
            const updated = await fetchLiveCategories(true);
            window.dispatchEvent(new CustomEvent('categories_updated', { detail: updated }));
          }
        )
        .subscribe();
    } catch (subErr) {
      console.warn('Supabase Realtime subscription notice for categories:', subErr);
    }
  }

  // Cross-Tab BroadcastChannel
  if ('BroadcastChannel' in window) {
    try {
      const bc = new BroadcastChannel('mex_tanim_store_sync');
      bc.onmessage = async (event) => {
        if (event.data?.type === 'CATEGORIES_UPDATED') {
          memoryCategoriesCache = null;
          lastCategoriesFetchTimestamp = 0;
          const updated = await fetchLiveCategories(true);
          window.dispatchEvent(new CustomEvent('categories_updated', { detail: updated }));
        }
      };
    } catch {}
  }

  // Window Focus / Visibility Change Auto-Revalidate (instant sync when switching tabs)
  const revalidate = async () => {
    memoryCategoriesCache = null;
    lastCategoriesFetchTimestamp = 0;
    const updated = await fetchLiveCategories(true);
    window.dispatchEvent(new CustomEvent('categories_updated', { detail: updated }));
  };

  window.addEventListener('focus', revalidate);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') revalidate();
  });

  // Background Heartbeat Polling every 3.5 seconds
  setInterval(() => {
    if (!document.hidden) {
      fetchLiveCategories(true).then((updated) => {
        window.dispatchEvent(new CustomEvent('categories_updated', { detail: updated }));
      }).catch(() => {});
    }
  }, 3500);
}

export async function fetchLiveCategories(forceRefresh = false): Promise<CategoryItem[]> {
  initCategoriesRealtime();

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

    // 3. Merge raw items with canonical 12 collections
    const mappedCategories: CategoryItem[] = mergeRawWithCanonicalCollections(rawList);

    memoryCategoriesCache = mappedCategories;
    lastCategoriesFetchTimestamp = Date.now();
    saveCachedCategories(mappedCategories);

    return mappedCategories;
  })().finally(() => {
    inFlightCategoriesPromise = null;
  });

  return inFlightCategoriesPromise;
}
