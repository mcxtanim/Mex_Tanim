import { AdminHeader } from "@/features/shared/AdminHeader";
import { BannerListView } from "@/features/banners/BannerListView";

export default function BannersPage() {
  return (
    <>
      <AdminHeader title="Hero Banners" />
      <main className="p-8">
        <BannerListView />
      </main>
    </>
  );
}
