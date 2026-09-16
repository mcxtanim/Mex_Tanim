import { User } from "@supabase/supabase-js";

export type AdminRole = "super_admin" | "admin" | "editor";

export interface AdminUser {
  id: string;
  email: string | null;
  phone: string | null;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
}

export type LoginTab = "google" | "email" | "phone";

export interface AuthContextType {
  user: User | null;
  adminUser: AdminUser | null;
  isAdmin: boolean;
  isLoading: boolean;
  authError: string | null;
  clearError: () => void;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  sendPhoneOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshAdminStatus: () => Promise<boolean>;
}
