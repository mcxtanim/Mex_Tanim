export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  image?: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image?: string;
}
