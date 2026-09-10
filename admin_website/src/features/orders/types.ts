export type OrderStatus = "Pending" | "Processing" | "Delivered" | "Cancelled";

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number; // in BDT
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
  };
  items: OrderItem[];
  totalAmount: number; // in BDT
  status: OrderStatus;
  paymentMethod: "Cash on Delivery" | "bKash" | "Nagad" | "Card";
  paymentStatus: "Paid" | "Unpaid";
  createdAt: string;
}
