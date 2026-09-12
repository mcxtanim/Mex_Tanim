import { AdminHeader } from "@/features/shared/AdminHeader";
import { AnalyticsView } from "@/features/analytics/AnalyticsView";

export default function AnalyticsPage() {
  return (
    <>
      <AdminHeader title="Analytics" />
      <main className="p-8">
        <AnalyticsView />
      </main>
    </>
  );
}
