"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardStatsCards } from "./DashboardStatsCards";
import { RecentOrdersList } from "./RecentOrdersList";
import { getStoredProducts, fetchProductsFromSupabase } from "../products/productService";
import { getStoredOrders, fetchOrdersFromSupabase } from "../orders/orderService";
import { Product } from "../products/types";
import { Order } from "../orders/types";
import { DashboardStats } from "./types";
import { Plus, PackagePlus, PackageX, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export function DashboardView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month" | "year" | "lifetime">("month");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>("");

  const loadDashboardData = useCallback(async (showRefreshingSpinner = false) => {
    if (showRefreshingSpinner) setIsRefreshing(true);
    try {
      const [fetchedProducts, fetchedOrders] = await Promise.all([
        fetchProductsFromSupabase(),
        fetchOrdersFromSupabase(),
      ]);

      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      } else {
        setProducts(getStoredProducts());
      }

      if (fetchedOrders) {
        setOrders(fetchedOrders);
      } else {
        setOrders(getStoredOrders());
      }

      setLastSynced(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn("Dashboard live sync notice:", err);
      setProducts(getStoredProducts());
      setOrders(getStoredOrders());
    } finally {
      if (showRefreshingSpinner) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  }, []);

  useEffect(() => {
    // Initial instant cached state
    setProducts(getStoredProducts());
    setOrders(getStoredOrders());
    loadDashboardData();

    // 1. Supabase Realtime Channels
    const ordersChannel = supabase
      ?.channel("realtime_dashboard_orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          loadDashboardData();
        }
      )
      .subscribe();

    const productsChannel = supabase
      ?.channel("realtime_dashboard_products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          loadDashboardData();
        }
      )
      .subscribe();

    // 2. Periodic Polling fallback (every 10 seconds)
    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000);

    window.addEventListener("storage", () => loadDashboardData());
    window.addEventListener("focus", () => loadDashboardData());

    return () => {
      if (ordersChannel) supabase?.removeChannel(ordersChannel);
      if (productsChannel) supabase?.removeChannel(productsChannel);
      clearInterval(interval);
      window.removeEventListener("storage", () => loadDashboardData());
      window.removeEventListener("focus", () => loadDashboardData());
    };
  }, [loadDashboardData]);

  // Compute live stats
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

  const timeFilters: { id: "today" | "week" | "month" | "year" | "lifetime"; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
    { id: "year", label: "Year" },
    { id: "lifetime", label: "Lifetime" },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Top Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Dashboard</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time Filter Pill Buttons */}
          <div className="bg-slate-900/90 border border-slate-800/90 p-1 rounded-xl flex items-center gap-1">
            {timeFilters.map((tf) => (
              <button
                key={tf.id}
                onClick={() => setTimeFilter(tf.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeFilter === tf.id
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Sync Status & Button */}
          {lastSynced && (
            <span className="text-[11px] text-slate-400 hidden xl:inline flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Synced: {lastSynced}
            </span>
          )}

          <button
            onClick={() => loadDashboardData(true)}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Fetch latest products & orders from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync"}</span>
          </button>

          {/* Action Buttons */}
          <Link
            href="/orders"
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Order</span>
          </Link>

          <Link
            href="/products"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
          >
            <PackagePlus className="w-4 h-4 text-emerald-400" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* 7 Top KPI Metrics Cards Grid */}
      <DashboardStatsCards stats={stats} />

      {/* Recent Customer Orders Table */}
      <RecentOrdersList orders={orders} />

      {/* Out of Stock Warning Banner if any */}
      {outOfStockProducts.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <PackageX className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-rose-200 uppercase tracking-wider">Inventory Alert</h4>
              <p className="text-xs text-rose-300/80 mt-0.5">
                {outOfStockProducts.length} product(s) out of stock: ({outOfStockProducts.map((p) => p.title).join(", ")})
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
