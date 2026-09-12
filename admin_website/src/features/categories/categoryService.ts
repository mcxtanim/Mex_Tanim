import { Category, CategoryFormData } from "./types";
import { initialCategories } from "./seedData";
import { supabase } from "../../lib/supabase";

const STORAGE_KEY = "mex_tanim_admin_categories";

export function getStoredCategories(): Category[] {
  if (typeof window === "undefined") return initialCategories;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCategories));
      return initialCategories;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading categories from localStorage", error);
    return initialCategories;
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
    const { data, error } = await supabase.from("categories").select("*");
    if (error || !data || data.length === 0) {
      return getStoredCategories();
    }
    const mapped: Category[] = data.map((item: any) => ({
      id: String(item.id),
      name: item.name || "",
      slug: item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: item.description || "",
      image: item.image || item.image_url || "",
      productCount: Number(item.product_count || item.productCount) || 0,
    }));
    saveStoredCategories(mapped);
    return mapped;
  } catch (err) {
    console.warn("Supabase fetch categories error, using fallback:", err);
    return getStoredCategories();
  }
}

export function createCategory(formData: CategoryFormData, existingCategories: Category[]): Category[] {
  const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: formData.name,
    slug,
    description: formData.description,
    image: formData.image,
    productCount: 0,
  };
  const updated = [newCat, ...existingCategories];
  saveStoredCategories(updated);

  if (supabase) {
    supabase
      .from("categories")
      .upsert({
        id: newCat.id,
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        image_url: newCat.image,
        product_count: 0,
      })
      .then(({ error }) => {
        if (error) console.warn("Supabase category upsert error:", error);
      });
  }

  return updated;
}

export function updateCategory(id: string, formData: CategoryFormData, existingCategories: Category[]): Category[] {
  const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const updated = existingCategories.map((cat) =>
    cat.id === id ? { ...cat, name: formData.name, description: formData.description, image: formData.image, slug } : cat
  );
  saveStoredCategories(updated);

  const updatedCat = updated.find((c) => c.id === id);
  if (supabase && updatedCat) {
    supabase
      .from("categories")
      .upsert({
        id: updatedCat.id,
        name: updatedCat.name,
        slug: updatedCat.slug,
        description: updatedCat.description,
        image_url: updatedCat.image,
      })
      .then(({ error }) => {
        if (error) console.warn("Supabase category update error:", error);
      });
  }

  return updated;
}

export function deleteCategory(id: string, existingCategories: Category[]): Category[] {
  const updated = existingCategories.filter((c) => c.id !== id);
  saveStoredCategories(updated);

  if (supabase) {
    supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .then(({ error }) => {
        if (error) console.warn("Supabase category delete error:", error);
      });
  }

  return updated;
}
