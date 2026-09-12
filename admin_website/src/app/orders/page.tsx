import { AdminHeader } from "@/features/shared/AdminHeader";
import { OrdersView } from "@/features/orders/OrdersView";

export default function OrdersPage() {
  return (
    <>
      <AdminHeader title="Orders" />
      <main className="p-8">
        <OrdersView />
      </main>
    </>
  );
}
