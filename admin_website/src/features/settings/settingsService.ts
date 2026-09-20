import { StoreSettings } from "./types";
import { supabase } from "../../lib/supabase";

const SETTINGS_STORAGE_KEY = "mex_tanim_store_settings";

export const DEFAULT_SETTINGS: StoreSettings = {
  id: "default",
  // Store Profile
  storeName: "Mex Tanim Store",
  storeTagline: "Shop Smart • Fast Delivery • Trusted Quality",
  phone: "",
  email: "support@mextanimstore.com",
  address: "Dhaka, Bangladesh",
  supportHoursBn: "সকাল ৮টা থেকে রাত ১২টা",
  supportHoursEn: "8:00 AM - 12:00 AM",

  // Connect & Chat Channels
  whatsappNumber: "",
  messengerUsername: "mextanimstore",
  messengerLink: "https://m.me/mextanimstore",
  telegramUsername: "mextanimstore",
  telegramLink: "https://t.me/mextanimstore",
  enableFloatingChat: true,
  enableWhatsappChat: true,
  enableMessengerChat: true,
  enableTelegramChat: true,

  // Social Media
  facebookLink: "https://facebook.com/mextanimstore",
  youtubeLink: "https://youtube.com/@mextanimstore",
  instagramLink: "",
  tiktokLink: "",

  // Delivery Fees
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  freeDeliveryThreshold: 0,

  // Announcements
  announcementBn: "সেরা গেমিং গ্যাজেট ১ জায়গায় সব • দেশের সেরা দামে ১০০% অথেনটিক প্রোডাক্ট",
  announcementEn: "Top Gaming Gadgets All in One Place • 100% Authentic Products at Best Price in BD",
  showAnnouncement: true,

  // Payment
  enableCashOnDelivery: true,
  bkashNumber: "",
  nagadNumber: "",

  // Courier
  enableSteadfastCourier: false,
  steadfastApiKey: "",
  steadfastSecretKey: "",
  steadfastWebhookUrl: "https://mextanimstore.com/api/webhooks/steadfast",
};

export function mapDbToSettings(item: any): StoreSettings {
  if (!item) return DEFAULT_SETTINGS;
  return {
    id: item.id || "default",
    storeName: item.store_name || DEFAULT_SETTINGS.storeName,
    storeTagline: item.store_tagline || DEFAULT_SETTINGS.storeTagline,
    phone: item.phone ?? "",
    email: item.email || DEFAULT_SETTINGS.email,
    address: item.address || DEFAULT_SETTINGS.address,
    supportHoursBn: item.support_hours_bn || DEFAULT_SETTINGS.supportHoursBn,
    supportHoursEn: item.support_hours_en || DEFAULT_SETTINGS.supportHoursEn,

    whatsappNumber: item.whatsapp_number ?? "",
    messengerUsername: item.messenger_username || DEFAULT_SETTINGS.messengerUsername,
    messengerLink: item.messenger_link || (item.messenger_username ? `https://m.me/${item.messenger_username}` : DEFAULT_SETTINGS.messengerLink),
    telegramUsername: item.telegram_username || DEFAULT_SETTINGS.telegramUsername,
    telegramLink: item.telegram_link || (item.telegram_username ? `https://t.me/${item.telegram_username}` : DEFAULT_SETTINGS.telegramLink),
    enableFloatingChat: item.enable_floating_chat ?? true,
    enableWhatsappChat: item.enable_whatsapp_chat ?? true,
    enableMessengerChat: item.enable_messenger_chat ?? true,
    enableTelegramChat: item.enable_telegram_chat ?? true,

    facebookLink: item.facebook_link ?? DEFAULT_SETTINGS.facebookLink,
    youtubeLink: item.youtube_link ?? DEFAULT_SETTINGS.youtubeLink,
    instagramLink: item.instagram_link ?? "",
    tiktokLink: item.tiktok_link ?? "",

    insideDhakaFee: Number(item.inside_dhaka_fee) || 60,
    outsideDhakaFee: Number(item.outside_dhaka_fee) || 120,
    freeDeliveryThreshold: Number(item.free_delivery_threshold) || 0,

    announcementBn: item.announcement_bn || DEFAULT_SETTINGS.announcementBn,
    announcementEn: item.announcement_en || DEFAULT_SETTINGS.announcementEn,
    showAnnouncement: item.show_announcement ?? true,

    enableCashOnDelivery: item.enable_cash_on_delivery ?? true,
    bkashNumber: item.bkash_number || "",
    nagadNumber: item.nagad_number || "",

    enableSteadfastCourier: item.enable_steadfast_courier ?? false,
    steadfastApiKey: item.steadfast_api_key || "",
    steadfastSecretKey: item.steadfast_secret_key || "",
    steadfastWebhookUrl: "https://mextanimstore.com/api/webhooks/steadfast",
    updatedAt: item.updated_at,
  };
}

export function mapSettingsToDb(settings: StoreSettings): any {
  return {
    id: "default",
    store_name: settings.storeName,
    store_tagline: settings.storeTagline,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    support_hours_bn: settings.supportHoursBn,
    support_hours_en: settings.supportHoursEn,

    whatsapp_number: settings.whatsappNumber,
    messenger_username: settings.messengerUsername,
    messenger_link: settings.messengerLink || `https://m.me/${settings.messengerUsername.trim()}`,
    telegram_username: settings.telegramUsername,
    telegram_link: settings.telegramLink || `https://t.me/${settings.telegramUsername.trim()}`,
    enable_floating_chat: settings.enableFloatingChat,
    enable_whatsapp_chat: settings.enableWhatsappChat,
    enable_messenger_chat: settings.enableMessengerChat,
    enable_telegram_chat: settings.enableTelegramChat,

    facebook_link: settings.facebookLink,
    youtube_link: settings.youtubeLink,
    instagram_link: settings.instagramLink,
    tiktok_link: settings.tiktokLink,

    inside_dhaka_fee: settings.insideDhakaFee,
    outside_dhaka_fee: settings.outsideDhakaFee,
    free_delivery_threshold: settings.freeDeliveryThreshold,

    announcement_bn: settings.announcementBn,
    announcement_en: settings.announcementEn,
    show_announcement: settings.showAnnouncement,

    enable_cash_on_delivery: settings.enableCashOnDelivery,
    bkash_number: settings.bkashNumber,
    nagad_number: settings.nagadNumber,

    enable_steadfast_courier: settings.enableSteadfastCourier,
    steadfast_api_key: settings.steadfastApiKey,
    steadfast_secret_key: settings.steadfastSecretKey,
    updated_at: new Date().toISOString(),
  };
}

export function getStoredSettings(): StoreSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading store settings:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function fetchSettingsFromSupabase(): Promise<StoreSettings> {
  if (!supabase) return getStoredSettings();
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      console.warn("Supabase store settings fetch notice:", error?.message);
      return getStoredSettings();
    }

    const mapped = mapDbToSettings(data);
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(mapped));
    }
    return mapped;
  } catch (err) {
    console.warn("fetchSettingsFromSupabase exception:", err);
    return getStoredSettings();
  }
}

export async function saveStoredSettings(settings: StoreSettings): Promise<StoreSettings> {
  // 1. Save to local storage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.error("Error saving store settings to localStorage:", err);
    }
  }

  // 2. Save to Supabase
  if (supabase) {
    try {
      const dbRow = mapSettingsToDb(settings);
      const { error } = await supabase
        .from("store_settings")
        .upsert(dbRow, { onConflict: "id" });

      if (error) {
        console.error("Supabase store settings save error:", error);
      } else {
        console.log("✓ Store settings saved to Supabase successfully!");
      }
    } catch (err) {
      console.error("saveStoredSettings exception:", err);
    }
  }

  return settings;
}

// Helpers to format direct URLs
export function formatWhatsAppUrl(numberOrUrl: string): string {
  if (!numberOrUrl) return "";
  const clean = numberOrUrl.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  let digits = clean.replace(/[^0-9]/g, "");
  if (digits.startsWith("01") && digits.length === 11) {
    digits = "88" + digits;
  }
  return digits ? `https://wa.me/${digits}` : "";
}

export function formatMessengerUrl(userOrUrl: string): string {
  if (!userOrUrl) return "";
  const clean = userOrUrl.trim();
  if (clean.includes("facebook.com/")) {
    const parts = clean.split("facebook.com/")[1].split("/")[0].split("?")[0];
    return `https://m.me/${parts}`;
  }
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  const user = clean.replace(/^@/, "").replace(/^m\.me\//, "");
  return user ? `https://m.me/${user}` : "";
}

export function formatTelegramUrl(userOrUrl: string): string {
  if (!userOrUrl) return "";
  const clean = userOrUrl.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  const user = clean.replace(/^@/, "").replace(/^t\.me\//, "");
  return user ? `https://t.me/${user}` : "";
}

