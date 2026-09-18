import { Banner } from "./types";
import { supabase } from "../../lib/supabase";

const BANNERS_STORAGE_KEY = "mex_tanim_admin_banners";
const BROADCAST_CHANNEL_NAME = "mex_tanim_banners_channel";

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: "banner-1",
    title: "Top Gaming Gadgets in One Place",
    titleBn: "সেরা গেমিং গ্যাজেট ১ জায়গাতেই সব",
    subtitle: "100% Authentic Products at Best Price in BD",
    subtitleBn: "দেশের সেরা দামে ১০০% অথেনটিক প্রোডাক্ট",
    badgeText: "Exclusive Deals",
    buttonText: "Shop Now",
    buttonLink: "#products",
    imageUrl: "/images/banners/banner1.png",
    sequence: 1,
    isActive: true,
  },
  {
    id: "banner-2",
    title: "Pro Gaming Accessories Collection",
    titleBn: "প্রো গেমিং এক্সেসরিজ কালেকশন",
    subtitle: "Best Response & Maximum Performance",
    subtitleBn: "সেরা রেসপন্স ও সর্বোচ্চ পারফরম্যান্স",
    badgeText: "Trending Now",
    buttonText: "Shop Now",
    buttonLink: "#products",
    imageUrl: "/images/banners/banner2.png",
    sequence: 2,
    isActive: true,
  },
  {
    id: "banner-3",
    title: "Ultra Fast Charging Gadgets",
    titleBn: "আল্ট্রা ফাস্ট চার্জিং গ্যাজেটস",
    subtitle: "Safe & Fastest Power Delivery",
    subtitleBn: "নিরাপদ ও দ্রুততম পাওয়ার ব্যাকআপ",
    badgeText: "Special Offer",
    buttonText: "Shop Now",
    buttonLink: "#products",
    imageUrl: "/images/banners/banner3.png",
    sequence: 3,
    isActive: true,
  },
  {
    id: "banner-4",
    title: "Premium Gaming Audio Gear",
    titleBn: "প্রিমিয়াম গেমিং অডিও গিয়ার",
    subtitle: "Crystal Clear Sound & Deep Bass",
    subtitleBn: "ক্রিস্টাল ক্লিয়ার সাউন্ড ও ডিপ ব্যাস",
    badgeText: "Top Rated",
    buttonText: "Shop Now",
    buttonLink: "#products",
    imageUrl: "/images/banners/banner4.png",
    sequence: 4,
    isActive: true,
  },
];

function broadcastChange() {
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      channel.postMessage({ type: "BANNERS_UPDATED", timestamp: Date.now() });
      channel.close();
    } catch (e) {
      console.warn("BroadcastChannel error:", e);
    }
  }
}

export function getStoredBanners(): Banner[] {
  if (typeof window === "undefined") return DEFAULT_BANNERS;
  try {
    const raw = localStorage.getItem(BANNERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(DEFAULT_BANNERS));
      return DEFAULT_BANNERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_BANNERS;
  } catch (err) {
    console.error("Error reading stored banners:", err);
    return DEFAULT_BANNERS;
  }
}

export function setStoredBanners(banners: Banner[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(banners));
    window.dispatchEvent(new Event("storage"));
    broadcastChange();
  } catch (err) {
    console.error("Error writing stored banners:", err);
  }
}

function mapDbToBanner(row: any): Banner {
  return {
    id: String(row.id),
    title: row.title || "",
    titleBn: row.title_bn || row.title || "",
    subtitle: row.subtitle || "",
    subtitleBn: row.subtitle_bn || row.subtitle || "",
    badgeText: row.badge_text || "Exclusive Deals",
    buttonText: row.button_text || "Shop Now",
    buttonLink: row.button_link || "#products",
    imageUrl: row.image_url || "",
    sequence: Number(row.sequence) || 1,
    isActive: Boolean(row.is_active ?? true),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchBannersFromSupabase(): Promise<Banner[]> {
  if (!supabase) return getStoredBanners();
  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("sequence", { ascending: true });

    if (error || !data || data.length === 0) {
      return getStoredBanners();
    }

    const mapped = data.map(mapDbToBanner);
    setStoredBanners(mapped);
    return mapped;
  } catch (err) {
    console.warn("fetchBannersFromSupabase exception:", err);
    return getStoredBanners();
  }
}

export async function saveBanner(banner: Banner): Promise<Banner> {
  const current = getStoredBanners();
  const index = current.findIndex((b) => b.id === banner.id);
  let updatedList: Banner[];

  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = { ...banner, updatedAt: new Date().toISOString() };
  } else {
    updatedList = [...current, { ...banner, createdAt: new Date().toISOString() }];
  }

  // Sort by sequence
  updatedList.sort((a, b) => a.sequence - b.sequence);
  setStoredBanners(updatedList);

  if (supabase) {
    try {
      const payload = {
        id: banner.id,
        title: banner.title,
        title_bn: banner.titleBn,
        subtitle: banner.subtitle,
        subtitle_bn: banner.subtitleBn,
        badge_text: banner.badgeText,
        button_text: banner.buttonText,
        button_link: banner.buttonLink,
        image_url: banner.imageUrl,
        sequence: banner.sequence,
        is_active: banner.isActive,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("banners").upsert(payload, { onConflict: "id" });
      if (error) {
        console.error("Supabase banner save error:", error);
      }
    } catch (err) {
      console.error("Supabase banner save exception:", err);
    }
  }

  return banner;
}

export async function deleteBanner(id: string): Promise<boolean> {
  const current = getStoredBanners();
  const filtered = current.filter((b) => b.id !== id);
  setStoredBanners(filtered);

  if (supabase) {
    try {
      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) {
        console.error("Supabase banner delete error:", error);
      }
    } catch (err) {
      console.error("Supabase banner delete exception:", err);
    }
  }

  return true;
}

export async function reorderBanners(orderedBanners: Banner[]): Promise<Banner[]> {
  const normalized = orderedBanners.map((b, idx) => ({
    ...b,
    sequence: idx + 1,
  }));

  setStoredBanners(normalized);

  if (supabase) {
    try {
      const upsertData = normalized.map((b) => ({
        id: b.id,
        title: b.title,
        title_bn: b.titleBn,
        subtitle: b.subtitle,
        subtitle_bn: b.subtitleBn,
        badge_text: b.badgeText,
        button_text: b.buttonText,
        button_link: b.buttonLink,
        image_url: b.imageUrl,
        sequence: b.sequence,
        is_active: b.isActive,
        updated_at: new Date().toISOString(),
      }));

      await supabase.from("banners").upsert(upsertData, { onConflict: "id" });
    } catch (err) {
      console.error("Reorder banners exception:", err);
    }
  }

  return normalized;
}

export async function uploadBannerImage(file: File): Promise<string> {
  if (supabase) {
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const filename = `banner_${Date.now()}_${cleanName}`;
      const { data, error } = await supabase.storage
        .from("banners")
        .upload(filename, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage.from("banners").getPublicUrl(filename);
        if (urlData?.publicUrl) {
          return urlData.publicUrl;
        }
      } else {
        console.warn("Supabase storage upload notice:", error?.message);
      }
    } catch (err) {
      console.warn("Storage upload exception:", err);
    }
  }

  // Robust client-side fallback to base64 Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
