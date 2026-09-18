import { AdminHeader } from "@/features/shared/AdminHeader";
import { BannerFormView } from "@/features/banners/BannerFormView";

export default function AddBannerPage() {
  return (
    <>
      <AdminHeader title="Add Hero Banner" subtitle="Create and schedule promotional banners" />
      <main className="p-4 sm:p-8">
        <BannerFormView />
      </main>
    </>
  );
}
