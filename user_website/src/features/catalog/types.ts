export interface Product {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  categoryBn: string;
  price: number;
  originalPrice: number;
  discountBadge: string;
  rating: number;
  reviewCount: number;
  image: string;
  inStock: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  description: string;
  descriptionBn: string;
  specs: string[];
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  iconName: string;
  itemCount: number;
}
