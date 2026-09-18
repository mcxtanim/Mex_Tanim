import DedicatedProductPage from "./ProductDetailClient";

export async function generateStaticParams() {
  // Generate static pages for standard products 1..50 + preview
  const ids = Array.from({ length: 50 }, (_, i) => ({ id: String(i + 1) }));
  ids.push({ id: "preview" });
  return ids;
}

export default function ProductDetailPage() {
  return <DedicatedProductPage />;
}
