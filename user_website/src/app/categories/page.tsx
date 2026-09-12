import { Header } from "@/features/shared/Header";
import { Footer } from "@/features/shared/Footer";
import { FloatingChat } from "@/features/shared/FloatingChat";
import { CategoriesView } from "@/features/catalog/CategoriesView";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      <main className="flex-1">
        <CategoriesView />
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
}
