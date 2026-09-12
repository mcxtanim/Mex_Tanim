import { Category, CategoryFormData } from "./types";
import { supabase } from "../../lib/supabase";

const STORAGE_KEY = "mex_tanim_admin_categories";

export interface LinkedProduct {
  id: string;
  title: string;
  price: number;
  image: string;
}

export function getStoredCategories(): Category[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading categories from localStorage", error);
    return [];
  }
}

export function saveStoredCategories(categories: Category[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.warn("localStorage quota exceeded for categories, saving lightweight cache...", error);
    try {
      const lightweight = categories.map((c) => ({
        ...c,
        image: c.image && c.image.startsWith("data:image") ? "" : c.image,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    } catch (e) {
      console.warn("Could not save categories to localStorage, skipping local cache.", e);
    }
    window.dispatchEvent(new Event("storage"));
  }
}

export async function fetchLinkedProductsForCategory(
  categorySlug: string,
  categoryId?: string
): Promise<LinkedProduct[]> {
  if (!supabase) return [];
  try {
    const filter = categoryId
      ? `category.eq.${categorySlug},category.eq.${categoryId}`
      : `category.eq.${categorySlug}`;

    const { data, error } = await supabase
      .from("products")
      .select("id, title, price, image_url, category")
      .or(filter);

    if (error || !data) return [];

    return data.map((item: any) => ({
      id: String(item.id),
      title: item.title || item.name || "Product",
      price: Number(item.price) || 0,
      image: item.image_url || item.image || "",
    }));
  } catch (err) {
    console.warn("fetchLinkedProductsForCategory error:", err);
    return [];
  }
}

export async function fetchCategoriesFromSupabase(): Promise<Category[]> {
  if (!supabase) return getStoredCategories();
  try {
    const { data: catData, error: catError } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (catError) {
      console.warn("Supabase categories fetch error:", catError);
      return getStoredCategories();
    }

    if (!catData) return [];

    // Also fetch products to calculate exact real product counts per category
    let productMap: Record<string, number> = {};
    try {
      const { data: prodData } = await supabase
        .from("products")
        .select("category");

      if (prodData && Array.isArray(prodData)) {
        prodData.forEach((p: any) => {
          const catKey = String(p.category || "").toLowerCase();
          if (catKey) {
            productMap[catKey] = (productMap[catKey] || 0) + 1;
          }
        });
      }
    } catch (e) {
      console.warn("Error fetching products for category counts:", e);
    }

    const mapped: Category[] = catData.map((item: any) => {
      const slug = item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const catId = String(item.id);
      const realCount = (productMap[slug.toLowerCase()] || 0) + (productMap[catId.toLowerCase()] || 0);

      return {
        id: catId,
        name: item.name || "",
        slug: slug,
        description: item.description || "",
        image: item.image_url || item.image || "",
        productCount: realCount > 0 ? realCount : Number(item.product_count || item.productCount) || 0,
      };
    });

    saveStoredCategories(mapped);
    return mapped;
  } catch (err) {
    console.warn("Supabase fetch categories error:", err);
    return getStoredCategories();
  }
}

export async function fetchCategoryById(id: string): Promise<Category | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .or(`id.eq.${id},slug.eq.${id}`)
        .maybeSingle();

      if (!error && data) {
        const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return {
          id: String(data.id),
          name: data.name || "",
          slug,
          description: data.description || "",
          image: data.image_url || data.image || "",
          productCount: Number(data.product_count) || 0,
        };
      }
    } catch (err) {
      console.warn("fetchCategoryById exception:", err);
    }
  }

  const stored = getStoredCategories();
  return stored.find((c) => c.id === id || c.slug === id) || null;
}

export async function createCategory(
  formData: CategoryFormData,
  existingCategories: Category[]
): Promise<Category[]> {
  const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const newId = `cat-${Date.now()}`;
  const newCat: Category = {
    id: newId,
    name: formData.name,
    slug,
    description: formData.description,
    image: formData.image,
    productCount: 0,
  };

  const updated = [newCat, ...existingCategories];
  saveStoredCategories(updated);

  if (supabase) {
    try {
      const { error } = await supabase.from("categories").insert({
        id: newId,
        name: formData.name,
        slug,
        description: formData.description || null,
        image_url: formData.image || null,
        product_count: 0,
      });
      if (error) console.error("Supabase category insert error:", error);
    } catch (err) {
      console.error("Supabase category insert exception:", err);
    }
  }

  return updated;
}

export async function updateCategory(
  id: string,
  formData: CategoryFormData,
  existingCategories: Category[]
): Promise<Category[]> {
  const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const updated = existingCategories.map((cat) =>
    cat.id === id
      ? { ...cat, name: formData.name, description: formData.description, image: formData.image, slug }
      : cat
  );
  saveStoredCategories(updated);

  if (supabase) {
    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: formData.name,
          slug,
          description: formData.description || null,
          image_url: formData.image || null,
        })
        .eq("id", id);
      if (error) console.error("Supabase category update error:", error);
    } catch (err) {
      console.error("Supabase category update exception:", err);
    }
  }

  return updated;
}

export async function deleteCategory(
  id: string,
  existingCategories: Category[]
): Promise<Category[]> {
  const updated = existingCategories.filter((c) => c.id !== id);
  saveStoredCategories(updated);

  if (supabase) {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) console.error("Supabase category delete error:", error);
    } catch (err) {
      console.error("Supabase category delete exception:", err);
    }
  }

  return updated;
}
