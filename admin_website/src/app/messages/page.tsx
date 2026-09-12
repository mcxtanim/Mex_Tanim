import { AdminHeader } from "@/features/shared/AdminHeader";
import { MessagesView } from "@/features/messages/MessagesView";

export default function MessagesPage() {
  return (
    <>
      <AdminHeader 
        title="Messages & Inbox" 
        subtitle="Manage live customer web chat messages and send instant support replies" 
      />
      <main className="p-8">
        <MessagesView />
      </main>
    </>
  );
}
