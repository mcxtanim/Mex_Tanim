"use client";

import { useParams } from "next/navigation";
import { ProductFormView } from "../../../../features/products/ProductFormView";

export default function EditProductPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  return <ProductFormView productId={id} />;
}
