import { CustomerOrder, CustomerOrderStatus } from './types';
import { supabase } from '../../lib/supabase';

const ADMIN_ORDERS_KEY = 'mex_tanim_admin_orders';
const SAVED_ADDRESS_KEY = 'mex_tanim_saved_address';

export const ORDER_STAGES: { status: CustomerOrderStatus; titleBn: string; titleEn: string; descBn: string; descEn: string }[] = [
  {
    status: 'Order Placed',
    titleBn: 'অর্ডার গৃহীত হয়েছে',
    titleEn: 'Order Placed',
    descBn: 'আপনার ক্যাশ অন ডেলিভারি অর্ডারটি সিস্টেমে সাবমিট হয়েছে',
    descEn: 'Your cash on delivery order has been received',
  },
  {
    status: 'Order Confirmed',
    titleBn: 'অর্ডার নিশ্চিত করা হয়েছে',
    titleEn: 'Order Confirmed',
    descBn: 'আমাদের সাপোর্ট টিম আপনার অর্ডারটি কনফার্ম করেছে',
    descEn: 'Customer support verified and confirmed your order',
  },
  {
    status: 'Processing',
    titleBn: 'প্রসেসিং চলছে',
    titleEn: 'Processing',
    descBn: 'ওয়্যারহাউসে আপনার পণ্য আইটেম প্রসেস করা হচ্ছে',
    descEn: 'Items are being prepared in warehouse',
  },
  {
    status: 'Packing',
    titleBn: 'প্যাকিং হচ্ছে',
    titleEn: 'Packing',
    descBn: 'নিরাপদ প্যাকেজিংয়ে পণ্য প্যাকিং করা হচ্ছে',
    descEn: 'Product is being securely packaged',
  },
  {
    status: 'Shipped',
    titleBn: 'শিপড করা হয়েছে',
    titleEn: 'Shipped',
    descBn: 'কুরিয়ার সার্ভিসে আপনার পার্সেল হস্তান্তর করা হয়েছে',
    descEn: 'Handed over to courier service provider',
  },
  {
    status: 'Out for Delivery',
    titleBn: 'ডেলিভারির জন্য বের হয়েছে',
    titleEn: 'Out for Delivery',
    descBn: 'ডেলিভারি ম্যান আপনার গন্তব্যে রওনা হয়েছে',
    descEn: 'Delivery rider is on the way to your address',
  },
  {
    status: 'Delivered',
    titleBn: 'ডেলিভারি সম্পন্ন',
    titleEn: 'Delivered',
    descBn: 'সফলভাবে পণ্য হস্তান্তর করা হয়েছে ও পেমেন্ট গৃহীত হয়েছে',
    descEn: 'Product successfully delivered and payment received',
  },
];

export function normalizeOrderStatus(rawStatus: string): CustomerOrderStatus {
  if (!rawStatus) return 'Order Placed';
  const statusStr = String(rawStatus).trim();

  if (statusStr === 'Pending') return 'Order Placed';
  if (statusStr === 'Order Placed' || statusStr === 'Order Confirmed') return statusStr as CustomerOrderStatus;
  if (statusStr === 'Processing' || statusStr === 'Packing' || statusStr === 'Shipped' || statusStr === 'Out for Delivery' || statusStr === 'Delivered' || statusStr === 'Cancelled') {
    return statusStr as CustomerOrderStatus;
  }

  return 'Order Placed';
}

export function getOrderStageIndex(status: CustomerOrderStatus): number {
  const normalized = normalizeOrderStatus(status);
  if (normalized === 'Cancelled') return -1;
  const index = ORDER_STAGES.findIndex((s) => s.status === normalized);
  return index >= 0 ? index : 0;
}

export async function fetchCustomerOrdersFromSupabase(customerPhone?: string): Promise<CustomerOrder[]> {
  if (!supabase) return getAllOrdersFromStorage();
  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    
    if (customerPhone) {
      const cleanPhone = customerPhone.trim();
      query = query.eq('phone', cleanPhone);
    }

    const { data, error } = await query;
    if (error || !data) return getAllOrdersFromStorage();

    const mapped: CustomerOrder[] = data.map((item: any) => {
      const phoneVal = item.phone || item.customer_phone || '';
      const shipping = item.shipping_address || {};
      const addrStreet = item.address || shipping.street || '';

      return {
        id: String(item.id),
        orderNumber: item.order_number || `#${item.id}`,
        customerName: item.customer_name || 'Customer',
        customerPhone: phoneVal,
        customerEmail: item.customer_email || undefined,
        shippingAddress: {
          street: addrStreet,
          city: shipping.city || item.delivery_area || 'Dhaka',
          district: shipping.district || item.delivery_area || 'Dhaka',
          postalCode: shipping.postalCode || '1200',
        },
        deliveryCharge: Number(item.delivery_charge) || 60,
        totalAmount: Number(item.total_amount) || 0,
        paymentMethod: item.payment_method || 'Cash on Delivery',
        paymentStatus: item.payment_status || 'Unpaid',
        status: normalizeOrderStatus(item.status),
        createdAt: item.created_at ? new Date(item.created_at).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }) : new Date().toLocaleString(),
        items: Array.isArray(item.items)
          ? item.items.map((i: any) => ({
              productId: String(i.id || i.productId || ''),
              title: i.name || i.title || item.product_name || 'Product Item',
              unitPrice: Number(i.price || i.unitPrice) || 0,
              quantity: Number(i.quantity) || 1,
              image: i.image || i.imageUrl || '',
            }))
          : [],
      };
    });

    return mapped;
  } catch (err) {
    console.warn('Supabase fetch customer orders error:', err);
    return getAllOrdersFromStorage();
  }
}

export function getAllOrdersFromStorage(): CustomerOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ADMIN_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((ord: any) => ({
      ...ord,
      customerPhone: ord.customerPhone || ord.phone || '',
      shippingAddress: ord.shippingAddress || { street: ord.address || '', district: 'Dhaka' },
      paymentStatus: ord.paymentStatus || 'Unpaid',
      status: normalizeOrderStatus(ord.status),
    }));
  } catch (err) {
    console.error('Error reading customer orders:', err);
    return [];
  }
}

export function getCustomerOrders(customerPhone?: string): CustomerOrder[] {
  const allOrders = getAllOrdersFromStorage();
  
  let targetPhone = customerPhone?.trim();
  if (!targetPhone && typeof window !== 'undefined') {
    try {
      const savedAddressRaw = localStorage.getItem(SAVED_ADDRESS_KEY);
      if (savedAddressRaw) {
        const saved = JSON.parse(savedAddressRaw);
        if (saved.phone) targetPhone = saved.phone.trim();
      }
    } catch {}
  }

  if (!targetPhone) {
    return allOrders;
  }

  return allOrders.filter(
    (ord) => ord.customerPhone?.trim() === targetPhone || ord.customerPhone?.replaceAll('-', '') === targetPhone.replaceAll('-', '')
  );
}

export function getSavedCustomerAddress() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SAVED_ADDRESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
