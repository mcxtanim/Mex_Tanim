"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { OrderDetailView } from "../../../features/orders/OrderDetailView";
import { extractRouteId } from "../../../lib/routeUtils";

export default function OrderDetailClient() {
  const params = useParams();
  const [resolvedId, setResolvedId] = useState<string>(() => extractRouteId(params?.id, "orders"));

  useEffect(() => {
    const id = extractRouteId(params?.id, "orders");
    if (id) setResolvedId(id);
  }, [params]);

  return <OrderDetailView orderId={resolvedId} />;
}
