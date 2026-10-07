export interface Product {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  categoryBn: string;
  brand?: string;
  brandBn?: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  rating: number;
  reviewCount: number;
  image: string;
  comboImages?: string[];
  videoUrl?: string;
  inStock: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isComboOffer?: boolean;
  soldCount?: number;
  description: string;
  descriptionBn: string;
  specs: string[];
  highlightSubtitle?: string;
  whyChoosePoints?: string[];
  perfectForGames?: string[];
  shortDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  iconName: string;
  itemCount: number;
}
