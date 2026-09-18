import { Product } from './types';
import { supabase } from '../../lib/supabase';
import { getCategoryName } from './categoryData';

const ADMIN_STORAGE_KEY = 'mex_tanim_admin_products';

const LIVE_PRODUCTS_CACHE_KEY = 'mex_tanim_cached_live_products';
const CACHE_TTL_MS = 60 * 1000; // 60 seconds fresh cache

let memoryProductsCache: Product[] | null = null;
let lastFetchTimestamp = 0;
let inFlightPromise: Promise<Product[]> | null = null;

export const getBrandName = (product?: Partial<Product> | null, language: string = 'en'): string => {
  if (!product) return 'Mex Tanim';
  if (language === 'bn' && product.brandBn) return product.brandBn;
  if (product.brand) return product.brand;
  if (product.name) {
    const firstWord = product.name.trim().split(' ')[0];
    if (firstWord && firstWord.length > 1) return firstWord;
  }
  return 'Mex Tanim';
};

function mapRawProduct(item: any): Product {
  const catSlug = item.category ? String(item.category).toLowerCase().trim().replace(/\s+/g, '-') : 'gaming-cooler';
  const catBn = (item.category_bn && /[\u0980-\u09FF]/.test(item.category_bn))
    ? item.category_bn
    : getCategoryName(catSlug, 'bn');

  return {
    id: String(item.id),
    name: item.title || item.name || '',
    nameBn: item.title_bn || item.titleBn || item.nameBn || item.title || '',
    category: catSlug,
    categoryBn: catBn,
    brand: item.brand || 'Mex Tanim',
    brandBn: item.brand || 'মেক্স তানিম',
    price: Number(item.price) || 0,
    originalPrice: Number(item.original_price || item.originalPrice) || Number(item.price) || 0,
    discountBadge: item.discount ? `-${item.discount}%` : '',
    rating: 4.9,
    reviewCount: 42,
    image: item.image_url || item.imageUrl || item.image || '',
    comboImages: Array.isArray(item.combo_images || item.comboImages) ? (item.combo_images || item.comboImages) : [],
    inStock: Number(item.stock ?? 10) > 0,
    isPopular: Boolean(item.is_popular ?? true),
    isFeatured: Boolean(item.is_featured ?? true),
    isBestSeller: Boolean(item.is_bestseller ?? true),
    isNewArrival: Boolean(item.is_new_arrival ?? true),
    isComboOffer: Boolean(item.is_combo ?? false),
    description: item.description || '',
    descriptionBn: item.description_bn || item.descriptionBn || item.description || '',
    specs: Array.isArray(item.specs)
      ? item.specs
      : typeof item.specs === 'string'
      ? item.specs.split(/,|\n/).map((s: string) => s.trim()).filter(Boolean)
      : [],
  };
}

/**
 * Synchronously returns cached products (0ms) from memory or localStorage.
 * Ensures the UI never shows empty loading skeletons if data was previously fetched.
 */
export function getCachedProducts(): Product[] {
  if (memoryProductsCache && memoryProductsCache.length > 0) {
    return memoryProductsCache;
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LIVE_PRODUCTS_CACHE_KEY) || localStorage.getItem(ADMIN_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryProductsCache = parsed.map(mapRawProduct);
          return memoryProductsCache;
        }
      }
    } catch (e) {
      console.warn('Error reading cached products:', e);
    }
  }

  return [];
}

/**
 * Fast SWR (Stale-While-Revalidate) products fetcher with request deduplication.
 * Returns cached products instantly (0ms) if available, and revalidates in the background.
 */
export async function fetchLiveProducts(forceRefresh = false): Promise<Product[]> {
  // Return memory cache immediately if fresh and not forced
  if (!forceRefresh && memoryProductsCache && memoryProductsCache.length > 0 && Date.now() - lastFetchTimestamp < CACHE_TTL_MS) {
    return memoryProductsCache;
  }

  // Deduplicate concurrent requests (e.g. 5 components mounting simultaneously)
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(mapRawProduct);
          memoryProductsCache = mapped;
          lastFetchTimestamp = Date.now();

          // Persist to localStorage for 0ms initial load on next page visit
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(LIVE_PRODUCTS_CACHE_KEY, JSON.stringify(mapped));
            } catch (e) {
              console.warn('Could not cache live products to localStorage:', e);
            }
          }

          return mapped;
        }
      }
    } catch (e) {
      console.warn('Supabase products fetch failed in user_website:', e);
    }

    // Fallback to local storage if network is offline or slow
    const fallback = getCachedProducts();
    if (fallback.length > 0) {
      memoryProductsCache = fallback;
      return fallback;
    }

    return [];
  })().finally(() => {
    inFlightPromise = null;
  });

  // Initialize Realtime subscription in browser once
  if (supabase && typeof window !== 'undefined' && !productsRealtimeInitialized) {
    initProductsRealtime();
  }

  return inFlightPromise;
}

let productsRealtimeInitialized = false;

export function initProductsRealtime(): void {
  if (!supabase || typeof window === 'undefined' || productsRealtimeInitialized) {
    return;
  }
  productsRealtimeInitialized = true;

  try {
    supabase
      .channel('public:products_live_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async (payload) => {
          memoryProductsCache = null;
          lastFetchTimestamp = 0;
          const fresh = await fetchLiveProducts(true);
          window.dispatchEvent(new CustomEvent('products_updated', { detail: fresh }));
        }
      )
      .subscribe();
  } catch (err) {
    console.warn('Realtime products subscription notice:', err);
  }

  if ('BroadcastChannel' in window) {
    try {
      const bc = new BroadcastChannel('mex_tanim_store_sync');
      bc.onmessage = async (event) => {
        if (event.data?.type === 'PRODUCTS_UPDATED') {
          memoryProductsCache = null;
          lastFetchTimestamp = 0;
          const fresh = await fetchLiveProducts(true);
          window.dispatchEvent(new CustomEvent('products_updated', { detail: fresh }));
        }
      };
    } catch {}
  }
}

/**
 * Fast single-product lookup with 0ms cache-hit return.
 */
export async function fetchProductById(id: string): Promise<Product | null> {
  const cached = getCachedProducts();
  const found = cached.find((p) => String(p.id) === String(id));
  if (found) {
    return found;
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        const mapped = mapRawProduct(data);
        if (memoryProductsCache) {
          memoryProductsCache = [mapped, ...memoryProductsCache.filter((p) => p.id !== mapped.id)];
        } else {
          memoryProductsCache = [mapped];
        }
        return mapped;
      }
    } catch (e) {
      console.warn('fetchProductById exception:', e);
    }
  }

  return null;
}
