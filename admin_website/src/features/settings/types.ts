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
  whatsappGroupLink?: string;
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

  // 7. Steadfast Courier API Integration
  enableSteadfastCourier: boolean;
  steadfastApiKey: string;
  steadfastSecretKey: string;
  steadfastWebhookUrl: string;

  updatedAt?: string;
}

