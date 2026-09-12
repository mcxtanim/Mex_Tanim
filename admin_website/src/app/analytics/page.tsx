import { AdminHeader } from "@/features/shared/AdminHeader";
import { AnalyticsView } from "@/features/analytics/AnalyticsView";

export default function AnalyticsPage() {
  return (
    <>
      <AdminHeader 
        title="Financial & Revenue Analytics" 
        subtitle="Track total revenue, operational costs, and automated net profit with custom date range graphs" 
      />
      <main className="p-8">
        <AnalyticsView />
      </main>
    </>
  );
}
