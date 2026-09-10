export interface Product {
  id: string;
  title: string;
  category: string;
  price: number; // In BDT
  discount: number; // Percentage
  stock: number;
  specs: string; // Formatting specifications details
  imageUrl: string;
  createdAt: string;
}

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface ProductFormData {
  title: string;
  category: string;
  price: number;
  discount: number;
  stock: number;
  specs: string;
  imageUrl: string;
}
