export interface Category {
  id: string;
  name: string;
  name_bn?: string;
  slug: string;
  description: string;
  productCount: number;
  image?: string;
}

export interface CategoryFormData {
  name: string;
  name_bn?: string;
  description: string;
  image?: string;
}
