"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { AdminSidebar } from "../shared/AdminSidebar";
import { ShieldCheck, Loader2 } from "lucide-react";

const PUBLIC_ROUTES = ["/login", "/auth/callback"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, isLoading } = useAuth();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    if (!isLoading && !isPublicRoute && (!user || !isAdmin)) {
      router.replace("/login");
    }
  }, [isLoading, isPublicRoute, user, isAdmin, router]);


  // Public routes (e.g. /login, /auth/callback) do not need sidebar or guard wrapper
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/20">
              <ShieldCheck className="w-7 h-7 text-slate-950" />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-slate-950 rounded-full">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-slate-100">Mex Tanim Store Admin</h2>
            <p className="text-xs text-slate-400">Verifying security credentials...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is not authenticated or not authorized as admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-3">
          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Redirecting to administrator login...</p>
        </div>
      </div>
    );
  }

  // Authenticated & Authorized Admin layout
  return (
    <div className="flex min-h-screen w-full antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
