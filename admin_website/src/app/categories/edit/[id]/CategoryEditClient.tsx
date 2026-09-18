"use client";

import { useParams } from "next/navigation";
import { CategoryFormView } from "../../../../features/categories/CategoryFormView";

export default function CategoryEditClient() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  return <CategoryFormView categoryId={id} />;
}
