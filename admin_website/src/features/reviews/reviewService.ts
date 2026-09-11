import { AdminReview } from "./types";

const REVIEWS_STORAGE_KEY = "mex_tanim_product_reviews";

const INITIAL_SEED_REVIEWS: AdminReview[] = [
  {
    id: "rev-101",
    productId: "prod-1",
    customerName: "Tanvir Ahmed",
    rating: 5,
    comment: "প্রোডাক্টটি অত্যন্ত ভালো! সাউন্ড কোয়ালিটি এবং আরজিবি লাইটিং এক কথায় অসাধারণ। মেক্স তানভির স্টোরকে ধন্যবাদ।",
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

export function getStoredReviews(): AdminReview[] {
  if (typeof window === "undefined") return INITIAL_SEED_REVIEWS;
  try {
    const data = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_SEED_REVIEWS));
      return INITIAL_SEED_REVIEWS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : INITIAL_SEED_REVIEWS;
  } catch (error) {
    console.error("Error reading reviews from localStorage", error);
    return INITIAL_SEED_REVIEWS;
  }
}

export function deleteStoredReview(reviewId: string, current: AdminReview[]): AdminReview[] {
  const updated = current.filter((r) => r.id !== reviewId);
  if (typeof window !== "undefined") {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  }
  return updated;
}
