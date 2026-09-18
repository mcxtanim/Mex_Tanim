import OrderDetailClient from "./OrderDetailClient";

export function generateStaticParams() {
  return [{ id: "preview" }];
}

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}
