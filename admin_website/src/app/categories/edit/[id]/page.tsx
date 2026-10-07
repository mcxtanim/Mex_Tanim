import CategoryEditClient from "./CategoryEditClient";
import { fetchCategoriesFromSupabase } from "@/features/categories/categoryService";

export async function generateStaticParams() {
  const ids = new Set<string>([
    "preview",
    "gaming-cooler",
    "finger-sleeves",
    "gaming-mice",
    "mechanical-keyboards",
    "gaming-headsets",
    "fast-chargers",
    "cables",
    "soundboxes",
    "trimmers",
    "combo-offers",
  ]);
  try {
    const categories = await fetchCategoriesFromSupabase();
    if (Array.isArray(categories)) {
      categories.forEach((c) => {
        if (c?.slug) ids.add(String(c.slug));
        if (c?.id) ids.add(String(c.id));
      });
    }
  } catch {}
  return Array.from(ids).map((id) => ({ id }));
}

export default function EditCategoryPage() {
  return <CategoryEditClient />;
}

