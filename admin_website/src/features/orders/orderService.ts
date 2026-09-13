import { Order, OrderStatus } from "./types";
import { supabase } from "../../lib/supabase";

const STORAGE_KEY = "mex_tanim_customer_orders";

export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading orders from localStorage", error);
    return [];
  }
}

export function saveStoredOrders(orders: Order[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.warn("localStorage quota exceeded for orders, saving lightweight cache...", error);
    try {
      const lightweight = orders.map((o) => ({
        ...o,
        items: Array.isArray(o.items)
          ? o.items.map((i: any) => {
              const img = i.image || i.imageUrl || "";
              return img && typeof img === "string" && img.startsWith("data:image")
                ? { ...i, image: "", imageUrl: "" }
                : i;
            })
          : o.items,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    } catch (e) {
      console.warn("Could not save orders to localStorage, skipping local cache.", e);
    }
    window.dispatchEvent(new Event("storage"));
  }
}

export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  if (!supabase) return getStoredOrders();
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase orders fetch error:", error);
      return getStoredOrders();
    }

    if (!data) return [];

    const mapped: Order[] = data.map((item: any) => {
      const itemsList = Array.isArray(item.items)
        ? item.items.map((i: any) => ({
            productId: String(i.productId || i.id || ""),
            title: i.title || i.name || "Product Item",
            quantity: Number(i.quantity) || 1,
            unitPrice: Number(i.unitPrice || i.price) || 0,
            price: Number(i.price || i.unitPrice) || 0,
            imageUrl: i.image || i.imageUrl || "",
          }))
        : [];

      const shipping = item.shipping_address || {};
      const addrStreet = item.address || shipping.street || "Delivery Address";
      const addrCity = shipping.city || item.delivery_area || "City";
      const addrDistrict = shipping.district || item.delivery_area || "District";

      const computedProductName = item.product_name || (itemsList.length > 0
        ? itemsList.map((i: any) => `${i.title} (x${i.quantity})`).join(", ")
        : "Product Item");

      return {
        id: String(item.id),
        orderNumber: item.order_number || `#${item.id}`,
        customerName: item.customer_name || "Customer",
        productName: computedProductName,
        customerEmail: item.customer_email || "",
        customerPhone: item.phone || item.customer_phone || "",
        shippingAddress: {
          address: addrStreet,
          street: addrStreet,
          city: addrCity,
          district: addrDistrict,
          postalCode: shipping.postalCode || "1200",
        },
        items: itemsList,
        totalAmount: Number(item.total_amount) || 0,
        shippingCost: Number(item.delivery_charge) || 60,
        deliveryCharge: Number(item.delivery_charge) || 60,
        status: item.status || "Pending",
        paymentMethod: item.payment_method || "Cash on Delivery",
        paymentStatus: item.payment_status || "Unpaid",
        createdAt: item.created_at ? new Date(item.created_at).toLocaleString("en-US", { timeZone: "Asia/Dhaka" }) : new Date().toLocaleString(),
      };
    });

    saveStoredOrders(mapped);
    return mapped;
  } catch (err) {
    console.warn("Supabase fetch orders error:", err);
    return getStoredOrders();
  }
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus, existingOrders: Order[]): Promise<Order[]> {
  const updated = existingOrders.map((ord) =>
    ord.id === orderId ? { ...ord, status: newStatus } : ord
  );
  saveStoredOrders(updated);

  if (supabase) {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      if (error) console.error("Supabase order status update error:", error);
    } catch (err) {
      console.error("Supabase order status update exception:", err);
    }
  }

  return updated;
}

export async function deleteOrder(orderId: string, existingOrders: Order[]): Promise<Order[]> {
  const updated = existingOrders.filter((ord) => ord.id !== orderId);
  saveStoredOrders(updated);

  if (supabase) {
    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);
      if (error) console.error("Supabase order delete error:", error);
    } catch (err) {
      console.error("Supabase order delete exception:", err);
    }
  }

  return updated;
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  const stored = getStoredOrders().find((o) => o.id === orderId || o.orderNumber === orderId);
  if (!supabase) return stored || null;

  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .maybeSingle();

    if (error || !data) return stored || null;

    const itemsList = Array.isArray(data.items)
      ? data.items.map((i: any) => ({
          productId: String(i.productId || i.id || ""),
          title: i.title || i.name || "Product Item",
          quantity: Number(i.quantity) || 1,
          unitPrice: Number(i.unitPrice || i.price) || 0,
          price: Number(i.price || i.unitPrice) || 0,
          imageUrl: i.image || i.imageUrl || "",
        }))
      : [];

    const shipping = data.shipping_address || {};
    const addrStreet = data.address || shipping.street || "Delivery Address";
    const addrCity = shipping.city || data.delivery_area || "City";
    const addrDistrict = shipping.district || data.delivery_area || "District";

    return {
      id: String(data.id),
      orderNumber: data.order_number || `#${data.id}`,
      customerName: data.customer_name || "Customer",
      customerEmail: data.customer_email || "",
      customerPhone: data.phone || data.customer_phone || "",
      shippingAddress: {
        address: addrStreet,
        street: addrStreet,
        city: addrCity,
        district: addrDistrict,
        postalCode: shipping.postalCode || "1200",
      },
      items: itemsList,
      totalAmount: Number(data.total_amount) || 0,
      shippingCost: Number(data.delivery_charge) || 60,
      deliveryCharge: Number(data.delivery_charge) || 60,
      status: data.status || "Pending",
      paymentMethod: data.payment_method || "Cash on Delivery",
      paymentStatus: data.payment_status || "Unpaid",
      createdAt: data.created_at
        ? new Date(data.created_at).toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
        : new Date().toLocaleString(),
    };
  } catch (err) {
    console.warn("fetchOrderById exception:", err);
    return stored || null;
  }
}

