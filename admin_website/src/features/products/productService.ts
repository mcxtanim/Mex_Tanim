import { Product, ProductFormData } from "./types";
import { supabase } from "../../lib/supabase";

const STORAGE_KEY = "mex_tanim_admin_products";

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading products from localStorage", error);
    return [];
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
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase products fetch error:", error);
      return getStoredProducts();
    }

    if (!data) return [];

    const mapped: Product[] = data.map((item: any) => ({
      id: String(item.id),
      title: item.title || "",
      titleBn: item.title_bn || item.titleBn || "",
      brand: item.brand || "",
      category: item.category || "GAMING MICE",
      price: Number(item.price) || 0,
      originalPrice: Number(item.original_price || item.originalPrice) || 0,
      discount: Number(item.discount) || 0,
      stock: Number(item.stock) || 0,
      description: item.description || "",
      descriptionBn: item.description_bn || item.descriptionBn || "",
      specs: Array.isArray(item.specs) ? item.specs.join(", ") : (item.specs || ""),
      imageUrl: item.image_url || item.imageUrl || "",
      is_featured: Boolean(item.is_featured),
      is_popular: Boolean(item.is_popular),
      is_bestseller: Boolean(item.is_bestseller),
      is_new_arrival: Boolean(item.is_new_arrival),
      is_combo: Boolean(item.is_combo),
      createdAt: item.created_at || new Date().toISOString().split("T")[0],
    }));

    saveStoredProducts(mapped);
    return mapped;
  } catch (err) {
    console.warn("Supabase fetch products error:", err);
    return getStoredProducts();
  }
}

export async function createProduct(formData: ProductFormData, existingProducts: Product[]): Promise<Product[]> {
  const newId = `prod-${Date.now()}`;
  const specsArray = formData.specs
    ? formData.specs.split(/,|\n/).map((s) => s.trim()).filter(Boolean)
    : [];

  const newProduct: Product = {
    id: newId,
    ...formData,
    createdAt: new Date().toISOString(),
  };

  const updated = [newProduct, ...existingProducts];
  saveStoredProducts(updated);

  if (supabase) {
    try {
      const { error } = await supabase.from("products").insert({
        id: newId,
        title: formData.title,
        title_bn: formData.titleBn || null,
        brand: formData.brand || null,
        category: formData.category,
        price: formData.price,
        original_price: formData.originalPrice || 0,
        discount: formData.discount || 0,
        stock: formData.stock,
        description: formData.description || null,
        description_bn: formData.descriptionBn || null,
        specs: specsArray,
        image_url: formData.imageUrl || null,
        is_featured: Boolean(formData.is_featured),
        is_popular: Boolean(formData.is_popular),
        is_bestseller: Boolean(formData.is_bestseller),
        is_new_arrival: Boolean(formData.is_new_arrival),
        is_combo: Boolean(formData.is_combo),
        created_at: new Date().toISOString(),
      });
      if (error) console.error("Supabase product insert error:", error);
    } catch (err) {
      console.error("Supabase product insert exception:", err);
    }
  }

  return updated;
}

export async function updateProduct(id: string, formData: ProductFormData, existingProducts: Product[]): Promise<Product[]> {
  const specsArray = formData.specs
    ? formData.specs.split(/,|\n/).map((s) => s.trim()).filter(Boolean)
    : [];

  const updated = existingProducts.map((p) =>
    p.id === id ? { ...p, ...formData } : p
  );
  saveStoredProducts(updated);

  if (supabase) {
    try {
      const { error } = await supabase
        .from("products")
        .update({
          title: formData.title,
          title_bn: formData.titleBn || null,
          brand: formData.brand || null,
          category: formData.category,
          price: formData.price,
          original_price: formData.originalPrice || 0,
          discount: formData.discount || 0,
          stock: formData.stock,
          description: formData.description || null,
          description_bn: formData.descriptionBn || null,
          specs: specsArray,
          image_url: formData.imageUrl || null,
          is_featured: Boolean(formData.is_featured),
          is_popular: Boolean(formData.is_popular),
          is_bestseller: Boolean(formData.is_bestseller),
          is_new_arrival: Boolean(formData.is_new_arrival),
          is_combo: Boolean(formData.is_combo),
        })
        .eq("id", id);
      if (error) console.error("Supabase product update error:", error);
    } catch (err) {
      console.error("Supabase product update exception:", err);
    }
  }

  return updated;
}

export async function deleteProduct(id: string, existingProducts: Product[]): Promise<Product[]> {
  const updated = existingProducts.filter((p) => p.id !== id);
  saveStoredProducts(updated);

  if (supabase) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) console.error("Supabase product delete error:", error);
    } catch (err) {
      console.error("Supabase product delete exception:", err);
    }
  }

  return updated;
}
