export interface Product {
  id: string;
  title: string;
  titleBn?: string;
  brand?: string;
  category: string;
  price: number; // In BDT
  originalPrice?: number; // In BDT
  discount: number; // Percentage
  stock: number;
  description?: string;
  descriptionBn?: string;
  specs: string; // Formatting specifications details
  imageUrl: string;
  comboImages?: string[];
  videoUrl?: string;
  highlightSubtitle?: string;
  whyChoosePoints?: string[];
  perfectForGames?: string[];
  shortDescription?: string;
  is_featured?: boolean;
  is_popular?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  is_combo?: boolean;
  createdAt: string;
}

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface ProductFormData {
  title: string;
  titleBn?: string;
  brand?: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount: number;
  stock: number;
  description?: string;
  descriptionBn?: string;
  specs: string;
  imageUrl: string;
  comboImagesText?: string;
  videoUrl?: string;
  highlightSubtitle?: string;
  whyChooseText?: string;
  perfectForText?: string;
  shortDescription?: string;
  is_featured?: boolean;
  is_popular?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  is_combo?: boolean;
}
