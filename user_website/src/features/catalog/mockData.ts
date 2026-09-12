import { Category, Product } from './types';

export const CATEGORIES: Category[] = [];
export const PRODUCTS: Product[] = [];
export const COMBO_PRODUCTS: Product[] = [];

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
