export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Packing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number; // in BDT
  price?: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  productName?: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address?: string;
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
  items: OrderItem[];
  totalAmount: number; // in BDT
  deliveryCharge?: number;
  shippingCost?: number;
  status: OrderStatus;
  paymentMethod: "Cash on Delivery" | "bKash" | "Nagad" | "Card";
  paymentStatus: "Paid" | "Unpaid";
  createdAt: string;
}
