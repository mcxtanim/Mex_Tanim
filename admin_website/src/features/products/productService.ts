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

  return slug || "gaming-mice";
}

let memoryProductsCache: Product[] | null = null;
let lastProductsFetchTimestamp = 0;
let inFlightProductsPromise: Promise<Product[]> | null = null;

export function getStoredProducts(): Product[] {
  if (memoryProductsCache && memoryProductsCache.length > 0) {
    return memoryProductsCache;
  }
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const parsed = data ? JSON.parse(data) : [];
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryProductsCache = parsed;
    }
    return parsed;
  } catch (error) {
    console.error("Error reading products from localStorage", error);
    return [];
  }
}

export function saveStoredProducts(products: Product[]): void {
  memoryProductsCache = products;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.warn("localStorage quota exceeded, saving lightweight product cache...", error);
    try {
      // Strip out large base64 data URLs to stay within quota
      const lightweight = products.map((p) => ({
        ...p,
        imageUrl: p.imageUrl && p.imageUrl.startsWith("data:image") ? "" : p.imageUrl,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    } catch (e) {
      console.warn("Could not save to localStorage, skipping local cache.", e);
    }
  }
}

export async function fetchProductsFromSupabase(forceRefresh = false): Promise<Product[]> {
  if (!forceRefresh && memoryProductsCache && memoryProductsCache.length > 0 && Date.now() - lastProductsFetchTimestamp < 60000) {
    return memoryProductsCache;
  }

  if (inFlightProductsPromise) {
    return inFlightProductsPromise;
  }

  inFlightProductsPromise = (async () => {
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

      lastProductsFetchTimestamp = Date.now();
      saveStoredProducts(mapped);
      return mapped;
    } catch (err) {
      console.warn("Supabase fetch products exception:", err);
      return getStoredProducts();
    }
  })().finally(() => {
    inFlightProductsPromise = null;
  });

  return inFlightProductsPromise;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const stored = getStoredProducts();
  const found = stored.find((p) => String(p.id) === String(id));
  if (found) {
    return found;
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) {
        const mapped: Product = {
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
        if (memoryProductsCache) {
          memoryProductsCache = [mapped, ...memoryProductsCache.filter((p) => p.id !== mapped.id)];
        } else {
          memoryProductsCache = [mapped];
        }
        return mapped;
      }
    } catch (err) {
      console.warn("fetchProductById exception:", err);
    }
  }

  return null;
}

function notifyProductsUpdated(products: Product[]) {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(new CustomEvent("products_updated", { detail: products }));
    } catch {}
    if ("BroadcastChannel" in window) {
      try {
        const bc = new BroadcastChannel("mex_tanim_store_sync");
        bc.postMessage({ type: "PRODUCTS_UPDATED" });
        bc.close();
      } catch {}
    }
  }
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
  notifyProductsUpdated(updated);

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
  notifyProductsUpdated(updated);

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
  notifyProductsUpdated(updated);

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
