export type CostCategory = 
  | "Product Sourcing" 
  | "Ad Spend & Marketing" 
  | "Packaging & Delivery" 
  | "Operating Expense";

export interface CostItem {
  id: string;
  title: string;
  category: CostCategory;
  amount: number; // BDT Total
  unitPrice?: number; // BDT per unit
  quantity?: number; // Total units
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface CostFormData {
  title: string;
  category: CostCategory;
  amount: number;
  unitPrice?: number;
  quantity?: number;
  date: string;
  notes?: string;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  profitMargin: number;
  aov: number;
  totalOrders: number;
  deliveredOrdersCount: number;
}
