import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export interface StoreSettings {
  id?: string;
  // 1. Store Profile
  storeName: string;
  storeTagline: string;
  phone: string;
  email: string;
  address: string;
  supportHoursBn: string;
  supportHoursEn: string;

  // 2. Direct Connect & Live Chat Channels (WhatsApp, Messenger, Telegram)
  whatsappNumber: string;
  messengerUsername: string;
  messengerLink: string;
  telegramUsername: string;
  telegramLink: string;
  enableFloatingChat: boolean;
  enableWhatsappChat: boolean;
  enableMessengerChat: boolean;
  enableTelegramChat: boolean;

  // 3. Social Media Channels
  facebookLink: string;
  youtubeLink: string;
  instagramLink: string;
  tiktokLink: string;

  // 4. Delivery & Shipping
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeDeliveryThreshold: number;

  // 5. Announcements
  announcementBn: string;
  announcementEn: string;
  showAnnouncement: boolean;

  // 6. Payment Methods
  enableCashOnDelivery: boolean;
  bkashNumber: string;
  nagadNumber: string;

  // 7. Steadfast Courier
  enableSteadfastCourier: boolean;
  steadfastApiKey: string;
  steadfastSecretKey: string;
  steadfastWebhookUrl: string;

  updatedAt?: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  id: 'default',
  // Store Profile
  storeName: 'Mex Tanim Store',
  storeTagline: 'Shop Smart • Fast Delivery • Trusted Quality',
  phone: '',
  email: 'support@mextanimstore.com',
  address: 'Dhaka, Bangladesh',
  supportHoursBn: 'সকাল ৮টা থেকে রাত ১২টা',
  supportHoursEn: '8:00 AM - 12:00 AM',

  // Connect & Chat Channels
  whatsappNumber: '',
  messengerUsername: 'mextanimstore',
  messengerLink: 'https://m.me/mextanimstore',
  telegramUsername: 'mextanimstore',
  telegramLink: 'https://t.me/mextanimstore',
  enableFloatingChat: true,
  enableWhatsappChat: true,
  enableMessengerChat: true,
  enableTelegramChat: true,

  // Social Media
  facebookLink: 'https://facebook.com/mextanimstore',
  youtubeLink: 'https://youtube.com/@mextanimstore',
  instagramLink: '',
  tiktokLink: '',

  // Delivery Fees
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  freeDeliveryThreshold: 0,

  // Announcements
  announcementBn: 'সেরা গেমিং গ্যাজেট ১ জায়গায় সব • দেশের সেরা দামে ১০০% অথেনটিক প্রোডাক্ট',
  announcementEn: 'Top Gaming Gadgets All in One Place • 100% Authentic Products at Best Price in BD',
  showAnnouncement: true,

  // Payment
  enableCashOnDelivery: true,
  bkashNumber: '',
  nagadNumber: '',

  // Courier
  enableSteadfastCourier: false,
  steadfastApiKey: '',
  steadfastSecretKey: '',
  steadfastWebhookUrl: 'https://mextanimstore.com/api/webhooks/steadfast',
};

const SETTINGS_STORAGE_KEY = 'mex_tanim_store_settings';
let cachedSettings: StoreSettings = DEFAULT_SETTINGS;

export function mapDbToSettings(item: any): StoreSettings {
  if (!item) return DEFAULT_SETTINGS;
  return {
    id: item.id || 'default',
    storeName: item.store_name || DEFAULT_SETTINGS.storeName,
    storeTagline: item.store_tagline || DEFAULT_SETTINGS.storeTagline,
    phone: item.phone ?? '',
    email: item.email || DEFAULT_SETTINGS.email,
    address: item.address || DEFAULT_SETTINGS.address,
    supportHoursBn: item.support_hours_bn || DEFAULT_SETTINGS.supportHoursBn,
    supportHoursEn: item.support_hours_en || DEFAULT_SETTINGS.supportHoursEn,

    whatsappNumber: item.whatsapp_number ?? '',
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
    instagramLink: item.instagram_link ?? '',
    tiktokLink: item.tiktok_link ?? '',

    insideDhakaFee: Number(item.inside_dhaka_fee) || 60,
    outsideDhakaFee: Number(item.outside_dhaka_fee) || 120,
    freeDeliveryThreshold: Number(item.free_delivery_threshold) || 0,

    announcementBn: item.announcement_bn || DEFAULT_SETTINGS.announcementBn,
    announcementEn: item.announcement_en || DEFAULT_SETTINGS.announcementEn,
    showAnnouncement: item.show_announcement ?? true,

    enableCashOnDelivery: item.enable_cash_on_delivery ?? true,
    bkashNumber: item.bkash_number || '',
    nagadNumber: item.nagad_number || '',

    enableSteadfastCourier: item.enable_steadfast_courier ?? false,
    steadfastApiKey: item.steadfast_api_key || '',
    steadfastSecretKey: item.steadfast_secret_key || '',
    steadfastWebhookUrl: 'https://mextanimstore.com/api/webhooks/steadfast',
    updatedAt: item.updated_at,
  };
}

export function getStoredSettings(): StoreSettings {
  if (typeof window === 'undefined') return cachedSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      cachedSettings = JSON.parse(raw);
      return cachedSettings;
    }
  } catch (e) {
    // Ignore error, return memory cache
  }
  return cachedSettings;
}

export async function fetchStoreSettings(): Promise<StoreSettings> {
  if (!supabase) return getStoredSettings();

  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error || !data) {
      return getStoredSettings();
    }

    const mapped = mapDbToSettings(data);
    cachedSettings = mapped;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(mapped));
        window.dispatchEvent(new CustomEvent('store_settings_updated', { detail: mapped }));
      } catch (e) {}
    }

    return mapped;
  } catch (err) {
    return getStoredSettings();
  }
}

// React Hook for dynamic store settings
export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(() => getStoredSettings());

  useEffect(() => {
    // 1. Initial fetch from Supabase
    fetchStoreSettings().then((live) => {
      setSettings(live);
    });

    // 2. Listen to custom event when settings are updated locally
    const handleLocalUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setSettings(detail);
      } else {
        setSettings(getStoredSettings());
      }
    };

    window.addEventListener('store_settings_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    // 3. Supabase Realtime subscription
    let channel: any = null;
    if (supabase) {
      try {
        channel = supabase
          .channel('public:store_settings_user')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'store_settings' },
            (payload) => {
              if (payload.new) {
                const mapped = mapDbToSettings(payload.new);
                setSettings(mapped);
                if (typeof window !== 'undefined') {
                  try {
                    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(mapped));
                  } catch (err) {}
                }
              }
            }
          )
          .subscribe();
      } catch (e) {}
    }

    return () => {
      window.removeEventListener('store_settings_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return settings;
}

// URL formatting helpers
export function formatWhatsAppUrl(numberOrUrl: string, messageText?: string): string {
  if (!numberOrUrl) return '';
  const clean = numberOrUrl.trim();
  const textParam = messageText ? `?text=${encodeURIComponent(messageText)}` : '';
  
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    if (messageText && !clean.includes('text=')) {
      const sep = clean.includes('?') ? '&' : '?';
      return `${clean}${sep}text=${encodeURIComponent(messageText)}`;
    }
    return clean;
  }
  let digits = clean.replace(/[^0-9]/g, '');
  if (digits.startsWith('01') && digits.length === 11) {
    digits = '88' + digits;
  }
  return digits ? `https://wa.me/${digits}${textParam}` : '';
}

export function formatMessengerUrl(userOrUrl: string): string {
  if (!userOrUrl) return '';
  const clean = userOrUrl.trim();
  if (clean.includes('facebook.com/')) {
    const parts = clean.split('facebook.com/')[1].split('/')[0].split('?')[0];
    return `https://m.me/${parts}`;
  }
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  const user = clean.replace(/^@/, '').replace(/^m\.me\//, '');
  return user ? `https://m.me/${user}` : '';
}

export function formatTelegramUrl(userOrUrl: string): string {
  if (!userOrUrl) return '';
  const clean = userOrUrl.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
  const user = clean.replace(/^@/, '').replace(/^t\.me\//, '');
  return user ? `https://t.me/${user}` : '';
}
