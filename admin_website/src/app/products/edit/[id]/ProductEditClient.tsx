"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductFormView } from "../../../../features/products/ProductFormView";
import { extractRouteId } from "../../../../lib/routeUtils";

export default function ProductEditClient() {
  const params = useParams();
  const [resolvedId, setResolvedId] = useState<string>(() => extractRouteId(params?.id, "edit"));

  useEffect(() => {
    const id = extractRouteId(params?.id, "edit");
    if (id) setResolvedId(id);
  }, [params]);

  return <ProductFormView productId={resolvedId} />;
}
