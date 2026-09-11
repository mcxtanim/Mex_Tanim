export type OrderStatus =
  | "Order Placed"
  | "Confirmed"
  | "Processing"
  | "Packing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Pending"; // fallback legacy

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number; // in BDT
  image?: string;
}

export interface ShippingAddress {
  name?: string;
  phone?: string;
  division?: string;
  district?: string;
  upazila?: string;
  area?: string;
  specificLocation?: string;
  street?: string;
  city?: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal?: number;
  deliveryCharge?: number;
  totalAmount: number; // in BDT
  status: OrderStatus;
  paymentMethod: "Cash on Delivery" | "bKash" | "Nagad" | "Card";
  paymentStatus: "Paid" | "Unpaid";
  createdAt: string;
}
