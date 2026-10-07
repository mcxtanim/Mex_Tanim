import OrderDetailClient from "./OrderDetailClient";
import { fetchOrdersFromSupabase } from "@/features/orders/orderService";

export async function generateStaticParams() {
  const ids = new Set<string>(["preview", "1", "2", "3"]);
  try {
    const orders = await fetchOrdersFromSupabase();
    if (Array.isArray(orders)) {
      orders.forEach((o) => {
        if (o?.id) ids.add(String(o.id));
      });
    }
  } catch {}
  return Array.from(ids).map((id) => ({ id }));
}

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}

