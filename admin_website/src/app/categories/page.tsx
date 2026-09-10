import { AdminHeader } from "@/features/shared/AdminHeader";
import { CategoriesView } from "@/features/categories/CategoriesView";

export default function CategoriesPage() {
  return (
    <>
      <AdminHeader title="Categories Management" subtitle="Manage store product categories & taxonomy" />
      <main className="p-8">
        <CategoriesView />
      </main>
    </>
  );
}
