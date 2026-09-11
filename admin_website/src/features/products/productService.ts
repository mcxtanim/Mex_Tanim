import { Product, ProductFormData } from "./types";
import { initialProducts } from "./seedData";

const STORAGE_KEY = "mex_tanim_admin_products";

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return initialProducts;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products from localStorage", error);
    return initialProducts;
  }
}

export function saveStoredProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error("Error saving products to localStorage", error);
  }
}

export function createProduct(formData: ProductFormData, existingProducts: Product[]): Product[] {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    ...formData,
    createdAt: new Date().toISOString().split("T")[0]
  };
  const updated = [newProduct, ...existingProducts];
  saveStoredProducts(updated);
  return updated;
}

export function updateProduct(id: string, formData: ProductFormData, existingProducts: Product[]): Product[] {
  const updated = existingProducts.map((p) =>
    p.id === id ? { ...p, ...formData } : p
  );
  saveStoredProducts(updated);
  return updated;
}

export function deleteProduct(id: string, existingProducts: Product[]): Product[] {
  const updated = existingProducts.filter((p) => p.id !== id);
  saveStoredProducts(updated);
  return updated;
}
