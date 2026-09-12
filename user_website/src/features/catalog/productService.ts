import { Product } from './types';
import { PRODUCTS as DEFAULT_PRODUCTS } from './mockData';
import { supabase } from '../../lib/supabase';

const ADMIN_STORAGE_KEY = 'mex_tanim_admin_products';

export async function fetchLiveProducts(): Promise<Product[]> {
  // 1. Try fetching from Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
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
          image: item.image_url || item.imageUrl || item.image || 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80',
          inStock: Number(item.stock ?? 10) > 0,
          isPopular: true,
          isFeatured: true,
          isBestSeller: true,
          isNewArrival: true,
          description: item.description || '',
          descriptionBn: item.description_bn || item.descriptionBn || item.description || '',
          specs: typeof item.specs === 'string' ? item.specs.split(',').map((s: string) => s.trim()) : (Array.isArray(item.specs) ? item.specs : []),
        }));
      }
    } catch (e) {
      console.warn('Supabase products fetch failed in user_website:', e);
    }
  }

  // 2. Check localStorage (synced from Admin)
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
            image: item.imageUrl || item.image || 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80',
            inStock: Number(item.stock ?? 10) > 0,
            isPopular: true,
            isFeatured: true,
            isBestSeller: true,
            isNewArrival: true,
            description: item.description || '',
            descriptionBn: item.descriptionBn || item.description || '',
            specs: typeof item.specs === 'string' ? item.specs.split(',').map((s: string) => s.trim()) : (Array.isArray(item.specs) ? item.specs : []),
          }));
        }
      }
    } catch (err) {
      console.warn('localStorage products read failed:', err);
    }
  }

  // 3. Default seed products
  return DEFAULT_PRODUCTS;
}
