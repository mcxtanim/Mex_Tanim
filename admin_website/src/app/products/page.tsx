import { AdminHeader } from "@/features/shared/AdminHeader";
import { ProductsView } from "@/features/products/ProductsView";

export default function ProductsPage() {
  return (
    <>
      <AdminHeader title="Products Management" subtitle="Catalog, Pricing in BDT, Discounts & Stock Control" />
      <main className="p-8">
        <ProductsView />
      </main>
    </>
  );
}
