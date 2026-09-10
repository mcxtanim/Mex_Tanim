"use client";

import { useState, useEffect } from "react";
import { DashboardStatsCards } from "./DashboardStatsCards";
import { RevenueChart } from "./RevenueChart";
import { RecentOrdersList } from "./RecentOrdersList";
import { getStoredProducts } from "../products/productService";
import { getStoredOrders } from "../orders/orderService";
import { Product } from "../products/types";
import { Order } from "../orders/types";
import { DashboardStats } from "./types";
import { AlertTriangle, PackageX } from "lucide-react";

export function DashboardView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
  }, []);

  // Compute live real-time stats
  const totalRevenue = orders
    .filter((o) => o.status === "Delivered" || o.status === "Processing")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;
  const inStockCount = products.filter((p) => p.stock > 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock < 10).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  const stats: DashboardStats = {
    totalRevenue,
    totalOrders: orders.length,
    pendingOrdersCount,
    totalProducts: products.length,
    inStockCount,
    lowStockCount,
  };

  return (
    <div className="space-y-6">
      {/* 4 Core Metric Cards */}
      <DashboardStatsCards stats={stats} />

      {/* Main Grid: Revenue Trend & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <RecentOrdersList orders={orders} />
      </div>

      {/* Low / Out of stock alerts section if any */}
      {outOfStockProducts.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <PackageX className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-200 uppercase tracking-wider">Inventory Alert</h4>
              <p className="text-xs text-rose-300/80 mt-0.5">
                {outOfStockProducts.length} product(s) are currently out of stock! ({outOfStockProducts.map((p) => p.title).join(", ")})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
