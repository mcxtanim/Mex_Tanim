"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BannerFormView } from "@/features/banners/BannerFormView";
import { extractRouteId } from "@/lib/routeUtils";

export default function BannerEditClient() {
  const params = useParams();
  const [resolvedId, setResolvedId] = useState<string>(() => extractRouteId(params?.id, "edit"));

  useEffect(() => {
    const id = extractRouteId(params?.id, "edit");
    if (id) setResolvedId(id);
  }, [params]);

  return <BannerFormView bannerId={resolvedId} />;
}
