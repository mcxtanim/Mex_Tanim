import { AdminHeader } from "@/features/shared/AdminHeader";
import { ProductsView } from "@/features/products/ProductsView";

export default function ProductsPage() {
  return (
    <>
      <AdminHeader title="Products" />
      <main className="p-8">
        <ProductsView />
      </main>
    </>
  );
}
