export interface ProductReview {
  id: string;
  productId: string;
  orderId?: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  isVerifiedBuyer: boolean;
}

const REVIEWS_STORAGE_KEY = 'mex_tanim_product_reviews';

const INITIAL_SEED_REVIEWS: ProductReview[] = [
  {
    id: 'rev-101',
    productId: 'prod-1',
    customerName: 'Tarek Hasan',
    rating: 5,
    comment: 'প্রোডাক্টটি অত্যন্ত ভালো! সাউন্ড কোয়ালিটি এবং আরজিবি লাইটিং এক কথায় অসাধারণ। মেক্স তানিম স্টোরকে ধন্যবাদ।',
    date: '2026-09-01',
    isVerifiedBuyer: true,
  },
  {
    id: 'rev-102',
    productId: 'prod-1',
    customerName: 'Shakil Hossain',
    rating: 5,
    comment: 'Heavy bass & mic clarity is superb for PUBG and Valorant. Fast delivery!',
    date: '2026-09-05',
    isVerifiedBuyer: true,
  },
  {
    id: 'rev-103',
    productId: 'prod-2',
    customerName: 'Rifat Chowdhury',
    rating: 5,
    comment: 'Razer DeathAdder mouse sensor precision is mind blowing. Original product provided!',
    date: '2026-09-08',
    isVerifiedBuyer: true,
  },
];

/**
 * Get all reviews from localStorage (merged with initial seed data)
 */
export function getAllReviews(): ProductReview[] {
  if (typeof window === 'undefined') return INITIAL_SEED_REVIEWS;
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      try {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_REVIEWS));
      } catch (e) {}
      return INITIAL_SEED_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SEED_REVIEWS;
  } catch (err) {
    console.error('Error loading reviews:', err);
    return INITIAL_SEED_REVIEWS;
  }
}

/**
 * Get all reviews for a specific product ID
 */
export function getReviewsForProduct(productId: string): ProductReview[] {
  const all = getAllReviews();
  return all.filter((r) => r.productId === productId);
}

/**
 * Check if a customer has already submitted a review for a specific product in an order
 */
export function hasCustomerReviewedOrderItem(orderId: string, productId: string): boolean {
  if (!orderId || !productId) return false;
  const all = getAllReviews();
  return all.some((r) => r.orderId === orderId && r.productId === productId);
}

/**
 * Add a new Verified Buyer review
 */
export function addReview(data: {
  productId: string;
  orderId?: string;
  customerName: string;
  rating: number;
  comment: string;
}): ProductReview {
  const all = getAllReviews();

  const newReview: ProductReview = {
    id: `rev-${Date.now()}`,
    productId: data.productId,
    orderId: data.orderId,
    customerName: data.customerName.trim() || 'Verified Customer',
    rating: Math.max(1, Math.min(5, data.rating)),
    comment: data.comment.trim(),
    date: new Date().toISOString().split('T')[0],
    isVerifiedBuyer: true,
  };

  const updated = [newReview, ...all];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  }

  return newReview;
}
