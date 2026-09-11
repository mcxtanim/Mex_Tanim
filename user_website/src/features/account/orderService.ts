import { Product } from '../catalog/types';

export type OrderStageStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Processing'
  | 'Packing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Pending'; // Admin legacy map

export interface CustomerOrderItem {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export interface CustomerOrderShippingAddress {
  street: string; // Area / Specific Location
  city: string; // Upazila
  district: string; // District, Division
  postalCode?: string;
}

export interface StatusHistoryItem {
  stage: OrderStageStatus;
  timestamp: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: CustomerOrderShippingAddress;
  items: CustomerOrderItem[];
  totalAmount: number;
  status: OrderStageStatus;
  paymentMethod: 'Cash on Delivery';
  paymentStatus: 'Unpaid' | 'Paid';
  createdAt: string;
  statusHistory?: StatusHistoryItem[];
}

export const ADMIN_ORDERS_KEY = 'mex_tanim_admin_orders';
export const SAVED_ADDRESS_KEY = 'mex_tanim_saved_address';

// 7-Stage Order Progress Timeline Configuration
export const ORDER_STAGES: { id: OrderStageStatus; nameEn: string; nameBn: string; descriptionEn: string; descriptionBn: string }[] = [
  {
    id: 'Order Placed',
    nameEn: 'Order Placed',
    nameBn: 'অর্ডার প্লেস করা হয়েছে',
    descriptionEn: 'Your order has been received by Mex Tanim Store',
    descriptionBn: 'আপনার অর্ডারটি মেক্স তানিম স্টোরে জমা হয়েছে',
  },
  {
    id: 'Order Confirmed',
    nameEn: 'Order Confirmed',
    nameBn: 'অর্ডার কনফার্ম করা হয়েছে',
    descriptionEn: 'Customer support verified your phone & delivery address',
    descriptionBn: 'কাস্টমার সাপোর্ট ফোন দিয়ে অর্ডারটি ভেরিফাই করেছে',
  },
  {
    id: 'Processing',
    nameEn: 'Processing / Preparing',
    nameBn: 'প্রসেসিং চলছে',
    descriptionEn: 'Items are being gathered from inventory',
    descriptionBn: 'ইনভেন্টরি থেকে গ্যাজেট সংগ্রহ করা হচ্ছে',
  },
  {
    id: 'Packing',
    nameEn: 'Packing',
    nameBn: 'প্যাকিং হচ্ছে',
    descriptionEn: 'Your product is securely packed for shipping',
    descriptionBn: 'নিরাপদ প্যাকেজিং সম্পন্ন করা হচ্ছে',
  },
  {
    id: 'Shipped',
    nameEn: 'Shipped',
    nameBn: 'শিপড করা হয়েছে',
    descriptionEn: 'Package handed over to courier service',
    descriptionBn: 'কুরিয়ার সার্ভিসে পার্সেল হস্তান্তর করা হয়েছে',
  },
  {
    id: 'Out for Delivery',
    nameEn: 'Out for Delivery',
    nameBn: 'ডেলিভারির জন্য বের হয়েছে',
    descriptionEn: 'Rider is on the way to your delivery address',
    descriptionBn: 'ডেলিভারি রাইডার আপনার ঠিকানায় রওয়ানা দিয়েছে',
  },
  {
    id: 'Delivered',
    nameEn: 'Delivered',
    nameBn: 'ডেলিভারড হয়েছে',
    descriptionEn: 'Order completed and payment received',
    descriptionBn: 'পণ্য হস্তান্তরিত এবং মূল্য পরিশোধিত',
  },
];

// Helper to normalize status strings from Admin panel or User store
export function normalizeOrderStatus(status: string): OrderStageStatus {
  if (!status) return 'Order Placed';
  const s = status.trim();
  if (s === 'Pending') return 'Order Placed';
  if (
    s === 'Order Placed' ||
    s === 'Order Confirmed' ||
    s === 'Processing' ||
    s === 'Packing' ||
    s === 'Shipped' ||
    s === 'Out for Delivery' ||
    s === 'Delivered' ||
    s === 'Cancelled'
  ) {
    return s as OrderStageStatus;
  }
  return 'Order Placed';
}

// Get stage index (0 to 6)
export function getOrderStageIndex(status: string): number {
  const normalized = normalizeOrderStatus(status);
  if (normalized === 'Cancelled') return -1;
  const index = ORDER_STAGES.findIndex((stage) => stage.id === normalized);
  return index >= 0 ? index : 0;
}

// Retrieve all orders from localStorage single source of truth
export function getAllOrdersFromStorage(): CustomerOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ADMIN_ORDERS_KEY);
    if (!raw) return [];
    const parsed: CustomerOrder[] = JSON.parse(raw);
    return parsed.map((ord) => ({
      ...ord,
      status: normalizeOrderStatus(ord.status),
    }));
  } catch (err) {
    console.error('Error loading orders from localStorage', err);
    return [];
  }
}

// Security: Retrieve orders belonging ONLY to current customer phone number
export function getCustomerOrders(customerPhone?: string): CustomerOrder[] {
  const allOrders = getAllOrdersFromStorage();
  if (!customerPhone) {
    // Check saved address phone
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SAVED_ADDRESS_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.phone) {
            customerPhone = parsed.phone;
          }
        } catch {
          // ignore
        }
      }
    }
  }

  if (!customerPhone) return [];

  const cleanTargetPhone = customerPhone.replace(/\D/g, '');
  return allOrders
    .filter((ord) => {
      const cleanOrdPhone = (ord.customerPhone || '').replace(/\D/g, '');
      return cleanOrdPhone.length >= 10 && (cleanOrdPhone.endsWith(cleanTargetPhone) || cleanTargetPhone.endsWith(cleanOrdPhone));
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Security & Ownership: Verify order ID matches customer phone number
export function getCustomerOrderById(orderId: string, customerPhone?: string): CustomerOrder | null {
  const allOrders = getAllOrdersFromStorage();
  const foundOrder = allOrders.find((ord) => ord.id === orderId || ord.orderNumber === orderId || ord.orderNumber === `#${orderId}`);
  if (!foundOrder) return null;

  // Security check: match customer phone
  if (customerPhone) {
    const cleanTargetPhone = customerPhone.replace(/\D/g, '');
    const cleanOrdPhone = (foundOrder.customerPhone || '').replace(/\D/g, '');
    if (cleanOrdPhone.length >= 10 && !(cleanOrdPhone.endsWith(cleanTargetPhone) || cleanTargetPhone.endsWith(cleanOrdPhone))) {
      // Security violation: phone mismatch
      return null;
    }
  }

  return foundOrder;
}
