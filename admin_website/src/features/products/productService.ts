import { Product, ProductFormData } from "./types";
import { supabase } from "../../lib/supabase";

const STORAGE_KEY = "mex_tanim_admin_products";

export function normalizeCategorySlug(rawCat: string): string {
  if (!rawCat) return "gaming-mice";
  const slug = rawCat
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (slug === "mechanical-keyboard" || slug === "keyboard" || slug === "keyboards") return "mechanical-keyboards";
  if (slug === "gaming-headset" || slug === "headset" || slug === "headphones") return "gaming-headsets";
  if (slug === "gaming-mouse" || slug === "mouse" || slug === "mice") return "gaming-mice";
  if (slug === "fast-charger" || slug === "charger" || slug === "chargers") return "fast-chargers";
  if (slug === "cable") return "cables";
  if (slug === "soundbox") return "soundboxes";
  if (slug === "trimmer") return "trimmers";
  if (slug === "cooler" || slug === "gaming-coolers") return "gaming-cooler";
  if (slug === "sleeves" || slug === "finger-sleeve") return "finger-sleeves";

  return slug || "gaming-mice";
}

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

export function saveStoredCategories(products: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error("Error saving products to localStorage", error);
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
      console.warn("Supabase products fetch error:", error.message || error);
      return getStoredProducts();
    }

    if (!data) return [];

    const mapped: Product[] = data.map((item: any) => ({
      id: String(item.id),
      title: item.title || "",
      titleBn: item.title_bn || item.titleBn || "",
      brand: item.brand || "",
      category: item.category || "gaming-mice",
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
    console.warn("Supabase fetch products exception:", err);
    return getStoredProducts();
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        return {
          id: String(data.id),
          title: data.title || "",
          titleBn: data.title_bn || data.titleBn || "",
          brand: data.brand || "",
          category: data.category || "gaming-mice",
          price: Number(data.price) || 0,
          originalPrice: Number(data.original_price || data.originalPrice) || 0,
          discount: Number(data.discount) || 0,
          stock: Number(data.stock) || 0,
          description: data.description || "",
          descriptionBn: data.description_bn || data.descriptionBn || "",
          specs: Array.isArray(data.specs) ? data.specs.join(", ") : (data.specs || ""),
          imageUrl: data.image_url || data.imageUrl || "",
          is_featured: Boolean(data.is_featured),
          is_popular: Boolean(data.is_popular),
          is_bestseller: Boolean(data.is_bestseller),
          is_new_arrival: Boolean(data.is_new_arrival),
          is_combo: Boolean(data.is_combo),
          createdAt: data.created_at || new Date().toISOString().split("T")[0],
        };
      }
    } catch (err) {
      console.warn("fetchProductById exception:", err);
    }
  }

  const stored = getStoredProducts();
  return stored.find((p) => p.id === id) || null;
}

export async function createProduct(
  formData: ProductFormData,
  existingProducts: Product[]
): Promise<Product[]> {
  const newId = `prod-${Date.now()}`;
  const categorySlug = normalizeCategorySlug(formData.category);
  const specsArray = formData.specs
    ? formData.specs.split(/,|\n/).map((s) => s.trim()).filter(Boolean)
    : [];

  const newProduct: Product = {
    id: newId,
    ...formData,
    category: categorySlug,
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
        category: categorySlug,
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
      if (error) {
        console.error("Supabase product insert error:", error.message || error.details || JSON.stringify(error));
      }
    } catch (err) {
      console.error("Supabase product insert exception:", err);
    }
  }

  return updated;
}

export async function updateProduct(
  id: string,
  formData: ProductFormData,
  existingProducts: Product[]
): Promise<Product[]> {
  const categorySlug = normalizeCategorySlug(formData.category);
  const specsArray = formData.specs
    ? formData.specs.split(/,|\n/).map((s) => s.trim()).filter(Boolean)
    : [];

  const updated = existingProducts.map((p) =>
    p.id === id ? { ...p, ...formData, category: categorySlug } : p
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
          category: categorySlug,
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
      if (error) {
        console.error("Supabase product update error:", error.message || error.details || JSON.stringify(error));
      }
    } catch (err) {
      console.error("Supabase product update exception:", err);
    }
  }

  return updated;
}

export async function deleteProduct(
  id: string,
  existingProducts: Product[]
): Promise<Product[]> {
  const updated = existingProducts.filter((p) => p.id !== id);
  saveStoredProducts(updated);

  if (supabase) {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        console.error("Supabase product delete error:", error.message || error.details || JSON.stringify(error));
      }
    } catch (err) {
      console.error("Supabase product delete exception:", err);
    }
  }

  return updated;
}
