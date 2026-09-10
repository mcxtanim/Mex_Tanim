import { AdminHeader } from "@/features/shared/AdminHeader";
import { OrdersView } from "@/features/orders/OrdersView";

export default function OrdersPage() {
  return (
    <>
      <AdminHeader title="Orders Management" subtitle="Filter orders, view customer details, and track status" />
      <main className="p-8">
        <OrdersView />
      </main>
    </>
  );
}
