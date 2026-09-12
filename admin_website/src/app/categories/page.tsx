import { AdminHeader } from "@/features/shared/AdminHeader";
import { CategoriesView } from "@/features/categories/CategoriesView";

export default function CategoriesPage() {
  return (
    <>
      <AdminHeader title="Categories" />
      <main className="p-8">
        <CategoriesView />
      </main>
    </>
  );
}
