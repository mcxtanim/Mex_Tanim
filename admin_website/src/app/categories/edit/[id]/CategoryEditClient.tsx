"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CategoryFormView } from "../../../../features/categories/CategoryFormView";
import { extractRouteId } from "../../../../lib/routeUtils";

export default function CategoryEditClient() {
  const params = useParams();
  const [resolvedId, setResolvedId] = useState<string>(() => extractRouteId(params?.id, "edit"));

  useEffect(() => {
    const id = extractRouteId(params?.id, "edit");
    if (id) setResolvedId(id);
  }, [params]);

  return <CategoryFormView categoryId={resolvedId} />;
}
