"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AdminUser, AuthContextType } from "./types";
import {
  checkIsAdmin,
  fetchCurrentAdminProfile,
  signInWithGoogle as authSignInWithGoogle,
  signInWithEmail as authSignInWithEmail,
  sendPhoneOtp as authSendPhoneOtp,
  verifyPhoneOtp as authVerifyPhoneOtp,
  signOutAdmin,
} from "./authService";

const ADMIN_CACHE_KEY = "mex_tanim_admin_session_v1";

interface CachedAdminData {
  user: User;
  adminUser: AdminUser;
  savedAt: number;
}

function getCachedAdminSession(): { user: User; adminUser: AdminUser } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_CACHE_KEY);
    if (!raw) return null;
    const parsed: CachedAdminData = JSON.parse(raw);
    // Valid for 7 days
    if (
      parsed &&
      parsed.user &&
      parsed.adminUser &&
      Date.now() - parsed.savedAt < 7 * 24 * 60 * 60 * 1000
    ) {
      return { user: parsed.user, adminUser: parsed.adminUser };
    }
  } catch {
    return null;
  }
  return null;
}

function saveAdminSession(user: User, adminUser: AdminUser) {
  if (typeof window === "undefined") return;
  try {
    const payload: CachedAdminData = {
      user,
      adminUser,
      savedAt: Date.now(),
    };
    localStorage.setItem(ADMIN_CACHE_KEY, JSON.stringify(payload));
  } catch {}
}

function clearAdminSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ADMIN_CACHE_KEY);
  } catch {}
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const verifyAndSetUser = useCallback(async (supabaseUser: User | null): Promise<boolean> => {
    if (!supabaseUser) {
      clearAdminSession();
      setUser(null);
      setAdminUser(null);
      setIsAdmin(false);
      return false;
    }

    const cleanEmail = (supabaseUser.email || "").trim().toLowerCase();
    const isAppAdmin =
      supabaseUser.app_metadata?.role === "super_admin" ||
      supabaseUser.app_metadata?.is_admin === true ||
      cleanEmail === "mcxtanim@gmail.com";

    if (isAppAdmin) {
      const profile: AdminUser = {
        id: supabaseUser.id,
        email: supabaseUser.email || cleanEmail,
        phone: supabaseUser.phone || null,
        role: (supabaseUser.app_metadata?.role as any) || "super_admin",
        is_active: true,
        created_at: supabaseUser.created_at,
      };
      setUser(supabaseUser);
      setAdminUser(profile);
      setIsAdmin(true);
      setAuthError(null);
      saveAdminSession(supabaseUser, profile);
      return true;
    }

    const adminStatus = await checkIsAdmin();
    if (!adminStatus) {
      await signOutAdmin();
      clearAdminSession();
      setUser(null);
      setAdminUser(null);
      setIsAdmin(false);
      setAuthError(
        `Access Denied: The account (${supabaseUser.email || supabaseUser.phone || "User"}) is not authorized as an administrator.`
      );
      return false;
    }

    const profile = await fetchCurrentAdminProfile();
    if (profile) {
      setUser(supabaseUser);
      setAdminUser(profile);
      setIsAdmin(true);
      setAuthError(null);
      saveAdminSession(supabaseUser, profile);
      return true;
    }

    return false;
  }, []);

  const refreshAdminStatus = useCallback(async (): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { data } = await supabase.auth.getUser();
      return await verifyAndSetUser(data.user);
    } catch {
      return false;
    }
  }, [verifyAndSetUser]);

  useEffect(() => {
    // 1. Instant hydration from cached admin session (0ms load)
    const cached = getCachedAdminSession();
    if (cached) {
      setUser(cached.user);
      setAdminUser(cached.adminUser);
      setIsAdmin(true);
      setIsLoading(false);
    }

    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // 2. Background silent revalidation with Supabase session
    async function initAuth() {
      try {
        const { data, error } = await supabase!.auth.getSession();
        if (error) {
          console.warn("Auth session warning:", error.message);
        }

        if (!isMounted) return;

        if (data?.session?.user) {
          await verifyAndSetUser(data.session.user);
        } else {
          clearAdminSession();
          setUser(null);
          setAdminUser(null);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Auth init exception:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          if (session?.user) {
            await verifyAndSetUser(session.user);
            setIsLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
          clearAdminSession();
          setUser(null);
          setAdminUser(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [verifyAndSetUser]);

  const handleSignInWithGoogle = async () => {
    clearError();
    return await authSignInWithGoogle();
  };

  const handleSignInWithEmail = async (email: string, pass: string) => {
    clearError();
    setIsLoading(true);
    try {
      const result = await authSignInWithEmail(email, pass);
      if (result.error) {
        setAuthError(result.error);
      } else if (result.user && result.adminUser) {
        setUser(result.user);
        setAdminUser(result.adminUser);
        setIsAdmin(true);
        saveAdminSession(result.user, result.adminUser);
      } else if (result.user) {
        await verifyAndSetUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendPhoneOtp = async (phone: string) => {
    clearError();
    return await authSendPhoneOtp(phone);
  };

  const handleVerifyPhoneOtp = async (phone: string, token: string) => {
    clearError();
    setIsLoading(true);
    try {
      const result = await authVerifyPhoneOtp(phone, token);
      if (result.error) {
        setAuthError(result.error);
      } else {
        await refreshAdminStatus();
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      clearAdminSession();
      await signOutAdmin();
      setUser(null);
      setAdminUser(null);
      setIsAdmin(false);
      setAuthError(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        isAdmin,
        isLoading,
        authError,
        clearError,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithEmail: handleSignInWithEmail,
        sendPhoneOtp: handleSendPhoneOtp,
        verifyPhoneOtp: handleVerifyPhoneOtp,
        signOut: handleSignOut,
        refreshAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
