export type CostCategory = 
  | "Product Sourcing" 
  | "Ad Spend & Marketing" 
  | "Packaging & Delivery" 
  | "Operating Expense";

export interface CostItem {
  id: string;
  title: string;
  category: CostCategory;
  amount: number; // BDT
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface CostFormData {
  title: string;
  category: CostCategory;
  amount: number;
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
