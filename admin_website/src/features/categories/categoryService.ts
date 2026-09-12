import { Category, CategoryFormData } from "./types";
import { supabase } from "../../lib/supabase";

const STORAGE_KEY = "mex_tanim_admin_categories";

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
    console.error("Error saving categories to localStorage", error);
  }
}

export async function fetchCategoriesFromSupabase(): Promise<Category[]> {
  if (!supabase) return getStoredCategories();
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.warn("Supabase categories fetch error:", error);
      return getStoredCategories();
    }

    if (!data) return [];

    const mapped: Category[] = data.map((item: any) => ({
      id: String(item.id),
      name: item.name || "",
      slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: item.description || "",
      image: item.image_url || item.image || "",
      productCount: Number(item.product_count || item.productCount) || 0,
    }));

    saveStoredCategories(mapped);
    return mapped;
  } catch (err) {
    console.warn("Supabase fetch categories error:", err);
    return getStoredCategories();
  }
}

export async function createCategory(formData: CategoryFormData, existingCategories: Category[]): Promise<Category[]> {
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

export async function updateCategory(id: string, formData: CategoryFormData, existingCategories: Category[]): Promise<Category[]> {
  const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const updated = existingCategories.map((cat) =>
    cat.id === id ? { ...cat, name: formData.name, description: formData.description, image: formData.image, slug } : cat
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

export async function deleteCategory(id: string, existingCategories: Category[]): Promise<Category[]> {
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
