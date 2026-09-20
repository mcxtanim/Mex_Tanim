import { AdminProductReview } from "./types";

const REVIEWS_STORAGE_KEY = "mex_tanim_product_reviews";

const SEED_REVIEWS: AdminProductReview[] = [
  {
    id: "rev-101",
    productId: "prod-1",
    customerName: "Tarek Hasan",
    rating: 5,
    comment: "প্রোডাক্টটি অত্যন্ত ভালো! সাউন্ড কোয়ালিটি এবং আরজিবি লাইটিং এক কথায় অসাধারণ। মেক্স তানিম স্টোরকে ধন্যবাদ।",
    date: "2026-09-01",
    isVerifiedBuyer: true,
  },
  {
    id: "rev-102",
    productId: "prod-1",
    customerName: "Shakil Hossain",
    rating: 5,
    comment: "Heavy bass & mic clarity is superb for PUBG and Valorant. Fast delivery!",
    date: "2026-09-05",
    isVerifiedBuyer: true,
  },
  {
    id: "rev-103",
    productId: "prod-2",
    customerName: "Rifat Chowdhury",
    rating: 5,
    comment: "Razer DeathAdder mouse sensor precision is mind blowing. Original product provided!",
    date: "2026-09-08",
    isVerifiedBuyer: true,
  },
];

export function getAdminStoredReviews(): AdminProductReview[] {
  if (typeof window === "undefined") return SEED_REVIEWS;
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(SEED_REVIEWS));
      return SEED_REVIEWS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_REVIEWS;
  } catch (err) {
    console.error("Error reading reviews in admin:", err);
    return SEED_REVIEWS;
  }
}

export function saveAdminReviews(reviews: AdminProductReview[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error("Error saving reviews in admin:", err);
  }
}

export function deleteAdminReview(reviewId: string, current: AdminProductReview[]): AdminProductReview[] {
  const updated = current.filter((r) => r.id !== reviewId);
  saveAdminReviews(updated);
  return updated;
}
