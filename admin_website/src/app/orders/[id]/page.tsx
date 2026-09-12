"use client";

import { useParams } from "next/navigation";
import { OrderDetailView } from "../../../features/orders/OrderDetailView";

export default function OrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  return <OrderDetailView orderId={id} />;
}
