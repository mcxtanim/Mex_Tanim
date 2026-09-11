export type CustomerOrderStatus =
  | 'Order Placed'
  | 'Order Confirmed'
  | 'Processing'
  | 'Packing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Pending';

export interface StatusHistoryLog {
  status: CustomerOrderStatus;
  timestamp: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export interface CustomerShippingAddress {
  street: string;
  city?: string;
  district: string;
  postalCode?: string;
  division?: string;
  upazila?: string;
  areaLocation?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: CustomerShippingAddress;
  items: OrderItem[];
  totalAmount: number;
  status: CustomerOrderStatus;
  paymentMethod: 'Cash on Delivery' | string;
  paymentStatus: 'Paid' | 'Unpaid' | string;
  createdAt: string;
  statusHistory?: StatusHistoryLog[];
  deliveryCharge?: number;
  subtotal?: number;
}
