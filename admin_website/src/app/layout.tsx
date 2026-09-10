import type { Metadata } from "next";
import "./globals.css";
import { AdminSidebar } from "@/features/shared/AdminSidebar";

export const metadata: Metadata = {
  title: "Mex Tanim Store Admin",
  description: "Official Admin Portal for Mex Tanim Store Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex antialiased selection:bg-emerald-500 selection:text-white">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {children}
        </div>
      </body>
    </html>
  );
}
