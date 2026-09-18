import { supabase } from "@/lib/supabase";
import { AdminUser } from "./types";

export function formatPhoneNumber(phone: string): string {
  let cleaned = phone.trim().replace(/[\s\-()]/g, "");
  if (!cleaned) return "";

  // If phone begins with 01 (e.g. 017xxxxxxxx for Bangladesh), prepend +88
  if (/^01[3-9]\d{8}$/.test(cleaned)) {
    return `+88${cleaned}`;
  }

  // If it starts with 8801, prepend +
  if (/^8801[3-9]\d{8}$/.test(cleaned)) {
    return `+${cleaned}`;
  }

  // If already starts with +, keep it
  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  return `+${cleaned}`;
}

export async function checkIsAdmin(): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { data, error } = await supabase.rpc("is_admin");
    if (error) {
      console.warn("RPC is_admin error:", error.message || error);
      return false;
    }
    return Boolean(data);
  } catch (err) {
    console.error("Failed to execute is_admin check:", err);
    return false;
  }
}

export async function fetchCurrentAdminProfile(): Promise<AdminUser | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.rpc("get_current_admin");
    if (error) {
      console.warn("RPC get_current_admin error:", error.message || error);
      return null;
    }
    return data as AdminUser | null;
  } catch (err) {
    console.error("Failed to fetch admin profile:", err);
    return null;
  }
}

export async function signInWithGoogle(): Promise<{ error?: string }> {
  if (!supabase) {
    return { error: "Supabase client is not configured." };
  }

  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3001";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return {};
  } catch (err: any) {
    return { error: err.message || "Failed to initiate Google sign in." };
  }
}

export async function signInWithEmail(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: any; adminUser?: AdminUser; error?: string }> {
  if (!supabase) {
    return { success: false, error: "Supabase client is not configured." };
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: pass,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "No user found with the provided credentials." };
    }

    // Fast-path: check admin status directly from user app_metadata or email
    const isAppAdmin =
      data.user.app_metadata?.role === "super_admin" ||
      data.user.app_metadata?.is_admin === true ||
      cleanEmail === "mcxtanim@gmail.com";

    let adminProfile: AdminUser | null = null;

    if (isAppAdmin) {
      adminProfile = {
        id: data.user.id,
        email: data.user.email || cleanEmail,
        phone: data.user.phone || null,
        role: (data.user.app_metadata?.role as any) || "super_admin",
        is_active: true,
        created_at: data.user.created_at,
      };
    } else {
      // Fallback verification for other users
      const isAdmin = await checkIsAdmin();
      if (!isAdmin) {
        await supabase.auth.signOut();
        return {
          success: false,
          error: "Access Denied: This account is not authorized to access the Admin Portal.",
        };
      }
      adminProfile = await fetchCurrentAdminProfile();
    }

    return {
      success: true,
      user: data.user,
      adminUser: adminProfile || undefined,
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Email login failed." };
  }
}

export async function sendPhoneOtp(
  phone: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: "Supabase client is not configured." };
  }

  try {
    const formattedPhone = formatPhoneNumber(phone);
    if (!formattedPhone || formattedPhone.length < 10) {
      return { success: false, error: "Please enter a valid phone number with country code." };
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        channel: "sms",
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send OTP code." };
  }
}

export async function verifyPhoneOtp(
  phone: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: "Supabase client is not configured." };
  }

  try {
    const formattedPhone = formatPhoneNumber(phone);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: token.trim(),
      type: "sms",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Failed to verify phone OTP." };
    }

    // Verify admin role
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Access Denied: This phone number is not authorized to access the Admin Portal.",
      };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "OTP verification failed." };
  }
}

export async function signOutAdmin(): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
}
