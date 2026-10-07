import ProductEditClient from "./ProductEditClient";
import { fetchProductsFromSupabase } from "@/features/products/productService";

export async function generateStaticParams() {
  const ids = new Set<string>([
    "preview",
    "prod-cloudinary-test-1",
    "prod-cloudinary-verify-01",
    "cooler-cx08-pro",
    "cooler-k6",
    "sleeves-glide-v2",
    "sleeves-glide-pro",
    "sleeves-luminous",
    "sleeves-memo-fs01",
  ]);
  try {
    const products = await fetchProductsFromSupabase();
    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p?.id) ids.add(String(p.id));
      });
    }
  } catch {}
  return Array.from(ids).map((id) => ({ id }));
}

export default function EditProductPage() {
  return <ProductEditClient />;
}

