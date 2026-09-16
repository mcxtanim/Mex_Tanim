"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { checkIsAdmin, signOutAdmin } from "@/features/auth/authService";
import { ShieldCheck, Loader2, AlertCircle } from "lucide-react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("Processing authentication response...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function handleAuthCallback() {
      if (!supabase) {
        setErrorMessage("Supabase client is not configured.");
        return;
      }

      // Check if there was an error in query params from OAuth provider
      const errorParam = searchParams.get("error_description") || searchParams.get("error");
      if (errorParam) {
        setErrorMessage(decodeURIComponent(errorParam));
        return;
      }

      try {
        setStatusMessage("Verifying administrator session...");
        
        // Let supabase finish setting up the session from hash / code
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!data.session?.user) {
          // Give Supabase an extra moment if hash fragment is being exchanged
          const { data: authData, error: authError } = await supabase.auth.getUser();
          if (authError || !authData.user) {
            router.replace("/login");
            return;
          }
        }

        setStatusMessage("Verifying administrative permissions...");
        const isAdmin = await checkIsAdmin();

        if (isCancelled) return;

        if (isAdmin) {
          setStatusMessage("Access granted. Loading dashboard...");
          router.replace("/");
        } else {
          // Unauthorized user
          await signOutAdmin();
          router.replace("/login?error=unauthorized");
        }
      } catch (err: any) {
        if (!isCancelled) {
          setErrorMessage(err.message || "Failed to complete authentication.");
        }
      }
    }

    handleAuthCallback();

    return () => {
      isCancelled = true;
    };
  }, [router, searchParams]);

  if (errorMessage) {
    return (
      <div className="w-full max-w-sm bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-100">Authentication Failed</h2>
          <p className="text-xs text-rose-300 leading-relaxed">{errorMessage}</p>
        </div>
        <button
          onClick={() => router.replace("/login")}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
      <div className="relative w-14 h-14 mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-xl shadow-emerald-500/20">
          <ShieldCheck className="w-7 h-7 text-slate-950" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-slate-950 rounded-full">
          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
        </div>
      </div>
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-slate-100">Mex Tanim Security</h2>
        <p className="text-xs text-slate-400">{statusMessage}</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            <p className="text-xs text-slate-400">Loading security verification...</p>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}
