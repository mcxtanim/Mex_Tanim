import { Product } from './types';
import { supabase } from '../../lib/supabase';

const ADMIN_STORAGE_KEY = 'mex_tanim_admin_products';

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

export async function fetchLiveProducts(): Promise<Product[]> {
  // 1. Fetch from Supabase database
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          name: item.title || item.name || '',
          nameBn: item.title_bn || item.titleBn || item.nameBn || item.title || '',
          category: item.category ? String(item.category).toLowerCase().replace(/\s+/g, '-') : 'gaming-cooler',
          categoryBn: item.category || 'গেমিং গ্যাজেট',
          brand: item.brand || 'Mex Tanim',
          brandBn: item.brand || 'মেক্স তানিম',
          price: Number(item.price) || 0,
          originalPrice: Number(item.original_price || item.originalPrice) || Number(item.price) || 0,
          discountBadge: item.discount ? `-${item.discount}%` : '',
          rating: 4.9,
          reviewCount: 42,
          image: item.image_url || item.imageUrl || item.image || '',
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
        }));
      }
    } catch (e) {
      console.warn('Supabase products fetch failed in user_website:', e);
    }
  }

  // 2. Fallback to localStorage (if offline/synced locally)
  if (typeof window !== 'undefined') {
    try {
      const localData = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            id: String(item.id),
            name: item.title || item.name || '',
            nameBn: item.titleBn || item.nameBn || item.title || '',
            category: item.category ? String(item.category).toLowerCase().replace(/\s+/g, '-') : 'gaming-cooler',
            categoryBn: item.category || 'গেমিং গ্যাজেট',
            brand: item.brand || 'Mex Tanim',
            brandBn: item.brand || 'মেক্স তানিম',
            price: Number(item.price) || 0,
            originalPrice: Number(item.originalPrice) || Number(item.price) || 0,
            discountBadge: item.discount ? `-${item.discount}%` : '',
            rating: 4.9,
            reviewCount: 42,
            image: item.imageUrl || item.image || '',
            inStock: Number(item.stock ?? 10) > 0,
            isPopular: Boolean(item.is_popular ?? true),
            isFeatured: Boolean(item.is_featured ?? true),
            isBestSeller: Boolean(item.is_bestseller ?? true),
            isNewArrival: Boolean(item.is_new_arrival ?? true),
            isComboOffer: Boolean(item.is_combo ?? false),
            description: item.description || '',
            descriptionBn: item.descriptionBn || item.description || '',
            specs: Array.isArray(item.specs)
              ? item.specs
              : typeof item.specs === 'string'
              ? item.specs.split(/,|\n/).map((s: string) => s.trim()).filter(Boolean)
              : [],
          }));
        }
      }
    } catch (err) {
      console.warn('localStorage products read failed:', err);
    }
  }

  return [];
}
