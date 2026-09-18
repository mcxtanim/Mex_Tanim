"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  resetAdminPassword,
  updateAdminPassword,
} from "@/features/auth/authService";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  KeyRound,
  CheckCircle2,
  X,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user,
    isAdmin,
    isLoading: isAuthLoading,
    authError,
    clearError,
    signInWithEmail,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [loginSuccessNotice, setLoginSuccessNotice] = useState<string | null>(null);

  // Forgot Password modal states
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotMode, setForgotMode] = useState<"request" | "reset">("request");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // If already authenticated and admin (and not in password recovery mode), go to dashboard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isRecovery =
        window.location.hash.includes("type=recovery") ||
        window.location.search.includes("type=recovery") ||
        searchParams.get("type") === "recovery";

      if (isRecovery) {
        return; // Don't redirect if user is in password recovery flow
      }
    }

    if (!isAuthLoading && user && isAdmin) {
      router.replace("/");
    }
  }, [user, isAdmin, isAuthLoading, router, searchParams]);

  // Check for password recovery callback from email link
  useEffect(() => {
    if (!supabase) return;

    // 1. Check URL hash/params on mount
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const search = window.location.search;
      if (
        hash.includes("type=recovery") ||
        search.includes("type=recovery") ||
        searchParams.get("type") === "recovery"
      ) {
        setForgotMode("reset");
        setIsForgotModalOpen(true);
      }
    }

    // 2. Listen to Supabase auth state change for PASSWORD_RECOVERY event
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setForgotMode("reset");
          setIsForgotModalOpen(true);
          if (session?.user?.email) {
            setForgotEmail(session.user.email);
            setEmail(session.user.email);
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [searchParams]);

  // Check URL params for error
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "unauthorized") {
      setLocalError(
        "Access Denied: Your account is not authorized to access the Admin Portal. Only verified administrators are permitted."
      );
    }
  }, [searchParams]);

  const displayedError = localError || authError;

  // Email + Password sign in
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setLocalError("Please provide both email and password.");
      return;
    }

    setLocalError(null);
    clearError();
    setLoginSuccessNotice(null);
    setIsSubmitting(true);

    try {
      const res = await signInWithEmail(email, password);
      if (res.success) {
        router.replace("/");
        return;
      } else if (res.error) {
        setLocalError(res.error);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setLocalError(err.message || "Email authentication failed.");
      setIsSubmitting(false);
    }
  };

  // Send password reset link to email
  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your admin email address.");
      return;
    }

    setForgotError(null);
    setIsForgotSubmitting(true);

    try {
      const res = await resetAdminPassword(forgotEmail);
      if (res.success) {
        setForgotSuccess(
          `We've sent a password reset link to ${forgotEmail}. Please check your inbox and click the link to set your new password.`
        );
      } else {
        setForgotError(res.error || "Failed to send password reset email.");
      }
    } catch (err: any) {
      setForgotError(err.message || "Failed to send password reset email.");
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  // Update password in Supabase
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotNewPassword) {
      setForgotError("Please enter a new password.");
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError("Password must be at least 6 characters.");
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setForgotError("Passwords do not match. Please verify.");
      return;
    }

    setForgotError(null);
    setIsForgotSubmitting(true);

    try {
      const res = await updateAdminPassword(forgotNewPassword);
      if (res.success) {
        // Clean up recovery session
        await supabase?.auth.signOut();

        // Clean up URL hash / search params
        if (typeof window !== "undefined") {
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Pre-fill email and clear password
        if (forgotEmail) {
          setEmail(forgotEmail);
        }
        setPassword("");

        // Close modal and show success alert
        setIsForgotModalOpen(false);
        setForgotNewPassword("");
        setForgotConfirmPassword("");
        setForgotError(null);
        setForgotSuccess(null);
        setLoginSuccessNotice(
          "Password updated successfully in Supabase! You can now sign in with your new password."
        );
      } else {
        setForgotError(res.error || "Failed to update password.");
      }
    } catch (err: any) {
      setForgotError(err.message || "Failed to update password.");
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] shadow-xl shadow-emerald-500/20 mb-4">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center justify-center gap-1.5">
          Mex Tanim Store
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
            Admin
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1.5">
          Restricted Security Portal · Authorized Administrators Only
        </p>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
        <div className="mb-6 text-center">
          <h2 className="text-sm font-bold text-slate-100">Administrator Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter your admin email and password to access the portal
          </p>
        </div>

        {/* Success Notice Box */}
        {loginSuccessNotice && (
          <div className="mb-6 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{loginSuccessNotice}</p>
          </div>
        )}

        {/* Error Alert Box */}
        {displayedError && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{displayedError}</p>
          </div>
        )}

        {/* Email + Password Form */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mextanim.com"
                required
                autoComplete="email"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 mt-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Forget Password Link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email.trim() || "");
                setForgotError(null);
                setForgotSuccess(null);
                setForgotMode("request");
                setIsForgotModalOpen(true);
              }}
              className="text-xs text-slate-400 hover:text-emerald-400 font-medium transition cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {/* Security Footer Notice */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Encrypted Session · Row-Level Security Enforced</span>
          </div>
        </div>
      </div>

      {/* Forgot / Reset Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-black/80 relative text-left">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotSuccess(null);
                setForgotError(null);
                if (
                  typeof window !== "undefined" &&
                  window.location.hash.includes("type=recovery")
                ) {
                  window.history.replaceState({}, document.title, window.location.pathname);
                }
              }}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Mode 1: Request Reset Link */}
            {forgotMode === "request" && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-100">Reset Admin Password</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your registered admin email address. We will send you a secure link to reset your password.
                </p>

                {forgotSuccess ? (
                  <div className="mt-5 space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold text-emerald-300">Recovery Link Sent!</p>
                        <p className="leading-relaxed text-slate-300">{forgotSuccess}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotModalOpen(false);
                        setForgotSuccess(null);
                      }}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendResetLink} className="space-y-4 mt-5">
                    {forgotError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <p>{forgotError}</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Admin Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="admin@mextanim.com"
                          required
                          autoFocus
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsForgotModalOpen(false)}
                        className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-2xl transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isForgotSubmitting}
                        className="w-2/3 h-10 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                      >
                        {isForgotSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Link...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Link</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Mode 2: Set New Password (Returned from email link) */}
            {forgotMode === "reset" && (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-100">Set New Password</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Please enter and confirm your new administrator password.
                </p>

                <form onSubmit={handleUpdatePassword} className="space-y-4 mt-5">
                  {forgotError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <p>{forgotError}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showForgotNewPassword ? "text" : "password"}
                        value={forgotNewPassword}
                        onChange={(e) => setForgotNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        required
                        autoFocus
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                      >
                        {showForgotNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showForgotConfirmPassword ? "text" : "password"}
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowForgotConfirmPassword(!showForgotConfirmPassword)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                      >
                        {showForgotConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isForgotSubmitting}
                    className="w-full h-11 mt-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer text-xs"
                  >
                    {isForgotSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating Password in Supabase...</span>
                      </>
                    ) : (
                      <>
                        <span>Update Password & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-xs text-slate-400">Loading admin security module...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}

