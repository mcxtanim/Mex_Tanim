import { CostItem, CostFormData, FinancialMetrics } from "./types";
import { Order } from "../orders/types";

const COSTS_STORAGE_KEY = "mex_tanim_admin_costs";

const SEED_COSTS: CostItem[] = [
  {
    id: "cost-101",
    title: "Fantech HG11 Headset Sourcing Batch",
    category: "Product Sourcing",
    unitPrice: 1450,
    quantity: 10,
    amount: 14500,
    date: "2026-09-01",
    notes: "10 units wholesale purchase from distributor",
  },
  {
    id: "cost-102",
    title: "Facebook & Instagram Ad Campaign",
    category: "Ad Spend & Marketing",
    amount: 3500,
    date: "2026-09-05",
    notes: "Targeting Dhaka & Chittagong gamers",
  },
  {
    id: "cost-103",
    title: "Steadfast Packaging & Poly Bags",
    category: "Packaging & Delivery",
    amount: 1200,
    date: "2026-09-08",
    notes: "Bubble wrap & branded sticker boxes",
  },
];

export function getStoredCosts(): CostItem[] {
  if (typeof window === "undefined") return SEED_COSTS;
  try {
    const raw = localStorage.getItem(COSTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(COSTS_STORAGE_KEY, JSON.stringify(SEED_COSTS));
      return SEED_COSTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_COSTS;
  } catch (err) {
    console.error("Error reading costs in admin:", err);
    return SEED_COSTS;
  }
}

export function saveCosts(costs: CostItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COSTS_STORAGE_KEY, JSON.stringify(costs));
  } catch (err) {
    console.error("Error saving costs in admin:", err);
  }
}

export function addCostItem(formData: CostFormData, currentCosts: CostItem[]): CostItem[] {
  const newItem: CostItem = {
    id: `cost-${Date.now()}`,
    ...formData,
  };
  const updated = [newItem, ...currentCosts];
  saveCosts(updated);
  return updated;
}

export function deleteCostItem(id: string, currentCosts: CostItem[]): CostItem[] {
  const updated = currentCosts.filter((item) => item.id !== id);
  saveCosts(updated);
  return updated;
}

export function getTotalCosts(costs: CostItem[]): number {
  return costs.reduce((sum, item) => sum + item.amount, 0);
}

export function calculateFinancialMetrics(orders: Order[], costs: CostItem[]): FinancialMetrics {
  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered" || o.status === "Processing" || o.status === "Shipped" || o.status === "Confirmed"
  );
  
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCost = getTotalCosts(costs);
  const netProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;
  const aov = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  return {
    totalRevenue,
    totalCost,
    netProfit,
    profitMargin,
    aov,
    totalOrders: orders.length,
    deliveredOrdersCount: deliveredOrders.length,
  };
}
