import { StoreSettings } from "./types";

const SETTINGS_STORAGE_KEY = "mex_tanim_store_settings";

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Mex Tanim Store",
  whatsappNumber: "8801317170609",
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  announcementBn: "সেরা গেমিং গ্যাজেট ১ জায়গায় সব • দেশের সেরা দামে ১০-০% অথেনটিক প্রোডাক্ট",
  announcementEn: "Top Gaming Gadgets All in One Place • 100% Authentic Products at Best Price in BD",
};

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

export function saveStoredSettings(settings: StoreSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event("storage"));
  } catch (err) {
    console.error("Error saving store settings:", err);
  }
}
