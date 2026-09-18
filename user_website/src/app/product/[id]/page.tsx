import DedicatedProductPage from "./ProductDetailClient";

export function generateStaticParams() {
  return [{ id: "preview" }];
}

export default function ProductDetailPage() {
  return <DedicatedProductPage />;
}
