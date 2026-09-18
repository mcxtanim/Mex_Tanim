import { supabase } from "../../lib/supabase";

export interface Banner {
  id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  badgeText: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  sequence: number;
  isActive: boolean;
}

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

const BANNERS_STORAGE_KEY = "mex_tanim_cached_banners";
const BROADCAST_CHANNEL_NAME = "mex_tanim_banners_channel";

let inMemoryBanners: Banner[] | null = null;

export function getStoredBanners(): Banner[] {
  if (inMemoryBanners && inMemoryBanners.length > 0) {
    return inMemoryBanners;
  }

  if (typeof window === "undefined") return DEFAULT_BANNERS;

  try {
    const raw = localStorage.getItem(BANNERS_STORAGE_KEY);
    if (!raw) {
      inMemoryBanners = DEFAULT_BANNERS;
      return DEFAULT_BANNERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      inMemoryBanners = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn("Error parsing cached banners:", err);
  }

  inMemoryBanners = DEFAULT_BANNERS;
  return DEFAULT_BANNERS;
}

export function saveCachedBanners(banners: Banner[]) {
  inMemoryBanners = banners;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(banners));
      window.dispatchEvent(new Event("banners_updated"));
    } catch (err) {
      console.warn("Failed to cache banners:", err);
    }
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
  };
}

export async function fetchLiveBanners(): Promise<Banner[]> {
  if (!supabase) return getStoredBanners();

  try {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sequence", { ascending: true });

    if (error || !data || data.length === 0) {
      return getStoredBanners();
    }

    const mapped = data.map(mapDbToBanner);
    saveCachedBanners(mapped);
    return mapped;
  } catch (err) {
    console.warn("fetchLiveBanners exception:", err);
    return getStoredBanners();
  }
}

export function subscribeToBannerUpdates(onUpdate: (banners: Banner[]) => void): () => void {
  // 1. Listen for localStorage changes
  const handleLocalUpdate = () => {
    onUpdate(getStoredBanners());
  };

  if (typeof window !== "undefined") {
    window.addEventListener("banners_updated", handleLocalUpdate);
    window.addEventListener("storage", handleLocalUpdate);
  }

  // 2. Multi-tab BroadcastChannel
  let broadcastChannel: BroadcastChannel | null = null;
  if (typeof window !== "undefined" && "BroadcastChannel" in window) {
    try {
      broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannel.onmessage = async (e) => {
        if (e.data?.type === "BANNERS_UPDATED") {
          const fresh = await fetchLiveBanners();
          onUpdate(fresh);
        }
      };
    } catch (e) {
      console.warn("BroadcastChannel banner subscription error:", e);
    }
  }

  // 3. Supabase Realtime Subscription
  let realtimeChannel: any = null;
  if (supabase) {
    try {
      realtimeChannel = supabase
        .channel("public:banners:live_updates")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "banners" },
          async () => {
            const fresh = await fetchLiveBanners();
            onUpdate(fresh);
          }
        )
        .subscribe();
    } catch (err) {
      console.warn("Realtime banner channel subscription notice:", err);
    }
  }

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("banners_updated", handleLocalUpdate);
      window.removeEventListener("storage", handleLocalUpdate);
    }
    if (broadcastChannel) broadcastChannel.close();
    if (realtimeChannel && supabase) supabase.removeChannel(realtimeChannel);
  };
}
