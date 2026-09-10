import { Order, OrderStatus } from "./types";
import { initialOrders } from "./seedData";

const STORAGE_KEY = "mex_tanim_admin_orders";

export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return initialOrders;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialOrders));
      return initialOrders;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading orders from localStorage", error);
    return initialOrders;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving orders to localStorage", error);
  }
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus, existingOrders: Order[]): Order[] {
  const updated = existingOrders.map((ord) =>
    ord.id === orderId ? { ...ord, status: newStatus } : ord
  );
  saveStoredOrders(updated);
  return updated;
}
