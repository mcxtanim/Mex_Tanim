import { AdminHeader } from "@/features/shared/AdminHeader";
import BannerEditClient from "./BannerEditClient";
import { fetchBannersFromSupabase } from "@/features/banners/bannerService";

export async function generateStaticParams() {
  const ids = new Set<string>(["preview", "1", "2", "3"]);
  try {
    const banners = await fetchBannersFromSupabase();
    if (Array.isArray(banners)) {
      banners.forEach((b) => {
        if (b?.id) ids.add(String(b.id));
      });
    }
  } catch {}
  return Array.from(ids).map((id) => ({ id }));
}

export default function EditBannerPage() {
  return (
    <>
      <AdminHeader title="Edit Hero Banner" subtitle="Update promotional slide content and configuration" />
      <main className="p-4 sm:p-8">
        <BannerEditClient />
      </main>
    </>
  );
}


