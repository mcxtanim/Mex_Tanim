export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  insideDhakaFee: number;
  outsideDhakaFee: number;
  announcementBn: string;
  announcementEn: string;
  // Steadfast Courier API Integration
  enableSteadfastCourier: boolean;
  steadfastApiKey: string;
  steadfastSecretKey: string;
  steadfastWebhookUrl: string;
}
