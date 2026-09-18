import { AdminHeader } from "@/features/shared/AdminHeader";
import BannerEditClient from "./BannerEditClient";

export function generateStaticParams() {
  return [{ id: "preview" }];
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
