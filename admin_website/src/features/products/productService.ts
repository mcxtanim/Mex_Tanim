import { Product, ProductFormData } from "./types";
import { initialProducts } from "./seedData";
import { supabase } from "../../lib/supabase";

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

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  if (!supabase) return getStoredProducts();
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error || !data || data.length === 0) {
      return getStoredProducts();
    }
    const mapped: Product[] = data.map((item: any) => ({
      id: String(item.id),
      title: item.title || "",
      titleBn: item.title_bn || item.titleBn || "",
      brand: item.brand || "",
      category: item.category || "GAMING COOLER",
      price: Number(item.price) || 0,
      originalPrice: Number(item.original_price || item.originalPrice) || 0,
      discount: Number(item.discount) || 0,
      stock: Number(item.stock) || 0,
      description: item.description || "",
      descriptionBn: item.description_bn || item.descriptionBn || "",
      specs: item.specs || "",
      imageUrl: item.image_url || item.imageUrl || "",
      createdAt: item.created_at || new Date().toISOString().split("T")[0],
    }));
    saveStoredProducts(mapped);
    return mapped;
  } catch (err) {
    console.warn("Supabase fetch products error, using fallback:", err);
    return getStoredProducts();
  }
}

export function createProduct(formData: ProductFormData, existingProducts: Product[]): Product[] {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    ...formData,
    createdAt: new Date().toISOString().split("T")[0],
  };
  const updated = [newProduct, ...existingProducts];
  saveStoredProducts(updated);

  if (supabase) {
    supabase
      .from("products")
      .upsert({
        id: newProduct.id,
        title: newProduct.title,
        title_bn: newProduct.titleBn,
        brand: newProduct.brand,
        category: newProduct.category,
        price: newProduct.price,
        original_price: newProduct.originalPrice,
        discount: newProduct.discount,
        stock: newProduct.stock,
        description: newProduct.description,
        description_bn: newProduct.descriptionBn,
        specs: newProduct.specs,
        image_url: newProduct.imageUrl,
        created_at: newProduct.createdAt,
      })
      .then(({ error }) => {
        if (error) console.warn("Supabase product upsert error:", error);
      });
  }

  return updated;
}

export function updateProduct(id: string, formData: ProductFormData, existingProducts: Product[]): Product[] {
  const updated = existingProducts.map((p) =>
    p.id === id ? { ...p, ...formData } : p
  );
  saveStoredProducts(updated);

  const updatedProd = updated.find((p) => p.id === id);
  if (supabase && updatedProd) {
    supabase
      .from("products")
      .upsert({
        id: updatedProd.id,
        title: updatedProd.title,
        title_bn: updatedProd.titleBn,
        brand: updatedProd.brand,
        category: updatedProd.category,
        price: updatedProd.price,
        original_price: updatedProd.originalPrice,
        discount: updatedProd.discount,
        stock: updatedProd.stock,
        description: updatedProd.description,
        description_bn: updatedProd.descriptionBn,
        specs: updatedProd.specs,
        image_url: updatedProd.imageUrl,
      })
      .then(({ error }) => {
        if (error) console.warn("Supabase product update error:", error);
      });
  }

  return updated;
}

export function deleteProduct(id: string, existingProducts: Product[]): Product[] {
  const updated = existingProducts.filter((p) => p.id !== id);
  saveStoredProducts(updated);

  if (supabase) {
    supabase
      .from("products")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.warn("Supabase product delete error:", error);
      });
  }

  return updated;
}
