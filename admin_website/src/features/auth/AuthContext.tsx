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
      setUser(null);
      setAdminUser(null);
      setIsAdmin(false);
      return false;
    }

    const adminStatus = await checkIsAdmin();
    if (!adminStatus) {
      // User is authenticated in Supabase but not an authorized admin
      await signOutAdmin();
      setUser(null);
      setAdminUser(null);
      setIsAdmin(false);
      setAuthError(
        `Access Denied: The account (${supabaseUser.email || supabaseUser.phone || "User"}) is not authorized as an administrator.`
      );
      return false;
    }

    const profile = await fetchCurrentAdminProfile();
    setUser(supabaseUser);
    setAdminUser(profile);
    setIsAdmin(true);
    setAuthError(null);
    return true;
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
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function initAuth() {
      const timeoutPromise = new Promise<{ timeout: true }>((resolve) =>
        setTimeout(() => resolve({ timeout: true }), 2000)
      );

      try {
        const sessionResult = await Promise.race([
          supabase!.auth.getSession(),
          timeoutPromise,
        ]);

        if ('timeout' in sessionResult) {
          if (isMounted) {
            setUser(null);
            setAdminUser(null);
            setIsAdmin(false);
          }
          return;
        }

        const { data, error } = sessionResult;
        if (error) {
          console.warn("Error getting auth session:", error.message);
        }

        if (isMounted) {
          if (data?.session?.user) {
            await verifyAndSetUser(data.session.user);
          } else {
            setUser(null);
            setAdminUser(null);
            setIsAdmin(false);
          }
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
            setIsLoading(true);
            await verifyAndSetUser(session.user);
            setIsLoading(false);
          }
        } else if (event === "SIGNED_OUT") {
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
      } else {
        await refreshAdminStatus();
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
