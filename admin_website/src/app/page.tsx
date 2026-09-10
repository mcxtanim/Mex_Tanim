import { AdminHeader } from "@/features/shared/AdminHeader";
import { DashboardView } from "@/features/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <>
      <AdminHeader title="Dashboard Overview" subtitle="Mex Tanim Store Key Performance & Sales Metrics" />
      <main className="p-8">
        <DashboardView />
      </main>
    </>
  );
}
